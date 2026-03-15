#!/bin/bash
# Ralph Wiggum Autonomous Improvement Loop
# Usage: ./ralph-rc.sh [--mobile]
# Control: tmux attach -t ralphs
#   Kill:   tmux kill-session -t ralphs
#   Pause:  tmux send-keys -t ralphs:loop C-c

set -e

BRANCH="ralph-wiggum-improvements"
BUDGET=3
QA_BUDGET=3
QA_TURNS=15
MAX_TURNS=30
SLEEP=600    # 10 min between runs — targets ~50% of 5hr session window
BACKOFF=900  # 15 min backoff when rate limited
MOBILE_FLAG="/tmp/ralph-mobile-focus.timestamp"

# --mobile: activate 12-hour mobile focus mode
if [ "$1" = "--mobile" ]; then
  EXPIRY=$(( $(date +%s) + 43200 ))  # 12 hours from now
  echo "$EXPIRY" > "$MOBILE_FLAG"
  echo "=== Mobile focus activated until $(date -r "$EXPIRY" '+%Y-%m-%d %H:%M') ==="
fi

MOBILE_PROMPT='You are a mobile-focused design critic for the sonarqube-tv app. CLAUDE.md has the full project map. Check git log --oneline -10 to see what has already been fixed. Pick ONE mobile issue and fix it: (1) Touch targets under 44px — buttons, links, cards must be ≥44px tap area, (2) Text sizing on narrow viewports — ensure readability at 375px, (3) Card spacing/density on mobile — 2-col grid gaps and padding, (4) Hero card rendering below 640px — check the sm:hidden mobile card layout, (5) 2-col grid alignment — ensure even columns in VideoRow mobile grid, (6) Filter modal mobile UX — full-screen on small viewports, easy dismiss, (7) Watch page responsive player — YouTube iframe sizing on mobile, (8) Horizontal overflow at 375px — no content should bleed off-screen, (9) Floating button positioning — filter FAB should not overlap content on mobile. Verify with npm run build. Commit with a descriptive message.'

MOBILE_POLISH_PROMPT='You are a mobile-focused polish critic for the sonarqube-tv app. CLAUDE.md has the full project map. Check git log --oneline -10 to see what has already been fixed. Pick ONE mobile polish issue — do NOT pick one already fixed: (1) Touch targets ≥44px on all interactive elements, (2) Text legibility at 375px width, (3) Mobile grid card spacing consistency, (4) Hero mobile card visual polish, (5) Grid column alignment edge cases, (6) Filter modal mobile layout, (7) Mobile video player controls, (8) Prevent horizontal scroll overflow, (9) FAB positioning on small screens. Verify with npm run build. Commit with a descriptive message.'

NORMAL_PROMPT='You are a design critic for the sonarqube-tv app. CLAUDE.md has the full project map. Check git log --oneline -10 to see what has already been fixed. Pick ONE of these known issues and fix it: (1) Hero description duplicates title — write a real summary or remove it, (2) Light mode hero has contrast problems — badges unreadable on light purple gradient, needs darker overlay in light mode, (3) Header nav invisible in light mode over hero — add border-bottom or shadow, (4) Latest row shows 67 videos — cap at 15 most recent, (5) No section divider above Latest row, (6) Card titles truncate awkwardly — use 2-line clamp, (7) ScrollToTop button shows N instead of arrow icon, (8) Watch All vs See All distinction unclear — simplify to one action, (9) Footer unreachable on long pages — check scroll. Also consider: theme toggle animation, continue watching row, filter button visibility. Verify with npm run build. Commit with a descriptive message.'

NORMAL_POLISH_PROMPT='You are a design critic for the sonarqube-tv app. CLAUDE.md has the full project map. Check git log --oneline -10 to see what has already been fixed. Pick ONE of these known issues and fix it — do NOT pick one that was already fixed in a recent commit: (1) Hero description duplicates title, (2) Light mode hero contrast — badges unreadable, (3) Header nav invisible in light mode over hero, (4) Latest row shows too many videos — cap at 15, (5) Missing section divider above Latest, (6) Card titles need 2-line clamp not single-line truncation, (7) ScrollToTop button shows wrong icon, (8) Simplify Watch All / See All into one action, (9) Footer unreachable — check scroll issues. Also: add smooth transition to theme toggle icon, make filter button more prominent. Verify with npm run build. Commit with a descriptive message.'

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
  # Check mobile focus mode
  if [ -f \"$MOBILE_FLAG\" ]; then
    EXPIRY=\$(cat \"$MOBILE_FLAG\")
    NOW=\$(date +%s)
    if [ \"\$NOW\" -lt \"\$EXPIRY\" ]; then
      DESIGN_PROMPT='$MOBILE_PROMPT'
      POLISH_PROMPT_VAR='$MOBILE_POLISH_PROMPT'
      echo '=== Mobile focus mode ACTIVE ==='
    else
      rm -f \"$MOBILE_FLAG\"
      DESIGN_PROMPT='$NORMAL_PROMPT'
      POLISH_PROMPT_VAR='$NORMAL_POLISH_PROMPT'
      echo '=== Mobile focus expired, reverting to normal mode ==='
    fi
  else
    DESIGN_PROMPT='$NORMAL_PROMPT'
    POLISH_PROMPT_VAR='$NORMAL_POLISH_PROMPT'
  fi

  echo '=== [Design Ralph] Starting... ==='
  OUTPUT=\$(claude -p \"\$DESIGN_PROMPT\" --allowedTools 'Bash,Read,Edit,Write,Grep,Glob' --max-turns $MAX_TURNS --max-budget-usd $BUDGET 2>&1)
  echo \"\$OUTPUT\"
  if echo \"\$OUTPUT\" | grep -q 'out of extra usage'; then echo '=== Rate limited. Backing off 5m... ==='; sleep $BACKOFF; continue; fi
  sleep $SLEEP

  echo '=== [Polish Ralph] Starting... ==='
  OUTPUT=\$(claude -p \"\$POLISH_PROMPT_VAR\" --allowedTools 'Bash,Read,Edit,Write,Grep,Glob' --max-turns $MAX_TURNS --max-budget-usd $BUDGET 2>&1)
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
