"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mobile-only sticky "Now Playing" bar for the watch page.
 *
 * Renders an invisible sentinel element in the document flow immediately after
 * the video player. When the sentinel scrolls above the viewport (i.e. the
 * player is no longer visible), a compact fixed bar slides into view below the
 * site header, showing a pulsing "live" dot and the current video title.
 *
 * Hidden on sm+ screens via `sm:hidden` — zero impact on desktop layout.
 */
export default function NowPlayingBar({ title }: Readonly<{ title: string }>) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel placed right after the player in the normal document flow.
          When this div scrolls above the viewport, `visible` becomes true. */}
      <div ref={sentinelRef} aria-hidden="true" />

      {/* Sticky bar — only shown on mobile, below the ~60px fixed header */}
      <div
        role="status"
        aria-live="polite"
        aria-label={visible ? `Now playing: ${title}` : undefined}
        className={`fixed inset-x-0 z-40 sm:hidden transition-[opacity,transform] duration-300 ease-in-out ${
          visible
            ? "top-[60px] translate-y-0 opacity-100"
            : "top-[60px] -translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-n8/80 bg-n9/96 px-4 py-2.5 backdrop-blur-md shadow-sm">
          {/* Pulsing "now playing" indicator */}
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sonar-red opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sonar-red" />
          </span>
          <span className="truncate font-heading text-xs font-medium text-n2 leading-none">
            {title}
          </span>
          <span className="ml-auto shrink-0 font-heading text-[10px] uppercase tracking-wider text-n6">
            Now Playing
          </span>
        </div>
      </div>
    </>
  );
}
