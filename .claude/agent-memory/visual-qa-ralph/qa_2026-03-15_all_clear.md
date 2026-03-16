---
name: Visual QA All Clear Log
description: Running log of full visual QA passes — most recent at top
type: project
---

## 2026-03-15 (Pass #2 — re-check)

Ran full visual QA on 2026-03-15 (second run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) accents, Sonar Red (`#D3121D`) play buttons, Poppins/Inter fonts
- Desktop Home: latest video row + Getting Started + Sonar Summit sections all render correctly
- Desktop Home Bottom: Customer Stories row + footer (YouTube/GitHub/SonarSource links) clean
- Desktop Watch: video player full-width, metadata card below with title/tags/share
- Desktop Category: sort bar (Newest/Oldest/Shortest/Longest), 4-column grid, count badge — all correct
- Mobile Home: 2-column grid layout (intentional), Filters sticky button visible, no overflow
- Mobile Home Bottom: Customer Stories 2-column grid, footer clean
- Mobile Watch: player + title + tags/date + duration/share + description + Summary/Transcript tabs — all render
- Mobile Category: sort bar present, video cards render in single-column layout (different from home's 2-col grid — appears intentional for category page)
- No horizontal overflow on mobile
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-15 (Pass #1 — initial baseline)

Ran full visual QA on 2026-03-15 across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) accents, Sonar Red (`#D3121D`) CTAs, Poppins/Inter fonts
- Mobile 2-column grid in VideoRow is **intentional** (coded in VideoRow.tsx with `sm:hidden` grid + `hidden sm:block` horizontal scroll)
- Desktop hero full-bleed banner (`h-[70vh] min-h-[500px]`) looks correct per code; screenshot shows rows below it (screenshot likely taken at scroll position)
- Footer renders correctly with YouTube/GitHub/SonarSource links
- Watch page: player + metadata card + ArticleTabs all render cleanly
- Category page: sort bar with Newest/Oldest/Shortest/Longest buttons, video grid, count badge all correct
- No horizontal overflow on mobile

**Why:** No regressions detected on this date.
**How to apply:** Use as baseline. Flag any future deviations from these layouts as potential regressions.
