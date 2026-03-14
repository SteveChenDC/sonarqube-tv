import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { categories, getCategoryBySlug, getVideosByCategory } from "@/data/videos";

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

        <h1 className="mb-2 font-heading text-3xl font-bold text-n1 sm:text-4xl">
          {category.title}
        </h1>
        <p className="mb-8 max-w-2xl text-base text-n6">
          {category.description}
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryVideos.map((video) => (
            <Link
              key={video.id}
              href={`/watch/${video.id}`}
              className="group"
            >
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-sonar-purple/40">
                  <svg
                    className="h-12 w-12 text-n1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="absolute bottom-2 right-2 rounded bg-n9/80 px-1.5 py-0.5 text-xs font-medium text-n1">
                  {video.duration}
                </span>
              </div>
              <h3 className="mt-2 line-clamp-2 font-heading text-sm font-medium text-n3 transition-colors group-hover:text-n1">
                {video.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-n7">
                {video.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
