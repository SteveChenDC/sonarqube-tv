#!/bin/bash
# Ralph Wiggum Loop — runs inside tmux, launched by ralph-rc.sh
# Expects env vars: BUDGET, QA_BUDGET, QA_TURNS, MAX_TURNS, BACKOFF,
#   PROMO_END, SLEEP_OFFPEAK, SLEEP_PEAK, SLEEP_NORMAL,
#   BUDGET_OFFPEAK, BUDGET_PEAK, MOBILE_FLAG,
#   MOBILE_PROMPT, MOBILE_POLISH_PROMPT

# No set -e: loop must be resilient to individual step failures

# ── Build gate: verify worktree passes build+test before merging ──
gate_worktree() {
  local wt_path="$1"
  echo "=== Build gate: npm run build && npm test in $wt_path ==="
  if (cd "$wt_path" && npm run build --silent 2>&1 && npm test -- --run 2>&1); then
    echo "=== Build gate: PASSED ==="
    return 0
  else
    echo "=== Build gate: FAILED — skipping merge ==="
    return 1
  fi
}

# Recreate a worktree if the directory was cleaned up but the branch still exists
ensure_worktree() {
  local wt_path="$1"
  local branch="$2"
  if [ ! -d "$wt_path" ]; then
    echo "=== Worktree $wt_path missing — recreating from $branch ==="
    git worktree prune 2>/dev/null || true
    git worktree add "$wt_path" "$branch" 2>/dev/null || true
  fi
}

# ── No-op tracking: skip agents with 3+ consecutive no-change cycles ──
NOOP_THRESHOLD=5
increment_noop() {
  local agent="$1"
  local f="/tmp/ralph-noop-${agent}.count"
  # Reset if file is older than 24h
  if [ -f "$f" ] && [ "$(find "$f" -mmin +1440 2>/dev/null)" ]; then
    rm -f "$f"
  fi
  local count=0
  [ -f "$f" ] && count=$(cat "$f")
  echo $((count + 1)) > "$f"
}
reset_noop() {
  local agent="$1"
  echo 0 > "/tmp/ralph-noop-${agent}.count"
}
should_skip_agent() {
  local agent="$1"
  local f="/tmp/ralph-noop-${agent}.count"
  # Reset if file is older than 24h
  if [ -f "$f" ] && [ "$(find "$f" -mmin +1440 2>/dev/null)" ]; then
    rm -f "$f"
  fi
  local count=0
  [ -f "$f" ] && count=$(cat "$f")
  [ "$count" -ge "$NOOP_THRESHOLD" ]
}

# ── Cost logging ──
log_cost() {
  local agent="$1" budget="$2"
  echo "$(date '+%Y-%m-%d %H:%M') $agent \$$budget" >> ralph-logs/cost.log
}

# ── Changelog: log all new commits since a given SHA ──
log_changelog() {
  local agent="$1" before_sha="$2"
  local after_sha=$(git rev-parse HEAD 2>/dev/null)
  if [ "$before_sha" = "$after_sha" ]; then return; fi
  local commits=$(git log --oneline "${before_sha}..${after_sha}" 2>/dev/null)
  if [ -z "$commits" ]; then return; fi
  {
    echo ""
    echo "### $(date '+%Y-%m-%d %H:%M') — ${agent}"
    echo "$commits" | while IFS= read -r line; do
      echo "- $line"
    done
  } >> ralph-logs/changelog.md
}

get_sleep() {
  if [[ "$(date +%Y-%m-%d)" > "$PROMO_END" ]]; then echo $SLEEP_NORMAL; return; fi
  local hour=$(TZ=America/New_York date +%H | sed 's/^0//')
  if [ "$hour" -ge 8 ] && [ "$hour" -lt 14 ]; then echo $SLEEP_PEAK; else echo $SLEEP_OFFPEAK; fi
}

