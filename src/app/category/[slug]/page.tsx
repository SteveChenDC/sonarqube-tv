import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getCategoryBySlug, getVideosByCategory } from "@/data/videos";
import VideoCard from "@/components/VideoCard";

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
          className="mb-6 inline-flex items-center gap-1.5 rounded font-heading text-sm text-n6 transition-colors hover:text-n1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2"
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

        <div className="mb-3 flex items-baseline gap-3">
          <h1 className="font-heading text-3xl font-bold text-n1 sm:text-4xl">
            {category.title}
          </h1>
          <span className="font-heading text-lg text-n6">{categoryVideos.length} videos</span>
        </div>
        <p className="max-w-2xl text-base leading-relaxed text-n4">
          {category.description}
        </p>
        <div className="mb-10 mt-8 border-t border-n8/40" />

        {categoryVideos.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryVideos.map((video) => (
              <VideoCard key={video.id} video={video} fluid hideCategory />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="mb-4 h-16 w-16 text-n7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <p className="font-heading text-lg font-medium text-n4">No videos yet</p>
            <p className="mt-1 text-sm text-n6">Check back soon for new content in this category.</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-qube-blue px-5 py-2.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-qube-blue/85"
            >
              Browse all videos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
