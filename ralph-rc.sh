#!/bin/bash
# Ralph Wiggum Autonomous Improvement Loop
# Usage: ./ralph-rc.sh [command]
# Commands: start, peek, status, stop, kill, pause, log, diff, cost, health, attach
# Control: tmux attach -t ralphs
#   Kill:   tmux kill-session -t ralphs
#   Pause:  tmux send-keys -t ralphs:loop C-c

set -e

CMD="${1:-start}"

# ── Subcommands that don't need tmux launch ──
case "$CMD" in
  peek)
    echo "=== Ralph Peek — $(date '+%Y-%m-%d %H:%M:%S %Z') ==="
    if [ -f ralph-logs/changelog.md ]; then
      tail -80 ralph-logs/changelog.md
    else
      echo "(no changelog yet, showing git log)"
      git log --oneline -10
    fi
    exit 0
    ;;
  status)
    tmux list-windows -t ralphs 2>/dev/null || echo "Ralphs not running"
    exit 0
    ;;
  stop)
    if ! tmux has-session -t ralphs 2>/dev/null; then
      echo "Ralphs not running."
      exit 0
    fi
    touch /tmp/ralph-stop-requested
    echo "Stop requested. Current agent will finish, then loop exits."
    echo "Use './ralph-rc.sh kill' to force-stop immediately."
    exit 0
    ;;
  kill)
    tmux kill-session -t ralphs 2>/dev/null && echo "Ralphs force-killed." || echo "Ralphs not running."
    rm -f /tmp/ralph-stop-requested
    exit 0
    ;;
  pause)
    tmux send-keys -t ralphs:loop C-c 2>/dev/null && echo "Loop paused." || echo "Ralphs not running."
    exit 0
    ;;
  log)
    git log --oneline -20
    exit 0
    ;;
  diff)
    git diff HEAD~5 --stat
    exit 0
    ;;
  cost)
    COMMITS=$(git log --since="24 hours ago" --oneline | wc -l | tr -d ' ')
    TODAY=$(date '+%Y-%m-%d')
    if [ -f ralph-logs/cost.log ]; then
      TODAY_BUDGET=$(grep "^$TODAY" ralph-logs/cost.log | awk '{gsub(/\$/,"",$4); sum+=$4} END {printf "%.2f", sum}')
      TOTAL_BUDGET=$(awk '{gsub(/\$/,"",$4); sum+=$4} END {printf "%.2f", sum}' ralph-logs/cost.log)
      echo "Today ($TODAY): \$${TODAY_BUDGET} allocated across $(grep -c "^$TODAY" ralph-logs/cost.log) agent runs"
      echo "All time: \$${TOTAL_BUDGET} allocated"
      echo ""
      echo "Today's breakdown:"
      grep "^$TODAY" ralph-logs/cost.log | awk '{print $4, $3}' | sort | uniq -c | sort -rn
    else
      echo "(no cost.log yet — estimated from commits)"
      echo "~${COMMITS} commits in last 24h, estimated cost: ~\$$(( COMMITS * 2 ))"
    fi
    exit 0
    ;;
  health)
    if [ ! -f /tmp/ralph-heartbeat ]; then
      echo "No heartbeat found — loop has never run or file was cleaned up."
      exit 1
    fi
    BEAT=$(cat /tmp/ralph-heartbeat)
    NOW=$(date +%s)
    AGE=$(( NOW - BEAT ))
    AGE_MIN=$(( AGE / 60 ))
    if [ "$AGE" -gt 3600 ]; then
      echo "WARNING: Heartbeat is ${AGE_MIN}m old — loop may be dead!"
      echo "Last beat: $(date -r "$BEAT" '+%Y-%m-%d %H:%M:%S')"
      exit 1
    else
      echo "Heartbeat OK — ${AGE_MIN}m ago ($(date -r "$BEAT" '+%H:%M:%S'))"
      # Show noop counters
      NOOPS=$(ls /tmp/ralph-noop-*.count 2>/dev/null)
      if [ -n "$NOOPS" ]; then
        echo ""
        echo "No-op counters:"
        for f in /tmp/ralph-noop-*.count; do
          AGENT=$(basename "$f" | sed 's/ralph-noop-//;s/\.count//')
          echo "  $AGENT: $(cat "$f") consecutive"
        done
      fi
      exit 0
    fi
    ;;
  attach)
    tmux attach -t ralphs
    exit 0
    ;;
  start|--mobile)
    ;; # fall through to launch logic below
  *)
    echo "Usage: ./ralph-rc.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start    Launch the Ralph loop in tmux (default)"
    echo "  peek     Show recent changelog entries"
    echo "  status   Show tmux session status"
    echo "  stop     Graceful stop (finish current agent, then exit)"
    echo "  kill     Force-kill the Ralph session immediately"
    echo "  pause    Pause the loop"
    echo "  log      Show last 20 commits"
    echo "  diff     Show diff of last 5 commits"
    echo "  cost     Show budget allocation from cost.log"
    echo "  health   Check loop heartbeat and noop counters"
    echo "  attach   Attach to the tmux session"
    echo "  --mobile Activate 12-hour mobile focus mode"
    exit 0
    ;;
esac

BRANCH="ralph-wiggum-improvements"
BUDGET=5
QA_BUDGET=5
QA_TURNS=100
MAX_TURNS=75
BACKOFF=300  # 5 min backoff when rate limited
MOBILE_FLAG="/tmp/ralph-mobile-focus.timestamp"

# Double usage promo: 2x limits outside 8AM-2PM ET through March 27, 2026
PROMO_END="2026-03-28"
SLEEP_OFFPEAK=30   # 30s — max throughput while 2x promo active
SLEEP_PEAK=45      # 45s — faster during peak
SLEEP_NORMAL=120   # 2 min — post-promo default
BUDGET_OFFPEAK=15  # Max budget during 2x limits
BUDGET_PEAK=10     # Higher budget during peak

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
if [[ "$CMD" = "--mobile" ]]; then
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
tmux send-keys -t ralphs:rc "echo '=== Ralph RC — Control Center ===' && echo 'Agents: 8-cycle rotation' && echo '  Core (full budget):  C0:design C1:polish C2:seo' && echo '  Secondary (half $):  C3:a11y C4:content C5:mobile C6:security C7:dx' && echo '  + test-ralph every 4th cycle (off-peak) | QA every cycle | perf after seo | visual-qa every 3rd' && echo 'Off-peak: 2 parallel (primary+test) | Peak: 1 (primary only)' && echo '2x promo: off-peak(2PM-8AM ET)=30s/\$10 | peak(8AM-2PM ET)=60s/\$5' && echo 'Ctrl+B, 1 = watch loop | Ctrl+B, 0 = rc' && echo 'tmux kill-session -t ralphs to stop'" Enter

# Attach to session
tmux attach -t ralphs
