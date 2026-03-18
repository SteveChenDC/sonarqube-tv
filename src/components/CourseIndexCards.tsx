"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { courses, getCourseVideos, getCourseTotalDuration } from "@/data/courses";
import {
  getCourseProgress,
  getNextUnwatchedVideo,
  isCourseCompleted,
  getModuleProgress,
} from "@/lib/courseProgress";
import type { Course } from "@/types";

type DifficultyFilter = "all" | "beginner" | "intermediate" | "advanced";

const difficultyStyles = {
  beginner: "text-qube-blue border-qube-blue/30 bg-qube-blue/10",
  intermediate: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  advanced: "text-sonar-red border-sonar-red/30 bg-sonar-red/10",
} as const;

const accentBorder = {
  "sonar-red": "border-l-sonar-red",
  "qube-blue": "border-l-qube-blue",
  "sonar-purple": "border-l-sonar-purple",
} as const;

function EnrichedCourseCard({ course }: Readonly<{ course: Course }>) {
  // useSyncExternalStore eliminates the useState(false)+useEffect setMounted double-render:
  // getServerSnapshot returns false (SSR/static-gen), getSnapshot returns true (client).
  // React transitions between them during hydration — no extra render cycle needed.
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const totalVideos = getCourseVideos(course).length;
  const duration = getCourseTotalDuration(course);
  const progress = mounted ? getCourseProgress(course) : null;
  const completed = mounted ? isCourseCompleted(course) : false;
  const nextVideo = mounted ? getNextUnwatchedVideo(course) : null;
  const moduleProgresses = mounted
    ? course.modules.map((m) => getModuleProgress(m))
    : null;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-l-4 border-n8 bg-n9/60 transition-all duration-200 hover:border-n7 hover:bg-n8/20 ${accentBorder[course.accentColor]}`}
    >
      <div className="p-5 sm:p-6">
        {/* Top row: badge + completion */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-heading text-[10px] font-semibold uppercase tracking-wider ${difficultyStyles[course.difficulty]}`}
          >
            {course.difficulty}
          </span>
          {completed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-qube-blue/15 px-2 py-0.5 font-heading text-[10px] font-bold text-qube-blue">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Complete
            </span>
          )}
          {progress && progress.percent > 0 && !completed && (
            <span className="font-heading text-xs font-semibold text-sonar-red">
              {progress.percent}%
            </span>
          )}
        </div>

        {/* Title + description */}
        <Link href={`/courses/${course.slug}`} className="mt-3 block">
          <h3 className="font-heading text-lg font-bold text-n1 transition-colors group-hover:text-qube-blue sm:text-xl">
            {course.title}
          </h3>
        </Link>
        <p className="mt-2 text-sm leading-relaxed text-n4 line-clamp-2">
          {course.description}
        </p>

        {/* Stats row */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-n5">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-n6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            {course.modules.length} modules
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-n6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
            {totalVideos} videos
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-n6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {duration}
          </span>
        </div>

        {/* Learning outcomes preview */}
        <div className="mt-4 space-y-1.5">
          {course.learningOutcomes.slice(0, 3).map((outcome) => (
            <div key={outcome} className="flex items-start gap-2">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-qube-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs leading-relaxed text-n4">{outcome}</span>
            </div>
          ))}
          {course.learningOutcomes.length > 3 && (
            <p className="pl-5.5 text-xs text-n6">
              +{course.learningOutcomes.length - 3} more
            </p>
          )}
        </div>

        {/* Module progress bar */}
        {moduleProgresses && progress && progress.percent > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-heading text-[10px] font-medium uppercase tracking-wider text-n6">
                Progress
              </span>
              <span className="font-heading text-[10px] text-n5">
                {progress.completed}/{progress.total} videos
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-n8">
              <div
                className="h-full rounded-full bg-sonar-red transition-all duration-300"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-5 flex items-center gap-3">
          {nextVideo && !completed ? (
            <>
              <Link
                href={`/watch/${nextVideo.id}?course=${course.slug}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-sonar-red px-4 py-2.5 font-heading text-xs font-semibold text-white transition-colors hover:bg-sonar-red/85"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {progress && progress.completed > 0 ? "Continue" : "Start Course"}
              </Link>
              <Link
                href={`/courses/${course.slug}`}
                className="inline-flex items-center gap-1 font-heading text-xs font-medium text-n4 transition-colors hover:text-n1"
              >
                View syllabus
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </>
          ) : (
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-n7 bg-n8/40 px-4 py-2.5 font-heading text-xs font-semibold text-n2 transition-colors hover:bg-n8 hover:text-n1"
            >
              {completed ? "Review Course" : "View Syllabus"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CourseIndexCards() {
  const [filter, setFilter] = useState<DifficultyFilter>("all");

  const filtered =
    filter === "all"
      ? courses
      : courses.filter((c) => c.difficulty === filter);

  const tabs: { value: DifficultyFilter; label: string; count: number }[] = [
    { value: "all", label: "All Courses", count: courses.length },
    { value: "beginner", label: "Beginner", count: courses.filter((c) => c.difficulty === "beginner").length },
    { value: "intermediate", label: "Intermediate", count: courses.filter((c) => c.difficulty === "intermediate").length },
    { value: "advanced", label: "Advanced", count: courses.filter((c) => c.difficulty === "advanced").length },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Difficulty filter tabs */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-heading text-xs font-semibold transition-colors ${
              filter === tab.value
                ? "bg-sonar-red text-white"
                : "border border-n7 bg-n8/40 text-n3 hover:bg-n8 hover:text-n1"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                filter === tab.value
                  ? "bg-white/20 text-white"
                  : "bg-n8 text-n5"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filtered.map((course) => (
          <EnrichedCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
