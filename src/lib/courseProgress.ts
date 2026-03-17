import { Course, CourseModule, Video } from "@/types";
import { getAllProgress } from "./watchProgress";
import { getCourseVideos, getVideoPositionInCourse } from "@/data/courses";
import { getVideoById } from "@/data/videos";

const COMPLETION_THRESHOLD = 90;

export function getCourseProgress(course: Course): {
  completed: number;
  total: number;
  percent: number;
  currentStep: number;
} {
  const progress = getAllProgress();
  const allVideos = getCourseVideos(course);
  const total = allVideos.length;
  let completed = 0;
  let currentStep = 1;
  let foundCurrent = false;

  for (let i = 0; i < allVideos.length; i++) {
    const p = progress[allVideos[i].id] ?? 0;
    if (p >= COMPLETION_THRESHOLD) {
      completed++;
    } else if (!foundCurrent) {
      currentStep = i + 1;
      foundCurrent = true;
    }
  }

  if (!foundCurrent && completed === total) {
    currentStep = total;
  }

  return {
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    currentStep,
  };
}

export function getModuleProgress(mod: CourseModule): {
  completed: number;
  total: number;
} {
  const progress = getAllProgress();
  let completed = 0;
  for (const vid of mod.videoIds) {
    if ((progress[vid] ?? 0) >= COMPLETION_THRESHOLD) {
      completed++;
    }
  }
  return { completed, total: mod.videoIds.length };
}

export function getNextUnwatchedVideo(course: Course): Video | null {
  const progress = getAllProgress();
  const allVideos = getCourseVideos(course);
  for (const v of allVideos) {
    if ((progress[v.id] ?? 0) < COMPLETION_THRESHOLD) {
      return v;
    }
  }
  return null;
}

export function isVideoCompleted(videoId: string): boolean {
  const progress = getAllProgress();
  return (progress[videoId] ?? 0) >= COMPLETION_THRESHOLD;
}

export function isCourseCompleted(course: Course): boolean {
  const { completed, total } = getCourseProgress(course);
  return total > 0 && completed === total;
}

export function getVideoStepState(
  course: Course,
  videoId: string
): "completed" | "current" | "upcoming" {
  const progress = getAllProgress();
  const p = progress[videoId] ?? 0;
  if (p >= COMPLETION_THRESHOLD) return "completed";

  // Check if this is the first unwatched video
  const allVideos = getCourseVideos(course);
  for (const v of allVideos) {
    if ((progress[v.id] ?? 0) < COMPLETION_THRESHOLD) {
      return v.id === videoId ? "current" : "upcoming";
    }
  }
  return "upcoming";
}

export { getVideoPositionInCourse, getCourseVideos };
