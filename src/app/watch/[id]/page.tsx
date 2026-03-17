import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import { durationToISO } from "@/lib/durationToISO";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import VideoPlayer from "@/components/VideoPlayer";
import VideoRow from "@/components/VideoRow";
import {
  getVideoById,
  getVideosByCategory,
  getCategoryBySlug,
  getRelatedVideosFromOtherCategories,
  videos,
} from "@/data/videos";
import { getArticleByVideoId, getTranscriptByVideoId } from "@/data/articles";

import ShareButton from "@/components/ShareButton";
import CourseBadge from "@/components/CourseBadge";

// Dynamically import below-fold client components to reduce initial JS bundle.
// ArticleTabs pulls in the markdown parser, TranscriptView, and extractChapters
// (~630 lines of client logic) — none of it needed until the page body is visible.
const ArticleTabs = dynamic(() => import("@/components/ArticleTabs"));

// PlaylistQueue only renders when ?playlist= is in the URL; defer its JS accordingly.
const PlaylistQueue = dynamic(() => import("@/components/PlaylistQueue"));

// NowPlayingBar: mobile-only sticky bar, invisible until user scrolls past the player.
// Deferred into its own chunk — not needed for initial paint on any viewport.
const NowPlayingBar = dynamic(() => import("@/components/NowPlayingBar"));

// CourseNavBar: only renders when ?course= is in the URL (most visits don't have it).
// Already wrapped in <Suspense> at the call site; deferred here to keep it out of
// the initial bundle for the ~228 statically generated watch pages.
const CourseNavBar = dynamic(() => import("@/components/CourseNavBar"));

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

  // Use maxresdefault for OG/social sharing where full resolution matters.
  const ogImage = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  return {
    title: video.title,
    description: video.description,
    openGraph: {
      title: video.title,
      description: video.description,
      url: `/watch/${id}`,
      images: [{ url: ogImage, width: 1280, height: 720, alt: video.title }],
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: video.description,
      images: [ogImage],
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
  const youMightAlsoLike = getRelatedVideosFromOtherCategories(
    video.id,
    video.category,
    4
  );

  const BASE_URL = "https://stevechendc.github.io/sonarqube-tv";

  // Use maxresdefault for structured data — schema.org recommends high-res thumbnails.
  const maxResThumbnail = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  const watchPageUrl = `${BASE_URL}/watch/${id}`;

  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": watchPageUrl,
    name: video.title,
    description: video.description,
    thumbnailUrl: maxResThumbnail,
    uploadDate: video.publishedAt,
    duration: durationToISO(video.duration),
    url: watchPageUrl,
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    isAccessibleForFree: true,
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
        item: BASE_URL,
      },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: category.title,
              item: `${BASE_URL}/category/${category.slug}`,
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
          className="group mb-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-2 font-heading text-sm text-n5 transition-colors hover:bg-n8/40 hover:text-n1 active:bg-n8/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2 -ml-3"
        >
          <svg
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
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
        <NowPlayingBar title={video.title} />
        <Suspense>
          <CourseNavBar videoId={video.id} />
        </Suspense>

        <div className="mt-6 rounded-xl border border-n8 bg-n8/15 p-5 sm:p-6">
          <h1 className="font-heading text-2xl font-bold leading-tight text-n1 sm:text-3xl">
            {video.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {/* Category tag — interactive navigation pill, larger to signal clickability */}
            {category && (
              <Link
                href={`/category/${category.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-qube-blue/40 bg-qube-blue/10 px-3 py-1 font-heading text-xs font-medium text-qube-blue transition-colors hover:border-qube-blue/70 hover:bg-qube-blue/20 active:scale-95"
              >
                {category.title}
              </Link>
            )}

            {/* Dot separator between category tag and metadata cluster */}
            {category && (
              <span className="h-1 w-1 shrink-0 rounded-full bg-n7" aria-hidden="true" />
            )}

            {/* Metadata cluster — compact, non-interactive, visually quieter */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-n7/50 bg-n8/40 px-2.5 py-0.5 font-heading text-xs font-medium text-n5">
              <svg className="h-3 w-3 shrink-0 text-qube-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDate(video.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-n7/50 bg-n8/40 px-2.5 py-0.5 font-heading text-xs font-medium text-n5">
              <svg className="h-3 w-3 shrink-0 text-sonar-red/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {video.duration}
            </span>
            <CourseBadge videoId={video.id} />
            <ShareButton />
          </div>
          <div className="mt-5 border-t border-n8/40 pt-5">
            <p className="text-base leading-7 text-n3">
              {video.description}
            </p>
          </div>
        </div>

        {(() => {
          const article = getArticleByVideoId(video.id);
          const transcript = getTranscriptByVideoId(video.id);
          if (!article && !transcript) return null;
          return (
            <div className="mt-6">
              <ArticleTabs article={article} transcript={transcript} />
            </div>
          );
        })()}

        <Suspense>
          <PlaylistQueue currentVideoId={video.id} allVideos={videos} />
        </Suspense>
      </div>

      {relatedVideos.length > 0 && (
        <div className="mt-12">
          <VideoRow
            title={`More in ${category?.title ?? "this category"}`}
            categorySlug={video.category}
            videos={relatedVideos.slice(0, 15)}
            totalCount={relatedVideos.length}
          />
        </div>
      )}

      {youMightAlsoLike.length >= 2 && (
        <div className="mt-8">
          <VideoRow
            title="You Might Also Like"
            videos={youMightAlsoLike}
          />
        </div>
      )}
    </div>
  );
}
