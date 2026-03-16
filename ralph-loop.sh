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

cleanup_worktrees() {
  git worktree remove /tmp/ralph-design-wt --force 2>/dev/null || true
  git worktree remove /tmp/ralph-polish-wt --force 2>/dev/null || true
  git branch -D ralph-design-tmp ralph-polish-tmp 2>/dev/null || true
}

CYCLE=0
while true; do
  CYCLE=$((CYCLE + 1))
  CSLEEP=$(get_sleep)
  CBUDGET=$(get_budget)
  echo "=== Cycle $CYCLE — sleep=${CSLEEP}s budget=\$${CBUDGET} ($(TZ=America/New_York date '+%H:%M ET')) ==="

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
    # Normal mode: Design + Polish in parallel worktrees
    ##############################
    cleanup_worktrees

    echo '=== [Design + Polish] Starting in parallel worktrees... ==='
    git worktree add /tmp/ralph-design-wt -b ralph-design-tmp HEAD 2>/dev/null
    git worktree add /tmp/ralph-polish-wt -b ralph-polish-tmp HEAD 2>/dev/null

    # Run both agents in parallel
    (cd /tmp/ralph-design-wt && claude -p 'Go' --agent design-ralph --model sonnet --dangerously-skip-permissions --max-turns $MAX_TURNS --max-budget-usd $CBUDGET 2>&1) > /tmp/ralph-design.log 2>&1 &
    DESIGN_PID=$!
    (cd /tmp/ralph-polish-wt && claude -p 'Go' --agent polish-ralph --dangerously-skip-permissions --max-turns $MAX_TURNS --max-budget-usd $CBUDGET 2>&1) > /tmp/ralph-polish.log 2>&1 &
    POLISH_PID=$!

    echo "=== Waiting for Design (PID $DESIGN_PID) + Polish (PID $POLISH_PID)... ==="
    wait $DESIGN_PID 2>/dev/null || true
    wait $POLISH_PID 2>/dev/null || true

    echo '=== [Design Ralph] Output: ==='
    cat /tmp/ralph-design.log 2>/dev/null || true
    echo '=== [Polish Ralph] Output: ==='
    cat /tmp/ralph-polish.log 2>/dev/null || true

    # Check for rate limiting in either output
    if grep -q 'out of extra usage' /tmp/ralph-design.log /tmp/ralph-polish.log 2>/dev/null; then
      echo '=== Rate limited. Cleaning up and backing off 5m... ==='
      cleanup_worktrees
      sleep $BACKOFF
      continue
    fi

    # Merge Design Ralph changes
    DESIGN_SHA=$(cd /tmp/ralph-design-wt && git rev-parse HEAD 2>/dev/null)
    if [ "$DESIGN_SHA" != "$BEFORE_SHA" ]; then
      git merge ralph-design-tmp --no-edit 2>&1
      LATEST=$(git log --oneline -1 2>/dev/null)
      echo "" >> ralph-logs/changelog.md
      echo "### $(date '+%Y-%m-%d %H:%M') — Design Ralph" >> ralph-logs/changelog.md
      echo "- $LATEST" >> ralph-logs/changelog.md
      echo "=== [Design Ralph] Merged: $LATEST ==="
    else
      echo '=== [Design Ralph] No changes ==='
    fi

    # Merge Polish Ralph changes
    POLISH_SHA=$(cd /tmp/ralph-polish-wt && git rev-parse HEAD 2>/dev/null)
    if [ "$POLISH_SHA" != "$BEFORE_SHA" ]; then
      if git merge ralph-polish-tmp --no-edit 2>&1; then
        LATEST=$(git log --oneline -1 2>/dev/null)
        echo "" >> ralph-logs/changelog.md
        echo "### $(date '+%Y-%m-%d %H:%M') — Polish Ralph" >> ralph-logs/changelog.md
        echo "- $LATEST" >> ralph-logs/changelog.md
        echo "=== [Polish Ralph] Merged: $LATEST ==="
      else
        echo '=== [Polish Ralph] Merge conflict — aborting polish merge ==='
        git merge --abort 2>/dev/null || true
      fi
    else
      echo '=== [Polish Ralph] No changes ==='
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
  # Visual QA Ralph (every other cycle)
  ##############################
  if [ $((CYCLE % 2)) -eq 0 ]; then
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
    echo "=== [Visual QA Ralph] Skipped (odd cycle $CYCLE) ==="
  fi

  echo "=== Cycle $CYCLE complete. Next cycle in ${CSLEEP}s... ==="
done