get_budget() {
  if [[ "$(date +%Y-%m-%d)" > "$PROMO_END" ]]; then echo $BUDGET; return; fi
  local hour=$(TZ=America/New_York date +%H | sed 's/^0//')
  if [ "$hour" -ge 8 ] && [ "$hour" -lt 14 ]; then echo $BUDGET_PEAK; else echo $BUDGET_OFFPEAK; fi
}

is_offpeak() {
  if [[ "$(date +%Y-%m-%d)" > "$PROMO_END" ]]; then echo 0; return; fi
  local hour=$(TZ=America/New_York date +%H | sed 's/^0//')
  if [ "$hour" -ge 8 ] && [ "$hour" -lt 14 ]; then echo 0; else echo 1; fi
}

check_stop() {
  if [ -f /tmp/ralph-stop-requested ]; then
    echo "=== Stop requested. Finishing gracefully... ==="
    cleanup_worktrees
    rm -f /tmp/ralph-stop-requested /tmp/ralph-heartbeat
    echo "=== Ralphs stopped gracefully. ==="
    exit 0
  fi
}

cleanup_worktrees() {
  for wt in design polish seo a11y content mobile security dx test; do
    git worktree remove "/tmp/ralph-${wt}-wt" --force 2>/dev/null || true
  done
  git branch -D ralph-design-tmp ralph-polish-tmp ralph-seo-tmp ralph-a11y-tmp ralph-content-tmp ralph-mobile-tmp ralph-security-tmp ralph-dx-tmp ralph-test-tmp 2>/dev/null || true
}

# Budget for secondary agents (half of primary)
get_secondary_budget() {
  local full=$(get_budget)
  echo $(( full / 2 ))
}
SECONDARY_TURNS=40  # Increased turns for secondary agents

