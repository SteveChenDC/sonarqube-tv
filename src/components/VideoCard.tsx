"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Video } from "@/types";
import { categories } from "@/data/videos";
import { getProgress } from "@/lib/watchProgress";

function parseDurationToMinutes(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    // H:MM:SS
    return parts[0] * 60 + parts[1] + parts[2] / 60;
  }
  // MM:SS or M:SS
  return parts[0] + (parts[1] ?? 0) / 60;
}

function getDurationBadgeClass(duration: string): string {
  const minutes = parseDurationToMinutes(duration);
  if (minutes < 4) return "bg-qube-blue/80";
  if (minutes <= 20) return "bg-black/80";
  return "bg-sonar-purple/80";
}

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years >= 1) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months >= 1) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
}

export default function VideoCard({ video, fluid = false, onRemove, hideCategory = false }: Readonly<{ video: Video; fluid?: boolean; onRemove?: () => void; hideCategory?: boolean }>) {
  const [progress, setProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const categoryTitle = categories.find((c) => c.slug === video.category)?.title;

  useEffect(() => {
    setProgress(getProgress(video.id));
  }, [video.id]);

  return (
    <Link
      href={`/watch/${video.id}`}
      className="group flex-shrink-0 snap-start rounded-lg transition-transform duration-300 hover:-translate-y-1"
    >
      <div className={`relative aspect-video overflow-hidden rounded-lg shadow-md shadow-transparent ring-1 ring-transparent transition-all duration-300 group-hover:shadow-lg group-hover:shadow-sonar-red/25 group-hover:ring-sonar-red/30 ${fluid ? "w-full" : "w-[280px] sm:w-[320px]"}`}>
        {/* Shimmer skeleton — visible until thumbnail loads */}
        <div
          className={`absolute inset-0 animate-shimmer rounded-lg transition-opacity duration-500 ${imageLoaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          aria-hidden="true"
        />
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="320px"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
          <svg
            className="h-12 w-12 scale-75 text-n1 opacity-0 drop-shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className={`absolute bottom-2 right-2 rounded px-1.5 py-0.5 text-xs font-medium text-white ${getDurationBadgeClass(video.duration)}`}>
          {video.duration}
        </span>

        {Date.now() - new Date(video.publishedAt).getTime() < 7 * 24 * 60 * 60 * 1000 && progress === 0 && (
          <span className="absolute top-2 left-2 rounded bg-sonar-red px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
            New
          </span>
        )}

        {onRemove && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -top-1 -right-1 z-10 flex h-11 w-11 items-center justify-center rounded-full text-n5 opacity-0 transition-all duration-200 hover:text-white group-hover:opacity-100"
            aria-label={`Remove ${video.title} from continue watching`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/80 transition-colors hover:bg-sonar-red">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </span>
          </button>
        )}

        {progress > 0 && (
          <>
            {/* Progress percentage badge - visible on hover */}
            <span className="absolute top-2 left-2 rounded bg-black/90 px-1.5 py-0.5 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {progress}% watched
            </span>
            {/* Progress bar - always visible */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-n8/60">
              <div
                className="h-full bg-sonar-red transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}
      </div>
      <h3 className={`mt-3 min-h-[2.75em] line-clamp-2 font-heading font-medium leading-snug text-n2 transition-colors group-hover:text-n1 ${fluid ? "text-base" : "w-[280px] text-[15px] sm:w-[320px]"}`}>
        {video.title}
      </h3>
      <div className={`mt-1.5 flex items-center gap-2 ${fluid ? "" : "w-[280px] sm:w-[320px]"}`}>
        <span className="text-xs text-n6">{timeAgo(video.publishedAt)}</span>
        {categoryTitle && !hideCategory && (
          <>
            <span className="h-1 w-1 shrink-0 rounded-full bg-n7" aria-hidden="true" />
            <span className="rounded-full border border-n7/40 bg-n8/50 px-2.5 py-0.5 font-heading text-xs font-medium text-n5 transition-colors group-hover:border-n6/50 group-hover:text-n4">
              {categoryTitle}
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
