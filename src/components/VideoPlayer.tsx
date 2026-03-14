"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getProgress, setProgress } from "@/lib/watchProgress";

interface VideoPlayerProps {
  youtubeId: string;
  title: string;
  videoId: string;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: Record<string, (e: unknown) => void>;
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}

export default function VideoPlayer({ youtubeId, title, videoId }: Readonly<VideoPlayerProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [progress, setProgressState] = useState(0);

  useEffect(() => {
    setProgressState(getProgress(videoId));
  }, [videoId]);

  const initPlayer = useCallback(() => {
    if (!globalThis.window?.YT || !containerRef.current) return;
    playerRef.current?.destroy();
    playerRef.current = new globalThis.window.YT.Player("yt-player", {
      videoId: youtubeId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
        enablejsapi: 1,
        origin: globalThis.location.origin,
      },
      events: {},
    });
  }, [youtubeId]);

  useEffect(() => {
    // Load YT API script if not loaded yet
    if (globalThis.window?.YT) {
      initPlayer();
    } else {
      const prev = globalThis.window?.onYouTubeIframeAPIReady;
      globalThis.window.onYouTubeIframeAPIReady = () => {
        prev?.();
        initPlayer();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [initPlayer]);

  // Track progress
  useEffect(() => {
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      try {
        const current = player.getCurrentTime();
        const duration = player.getDuration();
        if (duration > 0 && current > 0) {
          const percent = (current / duration) * 100;
          setProgress(videoId, percent);
          setProgressState(percent);
        }
      } catch {
        // player not ready yet
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [videoId]);

  // Listen for seek requests from TranscriptView
  useEffect(() => {
    function handleSeek(e: Event) {
      const seconds = (e as CustomEvent<number>).detail;
      playerRef.current?.seekTo(seconds, true);
    }
    globalThis.addEventListener("yt-seek", handleSeek);
    return () => globalThis.removeEventListener("yt-seek", handleSeek);
  }, []);

  return (
    <div className="w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-n8 bg-n9" ref={containerRef}>
        <div id="yt-player" className="absolute inset-0 h-full w-full" title={title} />
      </div>
      <div className="h-1 w-full bg-n8 rounded-b-lg overflow-hidden">
        {progress > 0 && (
          <div
            className="h-full bg-sonar-red transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        )}
      </div>
    </div>
  );
}
