"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getProgress, setProgress as saveProgress } from "@/lib/watchProgress";

/** YouTube thumbnail URL — hqdefault (480×360) is always available. */
function ytThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

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
  getPlayerState(): number;
  playVideo(): void;
  pauseVideo(): void;
  destroy(): void;
}

// YT player state constants
const YT_PLAYING = 1;
const SEEK_SECONDS = 10;

export default function VideoPlayer({ youtubeId, title, videoId, playerId = "yt-player", autoPlay, compact }: Readonly<VideoPlayerProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [progress, setProgressState] = useState(0);
  const [resumeToast, setResumeToast] = useState<string | null>(null);
  const [showShortcutsOverlay, setShowShortcutsOverlay] = useState(false);
  const [shortcutsHint, setShortcutsHint] = useState(true);
  const [seekToast, setSeekToast] = useState<string | null>(null);
  // Lazy-load: only activate the YouTube iframe when user clicks play (or autoPlay is set).
  const [activated, setActivated] = useState(!!autoPlay);

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
    if (!activated) return; // Don't load YouTube until user clicks play
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
  }, [initPlayer, activated]);

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
          saveProgress(videoId, percent);
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

  // Auto-dismiss shortcuts hint after 4s
  useEffect(() => {
    const timer = setTimeout(() => setShortcutsHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function togglePlayPause(player: YTPlayer) {
      try {
        if (player.getPlayerState() === YT_PLAYING) player.pauseVideo();
        else player.playVideo();
      } catch { /* player not ready */ }
    }

    function seekBy(player: YTPlayer, delta: number) {
      try {
        const t = delta < 0
          ? Math.max(0, player.getCurrentTime() + delta)
          : Math.min(player.getDuration(), player.getCurrentTime() + delta);
        player.seekTo(t, true);
        setSeekToast(`${delta < 0 ? "" : "+"}${delta}s`);
        setTimeout(() => setSeekToast(null), 1200);
      } catch { /* player not ready */ }
    }

    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable) return;

      if (e.key === "?") { setShowShortcutsOverlay((v) => !v); setShortcutsHint(false); return; }
      if (e.key === "Escape" && showShortcutsOverlay) { setShowShortcutsOverlay(false); return; }

      const player = playerRef.current;
      if (!player) return;

      if (e.key === " " || e.key === "k") { e.preventDefault(); togglePlayPause(player); return; }
      if (e.key === "ArrowLeft" || e.key === "j") { e.preventDefault(); seekBy(player, -SEEK_SECONDS); return; }
      if (e.key === "ArrowRight" || e.key === "l") { e.preventDefault(); seekBy(player, SEEK_SECONDS); return; }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showShortcutsOverlay]);

  // Before user clicks play: show thumbnail + play button, no YouTube API loaded.
  if (!activated) {
    return (
      <div className="w-full">
        <button
          type="button"
          aria-label={`Play ${title}`}
          onClick={() => setActivated(true)}
          className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-n8 bg-n9 focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ytThumbnail(youtubeId)}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Darken overlay */}
          <div className="absolute inset-0 bg-black/30 transition-opacity duration-200 group-hover:bg-black/45" />
          {/* Play button */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-sonar-red shadow-lg shadow-sonar-red/50 transition-transform duration-200 group-hover:scale-110">
            <svg className="ml-1 h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
        {!compact && <div className="h-1 w-full rounded-b-lg bg-n8" />}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-n8 bg-n9" ref={containerRef}>
        <div id={playerId} className="absolute inset-0 h-full w-full" title={title} />

        {resumeToast && (
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-lg bg-black/80 px-3 py-2 text-sm text-white shadow-lg backdrop-blur-sm animate-fade-in-out">
            <svg className="h-4 w-4 text-qube-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {resumeToast}
          </div>
        )}

        {seekToast && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="rounded-xl bg-black/70 px-4 py-2 font-heading text-lg font-semibold text-white backdrop-blur-sm animate-fade-in-out">
              {seekToast}
            </div>
          </div>
        )}

        {/* Keyboard shortcuts hint — briefly shown on load */}
        {!compact && shortcutsHint && (
          <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs text-white/70 backdrop-blur-sm transition-opacity duration-500">
            <kbd className="rounded bg-n7/60 px-1 py-0.5 font-mono text-[10px] text-n3">?</kbd>
            <span>keyboard shortcuts</span>
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

      {/* Keyboard shortcuts overlay */}
      {showShortcutsOverlay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowShortcutsOverlay(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-n7/40 bg-n9 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-n1">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowShortcutsOverlay(false)}
                className="rounded-lg p-1.5 text-n5 transition-colors hover:bg-n8 hover:text-n1"
                aria-label="Close shortcuts"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              {[
                { keys: ["Space", "k"], label: "Play / Pause" },
                { keys: ["←", "j"], label: `Seek back ${SEEK_SECONDS}s` },
                { keys: ["→", "l"], label: `Seek forward ${SEEK_SECONDS}s` },
                { keys: ["?"], label: "Toggle this panel" },
                { keys: ["Esc"], label: "Close panel" },
              ].map(({ keys, label }) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-n4">{label}</span>
                  <div className="flex items-center gap-1">
                    {keys.map((k, i) => (
                      <span key={k} className="flex items-center gap-1">
                        {i > 0 && <span className="text-xs text-n6">or</span>}
                        <kbd className="min-w-[1.75rem] rounded-md border border-n7/50 bg-n8 px-2 py-1 text-center font-mono text-xs font-medium text-n2 shadow-sm">
                          {k}
                        </kbd>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-n8/60 pt-4 text-center text-[11px] text-n6">
              Shortcuts work when focus is outside the player
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
