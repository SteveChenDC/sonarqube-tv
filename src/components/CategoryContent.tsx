"use client";

import { useState, useMemo } from "react";
import { Video } from "@/types";
import VideoCard from "@/components/VideoCard";

type SortOption = "newest" | "oldest" | "shortest" | "longest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "shortest", label: "Shortest" },
  { value: "longest", label: "Longest" },
];

function parseDurationToSeconds(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
}

function sortVideos(videos: Video[], sort: SortOption): Video[] {
  const sorted = [...videos];
  switch (sort) {
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      );
    case "shortest":
      return sorted.sort(
        (a, b) => parseDurationToSeconds(a.duration) - parseDurationToSeconds(b.duration)
      );
    case "longest":
      return sorted.sort(
        (a, b) => parseDurationToSeconds(b.duration) - parseDurationToSeconds(a.duration)
      );
  }
}

export default function CategoryContent({
  videos,
  description: _description,
}: Readonly<{
  videos: Video[];
  /** @deprecated Description is now rendered in the page-level header. This prop is retained for API compatibility. */
  description?: string;
}>) {
  const [sort, setSort] = useState<SortOption>("newest");

  const sorted = useMemo(() => sortVideos(videos, sort), [videos, sort]);

  if (videos.length === 0) {
    return null;
  }

  return (
    <div>

      {/* Sort controls */}
      <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-2">
        <span className="font-body text-xs font-medium uppercase tracking-wider text-n6 shrink-0">
          Sort by
        </span>
        <div className="flex flex-wrap rounded-lg border border-n7/50 bg-n9/40 p-0.5 gap-0.5">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSort(option.value)}
              className={`rounded-md px-4 py-2.5 font-heading text-sm font-medium transition-all duration-150 sm:px-3 sm:py-1.5 sm:text-xs ${
                sort === option.value
                  ? "bg-sonar-red text-white shadow-sm"
                  : "text-n5 hover:bg-n8/60 hover:text-n2"
              }`}
              aria-pressed={sort === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 xl:grid-cols-4">
        {sorted.map((video) => (
          <VideoCard key={video.id} video={video} fluid hideCategory />
        ))}
      </div>
    </div>
  );
}