CYCLE=0
while true; do
  CYCLE=$((CYCLE + 1))
  check_stop
  CSLEEP=$(get_sleep)
  CBUDGET=$(get_budget)
  OFFPEAK=$(is_offpeak)
  ROTATION=$((CYCLE % 8))

  # Heartbeat — write timestamp so health command can detect stale loops
  date +%s > /tmp/ralph-heartbeat
  mkdir -p /tmp/ralph-live

  echo "=== Cycle $CYCLE (rot=$ROTATION offpeak=$OFFPEAK) — sleep=${CSLEEP}s budget=\$${CBUDGET} ($(TZ=America/New_York date '+%H:%M ET')) ==="

  # QA regression priority — if QA fixed breakage last cycle, verify before continuing
  if [ -f /tmp/ralph-qa-fixed-breakage ]; then
    echo '=== [QA Verify] Re-running QA to confirm previous fix is stable... ==='
    rm -f /tmp/ralph-qa-fixed-breakage
    claude -p 'Go' --agent qa-ralph --dangerously-skip-permissions --max-turns $QA_TURNS --max-budget-usd $QA_BUDGET 2>&1 | tee /tmp/ralph-live/qa-ralph.log
    OUTPUT=$(cat /tmp/ralph-live/qa-ralph.log)
    log_cost "qa-ralph-verify" "$QA_BUDGET"
    if echo "$OUTPUT" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
    echo '=== [QA Verify] Done ==='
    sleep $CSLEEP
    check_stop
  fi

  # Check mobile focus mode
  IS_MOBILE=0
  if [ -f "$MOBILE_FLAG" ]; then
    EXPIRY=$(cat "$MOBILE_FLAG")
    NOW=$(date +%s)
    if [ "$NOW" -lt "$EXPIRY" ]; then
      IS_MOBILE=1
      echo '=== Mobile focus mode ACTIVE ==='
    else
      rm -f "$MOBILE_FLAG"
      echo '=== Mobile focus expired, reverting to normal mode ==='
    fi
  fi

  mkdir -p ralph-logs

  BEFORE_SHA=$(git rev-parse HEAD 2>/dev/null)

  if [ "$IS_MOBILE" = "1" ]; then
    ##############################
    # Mobile mode: sequential (no worktrees)
    ##############################
    echo '=== [Design Ralph] Starting (mobile)... ==='
    DESIGN_BEFORE=$(git rev-parse HEAD 2>/dev/null)
    claude -p "$MOBILE_PROMPT" --dangerously-skip-permissions --allowedTools 'Bash,Read,Edit,Write,Grep,Glob' --max-turns $MAX_TURNS --max-budget-usd $CBUDGET 2>&1 | tee /tmp/ralph-live/design-ralph-mobile.log
    OUTPUT=$(cat /tmp/ralph-live/design-ralph-mobile.log)
    log_cost "design-ralph-mobile" "$CBUDGET"
    if echo "$OUTPUT" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
    log_changelog "Design Ralph (mobile)" "$DESIGN_BEFORE"
    LATEST=$(git log --oneline -1 2>/dev/null)
    echo "=== [Design Ralph] Done: $LATEST ==="

    AFTER_SHA=$(git rev-parse HEAD 2>/dev/null)
    if [ "$BEFORE_SHA" = "$AFTER_SHA" ]; then
      echo '=== No changes made this cycle. Skipping remaining phases. ==='
      sleep $CSLEEP
      continue
    fi
    sleep $CSLEEP
    check_stop

    echo '=== [Polish Ralph] Starting (mobile)... ==='
    POLISH_BEFORE=$(git rev-parse HEAD 2>/dev/null)
    claude -p "$MOBILE_POLISH_PROMPT" --dangerously-skip-permissions --model sonnet --allowedTools 'Bash,Read,Edit,Write,Grep,Glob' --max-turns $MAX_TURNS --max-budget-usd $CBUDGET 2>&1 | tee /tmp/ralph-live/polish-ralph-mobile.log
    OUTPUT=$(cat /tmp/ralph-live/polish-ralph-mobile.log)
    log_cost "polish-ralph-mobile" "$CBUDGET"
    if echo "$OUTPUT" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
    log_changelog "Polish Ralph (mobile)" "$POLISH_BEFORE"
    LATEST=$(git log --oneline -1 2>/dev/null)
    echo "=== [Polish Ralph] Done: $LATEST ==="
    sleep $CSLEEP
    check_stop

  else
    ##############################
    # Normal mode: 3-cycle rotation with parallel worktrees
    ##############################

    # Determine primary agent for this cycle
    # Core agents (0-2): full budget+turns | Secondary agents (3-7): half budget+turns
    IS_SECONDARY=0
    case $ROTATION in
      0) PRIMARY_AGENT="design-ralph"   ; PRIMARY_WT="/tmp/ralph-design-wt"   ; PRIMARY_BRANCH="ralph-design-tmp" ;;
      1) PRIMARY_AGENT="polish-ralph"   ; PRIMARY_WT="/tmp/ralph-polish-wt"   ; PRIMARY_BRANCH="ralph-polish-tmp" ;;
      2) PRIMARY_AGENT="seo-ralph"      ; PRIMARY_WT="/tmp/ralph-seo-wt"      ; PRIMARY_BRANCH="ralph-seo-tmp" ;;
      3) PRIMARY_AGENT="a11y-ralph"     ; PRIMARY_WT="/tmp/ralph-a11y-wt"     ; PRIMARY_BRANCH="ralph-a11y-tmp"     ; IS_SECONDARY=1 ;;
      4) PRIMARY_AGENT="content-ralph"  ; PRIMARY_WT="/tmp/ralph-content-wt"  ; PRIMARY_BRANCH="ralph-content-tmp"  ; IS_SECONDARY=1 ;;
      5) PRIMARY_AGENT="mobile-ralph"   ; PRIMARY_WT="/tmp/ralph-mobile-wt"   ; PRIMARY_BRANCH="ralph-mobile-tmp"   ; IS_SECONDARY=1 ;;
      6) PRIMARY_AGENT="security-ralph" ; PRIMARY_WT="/tmp/ralph-security-wt" ; PRIMARY_BRANCH="ralph-security-tmp" ; IS_SECONDARY=1 ;;
      7) PRIMARY_AGENT="dx-ralph"       ; PRIMARY_WT="/tmp/ralph-dx-wt"       ; PRIMARY_BRANCH="ralph-dx-tmp"       ; IS_SECONDARY=1 ;;
    esac

    # Secondary agents get half budget and fewer turns
    if [ "$IS_SECONDARY" = "1" ]; then
      AGENT_BUDGET=$(get_secondary_budget)
      AGENT_TURNS=$SECONDARY_TURNS
    else
      AGENT_BUDGET=$CBUDGET
      AGENT_TURNS=$MAX_TURNS
    fi

    # No-op detection — skip agents with too many consecutive no-change cycles
    if should_skip_agent "$PRIMARY_AGENT"; then
      echo "=== [$PRIMARY_AGENT] Skipped ($(cat /tmp/ralph-noop-${PRIMARY_AGENT}.count) consecutive no-ops) ==="
      sleep $CSLEEP
      continue
    fi

    cleanup_worktrees

    # Create primary worktree
    git worktree add "$PRIMARY_WT" -b "$PRIMARY_BRANCH" HEAD 2>/dev/null

    # Launch primary agent
    echo "=== [$PRIMARY_AGENT] Starting in worktree (budget=\$${AGENT_BUDGET}, turns=${AGENT_TURNS})... ==="
    (cd "$PRIMARY_WT" && claude -p 'Go' --agent "$PRIMARY_AGENT" --model sonnet --dangerously-skip-permissions --max-turns $AGENT_TURNS --max-budget-usd $AGENT_BUDGET 2>&1) > "/tmp/ralph-${PRIMARY_AGENT}.log" 2>&1 &
    PRIMARY_PID=$!

    # Launch test-ralph in parallel during off-peak (zero conflict risk — only creates .test.tsx files)
    TEST_PID=""
    if [ "$OFFPEAK" = "1" ]; then
      git worktree add /tmp/ralph-test-wt -b ralph-test-tmp HEAD 2>/dev/null
      echo '=== [test-ralph] Starting in parallel worktree... ==='
      (cd /tmp/ralph-test-wt && claude -p 'Go' --agent test-ralph --model sonnet --dangerously-skip-permissions --max-turns $MAX_TURNS --max-budget-usd $CBUDGET 2>&1) > /tmp/ralph-test-ralph.log 2>&1 &
      TEST_PID=$!
      echo "=== Waiting for $PRIMARY_AGENT (PID $PRIMARY_PID) + test-ralph (PID $TEST_PID)... ==="
    else
      echo "=== Peak mode: skipping test-ralph parallel slot. Waiting for $PRIMARY_AGENT (PID $PRIMARY_PID)... ==="
    fi

    # Wait for all agents
    wait $PRIMARY_PID 2>/dev/null || true
    [ -n "$TEST_PID" ] && { wait $TEST_PID 2>/dev/null || true; }
    check_stop

    echo "=== [$PRIMARY_AGENT] Output: ==="
    cat "/tmp/ralph-${PRIMARY_AGENT}.log" 2>/dev/null || true
    if [ -n "$TEST_PID" ]; then
      echo '=== [test-ralph] Output: ==='
      cat /tmp/ralph-test-ralph.log 2>/dev/null || true
    fi

    # Check for rate limiting in any output
    RATE_LIMITED=0
    if grep -q 'out of extra usage' "/tmp/ralph-${PRIMARY_AGENT}.log" 2>/dev/null; then RATE_LIMITED=1; fi
    if [ -n "$TEST_PID" ] && grep -q 'out of extra usage' /tmp/ralph-test-ralph.log 2>/dev/null; then RATE_LIMITED=1; fi
    if [ "$RATE_LIMITED" = "1" ]; then
      echo '=== Rate limited. Cleaning up and backing off 5m... ==='
      cleanup_worktrees
      sleep $BACKOFF
      continue
    fi

    # Merge test-ralph first (guaranteed clean — only creates new .test.tsx files)
    if [ -n "$TEST_PID" ]; then
      TEST_SHA=$(git rev-parse ralph-test-tmp 2>/dev/null)
      if [ "$TEST_SHA" != "$BEFORE_SHA" ]; then
        ensure_worktree /tmp/ralph-test-wt ralph-test-tmp
        if gate_worktree /tmp/ralph-test-wt; then
          MERGE_BEFORE=$(git rev-parse HEAD 2>/dev/null)
          git merge ralph-test-tmp --no-edit 2>&1
          log_changelog "Test Ralph" "$MERGE_BEFORE"
          LATEST=$(git log --oneline -1 2>/dev/null)
          echo "=== [test-ralph] Merged: $LATEST ==="
          reset_noop test-ralph
        else
          echo '=== [test-ralph] Build gate failed — discarding ==='
          increment_noop test-ralph
        fi
        log_cost "test-ralph" "$CBUDGET"
      else
        echo '=== [test-ralph] No changes ==='
        increment_noop test-ralph
      fi
    fi

    # Merge primary agent changes
    PRIMARY_SHA=$(git rev-parse "$PRIMARY_BRANCH" 2>/dev/null)
    if [ "$PRIMARY_SHA" != "$BEFORE_SHA" ]; then
      ensure_worktree "$PRIMARY_WT" "$PRIMARY_BRANCH"
      if gate_worktree "$PRIMARY_WT"; then
        if git merge "$PRIMARY_BRANCH" --no-edit 2>&1; then
          log_changelog "${PRIMARY_AGENT}" "$BEFORE_SHA"
          LATEST=$(git log --oneline -1 2>/dev/null)
          echo "=== [$PRIMARY_AGENT] Merged: $LATEST ==="
          reset_noop "$PRIMARY_AGENT"
        else
          echo "=== [$PRIMARY_AGENT] Merge conflict — aborting merge ==="
          git merge --abort 2>/dev/null || true
        fi
      else
        echo "=== [$PRIMARY_AGENT] Build gate failed — discarding ==="
        increment_noop "$PRIMARY_AGENT"
      fi
      log_cost "$PRIMARY_AGENT" "$AGENT_BUDGET"
    else
      echo "=== [$PRIMARY_AGENT] No changes ==="
      increment_noop "$PRIMARY_AGENT"
    fi

    cleanup_worktrees

    AFTER_SHA=$(git rev-parse HEAD 2>/dev/null)
    if [ "$BEFORE_SHA" = "$AFTER_SHA" ]; then
      echo '=== No changes made this cycle. Skipping QA/Visual QA to save tokens. ==='
      sleep $CSLEEP
      continue
    fi
    sleep $CSLEEP
    check_stop
  fi

  ##############################
  # QA Ralph (always sequential, on merged result)
  ##############################
  echo '=== [QA Ralph] Starting... ==='
  QA_BEFORE=$(git rev-parse HEAD 2>/dev/null)
  claude -p 'Go' --agent qa-ralph --dangerously-skip-permissions --max-turns $QA_TURNS --max-budget-usd $QA_BUDGET 2>&1 | tee /tmp/ralph-live/qa-ralph.log
  OUTPUT=$(cat /tmp/ralph-live/qa-ralph.log)
  log_cost "qa-ralph" "$QA_BUDGET"
  if echo "$OUTPUT" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
  QA_AFTER=$(git rev-parse HEAD 2>/dev/null)
  log_changelog "QA Ralph" "$QA_BEFORE"
  LATEST=$(git log --oneline -1 2>/dev/null)
  # If QA made changes, flag for verification next cycle
  if [ "$QA_BEFORE" != "$QA_AFTER" ]; then
    echo "=== [QA Ralph] Fixed breakage — flagging for re-verification next cycle ==="
    touch /tmp/ralph-qa-fixed-breakage
  fi
  echo "=== [QA Ralph] Done: $LATEST ==="
  sleep $CSLEEP
  check_stop

  ##############################
  # Report Ralph — cycle summary (read-only, no commits)
  ##############################
  echo '=== [Report Ralph] Generating cycle report... ==='
  claude -p 'Go' --agent report-ralph --model sonnet --dangerously-skip-permissions --max-turns 5 --max-budget-usd 0.50 2>&1 | tee /tmp/ralph-live/report-ralph.log
  log_cost "report-ralph" "0.50"
  echo '=== [Report Ralph] Done ==='
  check_stop

  ##############################
  # Perf Ralph — runs after QA on seo cycles (rotation==2)
  ##############################
  if [ "$ROTATION" = "2" ]; then
    echo '=== [Perf Ralph] Starting (seo cycle follow-up)... ==='
    claude -p 'Go' --agent perf-ralph --model sonnet --dangerously-skip-permissions --max-turns $MAX_TURNS --max-budget-usd $CBUDGET 2>&1 | tee /tmp/ralph-live/perf-ralph.log
    OUTPUT=$(cat /tmp/ralph-live/perf-ralph.log)
    log_cost "perf-ralph" "$CBUDGET"
    if echo "$OUTPUT" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
    log_changelog "Perf Ralph" "$BEFORE_SHA"
    LATEST=$(git log --oneline -1 2>/dev/null)
    echo "=== [Perf Ralph] Done: $LATEST ==="
    sleep $CSLEEP
    check_stop
  fi

  ##############################
  # Interactive QA Ralph — runs after design/polish cycles (rotation 0 or 1) that had changes
  ##############################
  if [ "$ROTATION" = "0" ] || [ "$ROTATION" = "1" ]; then
    echo '=== [Interactive QA Ralph] Starting (post-design/polish E2E check)... ==='
    IQA_BEFORE=$(git rev-parse HEAD 2>/dev/null)
    claude -p 'Go' --agent interactive-qa-ralph --model sonnet --dangerously-skip-permissions --max-turns $MAX_TURNS --max-budget-usd $CBUDGET 2>&1 | tee /tmp/ralph-live/interactive-qa-ralph.log
    OUTPUT=$(cat /tmp/ralph-live/interactive-qa-ralph.log)
    log_cost "interactive-qa-ralph" "$CBUDGET"
    if echo "$OUTPUT" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
    log_changelog "Interactive QA Ralph" "$IQA_BEFORE"
    LATEST=$(git log --oneline -1 2>/dev/null)
    echo "=== [Interactive QA Ralph] Done: $LATEST ==="
    sleep $CSLEEP
    check_stop
  fi

  ##############################
  # Visual QA Ralph — every 3rd cycle (off-peak) or every 4th (peak)
  ##############################
  if [ "$OFFPEAK" = "1" ]; then
    VQA_FREQ=3
  else
    VQA_FREQ=4
  fi
  if [ $((CYCLE % VQA_FREQ)) -eq 0 ]; then
    if [ ! -f scripts/visual-qa.sh ]; then
      echo '=== [Visual QA Ralph] Skipped (scripts/visual-qa.sh not found) ==='
    else
      echo '=== [Visual QA Ralph] Taking screenshots... ==='
      bash scripts/visual-qa.sh 2>&1
      echo '=== [Visual QA Ralph] Analyzing screenshots... ==='
      VQA_BEFORE=$(git rev-parse HEAD 2>/dev/null)
      claude -p 'Go' --agent visual-qa-ralph --dangerously-skip-permissions --max-turns $MAX_TURNS --max-budget-usd $CBUDGET 2>&1 | tee /tmp/ralph-live/visual-qa-ralph.log
      OUTPUT=$(cat /tmp/ralph-live/visual-qa-ralph.log)
      log_cost "visual-qa-ralph" "$CBUDGET"
      if echo "$OUTPUT" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
      log_changelog "Visual QA Ralph" "$VQA_BEFORE"
      LATEST=$(git log --oneline -1 2>/dev/null)
      echo "=== [Visual QA Ralph] Done: $LATEST ==="
      sleep $CSLEEP
      check_stop
    fi
  else
    echo "=== [Visual QA Ralph] Skipped (cycle $CYCLE, every ${VQA_FREQ}th) ==="
  fi

  echo "=== Cycle $CYCLE complete. Next cycle in ${CSLEEP}s... ==="
done
