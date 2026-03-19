import Link from "next/link";
import Image from "next/image";
import { Video } from "@/types";
import { ReactNode } from "react";
import { categories } from "@/data/videos";

/** Returns true when the description adds little value beyond the title. */
function isDescriptionRedundant(title: string, description: string): boolean {
  const t = title.toLowerCase().trim();
  const d = description.toLowerCase().trim();
  if (d === t) return true;
  // Description starts with or contains the full title
  if (d.startsWith(t) || d.includes(t)) return true;
  // Title is a substring of the first sentence of description
  const firstSentence = d.split(/[.!?]/)[0];
  if (firstSentence.includes(t)) return true;
  return false;
}

export default function Hero({ video, actions }: Readonly<{ video: Video; actions?: ReactNode }>) {
  const category = categories.find((c) => c.slug === video.category);
  const showDescription = video.description && !isDescriptionRedundant(video.title, video.description);
  // For LCP quality, upgrade YouTube CDN thumbnails to maxresdefault (1280×720).
  // Videos with local fallback thumbnails (those that lacked maxresdefault) keep
  // their local file instead — identified by their non-https:// thumbnail path.
  const heroSrc = video.thumbnail.startsWith("https://")
    ? `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`
    : video.thumbnail;

  return (
    <>
      {/* Mobile card layout */}
      <section className="pt-20 px-4 sm:hidden">
        <div className="overflow-hidden rounded-xl bg-n9 border border-n8/60 shadow-xl shadow-black/40">
          <div className="relative aspect-video">
            <Image
              src={heroSrc}
              alt={video.title}
              className="object-cover"
              priority
              sizes="100vw"
              fetchPriority="high"
              fill
            />
          </div>
          <div className="p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-block rounded bg-qube-blue px-3 py-1 font-heading text-sm font-medium text-white">
                Featured
              </span>
              {category && (
                <span className="inline-block rounded bg-n8 px-3 py-1 font-heading text-sm font-medium text-n3">
                  {category.title}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded bg-n8 px-3 py-1 font-heading text-sm font-medium text-n3">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {video.duration}
              </span>
            </div>
            {/* h2: the desktop section already renders an h1 with the same title.
                Using h2 here avoids duplicate h1 in the DOM (both sections are
                always present; CSS merely hides one). Crawlers see a single h1. */}
            <h2 className="mb-2 font-heading text-xl font-bold text-n1">
              {video.title}
            </h2>
            {showDescription && (
              <p className="mb-4 text-sm leading-relaxed text-n4 line-clamp-2">
                {video.description}
              </p>
            )}
            <Link
              href={`/watch/${video.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-sonar-red px-6 py-3 font-heading text-sm font-semibold text-white shadow-lg shadow-sonar-red/25 transition-all duration-200 hover:bg-sonar-red/85 active:translate-y-0 active:shadow-md active:shadow-sonar-red/20"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </Link>
            {actions && <div className="mt-3">{actions}</div>}
          </div>
        </div>
      </section>

      {/* Desktop full-bleed hero */}
      <section className="relative hidden h-[70vh] min-h-[500px] w-full sm:block">
        <Image
          src={heroSrc}
          alt={video.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          fetchPriority="high"
        />
        {/* Bottom-up gradient: cinematic rise — clear thumbnail zone top 75%, text zone bottom 25% */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 via-[25%] to-transparent dark:from-background dark:via-background/70" />
        {/* Left-side gradient: lighter touch so thumbnail colors show through more on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 via-[45%] to-transparent dark:from-background/55 dark:via-background/15" />
        {/* Top vignette: lifts badge row above bright sky thumbnails */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent dark:from-background/35" />

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-block rounded bg-qube-blue px-3 py-1 font-heading text-sm font-medium text-white">
                  Featured
                </span>
                {category && (
                  <span className="inline-block rounded bg-black/80 px-3 py-1 font-heading text-sm font-medium text-white dark:bg-black/60">
                    {category.title}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded bg-black/90 px-3 py-1 font-heading text-sm font-medium text-white dark:bg-black/80">
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
              {showDescription && (
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
    </>
  );
}
