"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getProgress, setProgress } from "@/lib/watchProgress";

interface VideoPlayerProps {
  youtubeId: string;
  title: string;
  videoId: string;
  playerId?: string;
  autoPlay?: boolean;
  compact?: boolean;
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

export default function VideoPlayer({ youtubeId, title, videoId, playerId = "yt-player", autoPlay, compact }: Readonly<VideoPlayerProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [progress, setProgressState] = useState(0);
  const [resumeToast, setResumeToast] = useState<string | null>(null);

  useEffect(() => {
    setProgressState(getProgress(videoId));
  }, [videoId]);

  const initPlayer = useCallback(() => {
    if (!globalThis.window?.YT || !containerRef.current) return;
    playerRef.current?.destroy();
    const savedProgress = getProgress(videoId);
    playerRef.current = new globalThis.window.YT.Player(playerId, {
      videoId: youtubeId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
        enablejsapi: 1,
        origin: globalThis.location.origin,
        ...(autoPlay ? { autoplay: 1 } : {}),
      },
      events: {
        onReady: (e: unknown) => {
          const event = e as { target: YTPlayer };
          if (savedProgress > 0 && savedProgress < 95) {
            const duration = event.target.getDuration();
            if (duration > 0) {
              event.target.seekTo((savedProgress / 100) * duration, true);
              setResumeToast(`Resuming from ${Math.round(savedProgress)}%`);
              setTimeout(() => setResumeToast(null), 3000);
            }
          }
        },
      },
    });
  }, [youtubeId, playerId, autoPlay, videoId]);

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
          globalThis.dispatchEvent(
            new CustomEvent("yt-time", { detail: current * 1000 })
          );
        }
      } catch {
        // player not ready yet
      }
    }, 500);
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
        <div id={playerId} className="absolute inset-0 h-full w-full" title={title} />
        {resumeToast && (
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-lg bg-black/80 px-3 py-2 text-sm text-n1 shadow-lg backdrop-blur-sm animate-fade-in-out">
            <svg className="h-4 w-4 text-qube-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {resumeToast}
          </div>
        )}
      </div>
      {!compact && (
        <div className="h-1 w-full bg-n8 rounded-b-lg overflow-hidden">
          {progress > 0 && (
            <div
              className="h-full bg-sonar-red transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          )}
        </div>
      )}
    </div>
  );
}
