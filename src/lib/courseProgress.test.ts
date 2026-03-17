import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getCourseProgress,
  getModuleProgress,
  getNextUnwatchedVideo,
  isVideoCompleted,
  isCourseCompleted,
  getVideoStepState,
} from "./courseProgress";
import type { Course } from "@/types";

// Mock watch progress
vi.mock("./watchProgress", () => ({
  getAllProgress: vi.fn(() => ({})),
  getProgress: vi.fn(() => 0),
}));

// Mock video data
vi.mock("@/data/videos", () => ({
  getVideoById: vi.fn((id: string) => ({
    id,
    title: `Video ${id}`,
    description: "desc",
    youtubeId: `yt-${id}`,
    thumbnail: `/thumb-${id}.jpg`,
    category: "tutorials",
    duration: "10:00",
    publishedAt: "2025-01-01",
  })),
}));

const mockCourse: Course = {
  id: "test",
  slug: "test-course",
  title: "Test Course",
  shortTitle: "TC",
  description: "A test course",
  difficulty: "beginner",
  targetAudience: "Testers",
  learningOutcomes: ["Learn testing"],
  accentColor: "qube-blue",
  modules: [
    {
      id: "m1",
      title: "Module 1",
      description: "First module",
      videoIds: ["v1", "v2"],
    },
    {
      id: "m2",
      title: "Module 2",
      description: "Second module",
      videoIds: ["v3", "v4"],
    },
  ],
};

describe("courseProgress", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("getCourseProgress", () => {
    it("returns zero progress when no videos watched", () => {
      const result = getCourseProgress(mockCourse);
      expect(result.completed).toBe(0);
      expect(result.total).toBe(4);
      expect(result.percent).toBe(0);
      expect(result.currentStep).toBe(1);
    });

    it("counts completed videos (>=90%)", async () => {
      const { getAllProgress } = await import("./watchProgress");
      vi.mocked(getAllProgress).mockReturnValue({ v1: 95, v2: 100 });

      const result = getCourseProgress(mockCourse);
      expect(result.completed).toBe(2);
      expect(result.percent).toBe(50);
      expect(result.currentStep).toBe(3);
    });

    it("returns 100% when all complete", async () => {
      const { getAllProgress } = await import("./watchProgress");
      vi.mocked(getAllProgress).mockReturnValue({
        v1: 100,
        v2: 100,
        v3: 90,
        v4: 95,
      });

      const result = getCourseProgress(mockCourse);
      expect(result.completed).toBe(4);
      expect(result.percent).toBe(100);
    });
  });

  describe("getModuleProgress", () => {
    it("returns module-level progress", async () => {
      const { getAllProgress } = await import("./watchProgress");
      vi.mocked(getAllProgress).mockReturnValue({ v1: 100, v2: 50 });

      const result = getModuleProgress(mockCourse.modules[0]);
      expect(result.completed).toBe(1);
      expect(result.total).toBe(2);
    });
  });

  describe("getNextUnwatchedVideo", () => {
    it("returns first video when nothing watched", async () => {
      const { getAllProgress } = await import("./watchProgress");
      vi.mocked(getAllProgress).mockReturnValue({});

      const next = getNextUnwatchedVideo(mockCourse);
      expect(next?.id).toBe("v1");
    });

    it("returns first unwatched video", async () => {
      const { getAllProgress } = await import("./watchProgress");
      vi.mocked(getAllProgress).mockReturnValue({ v1: 100, v2: 95 });

      const next = getNextUnwatchedVideo(mockCourse);
      expect(next?.id).toBe("v3");
    });

    it("returns null when all complete", async () => {
      const { getAllProgress } = await import("./watchProgress");
      vi.mocked(getAllProgress).mockReturnValue({
        v1: 100,
        v2: 100,
        v3: 100,
        v4: 100,
      });

      const next = getNextUnwatchedVideo(mockCourse);
      expect(next).toBeNull();
    });
  });

  describe("isVideoCompleted", () => {
    it("returns false for unwatched video", async () => {
      const { getAllProgress } = await import("./watchProgress");
      vi.mocked(getAllProgress).mockReturnValue({});

      expect(isVideoCompleted("v1")).toBe(false);
    });

    it("returns true for video at 90%+", async () => {
      const { getAllProgress } = await import("./watchProgress");
      vi.mocked(getAllProgress).mockReturnValue({ v1: 90 });

      expect(isVideoCompleted("v1")).toBe(true);
    });
  });

  describe("isCourseCompleted", () => {
    it("returns false when not all complete", async () => {
      const { getAllProgress } = await import("./watchProgress");
      vi.mocked(getAllProgress).mockReturnValue({});

      expect(isCourseCompleted(mockCourse)).toBe(false);
    });

    it("returns true when all complete", async () => {
      const { getAllProgress } = await import("./watchProgress");
      vi.mocked(getAllProgress).mockReturnValue({
        v1: 100,
        v2: 100,
        v3: 100,
        v4: 100,
      });

      expect(isCourseCompleted(mockCourse)).toBe(true);
    });
  });

  describe("getVideoStepState", () => {
    it("returns current for first unwatched", async () => {
      const { getAllProgress } = await import("./watchProgress");
      vi.mocked(getAllProgress).mockReturnValue({});

      expect(getVideoStepState(mockCourse, "v1")).toBe("current");
    });

    it("returns upcoming for later unwatched", async () => {
      const { getAllProgress } = await import("./watchProgress");
      vi.mocked(getAllProgress).mockReturnValue({});

      expect(getVideoStepState(mockCourse, "v3")).toBe("upcoming");
    });

    it("returns completed for watched video", async () => {
      const { getAllProgress } = await import("./watchProgress");
      vi.mocked(getAllProgress).mockReturnValue({ v1: 100 });

      expect(getVideoStepState(mockCourse, "v1")).toBe("completed");
    });
  });
});
