import type { Metadata } from "next";
import Link from "next/link";
import { courses, getCourseVideos, getCourseTotalDuration } from "@/data/courses";
import CourseIndexCards from "@/components/CourseIndexCards";

export const metadata: Metadata = {
  title: "Certification Courses | Sonar.tv",
  description:
    "Structured learning paths for SonarQube certification prep. Master code quality, security, DevOps integration, AI code verification, and enterprise architecture.",
  openGraph: {
    title: "Certification Courses | Sonar.tv",
    description:
      "Structured learning paths for SonarQube certification prep. Master code quality, security, DevOps integration, AI code verification, and enterprise architecture.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SonarQube Certification Courses on Sonar.tv",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Certification Courses | Sonar.tv",
    description:
      "Structured learning paths for SonarQube certification prep. Master code quality, security, DevOps integration, AI code verification, and enterprise architecture.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/courses",
  },
};

const totalVideos = courses.reduce(
  (sum, c) => sum + getCourseVideos(c).length,
  0
);

export default function CoursesPage() {
  return (
    <div className="pt-20 pb-16">
      {/* Hero banner */}
      <div className="relative overflow-hidden border-b border-n8/50">
        <div className="absolute inset-0 bg-gradient-to-br from-sonar-red/8 via-transparent to-qube-blue/8" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Link
            href="/"
            className="group mb-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-2 font-heading text-sm text-n5 transition-colors hover:bg-n1/5 hover:text-n1 -ml-3"
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
            Home
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <svg
              className="h-8 w-8 text-sonar-red"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
              />
            </svg>
            <h1 className="font-heading text-3xl font-bold text-n1 sm:text-4xl">
              Certification Courses
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-n4">
            Structured learning paths curated from our video library. Follow
            each course in sequence to build expertise — from first scan to
            enterprise governance.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sonar-red/15">
                <svg className="h-4 w-4 text-sonar-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              <div>
                <p className="font-heading text-lg font-bold text-n1">{courses.length}</p>
                <p className="text-xs text-n5">Courses</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-qube-blue/15">
                <svg className="h-4 w-4 text-qube-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
              </span>
              <div>
                <p className="font-heading text-lg font-bold text-n1">{totalVideos}</p>
                <p className="text-xs text-n5">Videos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sonar-purple/15">
                <svg className="h-4 w-4 text-sonar-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </span>
              <div>
                <p className="font-heading text-lg font-bold text-n1">3</p>
                <p className="text-xs text-n5">Difficulty levels</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course cards with client-side filtering */}
      <CourseIndexCards />
    </div>
  );
}
