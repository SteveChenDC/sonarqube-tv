import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseNavBar from "./CourseNavBar";

const mockSearchParams = new URLSearchParams();
vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

vi.mock("@/data/courses", () => ({
  getCourseBySlug: vi.fn((slug: string) => {
    if (slug === "test-course") {
      return {
        id: "test",
        slug: "test-course",
        title: "Test Course",
        shortTitle: "TC",
        description: "desc",
        difficulty: "beginner",
        targetAudience: "Testers",
        learningOutcomes: ["Learn testing"],
        accentColor: "qube-blue",
        modules: [
          { id: "m1", title: "Module 1", description: "d", videoIds: ["v1", "v2", "v3"] },
        ],
      };
    }
    return undefined;
  }),
  getCourseVideos: () => [
    { id: "v1", title: "V1", description: "", youtubeId: "yt1", thumbnail: "/t.jpg", category: "c", duration: "10:00", publishedAt: "2025-01-01" },
    { id: "v2", title: "V2", description: "", youtubeId: "yt2", thumbnail: "/t.jpg", category: "c", duration: "10:00", publishedAt: "2025-01-01" },
    { id: "v3", title: "V3", description: "", youtubeId: "yt3", thumbnail: "/t.jpg", category: "c", duration: "10:00", publishedAt: "2025-01-01" },
  ],
  getVideoPositionInCourse: vi.fn((_course: unknown, videoId: string) => {
    const map: Record<string, { step: number; total: number; moduleIndex: number }> = {
      v1: { step: 1, total: 3, moduleIndex: 0 },
      v2: { step: 2, total: 3, moduleIndex: 0 },
      v3: { step: 3, total: 3, moduleIndex: 0 },
    };
    return map[videoId] ?? null;
  }),
}));

vi.mock("@/lib/courseProgress", () => ({
  getCourseProgress: () => ({ completed: 1, total: 3, percent: 33, currentStep: 2 }),
}));

describe("CourseNavBar", () => {
  it("renders nothing when no course param", () => {
    mockSearchParams.delete("course");
    const { container } = render(<CourseNavBar videoId="v1" />);
    expect(container.innerHTML).toBe("");
  });

  it("renders course title and step info", () => {
    mockSearchParams.set("course", "test-course");
    render(<CourseNavBar videoId="v2" />);
    expect(screen.getByText("Test Course")).toBeTruthy();
    expect(screen.getByText("Step 2 of 3")).toBeTruthy();
  });

  it("shows prev and next links for middle step", () => {
    mockSearchParams.set("course", "test-course");
    render(<CourseNavBar videoId="v2" />);
    expect(screen.getByLabelText("Previous step").getAttribute("href")).toBe(
      "/watch/v1?course=test-course"
    );
    expect(screen.getByLabelText("Next step").getAttribute("href")).toBe(
      "/watch/v3?course=test-course"
    );
  });

  it("disables prev on first step", () => {
    mockSearchParams.set("course", "test-course");
    render(<CourseNavBar videoId="v1" />);
    expect(screen.queryByLabelText("Previous step")).toBeNull();
    expect(screen.getByLabelText("Next step")).toBeTruthy();
  });

  it("disables next on last step", () => {
    mockSearchParams.set("course", "test-course");
    render(<CourseNavBar videoId="v3" />);
    expect(screen.getByLabelText("Previous step")).toBeTruthy();
    expect(screen.queryByLabelText("Next step")).toBeNull();
  });
});
