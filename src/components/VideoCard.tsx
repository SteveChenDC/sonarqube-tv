"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Video } from "@/types";
import { getProgress } from "@/lib/watchProgress";

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

export default function VideoCard({ video }: Readonly<{ video: Video }>) {
  const [progress, setProgressState] = useState(0);

  useEffect(() => {
    setProgressState(getProgress(video.id));
  }, [video.id]);

  return (
    <Link
      href={`/watch/${video.id}`}
      className="group flex-shrink-0 snap-start"
    >
      <div className="relative aspect-video w-[280px] overflow-hidden rounded-lg shadow-md shadow-transparent transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-sonar-red/25 sm:w-[320px]">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="320px"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-sonar-purple/40">
          <svg
            className="h-12 w-12 scale-75 text-n1 opacity-0 drop-shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="absolute bottom-2 right-2 rounded bg-n9/80 px-1.5 py-0.5 text-xs font-medium text-n1">
          {video.duration}
        </span>

        {progress > 0 && (
          <>
            {/* Progress percentage badge - visible on hover */}
            <span className="absolute top-2 left-2 rounded bg-n9/80 px-1.5 py-0.5 text-xs font-medium text-qube-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
      <h3 className="mt-2 line-clamp-2 w-[280px] font-heading text-sm font-medium text-n3 transition-colors group-hover:text-n1 sm:w-[320px]">
        {video.title}
      </h3>
      <p className="mt-0.5 w-[280px] text-xs text-n7 sm:w-[320px]">
        {timeAgo(video.publishedAt)}
      </p>
    </Link>
  );
}
