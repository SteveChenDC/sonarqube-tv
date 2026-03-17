---
name: project_qa_baseline
description: Build and test baseline as of 2026-03-16 — what passes, known warnings
type: project
---

As of 2026-03-16 (thirty-ninth QA run), `npm run build` and `npm test` both pass clean. All 372 tests pass (39 test files).

**Build**: Next.js 16.1.6 (Turbopack), 250 static pages generated (SSG), no errors.
- Known non-fatal warning: "Next.js inferred your workspace root" due to multiple lockfiles at `/Users/stevec/package-lock.json` and project root. Safe to ignore; does not affect build output.

**Tests**: Vitest 4.1.0 — 39 test files, 372 tests. All 372 PASSING.

**Run 39**: `src/components/CourseCard.test.tsx` — "shows short title in header" test was failing (searching for "TC" shortTitle text not rendered by the component). File was concurrently modified before fix applied, correcting the test to "shows course image in header" using `getByAltText`. All tests now pass.
- Pattern: CourseCard does NOT render `course.shortTitle` — the field exists on the `Course` type but is not displayed in the card UI. Tests should not assert on `shortTitle` text in CourseCard.

**Fixed in run 38**: `src/components/CourseTimeline.test.tsx` — parse error (0 tests ran).
- Error: "Unexpected token" at line 38, col 1 (`}));`) — oxc parser choked on postfix `[]` after closing `}` in TypeScript type annotation: `(course: { modules: { videoIds: string[] }[] })`.
- Fix: Changed to `Array<{ videoIds: string[] }>` generic form. Committed as d93f1a7.
- Pattern: oxc (Vitest 4.1.0's transformer) does NOT support `}[]` postfix array syntax on TypeScript type annotations inside `vi.fn()` callbacks. Use `Array<{...}>` instead of `{...}[]` for inline types in mock factory parameters.

**Fixed in run 28**: `src/components/__snapshots__/Hero.visual.test.tsx.snap` — 1 stale snapshot ("mobile card layout matches snapshot").
- Root cause: Mobile Hero card `bg-n9` div had polish CSS added: `border border-n8/60 shadow-xl shadow-black/40`.
- Fix: `npx vitest run -u`. Committed as e30f7b2.
- Pattern: Confirmed again — any CSS class addition to Hero card wrappers stales Hero.visual.test.tsx snapshots.

**Fixed in run 26**: `src/components/__snapshots__/Hero.visual.test.tsx.snap` — 1 stale snapshot.
- Test: "desktop hero layout matches snapshot"
- Root cause: Hero.tsx gradient overlay CSS changed from `from-background` / `from-background/70` to `from-black dark:from-background` / `from-black/70 dark:from-background/70` (added light-mode `black` fallbacks with `dark:` variants for compatibility).
- Fix: `npx vitest run -u` to refresh snapshot. Committed as bb71d72.
- Pattern: Any CSS gradient polish to Hero.tsx overlays will stale Hero.visual.test.tsx snapshot. Fix with `-u`.

**Fixed in run 19**: `src/components/__snapshots__/Hero.visual.test.tsx.snap` — 1 stale snapshot.
- Test: "desktop hero layout matches snapshot"
- Root cause: Commit 62d16c2 ("Polish hero gradient: smooth cinematic overlay, reduce flat bottom band") changed gradient CSS classes on two overlay divs in Hero.tsx. The vertical gradient lost `from-[18%]` and changed `via-background/60 via-[40%]` → `via-background/55 via-[35%]`. The horizontal gradient changed `from-background/80 via-sonar-purple/20` → `from-background/70 via-sonar-purple/15 via-[45%]`.
- Fix: `npx vitest run -u` to refresh snapshot. Committed as 9e36649.
- Pattern: Any CSS gradient polish to Hero.tsx overlays will stale Hero.visual.test.tsx snapshot. Fix with `-u`.

**Count change run 17→18**: 218 → 217. Caused by commit 3982cec ("Polish category header: promote description to header with Sonar Red accent bar") removing the `description` prop from `CategoryContent.tsx` and trimming the matching test assertions in `CategoryContent.test.tsx`. Net -1 test. Intentional, not a regression.

**Fixed in run 13**: `src/components/HomeContent.test.tsx` — 2 failing tests.
- Tests: "shows empty state when all videos are filtered out" and "resets filters via empty-state Reset filters button"
- Root cause: Commit 2d6cb91 ("Polish empty state: icon, hierarchy, and pill CTA") removed the trailing period from the empty-state heading — changed "No videos match your filters." to "No videos match your filters". Three assertions in the test file still matched the old string with the period.
- Fix: Updated all three test assertions to use "No videos match your filters" (no period). Committed as 3955fe6.
- Pattern: When the empty-state copy in HomeContent changes (heading or body text), HomeContent.test.tsx assertions will break. Check for exact-text queries with `getByText` and `queryByText`.

**Fixed in run 9**: `src/components/Footer.test.tsx` — 1 failing test.
- Test: "renders YouTube, GitHub, and SonarSource navigation links"
- Root cause: Commit d5b2a2e ("Polish footer: add brand icons, copyright, and improved layout") updated Footer social link `aria-label` attributes from short names (`"YouTube"`, `"GitHub"`) to descriptive names (`"SonarSource on YouTube"`, `"SonarSource on GitHub"`). The test still queried by the old short names.
- Fix: Updated test queries to use the new full accessible names.
- Pattern: When Footer social link aria-labels change, Footer.test.tsx queries must be updated to match. Always check `aria-label` on Footer links — the component uses them for all three social/nav links.

**Resolved in run 7**: `src/components/VideoRow.visual.test.tsx` — 2 stale snapshots.
- Tests: "mobile grid layout matches snapshot" and "desktop scroll layout matches snapshot"
- Root cause: Commit 60453f4 added card hover lift (`transition-transform duration-300 hover:-translate-y-1`) and ring glow (`ring-1 ring-transparent transition-all group-hover:ring-sonar-red/30`) micro-interactions to VideoCard. Changed `transition-shadow` to `transition-all`. Snapshots predated these CSS class changes.
- Fix: `npx vitest run -u` (note: `--update-snapshots` long form does NOT work in Vitest 4.1.0 — use `-u` short flag).
- Pattern: Any time CSS classes on the VideoCard `<a>` wrapper or thumbnail container change, VideoRow.visual.test.tsx snapshots go stale and need `-u` update.

**Resolved regression (commit b742d6c)**: ArticleTabs.test.tsx had 3 failing collapse/expand tests.
- Root cause: Tests used `not.toBeInTheDocument()` after collapse, but the component hides content via CSS grid animation (`gridTemplateRows: "0fr"`) — content stays in DOM.
- Fix applied to tests (not component): Assert `aria-hidden="true"` on the panel wrapper div instead of checking DOM presence.
- Pattern: When a component uses CSS-only show/hide (grid rows, opacity, height), test the semantic attribute (`aria-hidden`) rather than DOM presence.

**Test count history**: 193 → 203 → 211 → 212 → 218 (stable runs 9–17) → 217 (run 18, intentional trim) → 217 (runs 19–24, stable) → 219 (run 25, stable) → 219 (runs 26–36, stable) → 245 (run 37, 27 test files) → 318 (run 38, 36 test files) → 372 (run 39, 39 test files)
**Page count history**: 242 → 243 → 250 (run 38–39)

**Why:** Ongoing QA baseline tracking.
**How to apply:** If Hero.visual.test.tsx snapshot fails, check if gradient overlay CSS classes in Hero.tsx changed (including light/dark variant additions) — update with `npx vitest run -u`. If VideoRow.visual snapshots fail, first check if a new persistent DOM element was added to VideoCard (shimmer, overlay, badge) — stale snapshot is likely the culprit, fix with `npx vitest run -u`. If Footer link tests fail, check whether `aria-label` attributes on social/nav links were changed. If ArticleTabs collapse tests fail again, check whether the component changed from CSS-based to conditional rendering and align test strategy accordingly. If HomeContent empty-state tests fail, check whether the heading copy in HomeContent.tsx changed (exact text, punctuation included). If CategoryContent test count drops/changes, check if props were removed from the component — the test file is kept in sync with the component interface. If a new test file fails to parse (0 tests, transform error), check for `}[]` postfix array syntax in TypeScript type annotations inside vi.fn() callbacks — replace with `Array<{...}>` form. If CourseCard tests fail on shortTitle/TC text, note that CourseCard does NOT render shortTitle — fix the test to use the full title or image alt text.
