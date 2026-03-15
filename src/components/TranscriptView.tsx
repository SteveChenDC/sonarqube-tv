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
    <div
      ref={isActive ? activeRef : undefined}
      className={`flex gap-3 rounded p-1.5 transition-colors duration-200 ${
        isActive
          ? "bg-qube-blue/15 border-l-2 border-qube-blue"
          : "hover:bg-n8/30"
      }`}
    >
      <button
        onClick={() => onSeek(seg.offset)}
        className="shrink-0 font-mono text-xs text-qube-blue hover:underline"
      >
        {formatTime(seg.offset)}
      </button>
      <span className={`text-sm leading-relaxed ${isActive ? "text-n1" : "text-n4"}`}>
        {seg.text}
      </span>
    </div>
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

  const handleScroll = useCallback(() => {
    if (programmaticScrollRef.current) return;
    userScrolledRef.current = true;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      userScrolledRef.current = false;
    }, 3000);
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

  return { scrollRef, activeElRef };
}

export default function TranscriptView({
  segments,
  chapters = [],
}: Readonly<{ segments: TranscriptSegment[]; chapters?: TranscriptChapter[] }>) {
  const activeOffset = useActiveSegment(segments);
  const { scrollRef, activeElRef } = useAutoScroll(activeOffset);

  const handleSeek = (offsetMs: number) => {
    globalThis.dispatchEvent(new CustomEvent("yt-seek", { detail: offsetMs / 1000 }));
  };

  // No chapters — flat list
  if (chapters.length === 0) {
    return (
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
  );
}
