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

function sortVideos(
  videos: Video[],
  sort: SortOption,
  tsMap: Map<string, number>,
  secsMap: Map<string, number>
): Video[] {
  const sorted = [...videos];
  switch (sort) {
    case "newest":   return sorted.sort((a, b) => tsMap.get(b.id)! - tsMap.get(a.id)!);
    case "oldest":   return sorted.sort((a, b) => tsMap.get(a.id)! - tsMap.get(b.id)!);
    case "shortest": return sorted.sort((a, b) => secsMap.get(a.id)! - secsMap.get(b.id)!);
    case "longest":  return sorted.sort((a, b) => secsMap.get(b.id)! - secsMap.get(a.id)!);
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

  /** Timestamps precomputed once from videos — avoids new Date() during each sort comparison. */
  const tsMap = useMemo(
    () => new Map(videos.map((v) => [v.id, new Date(v.publishedAt).getTime()])),
    [videos]
  );
  /** Duration seconds precomputed once from videos — avoids repeated string parsing during sort. */
  const secsMap = useMemo(
    () => new Map(videos.map((v) => [v.id, parseDurationToSeconds(v.duration)])),
    [videos]
  );

  const sorted = useMemo(() => sortVideos(videos, sort, tsMap, secsMap), [videos, sort, tsMap, secsMap]);

  if (videos.length === 0) {
    return null;
  }

  return (
    <div>

      {/* Sort controls */}
      <div className="mb-6 flex flex-col items-start gap-x-2 gap-y-2 sm:flex-row sm:flex-wrap sm:items-center">
        <span className="font-heading text-xs font-medium uppercase tracking-wider text-n6 shrink-0">
          Sort by
        </span>
        <div className="flex flex-nowrap rounded-lg border border-n7/50 bg-n9/40 p-0.5 gap-0.5">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSort(option.value)}
              className={`rounded-md px-3 py-1.5 font-heading text-xs font-medium transition-all duration-200 ${
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

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 xl:grid-cols-4">
        {sorted.map((video, index) => (
          <div
            key={video.id}
            className="animate-tab-in"
            style={{ animationDelay: `${Math.min(index * 0.03, 0.45)}s` }}
          >
            <VideoCard video={video} fluid hideCategory priority={index < 4} />
          </div>
        ))}
      </div>
    </div>
  );
}
