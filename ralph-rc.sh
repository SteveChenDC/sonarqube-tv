#!/bin/bash
# Ralph Wiggum Autonomous Improvement Loop
# Usage: ./ralph-rc.sh [--mobile]
# Control: tmux attach -t ralphs
#   Kill:   tmux kill-session -t ralphs
#   Pause:  tmux send-keys -t ralphs:loop C-c

set -e

BRANCH="ralph-wiggum-improvements"
BUDGET=2
QA_BUDGET=2
QA_TURNS=10
MAX_TURNS=30
BACKOFF=300  # 5 min backoff when rate limited
MOBILE_FLAG="/tmp/ralph-mobile-focus.timestamp"

# Double usage promo: 2x limits outside 8AM-2PM ET through March 27, 2026
PROMO_END="2026-03-28"
SLEEP_OFFPEAK=90   # 1.5 min — maximize 2x window
SLEEP_PEAK=480     # 8 min — conserve during 1x window
SLEEP_NORMAL=180   # 3 min — post-promo default
BUDGET_OFFPEAK=5   # Higher budget during 2x limits
BUDGET_PEAK=3      # Standard budget during peak

get_sleep() {
  if [[ "$(date +%Y-%m-%d)" > "$PROMO_END" ]]; then
    echo $SLEEP_NORMAL
    return
  fi
  local hour=$(TZ="America/New_York" date +%H | sed 's/^0//')
  if [ "$hour" -ge 8 ] && [ "$hour" -lt 14 ]; then
    echo $SLEEP_PEAK
  else
    echo $SLEEP_OFFPEAK
  fi
}

get_budget() {
  if [[ "$(date +%Y-%m-%d)" > "$PROMO_END" ]]; then
    echo $BUDGET
    return
  fi
  local hour=$(TZ="America/New_York" date +%H | sed 's/^0//')
  if [ "$hour" -ge 8 ] && [ "$hour" -lt 14 ]; then
    echo $BUDGET_PEAK
  else
    echo $BUDGET_OFFPEAK
  fi
}

# --mobile: activate 12-hour mobile focus mode
if [ "$1" = "--mobile" ]; then
  EXPIRY=$(( $(date +%s) + 43200 ))  # 12 hours from now
  echo "$EXPIRY" > "$MOBILE_FLAG"
  echo "=== Mobile focus activated until $(date -r "$EXPIRY" '+%Y-%m-%d %H:%M') ==="
fi

MOBILE_PROMPT='You are a mobile-focused design critic for the sonarqube-tv app. CLAUDE.md has the full project map. Check git log --oneline -10 to see what has already been fixed. Pick ONE mobile issue and fix it: (1) Touch targets under 44px — buttons, links, cards must be ≥44px tap area, (2) Text sizing on narrow viewports — ensure readability at 375px, (3) Card spacing/density on mobile — 2-col grid gaps and padding, (4) Hero card rendering below 640px — check the sm:hidden mobile card layout, (5) 2-col grid alignment — ensure even columns in VideoRow mobile grid, (6) Filter modal mobile UX — full-screen on small viewports, easy dismiss, (7) Watch page responsive player — YouTube iframe sizing on mobile, (8) Horizontal overflow at 375px — no content should bleed off-screen, (9) Floating button positioning — filter FAB should not overlap content on mobile. Verify with npm run build. Commit with a descriptive message.'

MOBILE_POLISH_PROMPT='You are a mobile-focused polish critic for the sonarqube-tv app. CLAUDE.md has the full project map. Check git log --oneline -10 to see what has already been fixed. Pick ONE mobile polish issue — do NOT pick one already fixed: (1) Touch targets ≥44px on all interactive elements, (2) Text legibility at 375px width, (3) Mobile grid card spacing consistency, (4) Hero mobile card visual polish, (5) Grid column alignment edge cases, (6) Filter modal mobile layout, (7) Mobile video player controls, (8) Prevent horizontal scroll overflow, (9) FAB positioning on small screens. Verify with npm run build. Commit with a descriptive message.'

# Create or switch to the improvement branch
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"

# Kill existing session if any
tmux kill-session -t ralphs 2>/dev/null || true

# Start tmux session
tmux new-session -d -s ralphs -n rc

