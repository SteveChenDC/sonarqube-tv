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
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-n6">{formatDate(video.publishedAt)}</span>
            <span className="text-n8">|</span>
            <span className="text-sm text-n6">{video.duration}</span>
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
