Squash all Ralph branch commits into a single clean commit for merging to main.

## Steps

1. Run `git log --oneline main..HEAD` to see all commits to squash.
2. Count the commits and show the user a summary.
3. Ask the user for confirmation before proceeding.
4. Run `git reset --soft main` to unstage all changes back to main's state while keeping the working tree.
5. Run `git diff --cached --stat` to show what will be in the squashed commit.
6. Create a single commit with a summary message listing the key changes, ending with `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`.
7. Report the result.

**Important**: Only run this on the ralph-wiggum-improvements branch, never on main. Warn and abort if on main.
