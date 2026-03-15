"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Hero from "./Hero";
import VideoRow from "./VideoRow";
import { getAllProgress, removeProgress } from "@/lib/watchProgress";
import FilterBar, {
  FilterTrigger,
  UploadDateFilter,
  DurationFilter,
  SortBy,
} from "./FilterBar";
import ScrollToTop from "./ScrollToTop";
import { Video, Category } from "@/types";
import { featuredYoutubeIds } from "@/data/videos";

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

        <div id="categories" className="pt-8 pb-16">
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
            <div className="px-4 py-16 text-center sm:px-6">
              <p className="font-heading text-lg text-n4">
                No videos match your filters.
              </p>
              <button
                onClick={reset}
                className="mt-3 font-heading text-sm text-qube-blue hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2 rounded"
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
        className={`fixed bottom-6 right-18 z-40 flex h-10 items-center gap-2 rounded-full border border-qube-blue bg-qube-blue px-4 text-white shadow-lg shadow-qube-blue/30 backdrop-blur-md transition-all duration-300 hover:bg-qube-blue/85 hover:shadow-xl hover:shadow-qube-blue/40 focus-visible:ring-2 focus-visible:ring-qube-blue focus-visible:outline-none ${
          heroOutOfView && !footerInView
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
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
