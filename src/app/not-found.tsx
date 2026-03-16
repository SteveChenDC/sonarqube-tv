import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-sonar-purple/20 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-qube-blue/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Big 404 */}
        <div className="relative select-none">
          <span
            aria-hidden="true"
            className="font-heading text-[clamp(6rem,20vw,14rem)] font-bold leading-none tracking-tight text-n8"
          >
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center font-heading text-[clamp(6rem,20vw,14rem)] font-bold leading-none tracking-tight">
            <span className="bg-gradient-to-br from-sonar-purple via-qube-blue to-sonar-red bg-clip-text text-transparent">
              404
            </span>
          </span>
        </div>

        {/* Divider */}
        <div className="mt-2 h-px w-24 bg-gradient-to-r from-transparent via-n7 to-transparent" />

        {/* Heading */}
        <h1 className="mt-6 font-heading text-2xl font-semibold text-n1 sm:text-3xl">
          Page not found
        </h1>

        {/* Body copy */}
        <p className="mt-3 max-w-sm font-body text-base leading-relaxed text-n5">
          Looks like this video went offline. Head back home to find something
          great to watch.
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-qube-blue px-6 py-3 font-heading text-sm font-semibold text-white shadow-lg shadow-qube-blue/20 transition-all hover:bg-qube-blue/90 hover:shadow-qube-blue/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qube-blue"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7m-9 5v6h4v-6m-4 0H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1"
              />
            </svg>
            Back to Home
          </Link>

          <Link
            href="/category/getting-started"
            className="inline-flex items-center gap-2 rounded-lg border border-n7 px-6 py-3 font-heading text-sm font-semibold text-n3 transition-all hover:border-n5 hover:text-n1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qube-blue"
          >
            Browse tutorials
          </Link>
        </div>

        {/* Sonar brand tag */}
        <p className="mt-10 font-body text-xs text-n7">
          Sonar.tv — Video tutorials for code quality &amp; security
        </p>
      </div>
    </div>
  );
}
