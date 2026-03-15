Quick visual QA — take screenshots of all pages and analyze them for bugs.

## Steps

1. Make sure the dev server is running on port 3000. If not, start it with `npm run dev &` and wait 5 seconds.
2. Run `node scripts/visual-qa.mjs` to capture screenshots of home, watch, and category pages at desktop and mobile viewports.
3. Read each screenshot file in `ralph-logs/screenshots/` to visually inspect.
4. Check for: broken layouts, misaligned elements, overlapping content, unreadable text, images not loading, horizontal overflow on mobile, elements cut off at viewport edges.
5. Reference DESIGN_GUIDELINES.md for brand compliance (colors, fonts).
6. Report findings as a bulleted list. If everything looks good, say so.
7. If you find a bug, offer to fix it — but do NOT auto-fix without user confirmation.
