"use client";

import type { TranscriptSegment, TranscriptChapter } from "@/types";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function SegmentRow({ seg, onSeek }: { seg: TranscriptSegment; onSeek: (ms: number) => void }) {
  return (
    <div className="flex gap-3 rounded p-1.5 hover:bg-n8/30">
      <button
        onClick={() => onSeek(seg.offset)}
        className="shrink-0 font-mono text-xs text-qube-blue hover:underline"
      >
        {formatTime(seg.offset)}
      </button>
      <span className="text-sm leading-relaxed text-n4">{seg.text}</span>
    </div>
  );
}

export default function TranscriptView({
  segments,
  chapters = [],
}: Readonly<{ segments: TranscriptSegment[]; chapters?: TranscriptChapter[] }>) {
  const handleSeek = (offsetMs: number) => {
    window.dispatchEvent(new CustomEvent("yt-seek", { detail: offsetMs / 1000 }));
  };

  // No chapters — flat list
  if (chapters.length === 0) {
    return (
      <div className="max-h-96 space-y-1 overflow-y-auto scrollbar-hide">
        {segments.map((seg, i) => (
          <SegmentRow key={i} seg={seg} onSeek={handleSeek} />
        ))}
      </div>
    );
  }

  // Build chapter groups
  const groups: { title: string; startTime: number; segments: TranscriptSegment[] }[] = [];

  // Segments before first chapter
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
    <div className="max-h-[32rem] overflow-y-auto scrollbar-hide">
      {groups.map((group, gi) => (
        <div key={gi} className={gi > 0 ? "mt-4" : ""}>
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
            {group.segments.map((seg, i) => (
              <SegmentRow key={i} seg={seg} onSeek={handleSeek} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
