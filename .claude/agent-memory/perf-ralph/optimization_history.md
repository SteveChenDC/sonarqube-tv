---
name: optimization_history
description: History of all perf optimizations done and what to tackle next
type: project
---

## Already Done (do NOT duplicate)

### 2026-03-16 — React.memo + stable props to eliminate scroll-driven re-renders
- **Commit**: `perf: memo VideoCard/VideoRow and stabilize HomeContent props to eliminate redundant re-renders`
- **What**: Wrapped `VideoCard` and `VideoRow` with `React.memo`. In `HomeContent`, replaced inline `getVideosByCategory()` (new array each render) with a `useMemo` Map; memoized the merged top-row videos array, `sectionLabels` object, `handleRemoveVideo` callback, and `reset` callback.
- **Impact**: The 11 category VideoRows and their 150+ VideoCard children no longer re-render when `HomeContent` state changes from IntersectionObserver scroll events (`heroOutOfView`, `footerInView`). Eliminates ~165 unnecessary React reconciliation cycles per scroll event.

### 2026-03-16 — Dynamic import ArticleTabs + PlaylistQueue on watch page
- **Commit**: `perf: dynamic import ArticleTabs and PlaylistQueue on watch page`
- **What**: Converted static imports of `ArticleTabs` and `PlaylistQueue` in `watch/[id]/page.tsx` to `next/dynamic()` calls
- **Deferred JS**: ArticleTabs (~270 lines) + TranscriptView (~228 lines) + extractChapters (~130 lines) + PlaylistQueue (~179 lines) = ~807 lines of client logic split into lazy-loaded chunks
- **Impact**: Reduces initial JS parsed on every watch page load; chunks only fetched when component is needed by the browser

### 2026-03-16 — Thumbnail quality downsize (hqdefault for cards)
- **Commit**: `perf: use hqdefault thumbnails for video cards, maxresdefault for hero/OG`
- **What**: `ytThumbnail()` in `videos.ts` changed from `maxresdefault.jpg` (1280×720, ~150 KB) to `hqdefault.jpg` (480×360, ~25 KB)
- **Hero preserved**: `Hero.tsx` now constructs `maxresdefault.jpg` directly from `video.youtubeId` for LCP quality
- **OG preserved**: watch page `generateMetadata` and JSON-LD use `maxresdefault` for social cards
- **Impact**: ~80% per-thumbnail reduction; ~15–20 MB saved for full home page scroll

### Pre-existing optimizations (already in codebase when perf-ralph first ran)
- `VideoPlayer` lazy-loads YouTube iframe — thumbnail + play button shown until click
- `FilterBar` dynamically imported with `dynamic(() => import("./FilterBar"), { ssr: false })`
- `VideoRow` lazy-reveals content via IntersectionObserver (400px rootMargin) with skeleton
- `next/font/google` used for Poppins + Inter with `subsets: ["latin"]`
- Hero image has `priority` + `fetchPriority="high"` for LCP
- `images: { unoptimized: true }` in next.config.ts (static export — server-side optimization not available)

## Potential Next Opportunities

1. **`CourseCard` double-render** — uses `useState(false)` + `useEffect(() => setMounted(true))` pattern to gate localStorage reads. This causes every CourseCard to render twice (once with no progress, once with actual progress). The pattern is *necessary* to avoid hydration mismatches — localStorage isn't available at SSR/build time. The only way to eliminate it would be cookies (available during SSR). Low priority.
2. **`VideoCard` double-render** — same `useState(0)` + `useEffect` pattern for watch progress. Same caveat as above. Low priority since progress bar appears after hydration.
3. **`CourseCard` React.memo** — `CourseCard` is not memoized. The Certification Courses row in `HomeContent` renders 5 CourseCards that could be memoized to avoid re-renders during filter state changes. However, since the courses row is hidden when `isSearching` is true and the CourseCard has no expensive deps (static course data + localStorage), the ROI is low.
4. **`VideoCard` `sizes` attribute** — currently `sizes="320px"` for all cards. Since `images: { unoptimized: true }` is set for the static export, Next.js's image optimization server is not running — the `sizes` attribute only affects the browser's preload scanner. Minor.
5. **Debounce search input** — the `SearchContext` does not debounce; if search filtering is expensive, debouncing at 150ms could help. Current search is over static in-memory data so likely fast enough.
