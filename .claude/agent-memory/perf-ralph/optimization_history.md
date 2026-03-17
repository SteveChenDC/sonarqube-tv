---
name: optimization_history
description: History of all perf optimizations done and what to tackle next
type: project
---

## Already Done (do NOT duplicate)

### 2026-03-17 — Dynamic import CourseIndexCards, CourseTimeline, CourseSidebar
- **Commit**: `perf: dynamic import CourseIndexCards, CourseTimeline, CourseSidebar`
- **What**: Dynamically imported `CourseIndexCards` (225 lines) in `courses/page.tsx`, and `CourseTimeline` (256 lines) + `CourseSidebar` (141 lines) in `courses/[slug]/page.tsx`. Each has a skeleton loading fallback.
- **Impact**: ~622 lines of client JS split into deferred chunks. Hero/header content on both courses pages becomes interactive immediately while interactive sections load separately.

### 2026-03-17 — Dynamic import CourseNavBar and NowPlayingBar on watch page
- **Commit**: `perf: dynamic import CourseNavBar and NowPlayingBar on watch page`
- **What**: Converted static imports of `CourseNavBar` and `NowPlayingBar` in `watch/[id]/page.tsx` to `next/dynamic()` calls. `CourseNavBar` (162 lines) only renders when `?course=` is in the URL; `NowPlayingBar` (63 lines) is mobile-only and only visible after scroll.
- **Note**: `ssr: false` cannot be used in Server Components with `next/dynamic` — omit it there; it only works inside Client Components.
- **Impact**: ~225 lines of client logic split into deferred chunks, reducing initial JS on all 228 statically generated watch pages.

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

### 2026-03-17 — Split SearchContext to eliminate HomeContent re-renders on keystrokes
- **Commit**: `perf: split SearchContext so HomeContent only re-renders on search toggle`
- **What**: Refactored `SearchContext` into two separate React contexts: `SearchQueryContext` (raw string + mutators, consumed by `Header`) and `SearchIsSearchingContext` (boolean, consumed by `HomeContent`). Added new `useIsSearching()` hook. Updated `HomeContent` to call `useIsSearching()` instead of `useSearch()`.
- **Impact**: `HomeContent` (11 VideoRows + CourseCard children) previously re-rendered on every keystroke during search. Now it only re-renders when the user starts or stops searching — eliminating N−2 reconciliation cycles per session where N = characters typed.

### 2026-03-17 — Dynamic import CourseCard in HomeContent
- **Commit**: `perf: dynamic import CourseCard to defer courseProgress from initial bundle`
- **What**: Replaced static `CourseCard` import in `HomeContent.tsx` with `next/dynamic`. Added `CourseCardSkeleton` (skeleton matching card dimensions) as the loading fallback to prevent CLS.
- **Impact**: Deferred ~183 lines of CourseCard + ~96 lines of `@/lib/courseProgress` (localStorage logic) out of the initial HomeContent bundle into a lazy-loaded chunk. CourseCards are below the hero + first VideoRow — not on the critical render path.

## Potential Next Opportunities

1. **`CourseCard` double-render** — uses `useState(false)` + `useEffect(() => setMounted(true))` pattern to gate localStorage reads. This causes every CourseCard to render twice. The pattern is necessary to avoid hydration mismatches — localStorage isn't available at SSR/build time. The only way to eliminate it would be cookies (available during SSR). Low priority.
2. **`VideoCard` double-render** — same `useState(0)` + `useEffect` pattern for watch progress. Same caveat as above. Low priority since progress bar appears after hydration.
3. **Debounce search input** — the `SearchContext` does not debounce; if search filtering is expensive, debouncing at 150ms could help. Current search is over static in-memory data so likely fast enough. Low priority.
4. **Header bundles full `videos` array** — `Header.tsx` imports `{ categories, videos }` for search. All 228 video objects are bundled client-side. A lean search-index file with only (id, title, description, category, thumbnail, duration) would reduce bundle size. Complex refactor but meaningful for clients with slow connections.
5. **CategoryContent as server component** — The sort UI requires client state. If sort was moved to URL params (searchParams), CategoryContent could become a server component. Significant architecture change.
6. **Pre-existing test failures** — `ArticleTabs.test.tsx`, `HomeContent.test.tsx`, `FilterBar.test.tsx`, `WatchPage.test.tsx` have ~31 pre-existing failing tests (not caused by perf-ralph). Do NOT count these as regressions from optimizations.
