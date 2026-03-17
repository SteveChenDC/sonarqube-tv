import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CourseTimeline from "./CourseTimeline";
import type { Course } from "@/types";

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

vi.mock("@/data/courses", () => ({
  getCourseVideos: vi.fn((course: { modules: Array<{ videoIds: string[] }> }) => {
    const vids = [];
    for (const mod of course.modules) {
      for (const vid of mod.videoIds) {
        vids.push({
          id: vid,
          title: `Video ${vid}`,
          description: "desc",
          youtubeId: `yt-${vid}`,
          thumbnail: `/thumb-${vid}.jpg`,
          category: "tutorials",
          duration: "10:00",
          publishedAt: "2025-01-01",
        });
      }
    }
    return vids;
  }),
}));

vi.mock("@/lib/courseProgress", () => ({
  getModuleProgress: () => ({ completed: 0, total: 2 }),
  getVideoStepState: () => "upcoming",
  isCourseCompleted: () => false,
  getCourseProgress: () => ({ completed: 0, total: 4, percent: 0, currentStep: 1 }),
}));

vi.mock("@/lib/watchProgress", () => ({
  getProgress: () => 0,
  getAllProgress: () => ({}),
}));

const mockCourse: Course = {
  id: "test",
  slug: "test-course",
  title: "Test Course",
  shortTitle: "TC",
  description: "A test",
  difficulty: "beginner",
  targetAudience: "Testers",
  learningOutcomes: ["Learn testing basics"],
  accentColor: "qube-blue",
  modules: [
    { id: "m1", title: "First Module", description: "Module 1 desc", videoIds: ["v1", "v2"] },
    { id: "m2", title: "Second Module", description: "Module 2 desc", videoIds: ["v3", "v4"] },
  ],
};

describe("CourseTimeline", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders module titles as accordion headers", () => {
    render(<CourseTimeline course={mockCourse} />);
    expect(screen.getByText("First Module")).toBeTruthy();
    expect(screen.getByText("Second Module")).toBeTruthy();
  });

  it("shows default open module videos", () => {
    render(<CourseTimeline course={mockCourse} />);
    // First module is open by default
    expect(screen.getByText("Video v1")).toBeTruthy();
    expect(screen.getByText("Video v2")).toBeTruthy();
  });

  it("toggles accordion on click", () => {
    render(<CourseTimeline course={mockCourse} />);
    // Second module is closed by default
    expect(screen.queryByText("Video v3")).toBeNull();

    // Open it
    fireEvent.click(screen.getByText("Second Module"));
    expect(screen.getByText("Video v3")).toBeTruthy();

    // Close first module
    fireEvent.click(screen.getByText("First Module"));
    expect(screen.queryByText("Video v1")).toBeNull();
  });

  it("shows summary bar with module and video counts", () => {
    render(<CourseTimeline course={mockCourse} />);
    expect(screen.getByText(/2 modules/)).toBeTruthy();
    expect(screen.getByText(/4 videos/)).toBeTruthy();
  });

  it("renders links with course query param", () => {
    render(<CourseTimeline course={mockCourse} />);
    const links = screen.getAllByRole("link");
    const courseLinks = links.filter((l) =>
      l.getAttribute("href")?.includes("?course=test-course")
    );
    expect(courseLinks.length).toBeGreaterThanOrEqual(2);
  });
});
