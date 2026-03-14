import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import { Suspense } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import VideoRow from "@/components/VideoRow";
import PlaylistQueue from "@/components/PlaylistQueue";
import {
  getVideoById,
  getVideosByCategory,
  getCategoryBySlug,
  videos,
} from "@/data/videos";

export function generateStaticParams() {
  return videos.map((video) => ({ id: video.id }));
}

export default async function WatchPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const video = getVideoById(id);

  if (!video) {
    notFound();
  }

  const category = getCategoryBySlug(video.category);
  const relatedVideos = getVideosByCategory(video.category).filter(
    (v) => v.id !== video.id
  );

  return (
    <div className="pt-20 pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 font-heading text-sm text-n6 transition-colors hover:text-n1"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>

        <VideoPlayer youtubeId={video.youtubeId} title={video.title} videoId={video.id} />

        <div className="mt-8">
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="mb-3 inline-block font-heading text-sm text-qube-blue hover:underline"
            >
              {category.title}
            </Link>
          )}
          <h1 className="font-heading text-2xl font-bold leading-tight text-n1 sm:text-3xl">
            {video.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded bg-n8/60 px-2.5 py-1 text-sm text-n5">
              <svg className="h-3.5 w-3.5 text-n6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDate(video.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded bg-n8/60 px-2.5 py-1 text-sm text-n5">
              <svg className="h-3.5 w-3.5 text-n6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {video.duration}
            </span>
          </div>
          <p className="mt-5 text-base leading-relaxed text-n5">
            {video.description}
          </p>
        </div>

        <Suspense>
          <PlaylistQueue currentVideoId={video.id} allVideos={videos} />
        </Suspense>
      </div>

      {relatedVideos.length > 0 && (
        <div className="mt-12">
          <VideoRow
            title={`More in ${category?.title ?? "this category"}`}
            categorySlug={video.category}
            videos={relatedVideos}
          />
        </div>
      )}
    </div>
  );
}
