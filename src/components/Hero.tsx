import Link from "next/link";
import Image from "next/image";
import { Video } from "@/types";
import { ReactNode } from "react";
import { categories } from "@/data/videos";

export default function Hero({ video, actions }: Readonly<{ video: Video; actions?: ReactNode }>) {
  const category = categories.find((c) => c.slug === video.category);
  return (
    <section className="relative h-[70vh] min-h-[500px] w-full">
      <Image
        src={video.thumbnail}
        alt={video.title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-sonar-purple/40 to-transparent" />
      {/* Dark scrim ensures white text stays readable in both themes;
          light mode needs heavier opacity since from-background is near-white */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/15 dark:from-black/40 dark:via-black/20 dark:to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-block rounded bg-qube-blue px-3 py-1 font-heading text-sm font-medium text-white">
                Featured
              </span>
              {category && (
                <span className="inline-block rounded bg-black/60 px-3 py-1 font-heading text-sm font-medium text-white">
                  {category.title}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded bg-black/80 px-3 py-1 font-heading text-sm font-medium text-white">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {video.duration}
              </span>
            </div>
            <h1 className="mb-4 font-heading text-3xl font-bold text-white sm:text-5xl">
              {video.title}
            </h1>
            {video.description && video.description !== video.title && (
              <p className="mb-6 line-clamp-3 text-base leading-relaxed text-white/80 sm:text-lg">
                {video.description}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Link
              href={`/watch/${video.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-sonar-red px-6 py-3 font-heading text-sm font-semibold text-white shadow-lg shadow-sonar-red/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sonar-red/85 hover:shadow-xl hover:shadow-sonar-red/35 active:translate-y-0 active:shadow-md active:shadow-sonar-red/20"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </Link>
            {actions}
          </div>
        </div>
      </div>
    </section>
  );
}
