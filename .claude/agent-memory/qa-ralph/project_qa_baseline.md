---
name: project_qa_baseline
description: Build and test baseline as of 2026-03-17 — what passes, known warnings
type: project
---

As of 2026-03-18 (fiftieth QA run), `npm run build` and `npm test` both pass clean. All 767 tests pass (50 test files).

**Build**: Next.js 16.1.6 (Turbopack), 252 static pages generated (SSG), no errors. (Stable since run 45.)
- Known non-fatal warning: "Next.js inferred your workspace root" due to multiple lockfiles at `/Users/stevec/package-lock.json` and project root. Safe to ignore; does not affect build output.

**Tests**: Vitest 4.1.0 — 50 test files, 767 tests. All 767 PASSING.

**Run 47 (2026-03-17)**: 17 failures in `src/components/ArticleTabs.test.tsx`.
- Root cause: `ArticleTabs` component was redesigned — collapse/expand feature removed, default active tab changed from "transcript" to "summary" when article is present, tab buttons now have `role="tab"` (not default `role="button"`), sliding indicator uses CSS transform classes (`translate-x-0`/`translate-x-full`) instead of `style.left`/`style.width`, and single-tab layout uses an h3 header (not buttons).
- Tests affected: default tab assumption, collapse/expand tests (8 tests), sliding indicator position, animate-tab-in class, aria-hidden panel state (3 tests), border-b-2 single-tab button, `getByRole("button")` on tab elements, `getByRole("heading", { level: 3 })` without name (multiple h3s in single-tab mode).
- Fix: Updated all 17 failing tests: flipped default-tab assertions, removed collapse/expand and aria-hidden tests (feature gone), updated indicator tests to use `className.toContain("translate-x-...")`, fixed animation test flow to switch to transcript then back, updated `getByRole("button")` to `getByRole("tab")`, used `getAllByRole` + `.find(h => h.querySelector("code"))` for the multiple-h3 case. Committed as 5367415.
- Pattern: When ArticleTabs collapses or expands its API (feature removal), tests must be audited for: (1) collapse/expand buttons no longer exist, (2) default tab is "summary" when article is provided, (3) single-tab uses h3 header not button, (4) tab buttons have role="tab" not role="button", (5) sliding indicator uses transform classes not inline styles, (6) single-tab adds an extra h3 "AI Summary" so `getByRole("heading", { level: 3 })` without a name will throw if markdown also has h3s.

**Run 46 (2026-03-17)**: 1 failure in `src/data/videos.test.ts`.
- Test: "all thumbnail URLs are valid YouTube thumbnail URLs for the video's youtubeId"
- Root cause: Several videos in `videos.ts` now use locally hosted thumbnails at `/thumbnails/*.jpg` instead of YouTube CDN URLs. The test only allowed YouTube CDN base URLs.
- Fix: Updated the test to allow both YouTube CDN URLs and local `/thumbnails/*.jpg` paths. Committed as 7a166bb.
- Pattern: When new videos are added with local `/thumbnails/` paths, `src/data/videos.test.ts` thumbnail URL test will fail. The fix is to branch on `startsWith("/thumbnails/")` and validate with a `/^\/thumbnails\/.+\.jpg$/` regex instead.

**Run 44 (2026-03-16)**: 3 failures in `Hero.visual.test.tsx`.
- Error: Snapshot mismatches — expected `src="https://img.youtube.com/vi/snap123/maxresdefault.jpg"`, received `src="/snap-thumb.jpg"`. Third test ("both layouts render the same video data") also failed asserting the old YouTube maxresdefault URL.
- Root cause: `Hero.tsx` was updated to use `video.thumbnail` directly (`const heroSrc = video.thumbnail;`) instead of constructing the YouTube maxresdefault URL from `youtubeId`. The test still referenced the old pattern.
- Fix: Updated assertion comment and URL in test 3 to use `mockVideo.thumbnail` directly. Ran `npx vitest run -u` to refresh 2 stale snapshots. Committed as 187daf8.
- Pattern: If Hero.visual.test.tsx fails with a src URL mismatch (YouTube maxresdefault vs direct thumbnail), check whether Hero.tsx changed to use `video.thumbnail` directly — fix by updating the assertion to use `mockVideo.thumbnail` and refresh snapshots with `-u`.

