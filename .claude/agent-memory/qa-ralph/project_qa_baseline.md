---
name: project_qa_baseline
description: Build and test baseline as of 2026-03-15 — what passes, known warnings
type: project
---

As of 2026-03-15 (eighth QA run), `npm run build` and `npm test` both pass clean. All 212 tests pass.

**Build**: Next.js 16.1.6 (Turbopack), 243 static pages generated (SSG), no errors.
- Known non-fatal warning: "Next.js inferred your workspace root" due to multiple lockfiles at `/Users/stevec/package-lock.json` and project root. Safe to ignore; does not affect build output.

**Tests**: Vitest 4.1.0 — 24 test files, 211 tests. All 211 PASSING.

**Resolved in run 7**: `src/components/VideoRow.visual.test.tsx` — 2 stale snapshots.
- Tests: "mobile grid layout matches snapshot" and "desktop scroll layout matches snapshot"
- Root cause: Commit 60453f4 added card hover lift (`transition-transform duration-300 hover:-translate-y-1`) and ring glow (`ring-1 ring-transparent transition-all group-hover:ring-sonar-red/30`) micro-interactions to VideoCard. Changed `transition-shadow` to `transition-all`. Snapshots predated these CSS class changes.
- Fix: `npx vitest run -u` (note: `--update-snapshots` long form does NOT work in Vitest 4.1.0 — use `-u` short flag).
- Pattern: Any time CSS classes on the VideoCard `<a>` wrapper or thumbnail container change, VideoRow.visual.test.tsx snapshots go stale and need `-u` update.

**Resolved regression (commit b742d6c)**: ArticleTabs.test.tsx had 3 failing collapse/expand tests.
- Root cause: Tests used `not.toBeInTheDocument()` after collapse, but the component hides content via CSS grid animation (`gridTemplateRows: "0fr"`) — content stays in DOM.
- Fix applied to tests (not component): Assert `aria-hidden="true"` on the panel wrapper div instead of checking DOM presence.
- Pattern: When a component uses CSS-only show/hide (grid rows, opacity, height), test the semantic attribute (`aria-hidden`) rather than DOM presence.

**Test count history**: 193 → 203 → 211 → 212 (stable at 212 total as of run 8)
**Page count history**: 242 → 243 (stable)

**Why:** Ongoing QA baseline tracking.
**How to apply:** If VideoRow.visual snapshots fail, first check if a new persistent DOM element was added to VideoCard (shimmer, overlay, badge) — stale snapshot is likely the culprit, fix with --update-snapshots. If ArticleTabs collapse tests fail again, check whether the component changed from CSS-based to conditional rendering and align test strategy accordingly.
