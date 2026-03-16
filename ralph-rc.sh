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
if [[ "$1" = "--mobile" ]]; then
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
# Write config and launch loop in tmux
##############################
cat > /tmp/ralph-env.sh <<ENVEOF
export BUDGET=$BUDGET
export QA_BUDGET=$QA_BUDGET
export QA_TURNS=$QA_TURNS
export MAX_TURNS=$MAX_TURNS
export BACKOFF=$BACKOFF
export PROMO_END=$PROMO_END
export SLEEP_OFFPEAK=$SLEEP_OFFPEAK
export SLEEP_PEAK=$SLEEP_PEAK
export SLEEP_NORMAL=$SLEEP_NORMAL
export BUDGET_OFFPEAK=$BUDGET_OFFPEAK
export BUDGET_PEAK=$BUDGET_PEAK
export MOBILE_FLAG='$MOBILE_FLAG'
export MOBILE_PROMPT='$MOBILE_PROMPT'
export MOBILE_POLISH_PROMPT='$MOBILE_POLISH_PROMPT'
ENVEOF

tmux new-window -t ralphs -n loop
tmux send-keys -t ralphs:loop "source /tmp/ralph-env.sh && bash ralph-loop.sh" Enter

# Go back to rc window
tmux select-window -t ralphs:rc
tmux send-keys -t ralphs:rc "echo '=== Ralph RC — Control Center ===' && echo 'Agents: [Design+Polish](parallel worktrees) → QA → VisualQA(every 2nd cycle) — all Sonnet' && echo 'Memory: .claude/agents/ — persists across runs' && echo '2x promo: off-peak(2PM-8AM ET)=90s/\$5 | peak(8AM-2PM ET)=480s/\$2' && echo 'Ctrl+B, 1 = watch loop | Ctrl+B, 0 = rc' && echo 'tmux kill-session -t ralphs to stop'" Enter

# Attach to session
tmux attach -t ralphs