##############################
# Sequential loop — one Ralph at a time
##############################
tmux new-window -t ralphs -n loop
tmux send-keys -t ralphs:loop "
get_sleep() {
  if [[ \\\"\\\$(date +%Y-%m-%d)\\\" > \\\"$PROMO_END\\\" ]]; then echo $SLEEP_NORMAL; return; fi
  local hour=\\\$(TZ=America/New_York date +%H | sed 's/^0//')
  if [ \\\"\\\$hour\\\" -ge 8 ] && [ \\\"\\\$hour\\\" -lt 14 ]; then echo $SLEEP_PEAK; else echo $SLEEP_OFFPEAK; fi
}
get_budget() {
  if [[ \\\"\\\$(date +%Y-%m-%d)\\\" > \\\"$PROMO_END\\\" ]]; then echo $BUDGET; return; fi
  local hour=\\\$(TZ=America/New_York date +%H | sed 's/^0//')
  if [ \\\"\\\$hour\\\" -ge 8 ] && [ \\\"\\\$hour\\\" -lt 14 ]; then echo $BUDGET_PEAK; else echo $BUDGET_OFFPEAK; fi
}
CYCLE=0
while true; do
  CYCLE=\$((CYCLE + 1))
  CSLEEP=\$(get_sleep)
  CBUDGET=\$(get_budget)
  echo \"=== Cycle start — sleep=\${CSLEEP}s budget=\\\$\${CBUDGET} (\$(TZ=America/New_York date '+%H:%M ET')) ===\"

  # Check mobile focus mode
  IS_MOBILE=0
  if [ -f \"$MOBILE_FLAG\" ]; then
    EXPIRY=\$(cat \"$MOBILE_FLAG\")
    NOW=\$(date +%s)
    if [ \"\$NOW\" -lt \"\$EXPIRY\" ]; then
      IS_MOBILE=1
      echo '=== Mobile focus mode ACTIVE ==='
    else
      rm -f \"$MOBILE_FLAG\"
      echo '=== Mobile focus expired, reverting to normal mode ==='
    fi
  fi

  mkdir -p ralph-logs

  echo '=== [Design Ralph] Starting... ==='
  BEFORE_SHA=\$(git rev-parse HEAD 2>/dev/null)
  if [ \"\$IS_MOBILE\" = \"1\" ]; then
    OUTPUT=\$(claude -p '$MOBILE_PROMPT' --allowedTools 'Bash,Read,Edit,Write,Grep,Glob' --max-turns $MAX_TURNS --max-budget-usd \$CBUDGET 2>&1)
  else
    OUTPUT=\$(claude -a design-ralph --model sonnet --max-turns $MAX_TURNS --max-budget-usd \$CBUDGET 2>&1)
  fi
  echo \"\$OUTPUT\"
  if echo \"\$OUTPUT\" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
  AFTER_SHA=\$(git rev-parse HEAD 2>/dev/null)
  LATEST=\$(git log --oneline -1 2>/dev/null)
  echo \"\" >> ralph-logs/changelog.md
  echo \"### \$(date '+%Y-%m-%d %H:%M') — Design Ralph\" >> ralph-logs/changelog.md
  echo \"- \$LATEST\" >> ralph-logs/changelog.md
  echo \"=== [Design Ralph] Done: \$LATEST ===\"
  if [ \"\$BEFORE_SHA\" = \"\$AFTER_SHA\" ]; then
    echo '=== No changes made this cycle. Skipping Polish/QA/Visual QA to save tokens. ==='
    sleep \$CSLEEP
    continue
  fi
  sleep \$CSLEEP

  echo '=== [Polish Ralph] Starting... ==='
  if [ \"\$IS_MOBILE\" = \"1\" ]; then
    OUTPUT=\$(claude -p '$MOBILE_POLISH_PROMPT' --model sonnet --allowedTools 'Bash,Read,Edit,Write,Grep,Glob' --max-turns $MAX_TURNS --max-budget-usd \$CBUDGET 2>&1)
  else
    OUTPUT=\$(claude -a polish-ralph --max-turns $MAX_TURNS --max-budget-usd \$CBUDGET 2>&1)
  fi
  echo \"\$OUTPUT\"
  if echo \"\$OUTPUT\" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
  LATEST=\$(git log --oneline -1 2>/dev/null)
  echo \"\" >> ralph-logs/changelog.md
  echo \"### \$(date '+%Y-%m-%d %H:%M') — Polish Ralph\" >> ralph-logs/changelog.md
  echo \"- \$LATEST\" >> ralph-logs/changelog.md
  echo \"=== [Polish Ralph] Done: \$LATEST ===\"
  sleep \$CSLEEP

  echo '=== [QA Ralph] Starting... ==='
  OUTPUT=\$(claude -a qa-ralph --max-turns $QA_TURNS --max-budget-usd $QA_BUDGET 2>&1)
  echo \"\$OUTPUT\"
  if echo \"\$OUTPUT\" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
  LATEST=\$(git log --oneline -1 2>/dev/null)
  echo \"\" >> ralph-logs/changelog.md
  echo \"### \$(date '+%Y-%m-%d %H:%M') — QA Ralph\" >> ralph-logs/changelog.md
  echo \"- \$LATEST\" >> ralph-logs/changelog.md
  echo \"=== [QA Ralph] Done: \$LATEST ===\"
  sleep \$CSLEEP

  if [ \$((CYCLE % 2)) -eq 0 ]; then
    echo '=== [Visual QA Ralph] Taking screenshots... ==='
    node scripts/visual-qa.mjs 2>&1
    echo '=== [Visual QA Ralph] Analyzing screenshots... ==='
    OUTPUT=\$(claude -a visual-qa-ralph --max-turns $MAX_TURNS --max-budget-usd \$CBUDGET 2>&1)
    echo \"\$OUTPUT\"
    if echo \"\$OUTPUT\" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
    LATEST=\$(git log --oneline -1 2>/dev/null)
    echo \"\" >> ralph-logs/changelog.md
    echo \"### \$(date '+%Y-%m-%d %H:%M') — Visual QA Ralph\" >> ralph-logs/changelog.md
    echo \"- \$LATEST\" >> ralph-logs/changelog.md
    echo \"=== [Visual QA Ralph] Done: \$LATEST ===\"
    sleep \$CSLEEP
  else
    echo '=== [Visual QA Ralph] Skipped (odd cycle \$CYCLE) ==='
  fi

  echo '=== Cycle complete. Next cycle in \${CSLEEP}s... ==='
done" Enter

# Go back to rc window
tmux select-window -t ralphs:rc
tmux send-keys -t ralphs:rc "echo '=== Ralph RC — Control Center ===' && echo 'Agents: Design(sonnet) → Polish(sonnet) → QA(sonnet) → VisualQA(sonnet, every 2nd cycle)' && echo 'Memory: .claude/agents/ — persists across runs' && echo '2x promo: off-peak(2PM-8AM ET)=90s/\$5 | peak(8AM-2PM ET)=480s/\$2' && echo 'Ctrl+B, 1 = watch loop | Ctrl+B, 0 = rc' && echo 'tmux kill-session -t ralphs to stop'" Enter

# Attach to session
tmux attach -t ralphs
