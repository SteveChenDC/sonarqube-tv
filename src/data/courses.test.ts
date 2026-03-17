import { describe, it, expect } from "vitest";
import {
  courses,
  getCourseBySlug,
  getCoursesForVideo,
  getCourseVideos,
  getCourseTotalDuration,
  getVideoPositionInCourse,
} from "./courses";
import { getVideoById } from "./videos";

describe("courses data", () => {
  it("exports 5 courses", () => {
    expect(courses).toHaveLength(5);
  });

  it("each course has unique slug and id", () => {
    const slugs = courses.map((c) => c.slug);
    const ids = courses.map((c) => c.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all video IDs in courses reference real videos", () => {
    for (const course of courses) {
      for (const mod of course.modules) {
        for (const vid of mod.videoIds) {
          expect(getVideoById(vid)).toBeDefined();
        }
      }
    }
  });
});

describe("getCourseBySlug", () => {
  it("finds course by slug", () => {
    const course = getCourseBySlug("sonarqube-certified-developer");
    expect(course?.id).toBe("scd");
  });

  it("returns undefined for unknown slug", () => {
    expect(getCourseBySlug("nonexistent")).toBeUndefined();
  });
});

describe("getCoursesForVideo", () => {
  it("returns courses containing a video", () => {
    // v177 is in SCD module 1
    const found = getCoursesForVideo("v177");
    expect(found.length).toBeGreaterThanOrEqual(1);
    expect(found.some((c) => c.id === "scd")).toBe(true);
  });

  it("returns empty for video not in any course", () => {
    // v5 (sonar summit keynote) is not in any course
    const found = getCoursesForVideo("v5");
    expect(found).toHaveLength(0);
  });
});

describe("getCourseVideos", () => {
  it("returns all videos in order", () => {
    const course = getCourseBySlug("sonarqube-certified-developer")!;
    const videos = getCourseVideos(course);
    expect(videos.length).toBeGreaterThanOrEqual(10);
    // First video should be from module 1
    expect(course.modules[0].videoIds).toContain(videos[0].id);
  });
});

describe("getCourseTotalDuration", () => {
  it("returns a formatted duration string", () => {
    const course = courses[0];
    const duration = getCourseTotalDuration(course);
    expect(duration).toMatch(/\d+h|\d+m/);
  });
});

describe("getVideoPositionInCourse", () => {
  it("returns step number for video in course", () => {
    const course = getCourseBySlug("sonarqube-certified-developer")!;
    const firstVideoId = course.modules[0].videoIds[0];
    const pos = getVideoPositionInCourse(course, firstVideoId);
    expect(pos).toEqual({
      step: 1,
      total: expect.any(Number),
      moduleIndex: 0,
    });
  });

  it("returns null for video not in course", () => {
    const course = courses[0];
    expect(getVideoPositionInCourse(course, "v999")).toBeNull();
  });
});
