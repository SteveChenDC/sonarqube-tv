#!/bin/bash
# Ralph Wiggum Loop — runs inside tmux, launched by ralph-rc.sh
# Expects env vars: BUDGET, QA_BUDGET, QA_TURNS, MAX_TURNS, BACKOFF,
#   PROMO_END, SLEEP_OFFPEAK, SLEEP_PEAK, SLEEP_NORMAL,
#   BUDGET_OFFPEAK, BUDGET_PEAK, MOBILE_FLAG,
#   MOBILE_PROMPT, MOBILE_POLISH_PROMPT

# No set -e: loop must be resilient to individual step failures

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

cleanup_worktrees() {
  git worktree remove /tmp/ralph-design-wt --force 2>/dev/null || true
  git worktree remove /tmp/ralph-polish-wt --force 2>/dev/null || true
  git worktree remove /tmp/ralph-seo-wt --force 2>/dev/null || true
  git worktree remove /tmp/ralph-test-wt --force 2>/dev/null || true
  git branch -D ralph-design-tmp ralph-polish-tmp ralph-seo-tmp ralph-test-tmp 2>/dev/null || true
}

CYCLE=0
while true; do
  CYCLE=$((CYCLE + 1))
  CSLEEP=$(get_sleep)
  CBUDGET=$(get_budget)
  OFFPEAK=$(is_offpeak)
  ROTATION=$((CYCLE % 3))
  echo "=== Cycle $CYCLE (rot=$ROTATION offpeak=$OFFPEAK) — sleep=${CSLEEP}s budget=\$${CBUDGET} ($(TZ=America/New_York date '+%H:%M ET')) ==="

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
    OUTPUT=$(claude -p "$MOBILE_PROMPT" --dangerously-skip-permissions --allowedTools 'Bash,Read,Edit,Write,Grep,Glob' --max-turns $MAX_TURNS --max-budget-usd $CBUDGET 2>&1)
    echo "$OUTPUT"
    if echo "$OUTPUT" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
    LATEST=$(git log --oneline -1 2>/dev/null)
    echo "" >> ralph-logs/changelog.md
    echo "### $(date '+%Y-%m-%d %H:%M') — Design Ralph (mobile)" >> ralph-logs/changelog.md
    echo "- $LATEST" >> ralph-logs/changelog.md
    echo "=== [Design Ralph] Done: $LATEST ==="

    AFTER_SHA=$(git rev-parse HEAD 2>/dev/null)
    if [ "$BEFORE_SHA" = "$AFTER_SHA" ]; then
      echo '=== No changes made this cycle. Skipping remaining phases. ==='
      sleep $CSLEEP
      continue
    fi
    sleep $CSLEEP

    echo '=== [Polish Ralph] Starting (mobile)... ==='
    OUTPUT=$(claude -p "$MOBILE_POLISH_PROMPT" --dangerously-skip-permissions --model sonnet --allowedTools 'Bash,Read,Edit,Write,Grep,Glob' --max-turns $MAX_TURNS --max-budget-usd $CBUDGET 2>&1)
    echo "$OUTPUT"
    if echo "$OUTPUT" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
    LATEST=$(git log --oneline -1 2>/dev/null)
    echo "" >> ralph-logs/changelog.md
    echo "### $(date '+%Y-%m-%d %H:%M') — Polish Ralph (mobile)" >> ralph-logs/changelog.md
    echo "- $LATEST" >> ralph-logs/changelog.md
    echo "=== [Polish Ralph] Done: $LATEST ==="
    sleep $CSLEEP

  else
    ##############################
    # Normal mode: 3-cycle rotation with parallel worktrees
    ##############################

    # Determine primary agent for this cycle
    case $ROTATION in
      0) PRIMARY_AGENT="design-ralph" ; PRIMARY_WT="/tmp/ralph-design-wt" ; PRIMARY_BRANCH="ralph-design-tmp" ;;
      1) PRIMARY_AGENT="polish-ralph" ; PRIMARY_WT="/tmp/ralph-polish-wt" ; PRIMARY_BRANCH="ralph-polish-tmp" ;;
      2) PRIMARY_AGENT="seo-ralph"    ; PRIMARY_WT="/tmp/ralph-seo-wt"    ; PRIMARY_BRANCH="ralph-seo-tmp" ;;
    esac

    cleanup_worktrees

    # Create primary worktree
    git worktree add "$PRIMARY_WT" -b "$PRIMARY_BRANCH" HEAD 2>/dev/null

    # Launch primary agent
    echo "=== [$PRIMARY_AGENT] Starting in worktree... ==="
    (cd "$PRIMARY_WT" && claude -p 'Go' --agent "$PRIMARY_AGENT" --model sonnet --dangerously-skip-permissions --max-turns $MAX_TURNS --max-budget-usd $CBUDGET 2>&1) > "/tmp/ralph-${PRIMARY_AGENT}.log" 2>&1 &
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
      TEST_SHA=$(cd /tmp/ralph-test-wt && git rev-parse HEAD 2>/dev/null)
      if [ "$TEST_SHA" != "$BEFORE_SHA" ]; then
        git merge ralph-test-tmp --no-edit 2>&1
        LATEST=$(git log --oneline -1 2>/dev/null)
        echo "" >> ralph-logs/changelog.md
        echo "### $(date '+%Y-%m-%d %H:%M') — Test Ralph" >> ralph-logs/changelog.md
        echo "- $LATEST" >> ralph-logs/changelog.md
        echo "=== [test-ralph] Merged: $LATEST ==="
      else
        echo '=== [test-ralph] No changes ==='
      fi
    fi

    # Merge primary agent changes
    PRIMARY_SHA=$(cd "$PRIMARY_WT" && git rev-parse HEAD 2>/dev/null)
    if [ "$PRIMARY_SHA" != "$BEFORE_SHA" ]; then
      if git merge "$PRIMARY_BRANCH" --no-edit 2>&1; then
        LATEST=$(git log --oneline -1 2>/dev/null)
        echo "" >> ralph-logs/changelog.md
        echo "### $(date '+%Y-%m-%d %H:%M') — ${PRIMARY_AGENT}" >> ralph-logs/changelog.md
        echo "- $LATEST" >> ralph-logs/changelog.md
        echo "=== [$PRIMARY_AGENT] Merged: $LATEST ==="
      else
        echo "=== [$PRIMARY_AGENT] Merge conflict — aborting merge ==="
        git merge --abort 2>/dev/null || true
      fi
    else
      echo "=== [$PRIMARY_AGENT] No changes ==="
    fi

    cleanup_worktrees

    AFTER_SHA=$(git rev-parse HEAD 2>/dev/null)
    if [ "$BEFORE_SHA" = "$AFTER_SHA" ]; then
      echo '=== No changes made this cycle. Skipping QA/Visual QA to save tokens. ==='
      sleep $CSLEEP
      continue
    fi
    sleep $CSLEEP
  fi

  ##############################
  # QA Ralph (always sequential, on merged result)
  ##############################
  echo '=== [QA Ralph] Starting... ==='
  OUTPUT=$(claude -p 'Go' --agent qa-ralph --dangerously-skip-permissions --max-turns $QA_TURNS --max-budget-usd $QA_BUDGET 2>&1)
  echo "$OUTPUT"
  if echo "$OUTPUT" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
  LATEST=$(git log --oneline -1 2>/dev/null)
  echo "" >> ralph-logs/changelog.md
  echo "### $(date '+%Y-%m-%d %H:%M') — QA Ralph" >> ralph-logs/changelog.md
  echo "- $LATEST" >> ralph-logs/changelog.md
  echo "=== [QA Ralph] Done: $LATEST ==="
  sleep $CSLEEP

  ##############################
  # Report Ralph — cycle summary (read-only, no commits)
  ##############################
  echo '=== [Report Ralph] Generating cycle report... ==='
  claude -p 'Go' --agent report-ralph --model sonnet --dangerously-skip-permissions --max-turns 5 --max-budget-usd 0.50 2>&1
  echo '=== [Report Ralph] Done ==='

  ##############################
  # Perf Ralph — runs after QA on seo cycles (rotation==2)
  ##############################
  if [ "$ROTATION" = "2" ]; then
    echo '=== [Perf Ralph] Starting (seo cycle follow-up)... ==='
    OUTPUT=$(claude -p 'Go' --agent perf-ralph --model sonnet --dangerously-skip-permissions --max-turns $MAX_TURNS --max-budget-usd $CBUDGET 2>&1)
    echo "$OUTPUT"
    if echo "$OUTPUT" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
    LATEST=$(git log --oneline -1 2>/dev/null)
    echo "" >> ralph-logs/changelog.md
    echo "### $(date '+%Y-%m-%d %H:%M') — Perf Ralph" >> ralph-logs/changelog.md
    echo "- $LATEST" >> ralph-logs/changelog.md
    echo "=== [Perf Ralph] Done: $LATEST ==="
    sleep $CSLEEP
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
    if [ ! -f scripts/visual-qa.mjs ]; then
      echo '=== [Visual QA Ralph] Skipped (scripts/visual-qa.mjs not found) ==='
    else
      echo '=== [Visual QA Ralph] Taking screenshots... ==='
      node scripts/visual-qa.mjs 2>&1
      echo '=== [Visual QA Ralph] Analyzing screenshots... ==='
      OUTPUT=$(claude -p 'Go' --agent visual-qa-ralph --dangerously-skip-permissions --max-turns $MAX_TURNS --max-budget-usd $CBUDGET 2>&1)
      echo "$OUTPUT"
      if echo "$OUTPUT" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
      LATEST=$(git log --oneline -1 2>/dev/null)
      echo "" >> ralph-logs/changelog.md
      echo "### $(date '+%Y-%m-%d %H:%M') — Visual QA Ralph" >> ralph-logs/changelog.md
      echo "- $LATEST" >> ralph-logs/changelog.md
      echo "=== [Visual QA Ralph] Done: $LATEST ==="
      sleep $CSLEEP
    fi
  else
    echo "=== [Visual QA Ralph] Skipped (cycle $CYCLE, every ${VQA_FREQ}th) ==="
  fi

  echo "=== Cycle $CYCLE complete. Next cycle in ${CSLEEP}s... ==="
done
