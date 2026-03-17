"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Course } from "@/types";
import { getCourseVideos, getCourseTotalDuration } from "@/data/courses";
import {
  getCourseProgress,
  getNextUnwatchedVideo,
  isCourseCompleted,
} from "@/lib/courseProgress";

export default function CourseSidebar({
  course,
}: Readonly<{ course: Course }>) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalVideos = getCourseVideos(course).length;
  const duration = getCourseTotalDuration(course);
  const progress = mounted ? getCourseProgress(course) : null;
  const completed = mounted ? isCourseCompleted(course) : false;
  const nextVideo = mounted ? getNextUnwatchedVideo(course) : null;

  return (
    <div className="lg:sticky lg:top-24">
      <div className="rounded-xl border border-n8 bg-n9/60 overflow-hidden">
        {/* Progress ring or course accent */}
        <div className="flex items-center justify-center bg-gradient-to-br from-n8/50 to-n8/20 p-6">
          {progress && progress.percent > 0 ? (
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-n8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress.percent / 100)}`}
                  className="text-sonar-red transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-2xl font-bold text-n1">
                  {progress.percent}%
                </span>
                <span className="font-heading text-[10px] text-n5">complete</span>
              </div>
            </div>
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-n8/60">
              <span className="font-heading text-3xl font-black text-n1/30">
                {course.shortTitle}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          {/* CTA button */}
          {nextVideo && !completed ? (
            <Link
              href={`/watch/${nextVideo.id}?course=${course.slug}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-sonar-red px-4 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-sonar-red/85"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {progress && progress.completed > 0 ? "Continue Course" : "Start Course"}
            </Link>
          ) : completed ? (
            <div className="rounded-lg border border-qube-blue/30 bg-qube-blue/10 px-4 py-3 text-center font-heading text-sm font-semibold text-qube-blue">
              Course Completed
            </div>
          ) : (
            <Link
              href={`/courses/${course.slug}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-sonar-red px-4 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-sonar-red/85"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start Course
            </Link>
          )}

          {/* Key info */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-n5">Modules</span>
              <span className="font-heading text-xs font-semibold text-n2">{course.modules.length}</span>
            </div>
            <div className="h-px bg-n8" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-n5">Videos</span>
              <span className="font-heading text-xs font-semibold text-n2">{totalVideos}</span>
            </div>
            <div className="h-px bg-n8" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-n5">Duration</span>
              <span className="font-heading text-xs font-semibold text-n2">{duration}</span>
            </div>
            <div className="h-px bg-n8" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-n5">Level</span>
              <span className="font-heading text-xs font-semibold text-n2 capitalize">{course.difficulty}</span>
            </div>
            {progress && progress.percent > 0 && (
              <>
                <div className="h-px bg-n8" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-n5">Completed</span>
                  <span className="font-heading text-xs font-semibold text-n2">
                    {progress.completed} of {progress.total} videos
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
