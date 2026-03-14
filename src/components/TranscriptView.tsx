"use client";

import type { TranscriptSegment } from "@/types";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function TranscriptView({
  segments,
}: Readonly<{ segments: TranscriptSegment[] }>) {
  const handleSeek = (offsetMs: number) => {
    const iframe = document.querySelector<HTMLIFrameElement>("iframe[src*='youtube']");
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "seekTo",
          args: [offsetMs / 1000, true],
        }),
        "*"
      );
    }
  };

  return (
    <div className="max-h-96 space-y-1 overflow-y-auto scrollbar-hide">
      {segments.map((seg, i) => (
        <div key={i} className="flex gap-3 rounded p-1.5 hover:bg-n8/30">
          <button
            onClick={() => handleSeek(seg.offset)}
            className="shrink-0 font-mono text-xs text-qube-blue hover:underline"
          >
            {formatTime(seg.offset)}
          </button>
          <span className="text-sm leading-relaxed text-n4">{seg.text}</span>
        </div>
      ))}
    </div>
  );
}
