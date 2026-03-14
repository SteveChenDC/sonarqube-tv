import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import { durationToISO } from "@/lib/durationToISO";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const video = getVideoById(id);
  if (!video) return {};

  return {
    title: video.title,
    description: video.description,
    openGraph: {
      images: [video.thumbnail],
      type: "video.other",
    },
    alternates: {
      canonical: `/watch/${id}`,
    },
  };
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

  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnail,
    uploadDate: video.publishedAt,
    duration: durationToISO(video.duration),
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    publisher: {
      "@type": "Organization",
      name: "SonarSource",
      url: "https://www.sonarsource.com",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://sonarqube-tv.vercel.app",
      },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: category.title,
              item: `https://sonarqube-tv.vercel.app/category/${category.slug}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: video.title,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: video.title,
            },
          ]),
    ],
  };

  return (
    <div className="pt-20 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 rounded font-heading text-sm text-n6 transition-colors hover:text-n1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2"
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

        <div className="mt-6 rounded-xl border border-n8 bg-n8/15 p-5 sm:p-6">
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
            <span className="inline-flex items-center gap-1.5 rounded bg-n8/60 px-2.5 py-1 text-sm text-n4">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDate(video.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded bg-n8/60 px-2.5 py-1 text-sm text-n4">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {video.duration}
            </span>
          </div>
          <div className="mt-5 border-t border-n8/40 pt-5">
            <p className="text-base leading-7 text-n4">
              {video.description}
            </p>
          </div>
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
