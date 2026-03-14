import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getCategoryBySlug, getVideosByCategory } from "@/data/videos";
import VideoCard from "@/components/VideoCard";

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
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

  return (
    <div className="pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 font-heading text-sm text-n6 transition-colors hover:text-n1"
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
        <p className="max-w-2xl text-base leading-relaxed text-n5">
          {category.description}
        </p>
        <div className="mb-10 mt-8 border-t border-n8/40" />

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryVideos.map((video) => (
            <VideoCard key={video.id} video={video} fluid />
          ))}
        </div>
      </div>
    </div>
  );
}
