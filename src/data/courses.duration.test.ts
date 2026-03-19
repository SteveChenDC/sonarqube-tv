/**
 * courses.duration.test.ts
 *
 * Targeted tests for the three output branches of getCourseTotalDuration:
 *   • "Ym"    — less than one hour  (hours === 0)
 *   • "Xh Ym" — hours AND minutes   (hours > 0, mins > 0)
 *   • "Xh"    — exact hours         (hours > 0, mins === 0)
 *
 * The existing courses.test.ts only checks format with a regex; these tests
 * pin the actual strings produced by each branch.
 *
 * We mock getVideoById so we control durations precisely without depending
 * on the real 228-video dataset.
 */
import { describe, it, expect, vi } from "vitest";
import type { Video, Course } from "@/types";

// ---------------------------------------------------------------------------
// Mock getVideoById to return controlled-duration videos for our test IDs.
// All other IDs fall through to the real implementation.
// ---------------------------------------------------------------------------
vi.mock("@/data/videos", async (importActual) => {
  const actual = await importActual<typeof import("@/data/videos")>();

  const baseVideo: Video = {
    id: "base",
    title: "Test Video",
    description: "Test",
    youtubeId: "abc123",
    thumbnail: "/thumb.jpg",
    category: "tutorials",
    duration: "10:00",
    publishedAt: "2024-01-01",
  };

  return {
    ...actual,
    getVideoById: (id: string): Video | undefined => {
      if (id === "dur-15min") return { ...baseVideo, id, duration: "15:00" };
      if (id === "dur-30min") return { ...baseVideo, id, duration: "30:00" };
      if (id === "dur-35min") return { ...baseVideo, id, duration: "35:00" };
      return actual.getVideoById(id);
    },
  };
});

// Import AFTER the mock is hoisted
import { getCourseTotalDuration } from "@/data/courses";

// ---------------------------------------------------------------------------
// Factory helpers
// ---------------------------------------------------------------------------

function makeCourse(videoIds: string[]): Course {
  return {
    id: "test-course",
    slug: "test-course",
    title: "Test Course",
    shortTitle: "Test",
    description: "A test course",
    difficulty: "beginner",
    targetAudience: "Developers",
    learningOutcomes: [],
    accentColor: "sonar-red",
    modules: [
      {
        id: "mod-1",
        title: "Module 1",
        description: "Module one",
        videoIds,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("getCourseTotalDuration — all three output branches", () => {
  it('returns "Ym" when total is less than one hour', () => {
    // 3 × 15:00 = 45 minutes → "45m"
    const course = makeCourse(["dur-15min", "dur-15min", "dur-15min"]);
    expect(getCourseTotalDuration(course)).toBe("45m");
  });

  it('returns "Xh Ym" when total has both hours and leftover minutes', () => {
    // 2 × 35:00 = 70 minutes = 1h 10m → "1h 10m"
    const course = makeCourse(["dur-35min", "dur-35min"]);
    expect(getCourseTotalDuration(course)).toBe("1h 10m");
  });

  it('returns "Xh" when total is exactly a whole number of hours', () => {
    // 2 × 30:00 = 60 minutes = 1h 0m → "1h"
    const course = makeCourse(["dur-30min", "dur-30min"]);
    expect(getCourseTotalDuration(course)).toBe("1h");
  });

  it("returns 0m for a course with no videos", () => {
    // No videos → totalSeconds = 0 → hours = 0, mins = 0 → "0m"
    const course = makeCourse([]);
    expect(getCourseTotalDuration(course)).toBe("0m");
  });
});
