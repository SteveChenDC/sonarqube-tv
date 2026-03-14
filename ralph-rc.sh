#!/bin/bash
# Ralph Wiggum Autonomous Improvement Loop
# Usage: ./ralph-rc.sh
# Control: tmux attach -t ralphs
#   Kill:   tmux kill-session -t ralphs
#   Pause:  tmux send-keys -t ralphs:loop C-c

set -e

BRANCH="ralph-wiggum-improvements"
BUDGET=3
QA_BUDGET=3
QA_TURNS=15
MAX_TURNS=30
SLEEP=30
BACKOFF=300  # 5 min backoff when rate limited

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
tmux send-keys -t ralphs:loop "while true; do
  echo '=== [Testing Ralph] Starting... ==='
  OUTPUT=\$(claude -p 'You are a test engineer for the sonarqube-tv app. CLAUDE.md has the full project map — do NOT re-read files unless you need to edit them. Check git log --oneline -10 to avoid duplicating existing work. Find code that lacks test coverage and write or improve up to 3 tests. Run npm test to verify. Commit with a descriptive message.' --allowedTools 'Bash,Read,Edit,Write,Grep,Glob' --max-turns $MAX_TURNS --max-budget-usd $BUDGET 2>&1)
  echo \"\$OUTPUT\"
  if echo \"\$OUTPUT\" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
  sleep $SLEEP

  echo '=== [Design Ralph] Starting... ==='
  OUTPUT=\$(claude -p 'You are a UI/UX designer for the sonarqube-tv app. CLAUDE.md has the full project map — do NOT re-read files unless you need to edit them. Follow DESIGN_GUIDELINES.md strictly. Check git log --oneline -10 to avoid duplicating recent work. Pick up to 3 visual or UX improvements. Only use colors and fonts from DESIGN_GUIDELINES.md. Verify with npm run build. Commit with a descriptive message.' --allowedTools 'Bash,Read,Edit,Write,Grep,Glob' --max-turns $MAX_TURNS --max-budget-usd $BUDGET 2>&1)
  echo \"\$OUTPUT\"
  if echo \"\$OUTPUT\" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
  sleep $SLEEP

  echo '=== [QA Ralph] Starting... ==='
  OUTPUT=\$(claude -p 'You are a QA engineer for the sonarqube-tv app. CLAUDE.md has the full project map — do NOT re-read files unless you need to edit them. Run npm run build and npm test. If anything is broken, fix it and commit. If everything passes, exit cleanly.' --model sonnet --allowedTools 'Bash,Read,Edit,Write,Grep,Glob' --max-turns $QA_TURNS --max-budget-usd $QA_BUDGET 2>&1)
  echo \"\$OUTPUT\"
  if echo \"\$OUTPUT\" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
  sleep $SLEEP

  echo '=== Cycle complete. Next cycle in ${SLEEP}s... ==='
done" Enter

# Go back to rc window
tmux select-window -t ralphs:rc
tmux send-keys -t ralphs:rc "echo '=== Ralph RC — Control Center ===' && echo 'Sequential mode: Testing → Design → QA' && echo 'Budget: \$3/run | Sleep: 30s between runs' && echo 'Ctrl+B, 1 = watch loop | Ctrl+B, 0 = rc' && echo 'tmux kill-session -t ralphs to stop'" Enter

# Attach to session
tmux attach -t ralphs
