Commit all staged and unstaged changes, then push to the remote.

## Steps

1. Run `git status` to see what's changed (never use `-uall`).
2. Run `git diff` and `git diff --cached` to review all changes.
3. Run `git log --oneline -5` to match the repo's commit message style.
4. Stage all relevant changed files (avoid secrets like `.env`). Prefer naming specific files over `git add -A`.
5. Write a concise commit message summarizing the changes, ending with:
   `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
6. Commit using a HEREDOC for the message.
7. Push to the current branch with `git push -u origin HEAD`.
8. Report the result — branch name, commit hash, and remote URL if available.
