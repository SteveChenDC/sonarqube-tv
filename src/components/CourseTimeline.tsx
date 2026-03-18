"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/types";
import { getVideoById } from "@/data/videos";
import { getCourseVideos } from "@/data/courses";
import {
  getModuleProgress,
  getVideoStepState,
  isCourseCompleted,
  getCourseProgress,
} from "@/lib/courseProgress";
import { getProgress } from "@/lib/watchProgress";

function ModuleAccordion({
  mod,
  moduleIndex,
  course,
  globalStepOffset,
  defaultOpen,
}: Readonly<{
  mod: Course["modules"][number];
  moduleIndex: number;
  course: Course;
  globalStepOffset: number;
  defaultOpen: boolean;
}>) {
  const [open, setOpen] = useState(defaultOpen);
  const modProgress = getModuleProgress(mod);
  const isModuleComplete = modProgress.completed === modProgress.total;

  return (
    <div className="border border-n8 first:rounded-t-xl last:rounded-b-xl -mt-px first:mt-0">
      {/* Accordion header */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-n8/30 sm:px-5"
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            isModuleComplete
              ? "bg-sonar-red text-white"
              : "bg-n8 text-n4"
          }`}
        >
          {isModuleComplete ? (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            moduleIndex + 1
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-semibold text-n1 sm:text-base">
            {mod.title}
          </h3>
          <p className="mt-0.5 text-xs text-n5">
            {mod.videoIds.length} videos &middot; {modProgress.completed} of {modProgress.total} complete
          </p>
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-n5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Accordion content */}
      {open && (
        <div className="border-t border-n8 bg-n9/30">
          {mod.description && (
            <p className="px-4 pt-3 pb-1 text-xs text-n5 sm:px-5">
              {mod.description}
            </p>
          )}
          <div className="relative ml-4 border-l-2 border-sonar-red/30 py-1 sm:ml-5">
            {mod.videoIds.map((vid, vi) => {
              const video = getVideoById(vid);
              if (!video) return null;
              const state = getVideoStepState(course, vid);
              const watchProgress = getProgress(vid);
              const stepNum = globalStepOffset + vi + 1;

              return (
                <Link
                  key={vid}
                  href={`/watch/${vid}?course=${course.slug}`}
                  className={`group relative -ml-[13px] flex items-center gap-3 rounded-lg py-2 pl-[13px] pr-3 transition-colors hover:bg-n8/40 sm:pr-4 ${
                    state === "current" ? "bg-n8/20" : ""
                  }`}
                >
                  {/* Step circle on the timeline */}
                  <span
                    className={`absolute left-0 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      state === "completed"
                        ? "bg-sonar-red text-white"
                        : state === "current"
                          ? "ring-2 ring-sonar-red bg-background text-sonar-red"
                          : "bg-n8 text-n5"
                    }`}
                  >
                    {state === "completed" ? (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      stepNum
                    )}
                  </span>

                  {/* Thumbnail */}
                  <div className="relative ml-4 h-10 w-[72px] shrink-0 overflow-hidden rounded-md sm:h-12 sm:w-[85px]">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                      sizes="85px"
                    />
                    {watchProgress > 0 && watchProgress < 90 && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-n7">
                        <div
                          className="h-full bg-sonar-red"
                          style={{ width: `${watchProgress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Title + duration */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate font-heading text-xs transition-colors sm:text-sm ${
                        state === "current"
                          ? "font-semibold text-n1"
                          : state === "completed"
                            ? "text-n4"
                            : "text-n3 group-hover:text-n1"
                      }`}
                    >
                      {video.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-n5 sm:text-xs">
                      {video.duration}
                    </p>
                  </div>

                  {/* Play icon for current */}
                  {state === "current" && (
                    <svg className="h-4 w-4 shrink-0 text-sonar-red" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CourseTimeline({
  course,
}: Readonly<{ course: Course }>) {
  // useSyncExternalStore transitions server→client synchronously during hydration,
  // replacing the useState+useEffect setTick pattern to eliminate the extra render cycle.
  useSyncExternalStore(() => () => {}, () => true, () => false);

  const completed = isCourseCompleted(course);
  const progress = getCourseProgress(course);

  // Determine which module to open by default (the one with the current step)
  let stepCount = 0;
  let defaultOpenIndex = 0;
  for (let i = 0; i < course.modules.length; i++) {
    const mp = getModuleProgress(course.modules[i]);
    if (mp.completed < mp.total) {
      defaultOpenIndex = i;
      break;
    }
    stepCount += course.modules[i].videoIds.length;
    if (i === course.modules.length - 1) defaultOpenIndex = i;
  }

  // Calculate step offsets per module
  const moduleOffsets: number[] = [];
  let offset = 0;
  for (const mod of course.modules) {
    moduleOffsets.push(offset);
    offset += mod.videoIds.length;
  }

  return (
    <div>
      {completed && (
        <div className="mb-6 rounded-xl border border-qube-blue/30 bg-gradient-to-r from-sonar-red/10 via-qube-blue/10 to-sonar-red/10 p-5 text-center">
          <svg
            className="mx-auto mb-2 h-8 w-8 text-qube-blue"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg>
          <h3 className="font-heading text-base font-bold text-n1">
            Course Complete
          </h3>
          <p className="mt-1 text-sm text-n4">
            {course.title}
          </p>
        </div>
      )}

      {/* Summary bar */}
      <div className="mb-4 flex items-center justify-between rounded-lg bg-n8/30 px-4 py-2.5">
        <span className="font-heading text-xs text-n4">
          {course.modules.length} modules &middot; {offset} videos
        </span>
        {progress.percent > 0 && (
          <span className="font-heading text-xs font-semibold text-sonar-red">
            {progress.percent}% complete
          </span>
        )}
      </div>

      {/* Accordion modules */}
      <div>
        {course.modules.map((mod, mi) => (
          <ModuleAccordion
            key={mod.id}
            mod={mod}
            moduleIndex={mi}
            course={course}
            globalStepOffset={moduleOffsets[mi]}
            defaultOpen={mi === defaultOpenIndex}
          />
        ))}
      </div>
    </div>
  );
}
