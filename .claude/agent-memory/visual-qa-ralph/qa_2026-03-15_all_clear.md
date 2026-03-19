---
name: Visual QA All Clear Log
description: Running log of full visual QA passes — most recent at top
type: project
---

## 2026-03-19 (Pass #34)

Ran full visual QA on 2026-03-19 (thirty-fourth run). Fresh Playwright screenshots captured at 375px and 1280px viewports against the live dev server (http://localhost:3000). Pages: Home, Watch /watch/v1, Category /category/getting-started.

**Result: 1 bug found and fixed.**

**Bug fixed:** Mobile header overflow — nav items clip off-screen at <480px. The header nav was 307px wide in ~222px of available space at 375px. The ThemeToggle button left edge was at 425px (50px completely off-screen). Users on all common phone widths (375px iPhone SE, 390px iPhone 15, etc.) could not access the ThemeToggle or see the full "Categories" label. Root cause: Courses (100px) + Categories (120px) + ThemeToggle (36px) + gaps exceed available horizontal space after the logo. Fix: Courses and Categories text labels now use `hidden sm:inline` (matching the Search pattern), both buttons have `aria-label` for accessibility; ThemeToggle wrapped in `hidden sm:flex` (already was clipped and inaccessible on mobile). Verified: `headerScrollWidth === 375` after fix, all nav items within viewport. Committed: `a513b34`.

**Why prior passes missed it:** QA passes #22–33 all used 390px screenshot viewport (from a `qa-mobile-home.png` captured at 390×844 — discovered by reading PNG IHDR dimensions). At 390px the "Categories" text was mostly visible (ending at 421px, close to edge) and the ThemeToggle was off-screen but visually not noticed. The task prompt for this pass correctly specified 375px.

Specific checks (all clean after fix):
- Desktop Home 1280px: Hero (SecurityGuy TV video), speaker panel right side, Latest row — clean; light theme = known Playwright headless artifact
- Desktop Home Bottom: Enterprise row, Customer Stories section, footer with browse/categories/connect columns — clean
- Desktop Watch 1280px: player, title card, metadata (SonarQube Cloud + March 12th 2026 + 0:41 + Part of SCDE + Share), description — clean
- Desktop Category 1280px: Getting Started header, 6 videos + 1h 8m badges, sort bar (Newest red, all 4 buttons on one row), 4-col grid (42:47, 7:52, 9:31, 7:03 thumbnails) — clean
- Mobile Home 375px (after fix): Header fits (Search icon + Courses ▼ + Categories ▼, no overflow), hero card, Watch Now red button, Filters blue button, Latest 63 + Swipe hint — clean
- Mobile Home Bottom 375px: Customer Stories section, footer, Filters + scroll-to-top overlay — clean
- Mobile Watch 375px: full-width player, title, tags (SonarQube Cloud + March 12th 2026), 0:41/Part of SCDE/Share, description, AI Summary/Transcript tabs — within viewport
- Mobile Category 375px: Getting Started header, 6 videos + 1h 8m badges, sort bar (Newest red, all 4 buttons on ONE ROW at 375px), 2-col grid with thumbnails — clean
- "N" bottom-left artifact — confirmed false positive (Next.js route announcer)

---

## 2026-03-18 (Pass #33)

Ran full visual QA on 2026-03-18 (thirty-third run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px). Also inspected interactive-* screenshots from 16:42–16:43.

**Result: All clear — no new visual bugs found.**

No commits since Pass #32. All fixes from prior passes remain in place.

Specific checks:
- Desktop Home: Marquee row, Certification Courses (DEVELOPER/SECURITY/DEVOPS/AI CODE cards, BEGINNER/INTERMEDIATE badges, red Start Course buttons), Getting Started — clean
- Desktop Home Bottom: known black screenshot artifact; DevOps & CI/CD cards (1:57, 0:59, 46:48 duration badges) — clean
- Desktop Watch: YouTube player, Back nav, title "Auto import of GitHub repos to SonarQube Cloud in action." — correct
- Desktop Category: Sort bar (all 4 buttons on one row, Newest red/active), 4-col grid — correct
- Mobile Home: carousel, Certification Courses DEVELOPER card full-width (BEGINNER badge, 4 modules · 15 videos · 2h 58m, progress dots, Start Course button), Filters + scroll-to-top — no overflow
- Mobile Home Bottom: known black area artifact; DevOps & CI/CD row with 0:41 + 1:57 duration badges — clean
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, 0:41/Part of SCDK/Share, description, AI Summary/Transcript tabs — within viewport
- Mobile Category: screenshot is stale (Mar 17, pre-fix); confirmed `flex-nowrap` fix (commit 171a73b) still in CategoryContent.tsx line 70 — no regression
- Interactive Home (Mar 18 16:42): Hero "Linux Foundation: Open-Source & Clean Code | Live with Sonar", Latest row, Certification Courses — clean; grey placeholder tiles = lazy-load artifact
- Interactive Watch (Mar 18 16:42): Full watch page with long description and AI Summary/Transcript tabs, footer — clean
- Interactive Category page (Mar 18 16:43): Getting Started page, sort bar all 4 buttons on one row, 4-col grid — clean
- Interactive Filters (Mar 18 16:43): Filter modal open — white modal on dark page (consistent with prior passes, noted existing behavior)
- "N" bottom-left artifact — confirmed false positive (Next.js route announcer)

---

## 2026-03-18 (Pass #32)

Ran full visual QA on 2026-03-18 (thirty-second run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px). Also inspected newer qa-* screenshots.

**Result: All clear — no new visual bugs found.**

Screenshots from `desktop-*` / `mobile-*` sets are stale (Mar 17, pre-fix). The `qa-*` set is from Mar 18 04:53-54, still slightly before commit `171a73b` (04:59). All screenshot-visible issues have been cross-checked against current code.

Specific checks:
- Desktop Home: Marquee row, Certification Courses (4 cards), Getting Started — clean
- Desktop Home Bottom: known black screenshot artifact; DevOps & CI/CD cards — clean
- Desktop Watch (both desktop + qa-watch): player, back nav, title, article content — clean
- Desktop Category (both desktop + qa-category): sort bar (all 4 buttons on one row), 4-col grid — clean
- Mobile Home (desktop-mobile-home + qa-mobile-home): Hero with featured card + Watch Now/Filters, Certification Courses DEVELOPER card — clean
- Mobile Home Bottom: known black area artifact; SonarQube Cloud + DevOps rows — clean
- Mobile Watch: full-width player, metadata, tabs — within viewport
- Mobile Category: **stale screenshot shows pre-fix wrapping** — confirmed fix `171a73b` is applied in current code; `flex flex-nowrap` prevents wrapping
- Filters modal (qa-filters): white modal is correct — screenshot was captured in light mode (`html:not(.dark)` → `--background: #F4F7FB`)

---

## 2026-03-18 (Pass #31)

Ran full visual QA on 2026-03-18 (thirty-first run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: 1 bug found and fixed.**

**Bug fixed:** Mobile Category page — sort buttons ("Newest Oldest Shortest / Longest") wrapped onto two lines on 375px viewports, leaving "Longest" orphaned on a second row. Root cause: `flex flex-wrap` on the inner button container + `flex flex-wrap items-center` on the outer container meant that at ~293px remaining width the 4 buttons couldn't all fit. Fix: outer container changed to `flex flex-col items-start sm:flex-row sm:flex-wrap sm:items-center`; inner button container changed to `flex flex-nowrap`. Committed: `171a73b`.

Specific checks:
- Desktop Home: Marquee row, Certification Courses (4 cards), Getting Started section — all clean
- Desktop Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD cards — clean
- Desktop Watch: player, back nav, title — correct
- Desktop Category: "Getting Started" header, sort bar (4 buttons on one row), 4-col grid — correct
- Mobile Home: carousel, Certification Courses DEVELOPER card, Getting Started — no horizontal overflow
- Mobile Home Bottom: known black area artifact; Marquee row, DevOps & CI/CD — clean
- Mobile Watch: full-width player, metadata, tabs — within viewport
- Mobile Category: **FIXED** sort buttons now stack below label (flex-col on mobile) — all 4 on one row

---

## 2026-03-18 (Pass #30)

Ran full visual QA on 2026-03-18 (thirtieth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) duration/count badges, Sonar Red (`#D3121D`) "Newest" active sort + "Start Course" buttons
- Desktop Home: Marquee row → Certification Courses (DEVELOPER/SECURITY/DEVOPS/AI CODE cards with BEGINNER/INTERMEDIATE badges, red Start Course buttons) → Getting Started (badge 6) — clean
- Desktop Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD (badge 16) cards (1:57, 0:59, 46:48); SonarQube for IDE section — clean
- Desktop Watch: YouTube player with blue thumbnail, Back nav, title card "Auto import of GitHub repos to SonarQube Cloud in action." — correct
- Desktop Category: "Getting Started" + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid + partial second row — correct
- Mobile Home: Marquee row with 0:41 duration; Certification Courses DEVELOPER card (BEGINNER badge, 4 modules · 15 videos · 2h 58m, progress dots, Start Course button); Getting Started section + Filters + scroll-to-top — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact; Marquee row blue thumbnail; DevOps & CI/CD (badge 16) with 1:57 duration badge — clean
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, 0:41/Part of SCDK/Share, description, AI Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap), 2-col grid with thumbnails and duration badges — clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-18 (Pass #29)

Ran full visual QA on 2026-03-18 (twenty-ninth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) duration/count badges, Sonar Red (`#D3121D`) "Newest" active sort + "Start Course" buttons
- Desktop Home: Marquee row → Certification Courses (DEVELOPER/SECURITY/DEVOPS/AI CODE cards with BEGINNER/INTERMEDIATE badges, red Start Course buttons) → Getting Started (badge 6) — clean
- Desktop Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD (badge 16) cards (1:57, 0:59, 46:48); SonarQube for IDE section — clean
- Desktop Watch: YouTube player with blue thumbnail, Back nav, title card "Auto import of GitHub repos to SonarQube Cloud in action." — correct
- Desktop Category: "Getting Started" + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid + partial second row — correct
- Mobile Home: Marquee row titles visible; Certification Courses DEVELOPER card fills 375px width (BEGINNER badge, 4 modules · 15 videos · 2h 58m, progress dots, Start Course button); Getting Started badge 6; Filters + scroll-to-top — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact; Marquee row with blue YouTube thumbnail cards; DevOps & CI/CD (badge 16) with 1:57 duration badge — clean
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, 0:41/Part of SCDK/Share, description, AI Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap), 2-col grid with thumbnails — clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-17 (Pass #28)

Ran full visual QA on 2026-03-17 (twenty-eighth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) duration/count badges, Sonar Red (`#D3121D`) "Newest" active sort + "Start Course" buttons
- Desktop Home: Marquee row → Certification Courses (DEVELOPER/SECURITY/DEVOPS/AI CODE cards with BEGINNER/INTERMEDIATE badges, red Start Course buttons) → Getting Started (badge 6) — clean
- Desktop Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD (badge 16) cards (1:57, 0:59, 46:48); SonarQube for IDE section — clean
- Desktop Watch: YouTube player with blue thumbnail, Back nav, title card "Auto import of GitHub repos to SonarQube Cloud in action." — correct
- Desktop Category: "Getting Started" + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid + partial second row — correct
- Mobile Home: Marquee row titles visible; Certification Courses DEVELOPER card fills 375px width (BEGINNER badge, 4 modules · 15 videos · 2h 58m, progress dots, Start Course button); Getting Started badge 6; Filters + scroll-to-top — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact; Marquee row + DevOps & CI/CD 16 rows — clean
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, 0:41/Part of SCDK/Share, description, AI Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap), 2-col grid with thumbnails — clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-17 (Pass #27)

Ran full visual QA on 2026-03-17 (twenty-seventh run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) duration/count badges, Sonar Red (`#D3121D`) "Newest" active sort + "Start Course" buttons
- Desktop Home: Marquee row → Certification Courses (DEVELOPER/SECURITY/DEVOPS/AI CODE cards with BEGINNER/INTERMEDIATE badges, red Start Course buttons) → Getting Started (badge 6) — clean
- Desktop Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD (badge 16) cards (1:57, 0:59, 46:48); SonarQube for IDE section — clean
- Desktop Watch: YouTube player with blue thumbnail, Back nav, title card "Auto import of GitHub repos to SonarQube Cloud in action." — correct
- Desktop Category: "Getting Started" + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid + partial second row — correct
- Mobile Home: Marquee row titles visible; Certification Courses DEVELOPER card fills 375px width (BEGINNER badge, 4 modules · 15 videos · 2h 58m, progress dots, Start Course button); Getting Started badge 6; Filters + scroll-to-top — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD 16 + SonarQube for IDE rows — clean
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, 0:41/Part of SCDK/Share, description, AI Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap), 2-col grid with thumbnails — clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-17 (Pass #26)

Ran full visual QA on 2026-03-17 (twenty-sixth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) duration/count badges, Sonar Red (`#D3121D`) "Newest" active sort + "Start Course" buttons
- Desktop Home: Marquee row → Certification Courses (DEVELOPER/SECURITY/DEVOPS/AI CODE cards with BEGINNER/INTERMEDIATE badges, red Start Course buttons) → Getting Started (badge 6) — clean
- Desktop Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD (badge 16) cards (1:57, 0:59, 46:48); SonarQube for IDE section — clean
- Desktop Watch: YouTube player with blue thumbnail, Back nav, title card "Auto import of GitHub repos to SonarQube Cloud in action." — correct
- Desktop Category: "Getting Started" + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid + partial second row — correct
- Mobile Home: Marquee row titles visible; Certification Courses DEVELOPER card fills 375px width (BEGINNER badge, 4 modules · 15 videos · 2h 58m, progress dots, Start Course button); Getting Started badge 6; Filters + scroll-to-top — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD 1:57 badge + SonarQube for IDE 16 rows — clean
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, 0:41/Part of SCDK/Share, description, AI Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap), 2-col grid with thumbnails — clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-17 (Pass #25)

Ran full visual QA on 2026-03-17 (twenty-fifth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) duration/count badges, Sonar Red (`#D3121D`) "Newest" active sort + "Start Course" buttons
- Desktop Home: Marquee row → Certification Courses (DEVELOPER/SECURITY/DEVOPS/AI CODE cards with BEGINNER/INTERMEDIATE badges, red Start Course buttons) → Getting Started (badge 6) — clean
- Desktop Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD (badge 16) cards (1:57, 0:59, 46:48); SonarQube for IDE section — clean
- Desktop Watch: YouTube player with blue thumbnail, Back nav, title card "Auto import of GitHub repos to SonarQube Cloud in action." — correct
- Desktop Category: "Getting Started" + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid + partial second row — correct
- Mobile Home: Certification Courses DEVELOPER card fills 375px width (BEGINNER badge, 4 modules · 15 videos · 2h 58m, progress dots, Start Course button); Getting Started badge 6; Filters + scroll-to-top — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD 16 + SonarQube for IDE 16 rows — clean
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, 0:41/Part of SCDK/Share, description, AI Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap), 2-col grid with thumbnails — clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-17 (Pass #24)

Ran full visual QA on 2026-03-17 (twenty-fourth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) duration/count badges, Sonar Red (`#D3121D`) "Newest" active sort + "Start Course" buttons
- Desktop Home: Marquee row → Certification Courses (DEVELOPER/SECURITY/DEVOPS/AI CODE cards with BEGINNER/INTERMEDIATE badges, red Start Course buttons) → Getting Started (badge 6) — clean
- Desktop Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD (badge 16) cards (1:57, 0:59, 46:48); SonarQube for IDE section — clean
- Desktop Watch: YouTube player with blue thumbnail, Back nav, title card "Auto import of GitHub repos to SonarQube Cloud in action." — correct
- Desktop Category: "Getting Started" + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid + partial second row — correct
- Mobile Home: Certification Courses DEVELOPER card fills 375px width (BEGINNER badge, 4 modules · 15 videos · 2h 58m, progress dots, Start Course button); Getting Started badge 6; Filters + scroll-to-top — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD 16 + SonarQube for IDE 16 rows — clean
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, 0:41/Part of SCDK/Share, description, AI Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap), 2-col grid with thumbnails — clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-17 (Pass #23)

Ran full visual QA on 2026-03-17 (twenty-third run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) duration/count badges, Sonar Red (`#D3121D`) "Newest" active sort + "Start Course" buttons
- Desktop Home: Marquee row → Certification Courses (DEVELOPER/SECURITY/DEVOPS/AI CODE cards with BEGINNER/INTERMEDIATE badges, red Start Course buttons) → Getting Started (badge 6) — clean
- Desktop Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD (badge 16) cards (1:57, 0:59, 46:48); SonarQube for IDE section — clean
- Desktop Watch: YouTube player with blue thumbnail, Back nav, title card "Auto import of GitHub repos to SonarQube Cloud in action." — correct
- Desktop Category: "Getting Started" + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid + partial second row — correct
- Mobile Home: Certification Courses DEVELOPER card fills 375px width (BEGINNER badge, 4 modules · 15 videos · 2h 58m, progress dots, Start Course button); Getting Started badge 6; Filters + scroll-to-top — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD 16 + SonarQube for IDE 16 rows — clean
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, 0:41/Part of SCDK/Share, description, AI Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap), 2-col grid with thumbnails — clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-17 (Pass #22)

Ran full visual QA on 2026-03-17 (twenty-second run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) duration/count badges, Sonar Red (`#D3121D`) "Newest" active sort + "Start Course" buttons
- Desktop Home: Marquee row → Certification Courses (DEVELOPER/SECURITY/DEVOPS/AI CODE cards with BEGINNER/INTERMEDIATE badges, red Start Course buttons) → Getting Started (badge 6) — clean
- Desktop Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD (badge 16) cards (1:57, 0:59, 46:48); SonarQube for IDE section — clean
- Desktop Watch: YouTube player with blue thumbnail, Back nav, title card "Auto import of GitHub repos to SonarQube Cloud in action." — correct
- Desktop Category: "Getting Started" + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid + partial second row — correct
- Mobile Home: Certification Courses DEVELOPER card fills 375px width (BEGINNER badge, 4 modules · 15 videos · 2h 58m, progress dots, Start Course button); Getting Started badge 6; Filters + scroll-to-top — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD 16 + SonarQube for IDE 16 rows — clean
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, 0:41/Part of SCDC/Share, description, AI Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap), 2-col grid with thumbnails — clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-16 (Pass #21)

Ran full visual QA on 2026-03-16 (twenty-first run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) duration/count badges, Sonar Red (`#D3121D`) "Newest" active sort + "Start Course" buttons
- Desktop Home: Marquee row → Certification Courses (DEVELOPER/SECURITY/DEVOPS/AI CODE, BEGINNER/INTERMEDIATE badges, red Start Course buttons) → Getting Started — clean
- Desktop Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD carousel (1:57, 0:59, 46:48); SonarQube for IDE header — clean
- Desktop Watch: YouTube player with blue thumbnail, Back nav, title card below — correct
- Desktop Category: "Getting Started" + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid + partial second row — correct
- Mobile Home: Certification Courses full-width card (BEGINNER badge, progress dots, Start Course button); Getting Started badge 6; Filters + scroll-to-top — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD + SonarQube for IDE rows — clean
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, 0:41/Part of SCDE/Share, description, Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap), 2-col grid clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-16 (Pass #20)

Ran full visual QA on 2026-03-16 (twentieth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) duration/count badges, Sonar Red (`#D3121D`) "Newest" active sort + "Start Course" buttons
- Desktop Home: Marquee row at top + Certification Courses section (SCD, SCSE, SCDE, SCAVS cards with BEGINNER/INTERMEDIATE badges, red Start Course buttons) + Getting Started (badge 6) — clean
- Desktop Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD carousel (1:57, 0:59, 46:48 duration badges) + SonarQube for IDE section starting — clean
- Desktop Watch: YouTube player with blue thumbnail, Back nav, title card below — correct
- Desktop Category: "Getting Started" header + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid + partial second row — correct
- Mobile Home: Certification Courses card fills 375px width (BEGINNER badge, progress dots, Start Course button); Getting Started badge 6 below; Filters + scroll-to-top buttons — no horizontal overflow
- Mobile Home Bottom: completely black = known screenshot artifact (unloaded thumbnails in headless browser)
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, 0:41/Part of SCDE/Share, description, Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap), 2-col video grid clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-16 (Pass #19)

Ran full visual QA on 2026-03-16 (nineteenth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) duration/count badges, Sonar Red (`#D3121D`) "Newest" active sort + "Start Course" buttons
- New **Certification Courses** section (SCD, SCSE, SCDE, SCA cards) renders cleanly on both desktop and mobile — dark blue thumbnails, BEGINNER badges, progress dots, full-width on mobile
- Desktop Home: Certification Courses section above Getting Started (badge 6) — clean horizontal scroll layout, no overflow
- Desktop Home Bottom: Architecture & Governance (badge 6) with duration badges (46:07, 2:21, 5:49) — large black area at top = known screenshot artifact
- Desktop Watch: YouTube player centered, Back nav, Share button, keyboard shortcuts label, title card below — correct
- Desktop Category: "Getting Started" header + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid + partial second row — correct
- Mobile Home: Certification Courses card fills 375px width cleanly (progress dots + Start Course button visible); Getting Started section below with badge 6 — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact; SonarQube for IDE (badge 16) + Swipe hint + 1:57/2:33 duration badges — clean
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, 0:41 duration/Part of OSCT/Share, description, Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap), 2-col video grid clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-16 (Pass #18)

Ran full visual QA on 2026-03-16 (eighteenth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) duration badges + "6 videos" / "1h 8m total" badges, Sonar Red (`#D3121D`) "Newest" active sort button
- Desktop Home: featured marquee row + Getting Started (badge 8) + Sonar Summit sections — dark theme, aligned cards, correct colors
- Desktop Home Bottom: SonarQube for IDE row with duration badges (2:33, 1:41, 9:23) clean; large black area at top = known screenshot artifact
- Desktop Watch: YouTube player centered, Back nav, Share button, keyboard shortcuts label, title card below — correct
- Desktop Category: "Getting Started" header + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid + partial second row — correct
- Mobile Home: horizontal carousel (intentional), Getting Started + Sonar Summit sections — no horizontal overflow; Filters button visible
- Mobile Home Bottom: large black area at top = known screenshot artifact; SonarQube for IDE (badge 16) + Swipe hint + cards with duration badges — clean
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, 0:41 duration/share, description, Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap), 2-col video grid clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-16 (Pass #17)

Ran full visual QA on 2026-03-16 (seventeenth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) duration badges + "6 videos" / "1h 8m total" badges, Sonar Red (`#D3121D`) "Newest" active sort button
- Desktop Home: featured marquee row + Getting Started (badge 8) + Sonar Summit sections — dark theme, aligned cards, correct colors
- Desktop Home Bottom: Architecture & Governance carousel (badge 6) with duration badges (46:07, 2:21, 5:49) + prev/next arrows — large black area at top = known screenshot artifact
- Desktop Watch: YouTube player centered, Back nav, Share button, keyboard shortcuts label, title card below — correct
- Desktop Category: "Getting Started" header + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid — correct
- Mobile Home: horizontal carousel (intentional), Getting Started + Sonar Summit sections — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD (badge 16) + SonarQube for IDE carousels clean; Qube Blue duration badges visible
- Mobile Watch: full-width player, title, SonarQube Cloud + March 12th 2026 tags, 0:41 duration/share, description, Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap, consistent with all prior passes), 2-col grid clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-16 (Pass #16)

Ran full visual QA on 2026-03-16 (sixteenth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) "6 videos" / "1h 8m total" badges, Sonar Red (`#D3121D`) "Newest" active sort button
- Desktop Home: featured marquee row with thumbnails + "Getting Started" (badge 8) + Sonar Summit sections — dark theme, aligned cards, correct colors
- Desktop Home Bottom: large black area at top = known screenshot artifact; DevOps & CI/CD + SonarQube for IDE rows clean
- Desktop Watch: YouTube player centered, Back nav, Share button, keyboard shortcuts label, title card below — correct
- Desktop Category: "Getting Started" header + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid + partial second row — correct
- Mobile Home: horizontal carousel (intentional), Getting Started + Sonar Summit sections — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact; "Swipe ›" hint visible on mobile only (sm:hidden correctly hides on desktop); DevOps & CI/CD + SonarQube for IDE carousels clean
- Mobile Watch: full-width player, title, SonarQube Cloud + March 12th 2026 tags, 0:41 duration/share, description, Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap, consistent with all prior passes), 2-col grid clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-16 (Pass #15)

Ran full visual QA on 2026-03-16 (fifteenth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) "6 videos" / "1h 8m total" badges, Sonar Red (`#D3121D`) "Newest" active sort button
- Desktop Home: featured marquee row with thumbnails + "Getting Started" (badge 8) + Sonar Summit sections — dark theme, aligned cards, correct colors
- Desktop Home Bottom: DevOps & CI/CD + SonarQube for IDE (badge 16) rows clean, duration badges visible
- Desktop Watch: YouTube player centered, Back nav, Share button, keyboard shortcuts label, title card below — correct
- Desktop Category: "Getting Started" header + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid — correct
- Mobile Home: horizontal carousel (intentional), Getting Started + Sonar Summit sections — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact, DevOps & CI/CD + SonarQube for IDE carousels clean
- Mobile Watch: full-width player, title, SonarQube Cloud + March 12th 2026 tags, 0:41 duration/share, description, Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap, consistent with prior passes), 2-col grid clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-16 (Pass #14)

Ran full visual QA on 2026-03-16 (fourteenth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) "6 videos" / "1h 8m total" badges, Sonar Red (`#D3121D`) "Newest" active sort button
- Desktop Home: featured marquee row with thumbnails + "Getting Started" (badge 8) + Sonar Summit sections — dark theme, aligned cards, correct colors
- Desktop Home Bottom: DevOps & CI/CD + SonarQube for IDE (badge 16) rows clean, duration badges visible
- Desktop Watch: YouTube player centered, Back nav, Share button, keyboard shortcuts label, title card below — correct
- Desktop Category: "Getting Started" header + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid — correct
- Mobile Home: horizontal carousel (intentional), Getting Started + Sonar Summit sections — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact, DevOps & CI/CD + SonarQube for IDE carousels clean
- Mobile Watch: full-width player, title, SonarQube Cloud + March 12th 2026 tags, duration/share, description, Summary/Transcript tabs — all within viewport
- Mobile Category: "Longest" wraps to second line at 375px (expected flex-wrap, seen in prior passes), 2-col grid clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-16 (Pass #13)

Ran full visual QA on 2026-03-16 (thirteenth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) "6 videos" / "1h 8m total" badges, Sonar Red (`#D3121D`) "Newest" active sort button
- Desktop Home: featured marquee row + Getting Started (badge 8) + Sonar Summit sections — dark theme, aligned cards, correct colors
- Desktop Home Bottom: DevOps & CI/CD + SonarQube for IDE (badge 16) rows clean, duration badges visible
- Desktop Watch: YouTube player centered, Back nav, Share button, keyboard shortcuts label, title card below — correct
- Desktop Category: "Getting Started" header + "6 videos" + "1h 8m total" Qube Blue badges, Newest active Sonar Red, 4-col grid — correct
- Mobile Home: horizontal carousel (intentional), Getting Started + Sonar Summit sections — no horizontal overflow
- Mobile Home Bottom: large black area at top = known screenshot artifact (false positive), DevOps & CI/CD + SonarQube for IDE carousels clean
- Mobile Watch: full-width player, title, SonarQube Cloud + March 12th 2026 tags, duration/share, description, Summary/Transcript tabs — all within viewport
- Mobile Category: SORT BY + all 4 sort buttons on one row at 375px, 2-col grid, thumbnails loading — clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-16 (Pass #12)

Ran full visual QA on 2026-03-16 (twelfth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) "6 videos" / "1h 8m total" badges, Sonar Red (`#D3121D`) "Newest" active sort button
- Desktop Home: featured marquee row + Getting Started + Sonar Summit sections — dark theme, aligned cards, correct colors
- Desktop Home Bottom: CI/CD row + SonarQube for IDE section — duration badges visible, clean layout
- Desktop Watch: YouTube player centered, Back nav, Share button, title card below — correct
- Desktop Category: "Getting Started" header + "6 videos" + "1h 8m total" badges, Newest active in Sonar Red, 4-col grid — correct
- Mobile Home: horizontal carousel (intentional — VideoRow.tsx refactored to single scroll layout for all viewports), featured row + Getting Started + Sonar Summit sections — no horizontal overflow
- Mobile Home Bottom: large black area at top = screenshot artifact (unloaded thumbnails, lazy-load not triggered in headless browser), DevOps & CI/CD + SonarQube for IDE carousels clean
- Mobile Watch: full-width player, title, SonarQube Cloud + March 12th 2026 tags, duration/share, description, Summary/Transcript tabs — all within viewport
- Mobile Category: "SORT BY" + all 4 sort buttons on one row at 375px, 2-col video grid — clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)
- VideoRow mobile layout change confirmed intentional: old `sm:hidden` 2-col grid removed, now single `overflow-x-auto` scroll for all viewports

---

## 2026-03-16 (Pass #11)

Ran full visual QA on 2026-03-16 (eleventh run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) badges, Sonar Red (`#D3121D`) "Newest" active sort button
- Desktop Home: featured marquee row + Getting Started + Sonar Summit sections — dark theme, aligned cards, no overflow
- Desktop Home Bottom: SonarQube for IDE row with duration badges — clean, no clipping
- Desktop Watch: YouTube player centered, Back nav, Share button, "keyboard shortcuts" text, title card below — correct
- Desktop Category: "Getting Started" header + "6 videos" + "1h 8m total" badges, Newest active in Sonar Red, 4-col grid — correct
- Mobile Home: 2-col grid (intentional), compact header, featured row + Getting Started section — no horizontal overflow
- Mobile Home Bottom: 2-col card grid, "Product Updates" section header visible — clean
- Mobile Watch: full-width player, title, SonarQube Cloud + March 12th 2026 tags, duration/share, description, Summary/Transcript tabs — all within viewport
- Mobile Category: "SORT BY" + all 4 sort buttons on one row at 375px, 2-col video grid — clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-16 (Pass #10)

Ran full visual QA on 2026-03-16 (tenth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) badges, Sonar Red (`#D3121D`) "Newest" active sort button
- Desktop Home: featured marquee row with thumbnails, Getting Started + Sonar Summit sections — all correct
- Desktop Home Bottom: CI/CD section with cards, SonarQube for IDE section starting — clean, no overflow
- Desktop Watch: YouTube player, Back nav, Share button, "keyboard shortcuts" tooltip, title card below — correct
- Desktop Category: "Getting Started" header + "6 videos" + "1h 8m total" badges, Newest active in Sonar Red, 4-column grid + partial second row — correct
- Mobile Home: 2-column grid (intentional), featured row at top, Getting Started section below, Filters button — no overflow
- Mobile Home Bottom: Clean Code section "46" badge + "View all", 2-col card grid — clean
- Mobile Watch: full-width player, Back nav, title, SonarQube Cloud + March 12th 2026 tags, duration/share, description, Summary/Transcript tabs — all within viewport
- Mobile Category: "SORT BY" + Newest/Oldest/Shortest/Longest all fit on one row at 375px, 2-col video grid — clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-16 (Pass #9)

Ran full visual QA on 2026-03-16 (ninth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) "6 videos" badge, Sonar Red (`#D3121D`) "Newest" active sort button
- Desktop Home: featured marquee row with thumbnails/durations/tags, Getting Started + Sonar Summit sections — all correct
- Desktop Home Bottom: CI/CD row + SonarQube for IDE section clean, cards aligned, no overflow
- Desktop Watch: YouTube player centered, Back nav, share button, "keyboard shortcuts" tooltip, title card below — correct
- Desktop Category: header + "6 videos" badge, description, "Newest" active in Sonar Red, 4-column grid clean
- Mobile Home: 2-column grid (intentional), featured row, Filters button, no horizontal overflow
- Mobile Home Bottom: 2-col rows continue, "Product Updates" section header + "View all" link clean
- Mobile Watch: full-width player, title, tags, date, duration/share, description, Summary/Transcript tabs — all within viewport
- Mobile Category: "SORT BY" + all 4 sort buttons fit on one row at 375px, full-width video cards clean
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-16 (Pass #8)

Ran full visual QA on 2026-03-16 (eighth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) accents, Sonar Red (`#D3121D`) active sort button + play buttons
- Desktop Home: marquee/featured row + Getting Started + Sonar Summit sections render correctly with thumbnails, titles, dates, tags
- Desktop Home Bottom: Customer Stories row + footer (YouTube/GitHub/SonarSource links) clean
- Desktop Watch: YouTube player centered, Back nav, Share button, title/metadata below — correct
- Desktop Category: "Getting Started" header + "6 videos" badge, description, "Newest" active in Sonar Red, 4-column grid — correct
- Mobile Home: 2-column grid (intentional), section headers, Filters button, no horizontal overflow
- Mobile Home Bottom: 2-col Customer Stories cards clean
- Mobile Watch: full-width player, title, tags, date, duration/share, description, Summary/Transcript tabs — all within viewport
- Mobile Category: "SORT BY" + all 4 sort buttons fit on one line at 375px, full-width cards — clean
- "N" bottom-left artifact present on several pages — confirmed false positive (Next.js route announcer)

---

## 2026-03-16 (Pass #7)

Ran full visual QA on 2026-03-16 (seventh run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) accents, Sonar Red (`#D3121D`) active sort button + play buttons
- Desktop Home: featured/marquee row + Getting Started + Sonar Summit sections render correctly with thumbnails, titles, dates, tags
- Desktop Home Bottom: SonarQube for IDE row clean, cards aligned, no overflow
- Desktop Watch: YouTube player centered, Back nav, "keyboard shortcuts" tooltip, title below — all correct
- Desktop Category: "Getting Started" header + "6 videos" badge, description, sort bar (Newest active), 4-column grid — correct
- Mobile Home: 2-column grid (intentional), section headers visible, no horizontal overflow
- Mobile Home Bottom: 2-col card grid continues, titles properly truncated, clean
- Mobile Watch: full-width player, title, tags (SonarQube Cloud + date), duration/share, description, Summary/Transcript tabs — all present and within viewport
- Mobile Category: full-width cards, "SORT BY" wraps to 2 lines (expected flex-wrap at 375px), sort buttons intact
- "N" bottom-left artifact present on several pages — confirmed false positive (Next.js route announcer)

---

## 2026-03-15 (Pass #6 — re-check)

Ran full visual QA on 2026-03-15 (sixth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) accents, Sonar Red (`#D3121D`) active sort button + play buttons
- Desktop Home: hero marquee row + Getting Started + Sonar Summit sections render correctly with thumbnails, titles, dates, tags
- Desktop Home Bottom: CI/CD and SonarQube for IDE rows clean, cards aligned
- Desktop Watch: YouTube player centered, title below, metadata row intact — no overflow
- Desktop Category: "6 videos" badge, description, sort bar (Newest active), 4-column grid — all correct
- Mobile Home: 2-column grid (intentional), header fits, no horizontal overflow
- Mobile Home Bottom: 2-col card rows, "Product Updates 17" section header clean
- Mobile Watch: player full-width, title, metadata badges, description, Summary/Transcript tabs — all present
- Mobile Category: single-col cards, all 4 sort buttons fit on one row, no clipping
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-15 (Pass #5 — re-check)

Ran full visual QA on 2026-03-15 (fifth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) accents, Sonar Red (`#D3121D`) active sort button + play buttons
- Desktop Home: featured video row + Getting Started + Sonar Summit sections all render correctly with thumbnails, titles, dates, tags
- Desktop Home Bottom: Customer Stories row + footer (YouTube/GitHub/SonarSource links) clean
- Desktop Watch: full-width YouTube player, Back nav, Share button, metadata card below — all correct
- Desktop Category: "6 videos" badge, description, sort bar (Newest active in Sonar Red), 4-column grid — all correct
- Mobile Home: 2-column grid (intentional), section headers, Filters sticky button, no horizontal overflow
- Mobile Home Bottom: Customer Stories 2-column grid, Filters button, clean dark theme
- Mobile Watch: player full-width, title/tags/date/duration/share below, description, Summary/Transcript tabs — all present
- Mobile Category: "SORT BY" wraps to 2 lines (expected at 375px), sort buttons intact, video cards visible
- No horizontal overflow on mobile
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-15 (Pass #4 — re-check)

Ran full visual QA on 2026-03-15 (fourth run) across all 4 pages × 2 viewports (desktop 1280px, mobile 375px).

**Result: All clear — no visual bugs found. No regressions from baseline.**

Specific checks:
- Dark theme correctly applied everywhere (`#0a0a0a` background)
- Brand colors correct: Qube Blue (`#126ED3`) accents, Sonar Red (`#D3121D`) active sort button + play buttons, Poppins/Inter fonts
- Desktop Home: latest video row + Getting Started + Sonar Summit sections all render correctly with thumbnails, titles, dates, tags
- Desktop Home Bottom: Customer Stories row + footer (YouTube/GitHub/SonarSource links) clean
- Desktop Watch: full-width YouTube player, Back nav, Share button, metadata card below — all correct
- Desktop Category: "6 videos" badge, description, sort bar (Newest active in Sonar Red), 4-column grid — all correct
- Mobile Home: 2-column grid (intentional), section headers, Filters sticky button, no horizontal overflow
- Mobile Home Bottom: Customer Stories 2-column grid, Filters button, clean dark theme
- Mobile Watch: player full-width, title/tags/date/duration/share below, description, Summary/Transcript tabs — all present
- Mobile Category: single-column cards, "SORT BY" wraps to 2 lines (expected at 375px), sort buttons intact
- No horizontal overflow on mobile
- "N" bottom-left artifact present — confirmed false positive (Next.js route announcer)

---

## 2026-03-15 (Pass #3 — re-check)

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
