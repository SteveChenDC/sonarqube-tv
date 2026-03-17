"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCourseBySlug, getCourseVideos, getVideoPositionInCourse } from "@/data/courses";
import { getCourseProgress } from "@/lib/courseProgress";

interface CourseNavBarProps {
  videoId: string;
}

export default function CourseNavBar({ videoId }: Readonly<CourseNavBarProps>) {
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get("course");
  const [, setTick] = useState(0);

  useEffect(() => setTick(1), []);

  if (!courseSlug) return null;

  const course = getCourseBySlug(courseSlug);
  if (!course) return null;

  const position = getVideoPositionInCourse(course, videoId);
  if (!position) return null;

  const allVideos = getCourseVideos(course);
  const prevVideo = position.step > 1 ? allVideos[position.step - 2] : null;
  const nextVideo =
    position.step < position.total ? allVideos[position.step] : null;
  const progress = getCourseProgress(course);

  return (
    <div className="mt-4 rounded-xl border border-n8 bg-n8/15 p-3 sm:p-4">
      <div className="flex items-center gap-3">
        {/* Course link */}
        <Link
          href={`/courses/${course.slug}`}
          className="min-w-0 flex-1 group"
        >
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 shrink-0 text-sonar-red"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
              />
            </svg>
            <span className="truncate font-heading text-xs font-semibold text-n2 transition-colors group-hover:text-n1 sm:text-sm">
              {course.title}
            </span>
          </div>
        </Link>

        {/* Step counter */}
        <span className="shrink-0 font-heading text-xs text-n5">
          Step {position.step} of {position.total}
        </span>

        {/* Nav buttons */}
        <div className="flex items-center gap-1">
          {prevVideo ? (
            <Link
              href={`/watch/${prevVideo.id}?course=${courseSlug}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-n5 transition-colors hover:bg-n8 hover:text-n1"
              aria-label="Previous step"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          ) : (
            <span
              className="flex h-8 w-8 items-center justify-center rounded-md text-n7"
              aria-disabled="true"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
          )}
          {nextVideo ? (
            <Link
              href={`/watch/${nextVideo.id}?course=${courseSlug}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-n5 transition-colors hover:bg-n8 hover:text-n1"
              aria-label="Next step"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : (
            <span
              className="flex h-8 w-8 items-center justify-center rounded-md text-n7"
              aria-disabled="true"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1 rounded-full bg-n8">
        <div
          className="h-full rounded-full bg-sonar-red transition-all duration-300"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  );
}
