"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Hero from "./Hero";
import VideoRow from "./VideoRow";
import { getAllProgress, removeProgress } from "@/lib/watchProgress";
import dynamic from "next/dynamic";
import { FilterTrigger, SlidersIcon } from "./FilterTrigger";
import type { UploadDateFilter, DurationFilter, SortBy } from "./FilterBar";
import ScrollToTop from "./ScrollToTop";

const FilterBar = dynamic(() => import("./FilterBar"), { ssr: false });
import { Video, Category } from "@/types";
import { featuredYoutubeIds } from "@/data/videos";
import { courses } from "@/data/courses";
import { useSearch } from "./SearchContext";
import CourseCard from "./CourseCard";

function parseDurationMinutes(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
  if (parts.length === 2) return parts[0] + parts[1] / 60;
  return 0;
}

function isWithinDateRange(dateStr: string, filter: UploadDateFilter): boolean {
  if (filter === "anytime") return true;
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
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
  const { query: searchQuery } = useSearch();
  const isSearching = searchQuery.trim().length > 0;

  const hasActiveFilters =
    uploadDate !== "anytime" || duration !== "any" || sortBy !== "newest";

  const filteredVideos = useMemo(() => {
    const result = videos.filter(
      (v) =>
        isWithinDateRange(v.publishedAt, uploadDate) &&
        matchesDuration(v.duration, duration)
    );
    result.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [videos, uploadDate, duration, sortBy]);

  const MAX_CATEGORY_ROW = 15;
  const getVideosByCategory = (slug: string) =>
    filteredVideos.filter((v) => v.category === slug);

  const { topRowVideos, topRowTotalCount } = useMemo(() => {
    const MAX_TOP_ROW = 15;
    if (sortBy === "oldest") {
      return { topRowVideos: filteredVideos.slice(0, MAX_TOP_ROW), topRowTotalCount: filteredVideos.length };
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentVideos = filteredVideos.filter((v) => new Date(v.publishedAt) >= thirtyDaysAgo);
    return { topRowVideos: recentVideos.slice(0, MAX_TOP_ROW), topRowTotalCount: recentVideos.length };
  }, [filteredVideos, sortBy]);

  const reset = () => {
    setUploadDate("anytime");
    setDuration("any");
    setSortBy("newest");
  };

  const [coursesRowHidden, setCoursesRowHidden] = useState(() => {
    if (globalThis.window === undefined) return false;
    try { return localStorage.getItem("sonarqube-tv-hide-courses") === "1"; } catch { return false; }
  });

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
              title={(() => {
                if (continueWatchingVideos.length > 0) return "Continue Watching";
                if (sortBy === "oldest") return "Oldest";
                return "Latest";
              })()}
              videos={(() => {
                if (continueWatchingVideos.length > 0 && topRowVideos.length > 0) {
                  return [...continueWatchingVideos, ...topRowVideos.filter(v => !continueWatchingVideos.some(cw => cw.id === v.id))];
                }
                if (continueWatchingVideos.length > 0) return continueWatchingVideos;
                return topRowVideos;
              })()}
              hideHeader={continueWatchingVideos.length > 0 && topRowVideos.length > 0}
              dividerAfterIndex={
                continueWatchingVideos.length > 0 && topRowVideos.length > 0
                  ? continueWatchingVideos.length
                  : undefined
              }
              sectionLabels={
                continueWatchingVideos.length > 0 && topRowVideos.length > 0
                  ? {
                      firstLabel: "Continue Watching",
                      firstCount: continueWatchingVideos.length,
                      secondLabel: sortBy === "oldest" ? "Oldest" : "Latest",
                      secondCount: topRowTotalCount,
                      splitAt: continueWatchingVideos.length,
                    }
                  : undefined
              }
              totalCount={continueWatchingVideos.length === 0 ? topRowTotalCount : undefined}
              onRemoveVideo={continueWatchingVideos.length > 0 ? (videoId) => {
                removeProgress(videoId);
                setContinueWatchingVideos((prev) => prev.filter((v) => v.id !== videoId));
              } : undefined}
            />
          </div>
        )}

        {/* Certification Courses row */}
        {!isSearching && !coursesRowHidden && (
          <div className="relative pt-8">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-n8/50 to-transparent" />
            <div className="mb-4 flex items-center justify-between px-4 sm:px-6 lg:px-8">
              <h2 className="font-heading text-lg font-bold text-n1 sm:text-xl">
                Certification Courses
              </h2>
              <div className="flex items-center gap-3">
                <a
                  href="/courses"
                  className="font-heading text-xs font-medium text-qube-blue transition-colors hover:text-qube-blue/80"
                >
                  View all
                </a>
                <button
                  onClick={() => {
                    setCoursesRowHidden(true);
                    try { localStorage.setItem("sonarqube-tv-hide-courses", "1"); } catch { /* noop */ }
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
            <div className="flex gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8 scrollbar-hide">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}

        <div id="categories" className={`pt-8 pb-16${isSearching ? " hidden" : ""}`}>
              {categories.map((category) => {
                const categoryVideos = getVideosByCategory(category.slug);
                if (categoryVideos.length === 0 && hasActiveFilters) return null;
                return (
                  <div key={category.slug} className="relative pt-6">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-n8/50 to-transparent" />
                    <VideoRow
                      title={category.title}
                      categorySlug={category.slug}
                      videos={categoryVideos.slice(0, MAX_CATEGORY_ROW)}
                      totalCount={categoryVideos.length}
                    />
                  </div>
                );
              })}

              {hasActiveFilters && filteredVideos.length === 0 && (
                <div className="px-4 py-20 text-center sm:px-6">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-n7/40 bg-n8/60">
                    <svg className="h-8 w-8 text-n6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                  </div>
                  <p className="font-heading text-xl font-semibold text-n2">
                    No videos match your filters
                  </p>
                  <p className="mt-2 text-sm text-n5">
                    Try adjusting or removing some filters to find what you&rsquo;re looking for.
                  </p>
                  <button
                    onClick={reset}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-qube-blue/40 bg-qube-blue/10 px-4 py-2 font-heading text-sm font-medium text-qube-blue transition-colors hover:border-qube-blue/70 hover:bg-qube-blue/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2"
                  >
                    Reset filters
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
