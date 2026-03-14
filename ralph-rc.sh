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
SLEEP=120    # 2 min between runs — paces usage across 5hr session window
BACKOFF=600  # 10 min backoff when rate limited — gentler retry

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
  echo '=== [Design Ralph] Starting... ==='
  OUTPUT=\$(claude -p 'You are a UI/UX designer for the sonarqube-tv app. CLAUDE.md has the full project map — do NOT re-read files unless you need to edit them. Follow DESIGN_GUIDELINES.md strictly. Check git log --oneline -10 to avoid duplicating recent work. Your TOP PRIORITY is making the website look clean, professional, and human-readable. Focus on: text readability (font sizes, line heights, contrast ratios), proper whitespace and breathing room between elements, logical visual hierarchy so users can scan content easily, consistent alignment and spacing, ensuring nothing looks cramped or auto-generated. Run npm run dev to preview changes in the browser. Verify with npm run build. Make up to 3 improvements per run. Commit with a descriptive message.' --allowedTools 'Bash,Read,Edit,Write,Grep,Glob' --max-turns $MAX_TURNS --max-budget-usd $BUDGET 2>&1)
  echo \"\$OUTPUT\"
  if echo \"\$OUTPUT\" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
  sleep $SLEEP

  echo '=== [Polish Ralph] Starting... ==='
  OUTPUT=\$(claude -p 'You are a front-end polish engineer for the sonarqube-tv app. CLAUDE.md has the full project map — do NOT re-read files unless you need to edit them. Check git log --oneline -10 to avoid duplicating recent work. Your job is to review the current UI and fix anything that looks off or hard to read. Focus on: text that is too small or too large, colors with poor contrast against backgrounds, elements that overlap or are too close together, truncated or overflowing text, responsive layout issues, missing hover/focus states, anything that would make a human designer say this looks wrong. Run npm run build to verify. Make up to 3 fixes per run. Commit with a descriptive message.' --allowedTools 'Bash,Read,Edit,Write,Grep,Glob' --max-turns $MAX_TURNS --max-budget-usd $BUDGET 2>&1)
  echo \"\$OUTPUT\"
  if echo \"\$OUTPUT\" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
  sleep $SLEEP

  echo '=== [QA Ralph] Starting... ==='
  OUTPUT=\$(claude -p 'You are a QA engineer for the sonarqube-tv app. CLAUDE.md has the full project map — do NOT re-read files unless you need to edit them. Run npm run build and npm test. If anything is broken, fix it and commit. If everything passes, exit cleanly.' --model sonnet --allowedTools 'Bash,Read,Edit,Write,Grep,Glob' --max-turns $QA_TURNS --max-budget-usd $QA_BUDGET 2>&1)
  echo \"\$OUTPUT\"
  if echo \"\$OUTPUT\" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
  sleep $SLEEP

  echo '=== [Changelog] Logging cycle... ==='
  mkdir -p ralph-logs
  NEW_COMMITS=\$(git log --oneline --since='30 minutes ago' 2>/dev/null)
  if [ -n \"\$NEW_COMMITS\" ]; then
    echo \"\" >> ralph-logs/changelog.md
    echo \"## \$(date '+%Y-%m-%d %H:%M')\" >> ralph-logs/changelog.md
    echo \"\$NEW_COMMITS\" | while read -r line; do echo \"- \$line\" >> ralph-logs/changelog.md; done
    echo '=== Changelog updated ==='
  else
    echo '=== No new commits this cycle ==='
  fi

  echo '=== Cycle complete. Next cycle in ${SLEEP}s... ==='
done" Enter

# Go back to rc window
tmux select-window -t ralphs:rc
tmux send-keys -t ralphs:rc "echo '=== Ralph RC — Control Center ===' && echo 'Sequential: Design → Polish → QA → bash changelog' && echo 'Budget: \$3/run | Changelog: free' && echo 'Ctrl+B, 1 = watch loop | Ctrl+B, 0 = rc' && echo 'tmux kill-session -t ralphs to stop'" Enter

# Attach to session
tmux attach -t ralphs
