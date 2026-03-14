"use client";

import { useEffect, useRef, useState } from "react";
import { getProgress, setProgress } from "@/lib/watchProgress";

interface VideoPlayerProps {
  youtubeId: string;
  title: string;
  videoId: string;
}

export default function VideoPlayer({ youtubeId, title, videoId }: Readonly<VideoPlayerProps>) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [progress, setProgressState] = useState(0);

  useEffect(() => {
    setProgressState(getProgress(videoId));
  }, [videoId]);

  useEffect(() => {
    // Listen for postMessage from YouTube iframe API
    function handleMessage(event: MessageEvent) {
      if (event.origin !== "https://www.youtube.com") return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.event === "infoDelivery" && data.info?.currentTime != null && data.info?.duration) {
          const percent = (data.info.currentTime / data.info.duration) * 100;
          if (percent > 0) {
            setProgress(videoId, percent);
            setProgressState(percent);
          }
        }
      } catch {
        // ignore non-JSON messages
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [videoId]);

  return (
    <div className="w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-n8 bg-n9">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
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
