"use client";

import { useRef } from "react";
import Link from "next/link";
import { Video } from "@/types";
import VideoCard from "./VideoCard";

interface VideoRowProps {
  title: string;
  categorySlug: string;
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
    <section className="relative py-4">
      <div className="mx-4 mb-4 border-t border-n8/50 sm:mx-6" />
      <div className="mb-3 flex items-center justify-between px-4 sm:px-6">
        <h2 className="font-heading text-lg font-semibold text-n1 sm:text-xl">{title}</h2>
        <div className="flex items-center gap-4">
          <Link
            href={`/watch/${videos[0].id}?playlist=${categorySlug}`}
            className="inline-flex items-center gap-1.5 font-heading text-sm text-n6 transition-colors hover:text-n1"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" opacity=".5" />
              <path d="M15 12l5 3.5V8.5z" />
            </svg>
            Watch All
          </Link>
          <Link
            href={`/category/${categorySlug}`}
            className="font-heading text-sm text-n1 transition-colors hover:text-n6"
          >
            See All
          </Link>
        </div>
      </div>

      <div className="group/row relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 z-10 flex h-full w-12 items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 transition-opacity duration-300 group-hover/row:opacity-100"
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
          className="absolute right-0 top-0 z-10 flex h-full w-12 items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 transition-opacity duration-300 group-hover/row:opacity-100"
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
