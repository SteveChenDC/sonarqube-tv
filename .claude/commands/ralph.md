Ralph Wiggum RC — Control Center for autonomous improvement loops.

Based on the user's command, perform ONE of the following actions:

## Commands

### "start" or "launch"
Run `./ralph-rc.sh` to launch the sequential Ralph loop in tmux.

### "status"
Run `tmux list-windows -t ralphs 2>/dev/null || echo "Ralphs not running"` to show status.

### "log" or "progress"
Run `git log --oneline -20` to show recent Ralph commits.

### "diff"
Run `git diff HEAD~5 --stat` to summarize recent changes.

### "stop" or "kill"
Run `tmux kill-session -t ralphs` to stop the loop.

### "pause"
Run `tmux send-keys -t ralphs:loop C-c` to pause the loop.

### "review"
Run `npm run build && npm test` to check if the Ralphs broke anything. Then use the Chrome MCP tools to open `http://localhost:3000` and take a screenshot to visually verify the UI changes.

### "merge"
Show the user the diff vs main with `git diff main...HEAD --stat` and ask for confirmation before merging into main.

### "budget <amount>"
Edit ralph-rc.sh and update the BUDGET variable to the specified amount.

### "turns <number>"
Edit ralph-rc.sh and update the MAX_TURNS variable to the specified number.

### "cost"
Run `git log --since="24 hours ago" --oneline | wc -l` to count commits in the last 24h. Multiply by $2 (estimated avg cost per commit) and report: "~X commits in last 24h, estimated cost: ~$Y". Also show the current BUDGET and SLEEP values from ralph-rc.sh.

### "peek"
Read and display `ralph-logs/changelog.md` to show what the Ralphs have been up to. If the file doesn't exist yet, run `git log --oneline -10` instead.

If no argument is provided, show this help menu and current status.

User's command: $ARGUMENTS
