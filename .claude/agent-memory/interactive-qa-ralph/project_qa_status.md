---
name: QA run status
description: Result of the last interactive QA checklist run — pass/fail counts, tooling availability
type: project
---

All 28 Playwright E2E tests passed on 2026-03-19 (latest run confirmed same day).

Test suites covered:
- filter-modal.spec.ts — 4 tests (open, duration filter, reset, escape key)
- mobile.spec.ts — 5 tests (home load, filter modal, search, tap nav, watch page)
- navigation.spec.ts — 6 tests (home, logo, categories, courses, category page, back button)
- search.spec.ts — 6 tests (open, results, click result, escape, slash key, no results)
- video-card.spec.ts — 3 tests (click, hover, display)
- watch-page.spec.ts — 4 tests (load, back link, related videos, category link)

Visual QA via Playwright screenshots (1280×800 + 375px mobile) confirmed on 2026-03-19:
- ✅ Hero banner renders with featured video, badges, Watch Now + Filters buttons
- ✅ "Latest" and other video rows load with proper thumbnails
- ✅ Filter modal opens cleanly with all filter groups (Upload Date, Duration, Sort By) and Apply button; default pills highlighted in blue; backdrop dimmed
- ✅ Categories dropdown opens with "Browse by Category" panel in column layout
- ✅ Category page (/category/getting-started) shows title, badge counts (6 videos | 1h 8m total), sort tabs, and video grid
- ✅ Watch page renders video metadata and related videos row
- ✅ Mobile layout (375px) is responsive — header compact, full-width CTAs, Swipe affordance on video rows, no overflow

Key selector notes (from E2E tests):
- Video card links: `a.snap-start[href^="/watch/"]` (not just `a[href^="/watch/"]` — hero CTA matches too but is off-screen)
- Floating filter button: `button[aria-label="Open filters"]` — requires `window.scrollTo(0, 800)` first to reveal
- Filter hero button: `button:has-text("Filters")` (inline in Hero, not the floating version)

Known fix applied 2026-03-19:
- sr-only search live-region was emitting identical text ("X of Y results") as the visible span,
  causing strict-mode violations in 3 Playwright tests. Changed sr-only to "N results found"
  so the locator /\d+ of \d+ results?/ resolves to exactly one (visible) element. (commit ee30d4e)
- Mobile header overflow fixed 2026-03-19 (commit a513b34)

**Why:** Baseline health check before further development work.
**How to apply:** If future tests fail or visual regressions appear, compare against this baseline to scope the regression.

agent-browser is NOT installed on this machine — exploratory screenshot testing done via Playwright node scripts instead.
Install agent-browser with: npm install -g agent-browser && agent-browser install
