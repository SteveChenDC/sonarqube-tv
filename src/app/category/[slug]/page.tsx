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
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
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
      {
        "@type": "ListItem",
        position: 2,
        name: category.title,
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
          className="mb-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-2 font-heading text-sm text-n6 transition-colors hover:bg-n8/40 hover:text-n1 active:bg-n8/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2 -ml-3"
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

        <div className="mb-8 border-l-[3px] border-sonar-red pl-4">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-3xl font-bold text-n1 sm:text-4xl">
              {category.title}
            </h1>
            <span className="inline-flex items-center rounded-full border border-qube-blue/25 bg-qube-blue/10 px-2.5 py-1 font-heading text-xs font-medium text-qube-blue/80">
              {categoryVideos.length} {categoryVideos.length === 1 ? "video" : "videos"}
            </span>
          </div>
          {category.description && (
            <p className="mt-2 max-w-2xl font-body text-base leading-relaxed text-n4">
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
          <CategoryContent videos={categoryVideos} />
        )}
      </div>
    </div>
  );
}
