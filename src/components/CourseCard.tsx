"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/types";
import {
  getCourseProgress,
  getModuleProgress,
  getNextUnwatchedVideo,
  isCourseCompleted,
} from "@/lib/courseProgress";
import { getCourseVideos, getCourseTotalDuration } from "@/data/courses";

const difficultyStyles = {
  beginner: "bg-qube-blue/15 text-qube-blue border-qube-blue/30",
  intermediate: "bg-sonar-purple/25 text-n3 border-sonar-purple/40",
  advanced: "bg-sonar-red/15 text-sonar-red border-sonar-red/30",
} as const;

const difficultyLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;

export default function CourseCard({
  course,
}: Readonly<{ course: Course }>) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalVideos = getCourseVideos(course).length;
  const duration = getCourseTotalDuration(course);
  const progress = mounted ? getCourseProgress(course) : null;
  const completed = mounted ? isCourseCompleted(course) : false;
  const nextVideo = mounted ? getNextUnwatchedVideo(course) : null;

  const moduleProgresses = mounted
    ? course.modules.map((m) => getModuleProgress(m))
    : null;

  // Find current module index
  const currentModuleIndex = moduleProgresses
    ? moduleProgresses.findIndex((mp) => mp.completed < mp.total)
    : 0;

  return (
    <div className="group relative flex w-[300px] shrink-0 flex-col overflow-hidden rounded-xl border border-n8 bg-n9/60 transition-all duration-200 hover:-translate-y-1 hover:border-sonar-red/30 hover:bg-n8/30 hover:shadow-lg hover:shadow-sonar-red/20 sm:w-[320px]">
      {/* Course image header */}
      <div className="relative h-36 overflow-hidden">
        <Image
          src={`/courses/${course.id}.png`}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="320px"
        />

        {/* Completion badge overlay */}
        {completed && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-qube-blue/20 px-2 py-1 backdrop-blur-sm">
            <svg
              className="h-3.5 w-3.5 text-qube-blue"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-heading text-[10px] font-bold text-qube-blue">
              Complete
            </span>
          </div>
        )}

        {/* Progress bar at bottom of image area */}
        {progress && progress.percent > 0 && !completed && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-n8/50">
            <div
              className="h-full bg-sonar-red transition-all duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Difficulty badge */}
        <span
          className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 font-heading text-[10px] font-semibold uppercase tracking-wider ${difficultyStyles[course.difficulty]}`}
        >
          {difficultyLabels[course.difficulty]}
        </span>

        <h3 className="mt-2 font-heading text-sm font-bold leading-tight text-n1 line-clamp-2">
          {course.title}
        </h3>

        <p className="mt-1 text-xs text-n5">
          {course.modules.length} modules &middot; {totalVideos} videos &middot;{" "}
          {duration}
        </p>

        {/* Module progress dots */}
        <div className="mt-3 flex items-center gap-1.5">
          <div className="flex items-center gap-0">
            {course.modules.map((mod, i) => {
              const mp = moduleProgresses?.[i];
              const isCompleted = mp ? mp.completed === mp.total : false;
              const isCurrent =
                !isCompleted &&
                i ===
                  (currentModuleIndex === -1
                    ? course.modules.length - 1
                    : currentModuleIndex);

              return (
                <div key={mod.id} className="flex items-center">
                  {i > 0 && (
                    <div
                      className={`h-px w-3 ${isCompleted || (moduleProgresses && i <= currentModuleIndex) ? "bg-sonar-red/60" : "bg-n7/40"}`}
                    />
                  )}
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      isCompleted
                        ? "bg-sonar-red"
                        : isCurrent
                          ? "ring-2 ring-sonar-red bg-background"
                          : "bg-n7/40"
                    }`}
                  />
                </div>
              );
            })}
          </div>
          {moduleProgresses && (
            <span className="ml-1 font-heading text-[10px] text-n5">
              Module{" "}
              {currentModuleIndex === -1
                ? course.modules.length
                : currentModuleIndex + 1}{" "}
              of {course.modules.length}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-3">
          {nextVideo && !completed ? (
            <Link
              href={`/watch/${nextVideo.id}?course=${course.slug}`}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-sonar-red px-4 py-2 font-heading text-xs font-semibold text-white transition-colors hover:bg-sonar-red/85"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              {progress && progress.completed > 0 ? "Continue" : "Start Course"}
            </Link>
          ) : (
            <Link
              href={`/courses/${course.slug}`}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-n7 bg-n8/40 px-4 py-2 font-heading text-xs font-semibold text-n2 transition-colors hover:bg-n8 hover:text-n1"
            >
              {completed ? "Review Course" : "View Course"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
