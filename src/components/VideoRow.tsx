"use client";

import { useRef } from "react";
import Link from "next/link";
import { Video } from "@/types";
import VideoCard from "./VideoCard";

interface VideoRowProps {
  title: string;
  categorySlug?: string;
  videos: Video[];
}

export default function VideoRow({ title, categorySlug, videos }: Readonly<VideoRowProps>) {
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

  return (
    <section id={categorySlug} className="relative scroll-mt-20 py-8">
      <div className="mb-4 flex items-center justify-between px-4 sm:px-6">
        <h2 className="font-heading text-lg font-semibold text-n1 sm:text-xl">
            {title}
            <span className="ml-2 inline-block align-middle rounded-full bg-n8/50 px-2 py-0.5 text-xs font-normal text-n5">{videos.length}</span>
          </h2>
        {categorySlug && (
          <Link
            href={`/category/${categorySlug}`}
            className="font-heading text-sm text-n3 transition-colors hover:text-n1"
          >
            View All
          </Link>
        )}
      </div>

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
          className="flex gap-4 overflow-x-auto scroll-smooth px-4 scrollbar-hide snap-x snap-mandatory sm:px-6"
        >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
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
