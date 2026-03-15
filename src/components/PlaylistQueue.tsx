"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Video } from "@/types";

interface PlaylistQueueProps {
  currentVideoId: string;
  allVideos: Video[];
}

export default function PlaylistQueue({
  currentVideoId,
  allVideos,
}: Readonly<PlaylistQueueProps>) {
  const searchParams = useSearchParams();
  const playlistSlug = searchParams.get("playlist");

  if (!playlistSlug) return null;

  const playlistVideos = allVideos.filter((v) => v.category === playlistSlug);
  if (playlistVideos.length === 0) return null;

  const currentIndex = playlistVideos.findIndex((v) => v.id === currentVideoId);
  const nextVideo =
    currentIndex < playlistVideos.length - 1
      ? playlistVideos[currentIndex + 1]
      : null;
  const prevVideo = currentIndex > 0 ? playlistVideos[currentIndex - 1] : null;

  return (
    <div className="mt-8 rounded-lg border border-n8 bg-n9/50">
      <div className="flex items-center justify-between border-b border-n8 px-4 py-3">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-qube-blue"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"
              opacity=".5"
            />
            <path d="M15 12l5 3.5V8.5z" />
          </svg>
          <span className="font-heading text-sm font-semibold text-n1">
            Playlist
          </span>
          <span className="font-heading text-xs text-n6">
            {currentIndex + 1} / {playlistVideos.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {prevVideo ? (
            <Link
              href={`/watch/${prevVideo.id}?playlist=${playlistSlug}`}
              className="rounded p-2 text-n6 transition-colors hover:bg-n8 hover:text-n1"
              aria-label="Previous video"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded p-2 text-n7" aria-disabled="true" aria-label="No previous video">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          )}
          {nextVideo ? (
            <Link
              href={`/watch/${nextVideo.id}?playlist=${playlistSlug}`}
              className="rounded p-2 text-n6 transition-colors hover:bg-n8 hover:text-n1"
              aria-label="Next video"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded p-2 text-n7" aria-disabled="true" aria-label="No next video">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto sm:max-h-80">
        {playlistVideos.map((video, index) => (
          <Link
            key={video.id}
            href={`/watch/${video.id}?playlist=${playlistSlug}`}
            className={`group flex items-center gap-3 py-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qube-blue focus-visible:ring-inset ${
              video.id === currentVideoId
                ? "border-l-2 border-sonar-red bg-n8/70 pl-[14px] pr-4"
                : "border-l-2 border-transparent px-4 hover:bg-n8/50 active:bg-n8/80"
            }`}
          >
            <span className="w-5 shrink-0 text-right font-heading text-xs text-n6">
              {video.id === currentVideoId ? (
                <svg
                  className="inline h-3 w-3 text-sonar-red"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                index + 1
              )}
            </span>
            <div className="relative h-10 w-[72px] shrink-0 overflow-hidden rounded">
              <Image
                src={video.thumbnail}
                alt=""
                fill
                className="object-cover"
                sizes="72px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`truncate font-heading text-xs transition-colors ${
                  video.id === currentVideoId
                    ? "font-semibold text-n1"
                    : "text-n3 group-hover:text-n1"
                }`}
              >
                {video.title}
              </p>
              <p className="font-body text-xs text-n5 transition-colors group-hover:text-n4">
                {video.duration}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
