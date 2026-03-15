"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TranscriptSegment, TranscriptChapter } from "@/types";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function SegmentRow({
  seg,
  isActive,
  onSeek,
  activeRef,
}: Readonly<{
  seg: TranscriptSegment;
  isActive: boolean;
  onSeek: (ms: number) => void;
  activeRef?: React.Ref<HTMLButtonElement>;
}>) {
  return (
    <button
      ref={isActive ? activeRef : undefined}
      onClick={() => onSeek(seg.offset)}
      className={`flex w-full gap-3 rounded p-1.5 text-left transition-colors duration-200 cursor-pointer ${
        isActive
          ? "bg-qube-blue/15 border-l-2 border-qube-blue"
          : "hover:bg-n8/30"
      }`}
    >
      <span className="shrink-0 font-mono text-xs text-qube-blue">
        {formatTime(seg.offset)}
      </span>
      <span className={`text-sm leading-relaxed ${isActive ? "text-n1" : "text-n4"}`}>
        {seg.text}
      </span>
    </button>
  );
}

function useActiveSegment(segments: TranscriptSegment[]) {
  const [currentTimeMs, setCurrentTimeMs] = useState(-1);

  useEffect(() => {
    function handleTime(e: Event) {
      setCurrentTimeMs((e as CustomEvent<number>).detail);
    }
    globalThis.addEventListener("yt-time", handleTime);
    return () => globalThis.removeEventListener("yt-time", handleTime);
  }, []);

  // Find active segment: offset <= currentTimeMs < offset + duration
  const activeOffset =
    currentTimeMs >= 0
      ? segments.find(
          (seg) =>
            currentTimeMs >= seg.offset &&
            currentTimeMs < seg.offset + seg.duration
        )?.offset ?? -1
      : -1;

  return activeOffset;
}

function useAutoScroll(activeOffset: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeElRef = useRef<HTMLButtonElement>(null);
  const userScrolledRef = useRef(false);
  const programmaticScrollRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [paused, setPaused] = useState(false);

  const resume = useCallback(() => {
    userScrolledRef.current = false;
    clearTimeout(timeoutRef.current);
    setPaused(false);
  }, []);

  const handleScroll = useCallback(() => {
    if (programmaticScrollRef.current) return;
    userScrolledRef.current = true;
    setPaused(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      userScrolledRef.current = false;
      setPaused(false);
    }, 5000);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutRef.current);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (activeOffset < 0 || userScrolledRef.current) return;
    const container = scrollRef.current;
    const active = activeElRef.current;
    if (!container || !active) return;
    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const offsetTop = activeRect.top - containerRect.top + container.scrollTop;
    programmaticScrollRef.current = true;
    container.scrollTo({
      top: offsetTop - containerRect.height / 2 + activeRect.height / 2,
      behavior: "smooth",
    });
    // Clear programmatic flag after scroll animation settles
    setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 500);
  }, [activeOffset]);

  return { scrollRef, activeElRef, paused, resume };
}

export default function TranscriptView({
  segments,
  chapters = [],
}: Readonly<{ segments: TranscriptSegment[]; chapters?: TranscriptChapter[] }>) {
  const activeOffset = useActiveSegment(segments);
  const { scrollRef, activeElRef, paused, resume } = useAutoScroll(activeOffset);

  const handleSeek = (offsetMs: number) => {
    globalThis.dispatchEvent(new CustomEvent("yt-seek", { detail: offsetMs / 1000 }));
  };

  const scrollPausedBanner = paused && activeOffset >= 0 && (
    <button
      onClick={resume}
      className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-qube-blue px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-all hover:bg-qube-blue/90"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
      Auto-scroll paused
    </button>
  );

  // No chapters — flat list
  if (chapters.length === 0) {
    return (
      <div className="relative">
        <div ref={scrollRef} className="max-h-96 space-y-1 overflow-y-auto scrollbar-hide">
          {segments.map((seg) => (
            <SegmentRow
              key={seg.offset}
              seg={seg}
              isActive={seg.offset === activeOffset}
              onSeek={handleSeek}
              activeRef={activeElRef}
            />
          ))}
        </div>
        {scrollPausedBanner}
      </div>
    );
  }

  // Build chapter groups
  const groups: { title: string; startTime: number; segments: TranscriptSegment[] }[] = [];

  if (chapters[0].startIndex > 0) {
    groups.push({
      title: "Introduction",
      startTime: segments[0]?.offset ?? 0,
      segments: segments.slice(0, chapters[0].startIndex),
    });
  }

  for (let c = 0; c < chapters.length; c++) {
    const start = chapters[c].startIndex;
    const end = c + 1 < chapters.length ? chapters[c + 1].startIndex : segments.length;
    groups.push({
      title: chapters[c].title,
      startTime: segments[start]?.offset ?? 0,
      segments: segments.slice(start, end),
    });
  }

  return (
    <div className="relative">
      <div ref={scrollRef} className="max-h-[32rem] overflow-y-auto scrollbar-hide">
        {groups.map((group, gi) => (
          <div key={group.title} className={gi > 0 ? "mt-4" : ""}>
            <button
              onClick={() => handleSeek(group.startTime)}
              className="sticky top-0 z-10 flex w-full items-center gap-2 bg-n9/95 backdrop-blur-sm px-2 py-2 text-left"
            >
              <span className="font-mono text-xs text-qube-blue">
                {formatTime(group.startTime)}
              </span>
              <span className="font-heading text-sm font-semibold text-n1">
                {group.title}
              </span>
            </button>
            <div className="space-y-1 pl-2">
              {group.segments.map((seg) => (
                <SegmentRow
                  key={seg.offset}
                  seg={seg}
                  isActive={seg.offset === activeOffset}
                  onSeek={handleSeek}
                  activeRef={activeElRef}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {scrollPausedBanner}
    </div>
  );
}
