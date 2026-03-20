"use client";

import { useState, useMemo, useCallback, useEffect, useRef, useReducer, useSyncExternalStore } from "react";
import Hero from "./Hero";
import VideoRow from "./VideoRow";
import { getAllProgress, removeProgress } from "@/lib/watchProgress";
import dynamic from "next/dynamic";
import { FilterTrigger, SlidersIcon } from "./FilterTrigger";
import type { UploadDateFilter, DurationFilter, SortBy } from "./FilterBar";
import ScrollToTop from "./ScrollToTop";

const FilterBar = dynamic(() => import("./FilterBar"), { ssr: false });

// CourseCard pulls in @/lib/courseProgress (~96 lines of localStorage logic) eagerly.
// Dynamically importing it defers that code out of the initial HomeContent bundle;
// the skeleton prevents CLS while the tiny chunk fetches.
function CourseCardSkeleton() {
  return (
    <div className="flex w-[300px] shrink-0 flex-col overflow-hidden rounded-xl border border-n8 bg-n9/60 sm:w-[320px]">
      <div className="h-36 animate-pulse bg-n8" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-16 animate-pulse rounded-full bg-n8" />
        <div className="h-4 w-40 animate-pulse rounded bg-n8" />
        <div className="h-3 w-28 animate-pulse rounded bg-n8" />
        <div className="mt-auto h-8 w-full animate-pulse rounded-lg bg-n8" />
      </div>
    </div>
  );
}
const CourseCard = dynamic(() => import("./CourseCard"), {
  loading: () => <CourseCardSkeleton />,
});

import { Video, Category } from "@/types";
// Import from courses-data (no videos.ts dependency) rather than courses.ts,
// so the 228-video array (~86 KB) stays out of the initial HomeContent bundle.
import { courses } from "@/data/courses-data";

// Inlined from @/data/videos — avoids importing the full 228-video module
// (101 KB) into the initial client bundle just for these 12 IDs.
const featuredYoutubeIds = [
  "F1F_CVD33WI", // Seven habits of highly effective AI coding (Erin Kouri)
  "el9OKGrqU6o", // Refactoring with Cognitive Complexity (Ann Campbell)
  "g6BqDORtdkE", // Fireside chat with DATEV (two people)
  "ACZqTrM5Frs", // Interview - Product Manager
  "2jYXRu9dOJM", // Interview - Software Engineer
  "i95lJmsWEHc", // Interview - Python Developer
  "D-ycv935v64", // Live with ISMG
  "cPxwIpV6VBI", // SecurityGuy TV (three people)
  "doEikRO9GF8", // MISRA C++ 2023 (Phil Nash & Andreas Weis)
  "4Ya5K95pmKQ", // MS Build 2024 (Manish Kapur)
  "kfu0M0G591s", // Linux Foundation (two people)
  "vGfM3FInXTQ", // Supercharge your developers (three people)
];
import { useIsSearching } from "./SearchContext";

function parseDurationMinutes(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
  if (parts.length === 2) return parts[0] + parts[1] / 60;
  return 0;
}

function isWithinDateRange(timestampMs: number, filter: UploadDateFilter, nowMs: number): boolean {
  if (filter === "anytime") return true;
  const diffDays = (nowMs - timestampMs) / (1000 * 60 * 60 * 24);
  switch (filter) {
    case "today":
      return diffDays < 1;
    case "this-week":
      return diffDays < 7;
    case "this-month":
      return diffDays < 30;
    case "this-year":
      return diffDays < 365;
    default:
      return true;
  }
}

function matchesDuration(duration: string, filter: DurationFilter): boolean {
  if (filter === "any") return true;
  const mins = parseDurationMinutes(duration);
  switch (filter) {
    case "short":
      return mins < 4;
    case "medium":
      return mins >= 4 && mins <= 20;
    case "long":
      return mins > 20;
    default:
      return true;
  }
}

interface HomeContentProps {
  categories: Category[];
  videos: Video[];
}