**Run 41 (2026-03-16)**: `src/app/layout.test.tsx` — "includes Organization JSON-LD script in the document" test was failing.
- Error: `SyntaxError: Unexpected non-whitespace character after JSON at position 328` at `JSON.parse(jsonLdContent)`.
- Root cause: A second JSON-LD script (WebSite schema) was added to layout.tsx. The test joined all `script[type="application/ld+json"]` textContent with `"\n"` and called `JSON.parse()` on the concatenation — two JSON objects separated by `\n` is not valid JSON.
- Fix: Changed to parse each script individually with `JSON.parse()` and use `.find()` to locate the one with `@type === "Organization"`. Committed as 5516475.
- Pattern: If layout.test.tsx JSON-LD test fails with a JSON parse error, check if additional JSON-LD scripts were added to layout.tsx. The fix is to parse scripts individually and find by `@type`, not join all scripts into one parse call.

**Run 40**: `npm run build` and `npm test` both passed clean. 372 tests (39 files), 250 pages.

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
- Root cause: Hero.tsx gradient overlay CSS changed from `from-background` / `from-background/70` to `from-black dark:from-background` / `from-black/70 dark:from-background/70`.
- Fix: `npx vitest run -u`. Committed as bb71d72.
- Pattern: Any CSS gradient polish to Hero.tsx overlays will stale Hero.visual.test.tsx snapshot. Fix with `-u`.

**Test count history**: 193 → 203 → 211 → 212 → 218 (stable runs 9–17) → 217 (run 18, intentional trim) → 217 (runs 19–24, stable) → 219 (run 25, stable) → 219 (runs 26–36, stable) → 245 (run 37, 27 test files) → 318 (run 38, 36 test files) → 372 (run 39, 39 test files) → 398 (run 41, 42 test files) → 385 (run 43–44, 41 test files) → 652 (run 45, 46 test files) → 663 (run 46, 46 test files) → 673 (run 47, 46 test files) → 767 (run 49, 50 test files)
**Page count history**: 242 → 243 → 250 (run 38–44) → 252 (run 45–47)

**Why:** Ongoing QA baseline tracking.
**How to apply:** If `ArticleTabs.test.tsx` fails after component changes, check: (1) default tab is "summary" when article provided, (2) no collapse/expand buttons, (3) single-tab uses h3 not button, (4) tab buttons have role="tab", (5) indicator uses CSS transform classes, (6) `getByRole("heading", { level: 3 })` without name fails if markdown also has h3s — use `getAllByRole` + `.find(h => h.querySelector(...))`. If `src/data/videos.test.ts` thumbnail URL test fails, it likely means new videos use local `/thumbnails/*.jpg` paths — fix by branching on `startsWith("/thumbnails/")` and validating with `/^\/thumbnails\/.+\.jpg$/`. If Hero.visual.test.tsx fails with a src URL mismatch (YouTube maxresdefault URL vs `/snap-thumb.jpg`), check whether Hero.tsx changed to use `video.thumbnail` directly — fix by updating test assertion to `mockVideo.thumbnail` and refresh snapshots with `npx vitest run -u`. If layout.test.tsx JSON-LD test fails with a JSON parse error, check if additional JSON-LD scripts were added to layout.tsx — fix by parsing each script individually and using `.find()` by `@type`. If Hero.visual.test.tsx snapshot fails due to CSS changes, update with `npx vitest run -u`. If VideoRow.visual snapshots fail, first check if a new persistent DOM element was added to VideoCard (shimmer, overlay, badge) — stale snapshot is likely the culprit, fix with `npx vitest run -u`. If Footer link tests fail, check whether `aria-label` attributes on social/nav links were changed. If HomeContent empty-state tests fail, check whether the heading copy in HomeContent.tsx changed (exact text, punctuation included). If a new test file fails to parse (0 tests, transform error), check for `}[]` postfix array syntax in TypeScript type annotations inside vi.fn() callbacks — replace with `Array<{...}>` form. If CourseCard tests fail on shortTitle/TC text, note that CourseCard does NOT render shortTitle — fix the test to use the full title or image alt text.
