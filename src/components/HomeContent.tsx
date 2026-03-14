"use client";

import { useState, useMemo } from "react";
import Hero from "./Hero";
import VideoRow from "./VideoRow";
import FilterBar, {
  FilterTrigger,
  UploadDateFilter,
  DurationFilter,
  SortBy,
} from "./FilterBar";
import ScrollToTop from "./ScrollToTop";
import { Video, Category } from "@/types";

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
  featuredVideo: Video;
}

export default function HomeContent({
  categories,
  videos,
  featuredVideo,
}: Readonly<HomeContentProps>) {
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

  const getVideosByCategory = (slug: string) =>
    filteredVideos.filter((v) => v.category === slug);

  const topRowVideos = useMemo(() => {
    const MAX_TOP_ROW = 15;
    if (sortBy === "oldest") {
      return filteredVideos.slice(0, MAX_TOP_ROW);
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return filteredVideos
      .filter((v) => new Date(v.publishedAt) >= thirtyDaysAgo)
      .slice(0, MAX_TOP_ROW);
  }, [filteredVideos, sortBy]);

  const reset = () => {
    setUploadDate("anytime");
    setDuration("any");
    setSortBy("newest");
  };

  const activeFilterCount = [
    uploadDate !== "anytime",
    duration !== "any",
    sortBy !== "newest",
  ].filter(Boolean).length;

  return (
    <div>
      <Hero
        video={featuredVideo}
        actions={
          <FilterTrigger
            activeCount={activeFilterCount}
            onClick={() => setFilterOpen(true)}
          />
        }
      />

      <div className="relative z-10">
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

        {topRowVideos.length > 0 && (
          <div className="pt-10">
            <VideoRow
              title={sortBy === "oldest" ? "Oldest" : "Latest"}
              videos={topRowVideos}
            />
          </div>
        )}

        <div id="categories" className="space-y-4 pt-8 pb-16">
          {categories.map((category) => {
            const categoryVideos = getVideosByCategory(category.slug);
            if (categoryVideos.length === 0 && hasActiveFilters) return null;
            return (
              <VideoRow
                key={category.slug}
                title={category.title}
                categorySlug={category.slug}
                videos={categoryVideos}
              />
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
      <ScrollToTop />
    </div>
  );
}