export default function HomeContent({
  categories,
  videos,
}: Readonly<HomeContentProps>) {
  const [featuredVideo, setFeaturedVideo] = useState<Video>(
    () => videos.find((v) => v.youtubeId === featuredYoutubeIds[0]) ?? videos[0]
  );
  useEffect(() => {
    const ytId = featuredYoutubeIds[Math.floor(Math.random() * featuredYoutubeIds.length)];
    const picked = videos.find((v) => v.youtubeId === ytId);
    if (picked) setFeaturedVideo(picked);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [uploadDate, setUploadDate] = useState<UploadDateFilter>("anytime");
  const [duration, setDuration] = useState<DurationFilter>("any");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  // Subscribe only to the isSearching boolean, not the raw query string.
  // This prevents HomeContent (and its 11 VideoRows) from re-rendering on
  // every keystroke — it only re-renders when the user starts/stops searching.
  const isSearching = useIsSearching();

  const hasActiveFilters =
    uploadDate !== "anytime" || duration !== "any" || sortBy !== "newest";

  /** Timestamps precomputed once from the static videos array.
   *  Avoids creating ~228 Date objects per filter interaction and
   *  ~3,648 Date objects per sort comparison (O(n log n) calls). */
  const publishedAtMs = useMemo(
    () => new Map(videos.map((v) => [v.id, new Date(v.publishedAt).getTime()])),
    [videos]
  );

  const filteredVideos = useMemo(() => {
    const nowMs = Date.now();
    const result = videos.filter(
      (v) =>
        isWithinDateRange(publishedAtMs.get(v.id)!, uploadDate, nowMs) &&
        matchesDuration(v.duration, duration)
    );
    result.sort((a, b) => {
      const tsA = publishedAtMs.get(a.id)!;
      const tsB = publishedAtMs.get(b.id)!;
      return sortBy === "newest" ? tsB - tsA : tsA - tsB;
    });
    return result;
  }, [videos, uploadDate, duration, sortBy, publishedAtMs]);

  const MAX_CATEGORY_ROW = 15;

  /** Stable map of category slug → { sliced videos for the row, total count }. */
  const videosByCategory = useMemo(() => {
    const map = new Map<string, { videos: Video[]; total: number }>();
    for (const category of categories) {
      const all = filteredVideos.filter((v) => v.category === category.slug);
      map.set(category.slug, { videos: all.slice(0, MAX_CATEGORY_ROW), total: all.length });
    }
    return map;
  }, [categories, filteredVideos]);

  const { topRowVideos, topRowTotalCount } = useMemo(() => {
    const MAX_TOP_ROW = 15;
    if (sortBy === "oldest") {
      return { topRowVideos: filteredVideos.slice(0, MAX_TOP_ROW), topRowTotalCount: filteredVideos.length };
    }
    const thirtyDaysAgoMs = Date.now() - 30 * 24 * 60 * 60 * 1000;
    // Strict `>` matches the semantic: "published within the last 30 days"
    // (a video at exactly 30 days old is NOT within the last 30 days).
    const recentVideos = filteredVideos.filter((v) => (publishedAtMs.get(v.id) ?? 0) > thirtyDaysAgoMs);
    return { topRowVideos: recentVideos.slice(0, MAX_TOP_ROW), topRowTotalCount: recentVideos.length };
  }, [filteredVideos, sortBy, publishedAtMs]);

  const reset = useCallback(() => {
    setUploadDate("anytime");
    setDuration("any");
    setSortBy("newest");
  }, []);

  // useSyncExternalStore reads localStorage synchronously during hydration (before
  // first browser paint), eliminating the useEffect double-render and the CLS flash
  // that occurred for users who had previously hidden the courses row.
  // getServerSnapshot returns false (safe SSR fallback — localStorage unavailable).
  const coursesRowHidden = useSyncExternalStore(
    () => () => {}, // no-op subscribe — no external events to listen for
    () => { try { return localStorage.getItem("sonarqube-tv-hide-courses") === "1"; } catch { return false; } },
    () => false, // server snapshot
  );
  // Force-update trigger: useSyncExternalStore has a no-op subscribe, so it only
  // re-evaluates its snapshot during renders. After writing to localStorage (hide
  // button click), we call forceHideUpdate() to schedule a render, during which
  // the snapshot re-reads localStorage and returns true.
  const [, forceHideUpdate] = useReducer((n: number) => n + 1, 0);

  const [continueWatchingVideos, setContinueWatchingVideos] = useState<Video[]>([]);

  useEffect(() => {
    const progress = getAllProgress();
    const inProgress = videos
      .filter((v) => {
        const p = progress[v.id];
        return p !== undefined && p > 0 && p < 100;
      })
      .sort((a, b) => (progress[b.id] ?? 0) - (progress[a.id] ?? 0));
    setContinueWatchingVideos(inProgress);
  }, [videos]);

  /** Stable callback for removing a video from the Continue Watching row. */
  const handleRemoveVideo = useCallback((videoId: string) => {
    removeProgress(videoId);
    setContinueWatchingVideos((prev) => prev.filter((v) => v.id !== videoId));
  }, []);

  /** Stable merged videos list for the top row (Continue Watching + Latest/Oldest). */
  const topRowMergedVideos = useMemo(() => {
    if (continueWatchingVideos.length > 0 && topRowVideos.length > 0) {
      return [...continueWatchingVideos, ...topRowVideos.filter((v) => !continueWatchingVideos.some((cw) => cw.id === v.id))];
    }
    if (continueWatchingVideos.length > 0) return continueWatchingVideos;
    return topRowVideos;
  }, [continueWatchingVideos, topRowVideos]);

  /** Stable sectionLabels object — only defined when both sections are non-empty. */
  const topRowSectionLabels = useMemo(() => {
    if (continueWatchingVideos.length > 0 && topRowVideos.length > 0) {
      return {
        firstLabel: "Continue Watching",
        firstCount: continueWatchingVideos.length,
        secondLabel: sortBy === "oldest" ? "Oldest" : "Latest",
        secondCount: topRowTotalCount,
        splitAt: continueWatchingVideos.length,
      };
    }
    return undefined;
  }, [continueWatchingVideos, topRowVideos, sortBy, topRowTotalCount]);

  const activeFilterCount = [
    uploadDate !== "anytime",
    duration !== "any",
    sortBy !== "newest",
  ].filter(Boolean).length;

  // Track when hero is scrolled out of view to show floating filter button
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroOutOfView, setHeroOutOfView] = useState(false);
  // Track when footer is in view to hide floating buttons
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroOutOfView(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div ref={heroRef}>
        <Hero
          video={featuredVideo}
          actions={
            <FilterTrigger
              activeCount={activeFilterCount}
              onClick={() => setFilterOpen(true)}
            />
          }
        />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <FilterBar
          uploadDate={uploadDate}
          duration={duration}
          sortBy={sortBy}
          onUploadDateChange={setUploadDate}
          onDurationChange={setDuration}
          onSortByChange={setSortBy}
          onReset={reset}
          hasActiveFilters={hasActiveFilters}
          isOpen={filterOpen}
          onOpenChange={setFilterOpen}
        />

        {(continueWatchingVideos.length > 0 || topRowVideos.length > 0) && (
          <div className="relative pt-10">
            {/* Section divider between hero and content */}
            <div className="absolute top-0 left-0 right-0 flex flex-col items-center">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-n6/40 to-transparent" />
              <div className="h-px w-3/4 bg-gradient-to-r from-transparent via-qube-blue/20 to-transparent" />
            </div>
            <VideoRow
              title={
                continueWatchingVideos.length > 0
                  ? "Continue Watching"
                  : sortBy === "oldest"
                    ? "Oldest"
                    : "Latest"
              }
              videos={topRowMergedVideos}
              hideHeader={continueWatchingVideos.length > 0 && topRowVideos.length > 0}
              dividerAfterIndex={
                continueWatchingVideos.length > 0 && topRowVideos.length > 0
                  ? continueWatchingVideos.length
                  : undefined
              }
              sectionLabels={topRowSectionLabels}
              totalCount={continueWatchingVideos.length === 0 ? topRowTotalCount : undefined}
              onRemoveVideo={continueWatchingVideos.length > 0 ? handleRemoveVideo : undefined}
            />
          </div>
        )}

        {/* Certification Courses row */}
        {!isSearching && !coursesRowHidden && (
          <div className="relative pt-8">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-n8/50 to-transparent" />
            <div className="mb-4 flex items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="inline-block h-5 w-1 shrink-0 rounded-full bg-sonar-red" aria-hidden="true" />
                <h2 className="font-heading text-lg font-semibold text-n1 sm:text-xl">
                  Certification Courses
                  <span className="ml-2 inline-block align-middle rounded-full bg-n8/50 px-2 py-0.5 text-xs font-normal text-n5">
                    {courses.length}
                  </span>
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/courses"
                  className="group/link inline-flex items-center gap-1 font-heading text-xs font-medium text-qube-blue transition-colors hover:text-qube-blue/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qube-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                >
                  View all
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <button
                  onClick={() => {
                    try { localStorage.setItem("sonarqube-tv-hide-courses", "1"); } catch { /* noop */ }
                    forceHideUpdate(); // triggers re-render → snapshot re-reads localStorage → true
                  }}
                  aria-label="Hide certification courses row"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-n6 transition-colors hover:bg-n8 hover:text-n3"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto px-4 pb-4 sm:px-6 scrollbar-hide">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}

        <div id="categories" className={`pt-8 pb-16${isSearching ? " hidden" : ""}`}>
              {categories.map((category) => {
                const entry = videosByCategory.get(category.slug);
                const categoryVideos = entry?.videos ?? [];
                const categoryTotal = entry?.total ?? 0;
                if (categoryTotal === 0 && hasActiveFilters) return null;
                return (
                  <div key={category.slug} className="relative pt-6">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-n8/50 to-transparent" />
                    <VideoRow
                      title={category.title}
                      categorySlug={category.slug}
                      videos={categoryVideos}
                      totalCount={categoryTotal}
                    />
                  </div>
                );
              })}

              {hasActiveFilters && filteredVideos.length === 0 && (
                <div className="px-4 py-20 text-center sm:px-6 animate-fade-in">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-n7/40 bg-gradient-to-br from-n8/70 to-n9/90 shadow-inner ring-2 ring-n7/20">
                    <svg className="h-10 w-10 text-n5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                  </div>
                  <p className="font-heading text-xl font-semibold text-n2">
                    No videos match your filters
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-n5">
                    Try adjusting or removing some filters to find what you&rsquo;re looking for.
                  </p>
                  <button
                    onClick={reset}
                    className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-qube-blue/40 bg-qube-blue/10 px-5 py-2.5 font-heading text-sm font-medium text-qube-blue transition-colors hover:border-qube-blue/70 hover:bg-qube-blue/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear all filters
                  </button>
                </div>
              )}
        </div>
      </div>
      {/* Floating filter button — appears when hero's inline trigger scrolls out of view */}
      <button
        onClick={() => setFilterOpen(true)}
        aria-label="Open filters"
        className={`fixed bottom-6 right-20 z-40 flex h-11 items-center gap-2 rounded-full border border-qube-blue bg-qube-blue px-4 text-white shadow-lg shadow-qube-blue/30 backdrop-blur-md transition-all duration-300 hover:bg-qube-blue/85 hover:shadow-xl hover:shadow-qube-blue/40 focus-visible:ring-2 focus-visible:ring-qube-blue focus-visible:outline-none ${
          heroOutOfView && !footerInView
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <SlidersIcon />
        <span className="font-heading text-xs font-semibold">Filters</span>
        {activeFilterCount > 0 && (
          <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-qube-blue">
            {activeFilterCount}
          </span>
        )}
      </button>
      <ScrollToTop hidden={footerInView} />
    </div>
  );
}
