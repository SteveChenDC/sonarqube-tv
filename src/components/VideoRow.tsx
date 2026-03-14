"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Video } from "@/types";
import VideoCard from "./VideoCard";

interface SectionLabels {
  firstLabel: string;
  firstCount: number;
  secondLabel: string;
  secondCount: number;
  splitAt: number;
}

interface VideoRowProps {
  title: string;
  categorySlug?: string;
  videos: Video[];
  hideHeader?: boolean;
  dividerAfterIndex?: number;
  sectionLabels?: SectionLabels;
  onRemoveVideo?: (videoId: string) => void;
}

export default function VideoRow({ title, categorySlug, videos, hideHeader, dividerAfterIndex, sectionLabels, onRemoveVideo }: Readonly<VideoRowProps>) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (videos.length === 0) return null;

  function renderLabel(label: string, count: number) {
    return (
      <h2 className="font-heading text-lg font-semibold text-n1 whitespace-nowrap sm:text-xl">
        {label}
        <span className="ml-2 inline-block align-middle rounded-full bg-n8/50 px-2 py-0.5 text-xs font-normal text-n5">
          {count}
        </span>
      </h2>
    );
  }

  return (
    <section id={categorySlug} className="relative scroll-mt-20 py-8">
      {!hideHeader && (
        <div className="mb-4 flex items-center justify-between px-4 sm:px-6">
          <h2 className="font-heading text-lg font-semibold text-n1 sm:text-xl">
            {title}
            <span className="ml-2 inline-block align-middle rounded-full bg-n8/50 px-2 py-0.5 text-xs font-normal text-n5">{videos.length}</span>
          </h2>
          {categorySlug && (
            <Link
              href={`/category/${categorySlug}`}
              className="group/link inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-heading text-sm font-medium text-qube-blue transition-all hover:bg-qube-blue/10 hover:text-qube-blue/80"
            >
              See All
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      )}

      <div className="group/row relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 z-10 flex h-full w-12 items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 transition-opacity duration-300 group-hover/row:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
          aria-label="Scroll left"
        >
          <svg className="h-6 w-6 text-n1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-6 scrollbar-hide snap-x snap-mandatory sm:px-8 lg:px-10"
        >
          {sectionLabels ? (
            <>
              {/* First section: label + cards */}
              <div className="flex shrink-0 flex-col gap-3">
                {renderLabel(sectionLabels.firstLabel, sectionLabels.firstCount)}
                <div className="flex gap-4">
                  {videos.slice(0, sectionLabels.splitAt).map((video) => (
                    <VideoCard key={video.id} video={video} onRemove={onRemoveVideo ? () => onRemoveVideo(video.id) : undefined} />
                  ))}
                </div>
              </div>

              {/* Vertical divider spanning full height */}
              <div className="flex shrink-0 items-stretch px-1">
                <div className="w-px bg-n7/50" />
              </div>

              {/* Second section: label + cards */}
              <div className="flex shrink-0 flex-col gap-3">
                {renderLabel(sectionLabels.secondLabel, sectionLabels.secondCount)}
                <div className="flex gap-4">
                  {videos.slice(sectionLabels.splitAt).map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            videos.map((video) => (
              <VideoCard key={video.id} video={video} onRemove={onRemoveVideo ? () => onRemoveVideo(video.id) : undefined} />
            ))
          )}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 z-10 flex h-full w-12 items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 transition-opacity duration-300 group-hover/row:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
          aria-label="Scroll right"
        >
          <svg className="h-6 w-6 text-n1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
