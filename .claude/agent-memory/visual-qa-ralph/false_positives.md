---
name: Visual QA False Positives
description: Known non-bugs to skip or ignore during visual QA passes
type: feedback
---

## IMPORTANT: Mobile viewport must be 375px (not 390px)

**What happened:** Passes #22–33 all used 390px for "mobile" screenshots (the `qa-mobile-home.png` was captured at 390×844 — confirmed by reading PNG IHDR dimensions). This caused a real bug (mobile header overflow) to be missed for many passes because at 390px "Categories" text was close to the edge but not obviously clipped, and the ThemeToggle clipping was not visually noticed.

**Why this matters:** The prompt specifies "mobile (375px)" — always use exactly 375px for mobile screenshots to match iPhone SE and detect tight-layout bugs. Do NOT use 390px.

**Action:** Always capture fresh screenshots at the exact viewports specified (375px for mobile). Do not rely on stale screenshots in the repository.

---

## "N" character at bottom-left of all pages

**What it looks like:** A tiny single letter "N" appears at the very bottom-left corner of the viewport in screenshots of every page (home, watch, category).

**Why it's NOT a bug:** After thorough code inspection of layout.tsx, Footer.tsx, Header.tsx, HomeContent.tsx, VideoRow.tsx, ScrollToTop.tsx, and all page components — no app code produces text at the bottom-left. This is most likely the **Next.js route announcer** (`aria-live` element) or a Next.js dev overlay artifact rendering at the page edge during screenshot capture. It does not appear to real users browsing the app.

**Action:** Do NOT flag this as a bug. Do NOT attempt to fix it — it has no source in app code.

---

## Mobile home page has no visible hero

**What it looks like:** In the mobile-home.png screenshot, the hero card is not visible at the very top — instead video cards appear directly below the header.

**Why it's NOT a bug:** The screenshot may be captured at a slightly scrolled position. The Hero.tsx mobile section renders correctly at `pt-20 sm:hidden` with a proper card layout. Desktop hero uses `hidden sm:block h-[70vh] min-h-[500px]` which is correct.

---

## Mobile horizontal carousel (previously 2-column grid)

**What it looks like:** On mobile, video rows show as a horizontal scroll carousel with large cards and prev/next arrow buttons — same pattern as desktop.

**Why it's NOT a bug:** VideoRow.tsx was refactored (as of 2026-03-16) to use a single horizontal scroll layout for **all viewports**. The old `sm:hidden` 2-col grid and `hidden sm:block` scroll split no longer exists. The carousel on mobile is intentional.

---

## Large black empty area at top of mobile-home-bottom.png

**What it looks like:** A large (~40% viewport height) solid black space appears at the top of the mobile-home-bottom screenshot, before the fixed header and DevOps & CI/CD section.

**Why it's NOT a bug:** This is a screenshot capture artifact. The black area is likely Sonar Summit section cards with unloaded thumbnails blending into the `#0a0a0a` background color, combined with the lazy-loading IntersectionObserver not triggering in the headless browser. Real users see proper thumbnails and content.
