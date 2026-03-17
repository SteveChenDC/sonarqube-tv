/**
 * courses.ts — course helper functions + re-export of courses data.
 *
 * The `courses` array lives in courses-data.ts, which has NO dependency on
 * videos.ts. This keeps the 228-video array (~86 KB) out of any bundle that
 * only needs course metadata (e.g., HomeContent, Header dropdown).
 *
 * The helper functions below DO import getVideoById → videos.ts. They are
 * only called from dynamically-imported client components (CourseCard,
 * CourseSidebar, CourseTimeline) and server components (CourseBadge,
 * watch/[id] page), so they do NOT inflate the initial client bundle.
 */
import type { Course, Video } from "@/types";
import { getVideoById } from "./videos";

// Re-export so all existing importers (`import { courses } from "@/data/courses"`)
// continue to work unchanged — but the array now lives in courses-data.ts.
export { courses } from "./courses-data";
import { courses } from "./courses-data";

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getCoursesForVideo(videoId: string): Course[] {
  return courses.filter((c) =>
    c.modules.some((m) => m.videoIds.includes(videoId))
  );
}

export function getCourseVideos(course: Course): Video[] {
  const vids: Video[] = [];
  for (const mod of course.modules) {
    for (const vid of mod.videoIds) {
      const v = getVideoById(vid);
      if (v) vids.push(v);
    }
  }
  return vids;
}

function parseDuration(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

export function getCourseTotalDuration(course: Course): string {
  const videos = getCourseVideos(course);
  const totalSeconds = videos.reduce(
    (sum, v) => sum + parseDuration(v.duration),
    0
  );
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.round((totalSeconds % 3600) / 60);
  if (hours === 0) return `${mins}m`;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getVideoPositionInCourse(
  course: Course,
  videoId: string
): { step: number; total: number; moduleIndex: number } | null {
  let step = 0;
  const allVideos = getCourseVideos(course);
  for (let mi = 0; mi < course.modules.length; mi++) {
    for (const vid of course.modules[mi].videoIds) {
      step++;
      if (vid === videoId) {
        return { step, total: allVideos.length, moduleIndex: mi };
      }
    }
  }
  return null;
}
