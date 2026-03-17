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

  return (
    <div className="pt-20 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
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
          <div className="py-20 text-center">
            <svg
              className="mx-auto h-12 w-12 text-n7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p className="mt-4 font-heading text-lg text-n4">
              No videos in this category yet.
            </p>
            <Link
              href="/"
              className="mt-3 inline-block font-heading text-sm text-qube-blue hover:underline"
            >
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
