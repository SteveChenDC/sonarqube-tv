---
name: Completed design fixes
description: Tracks which issues from the Ralph task list have been implemented to avoid duplicate work
type: project
---

All of the following issues have been implemented as of 2026-03-16:

**HOME PAGE:**
- #1 Search/filter — done (SearchContext + HomeContent query filtering)
- #2 Loading skeletons — done (shimmer in VideoCard, RowSkeleton in VideoRow)
- #3 Keyboard navigation — done (arrow keys in VideoRow handleKeyDown)
- #4 Duration color coding — done (getDurationBadgeClass: blue=short, black=medium, purple=long)

**WATCH PAGE:**
- #5 Related videos — done (getRelatedVideosFromOtherCategories + VideoRow in watch page)
- #6 Share button — done (ShareButton.tsx)
- #7 Keyboard shortcuts overlay — done (VideoPlayer: space/k=play, ←/j=rewind, →/l=forward, ?=overlay)
- #8 Chapter navigation — done (TranscriptView: clickable chapter headers with sticky headers + play icon)

**CATEGORY PAGE:**
- #9 Sort controls — done (CategoryContent: newest/oldest/shortest/longest)
- #10 Category header improvements — done (video count badge + total duration badge)

**GLOBAL:**
- #11 Custom 404 page — done (mentioned in git log "73aa433")
- #13 Light mode Hero gradient fix — done (2026-03-16): hero uses `from-black/90` instead of `from-background` so gradient is always cinematic dark; h1/desc use `text-white` unconditionally
- #14 Lazy loading — done (IntersectionObserver in VideoRow with 400px rootMargin)

**Pre-existing test fix:**
- VideoRow keyboard nav test was failing due to jsdom not implementing `scrollIntoView`. Fixed by adding `window.HTMLElement.prototype.scrollIntoView = () => {}` to `src/__tests__/setup.tsx`.

**Why:** To help future Ralphs avoid re-picking already-done items.
**How to apply:** Check this list before picking an issue — pick only items NOT listed here.

**GLOBAL (continued):**
- #12 Accessibility audit — done (2026-03-16): aria-label on VideoRow sections, aria-hidden on decorative SVGs, role=progressbar + aria-valuenow/min/max on VideoCard progress bar, aria-expanded + aria-haspopup + aria-controls on Header Categories button, id + role=region on dropdown panel

**REMAINING (not yet done as of 2026-03-16):**
- #15 Swipe gesture hints for mobile
- #16 Mobile watch page optimization
- #17 Mobile category page at 375px
