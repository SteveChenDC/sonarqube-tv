---
name: Visual QA False Positives
description: Known non-bugs to skip or ignore during visual QA passes
type: feedback
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

## Mobile 2-column video card grid

**What it looks like:** On mobile, video rows show as a 2-column grid instead of the horizontal scroll seen on desktop.

**Why it's NOT a bug:** This is **intentional design** in VideoRow.tsx — `sm:hidden` div renders a `grid grid-cols-2 gap-3` layout, while `hidden sm:block` renders horizontal scroll. The mobile grid caps at 6 videos (`MOBILE_CAP = 6`).
