"use client";

import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { Video } from "@/types";
import VideoCard from "./VideoCard";

/** Placeholder shown for off-screen rows before they're lazy-loaded */
function RowSkeleton({ hideHeader }: { hideHeader?: boolean }) {
  return (
    <div aria-hidden="true">
      {!hideHeader && (
        <div className="mb-4 flex items-center gap-3 px-4 sm:px-6">
          <div className="h-5 w-1 shrink-0 rounded-full bg-n7/50 animate-pulse" />
          <div className="h-6 w-40 rounded-full bg-n7/50 animate-pulse" />
        </div>
      )}
      <div className="flex gap-4 overflow-hidden px-4 sm:px-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px]">
            <div className="aspect-video w-full rounded-lg bg-n7/50 animate-pulse" />
            <div className="mt-3 h-4 w-4/5 rounded bg-n7/40 animate-pulse" />
            <div className="mt-2 h-3 w-2/5 rounded bg-n7/30 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

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
  totalCount?: number;
  hideHeader?: boolean;
  dividerAfterIndex?: number;
  sectionLabels?: SectionLabels;
  onRemoveVideo?: (videoId: string) => void;
}

function VideoRow({ title, categorySlug, videos, totalCount, hideHeader, dividerAfterIndex, sectionLabels, onRemoveVideo }: Readonly<VideoRowProps>) {
  const hideCategoryBadge = !!categorySlug;
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Lazy-reveal: only render full row content when section scrolls near viewport.
  // rootMargin: "400px" preloads one screen-height before the row becomes visible.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const handleScroll = useCallback(() => {
    updateScrollState();
    if (!hasScrolled) setHasScrolled(true);
  }, [updateScrollState, hasScrolled]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", handleScroll, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      ro.disconnect();
    };
  }, [handleScroll, updateScrollState, videos, isRevealed]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  /** Move focus between video cards with arrow keys. */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;

    const cards = Array.from(
      container.querySelectorAll<HTMLAnchorElement>("a[href]")
    );
    if (cards.length === 0) return;

    const focusedIndex = cards.findIndex(
      (el) => el === document.activeElement || el.contains(document.activeElement)
    );
    if (focusedIndex === -1) return; // no card focused — don't intercept

    let nextIndex = focusedIndex;
    if (e.key === "ArrowRight") nextIndex = Math.min(focusedIndex + 1, cards.length - 1);
    else if (e.key === "ArrowLeft") nextIndex = Math.max(focusedIndex - 1, 0);
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = cards.length - 1;

    if (nextIndex !== focusedIndex) {
      e.preventDefault();
      cards[nextIndex].focus();
      cards[nextIndex].scrollIntoView?.({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, []);

  if (videos.length === 0) return null;

  function renderLabel(label: string, count: number) {
    return (
      <div className="flex items-center gap-3">
        <span className="inline-block h-5 w-1 shrink-0 rounded-full bg-sonar-red" aria-hidden="true" />
        <h2 className="font-heading text-lg font-semibold text-n1 whitespace-nowrap sm:text-xl">
          {label}
          <span className="ml-2 inline-block align-middle rounded-full bg-n8/50 px-2 py-0.5 text-xs font-normal text-n5">
            {count}
          </span>
        </h2>
      </div>
    );
  }

  return (
    <section ref={sectionRef} id={categorySlug} className="relative scroll-mt-20 py-8">
      {!isRevealed ? <RowSkeleton hideHeader={hideHeader} /> : (
      <>
      {!hideHeader && (
        <div className="mb-4 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="inline-block h-5 w-1 shrink-0 rounded-full bg-sonar-red" aria-hidden="true" />
            <h2 className="font-heading text-lg font-semibold text-n1 sm:text-xl">
              {title}
              <span className="ml-2 inline-block align-middle rounded-full bg-n8/50 px-2 py-0.5 text-xs font-normal text-n5">{totalCount ?? videos.length}</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile-only swipe hint — visible until user scrolls for the first time */}
            {canScrollRight && !hasScrolled && (
              <span
                aria-hidden="true"
                className="sm:hidden inline-flex items-center gap-1 rounded-full border border-n7/40 bg-n8/50 px-2 py-0.5 font-heading text-[10px] font-medium text-n5 transition-opacity duration-500"
              >
                Swipe
                <svg
                  className="h-3 w-3 animate-[nudge_1.4s_ease-in-out_3]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            )}
            {categorySlug && totalCount !== undefined && totalCount > videos.length && (
              <Link
                href={`/category/${categorySlug}`}
                className="group inline-flex items-center gap-1 font-heading text-xs font-medium text-qube-blue transition-colors hover:text-qube-blue/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qube-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
              >
                View all
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* All viewports: horizontal scroll */}
      <div>
        <div className="group/row relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-0 z-10 flex h-full w-12 items-center justify-center bg-gradient-to-r from-background/90 to-transparent opacity-0 transition-opacity duration-300 group-hover/row:opacity-70 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
              aria-label="Scroll left"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-n9/80 shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-110">
                <svg className="h-5 w-5 text-n1 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </span>
            </button>
          )}

          <div
            ref={scrollRef}
            role="region"
            aria-label={`${title} — use arrow keys to browse`}
            onKeyDown={handleKeyDown}
            className="flex gap-4 overflow-x-auto scroll-smooth px-4 scrollbar-hide snap-x snap-mandatory sm:px-6"
          >
            {sectionLabels ? (
              <>
                {/* First section: label + cards */}
                <div className="flex shrink-0 flex-col gap-3">
                  {renderLabel(sectionLabels.firstLabel, sectionLabels.firstCount)}
                  <div className="flex gap-4">
                    {videos.slice(0, sectionLabels.splitAt).map((video) => (
                      <VideoCard key={video.id} video={video} hideCategory={hideCategoryBadge} onRemove={onRemoveVideo ? () => onRemoveVideo(video.id) : undefined} />
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
                      <VideoCard key={video.id} video={video} hideCategory={hideCategoryBadge} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              videos.map((video) => (
                <VideoCard key={video.id} video={video} hideCategory={hideCategoryBadge} onRemove={onRemoveVideo ? () => onRemoveVideo(video.id) : undefined} />
              ))
            )}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-0 z-10 flex h-full w-12 items-center justify-center bg-gradient-to-l from-background/90 to-transparent opacity-0 transition-opacity duration-300 group-hover/row:opacity-70 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
              aria-label="Scroll right"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-n9/80 shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-110">
                <svg className="h-5 w-5 text-n1 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
      </>
      )}
    </section>
  );
}

export default memo(VideoRow);
