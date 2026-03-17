import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getCategoryBySlug, getVideosByCategory } from "@/data/videos";
import CategoryContent from "@/components/CategoryContent";

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: category.title,
    description: category.description,
    openGraph: {
      title: `${category.title} | Sonar.tv`,
      description: category.description,
      url: `/category/${slug}`,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${category.title} — SonarQube video tutorials`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.title} | Sonar.tv`,
      description: category.description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

function parseDurationToSeconds(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
}

function formatTotalDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours >= 1) {
    return `${hours}h ${minutes}m total`;
  }
  return `${minutes}m total`;
}

export default async function CategoryPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryVideos = getVideosByCategory(slug);
  const totalSeconds = categoryVideos.reduce(
    (sum, v) => sum + parseDurationToSeconds(v.duration),
    0
  );

  const BASE_URL = "https://stevechendc.github.io/sonarqube-tv";

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
      {
        "@type": "ListItem",
        position: 2,
        name: category.title,
        item: `${BASE_URL}/category/${slug}`,
      },
    ],
  };

  // ItemList enumerates each video so Google can surface individual videos
  // in rich carousels when users search for content in this category.
  const videoListJsonLd = categoryVideos.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${category.title} — SonarQube Video Tutorials`,
        description: category.description,
        url: `${BASE_URL}/category/${slug}`,
        numberOfItems: categoryVideos.length,
        itemListElement: categoryVideos.map((video, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "VideoObject",
            name: video.title,
            description: video.description,
            thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
            uploadDate: video.publishedAt,
            contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
            embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
            url: `${BASE_URL}/watch/${video.id}`,
            publisher: {
              "@type": "Organization",
              name: "SonarSource",
              url: "https://www.sonarsource.com",
            },
          },
        })),
      }
    : null;

  return (
    <div className="pt-20 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      {videoListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(videoListJsonLd),
          }}
        />
      )}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
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

        <div className="mb-8 border-b border-n8/60 pb-8">
          {/* Title row with accent bar */}
          <div className="mb-3 flex items-start gap-3">
            <span className="mt-1.5 inline-block h-8 w-1 shrink-0 rounded-full bg-sonar-red sm:mt-2 sm:h-10" aria-hidden="true" />
            <h1 className="font-heading text-2xl font-bold text-n1 break-words hyphens-auto sm:text-3xl lg:text-4xl">
              {category.title}
            </h1>
          </div>
          {/* Stats row */}
          <div className="mb-4 ml-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-n7/50 bg-n8/60 px-2.5 py-1 font-heading text-xs font-medium text-n5">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
              </svg>
              {categoryVideos.length} {categoryVideos.length === 1 ? "video" : "videos"}
            </span>
            {totalSeconds > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-n7/50 bg-n8/60 px-2.5 py-1 font-heading text-xs font-medium text-n5">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {formatTotalDuration(totalSeconds)}
              </span>
            )}
          </div>
          {/* Description */}
          {category.description && (
            <p className="ml-4 max-w-2xl font-body text-base leading-relaxed text-n4">
              {category.description}
            </p>
          )}
        </div>

        {categoryVideos.length === 0 ? (
          <div className="px-4 py-24 text-center sm:px-6">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-n7/40 bg-n8/60 shadow-inner">
              <svg
                className="h-10 w-10 text-n6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <p className="font-heading text-xl font-semibold text-n2">
              No videos here yet
            </p>
            <p className="mt-2 text-sm leading-relaxed text-n5">
              This category is coming soon. Check back later or browse our full library.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-qube-blue/40 bg-qube-blue/10 px-5 py-2.5 font-heading text-sm font-medium text-qube-blue transition-colors hover:border-qube-blue/70 hover:bg-qube-blue/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Browse all videos
            </Link>
          </div>
        ) : (
          <CategoryContent videos={categoryVideos} description={category.description} />
        )}
      </div>
    </div>
  );
}
