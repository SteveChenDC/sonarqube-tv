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
  activeRef?: React.Ref<HTMLDivElement>;
}>) {
  return (
    <button
      ref={isActive ? activeRef : undefined}
      onClick={() => onSeek(seg.offset)}
      className={`flex w-full cursor-pointer gap-3 rounded p-1.5 text-left transition-colors duration-200 ${
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
  const activeElRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);
  const programmaticScrollRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isPaused, setIsPaused] = useState(false);

  const resume = useCallback(() => {
    userScrolledRef.current = false;
    clearTimeout(timeoutRef.current);
    setIsPaused(false);
  }, []);

  const handleScroll = useCallback(() => {
    if (programmaticScrollRef.current) return;
    userScrolledRef.current = true;
    setIsPaused(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      userScrolledRef.current = false;
      setIsPaused(false);
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

  return { scrollRef, activeElRef, isPaused, resume };
}

export default function TranscriptView({
  segments,
  chapters = [],
}: Readonly<{ segments: TranscriptSegment[]; chapters?: TranscriptChapter[] }>) {
  const activeOffset = useActiveSegment(segments);
  const { scrollRef, activeElRef, isPaused, resume } = useAutoScroll(activeOffset);

  const handleSeek = (offsetMs: number) => {
    globalThis.dispatchEvent(new CustomEvent("yt-seek", { detail: offsetMs / 1000 }));
  };

  const pausedIndicator = isPaused && activeOffset >= 0 && (
    <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 animate-fade-in">
      <button
        onClick={resume}
        className="flex items-center gap-1.5 rounded-full bg-n8 px-3 py-1.5 text-xs font-medium text-n3 shadow-lg transition-colors hover:bg-qube-blue hover:text-white"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        Auto-scroll paused
      </button>
    </div>
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
        {pausedIndicator}
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
      {pausedIndicator}
    </div>
  );
}
