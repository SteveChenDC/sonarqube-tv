import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseCard from "./CourseCard";
import type { Course } from "@/types";

vi.mock("@/data/courses", () => ({
  getCourseVideos: () => [
    { id: "v1", title: "V1", description: "", youtubeId: "yt1", thumbnail: "/t.jpg", category: "c", duration: "10:00", publishedAt: "2025-01-01" },
    { id: "v2", title: "V2", description: "", youtubeId: "yt2", thumbnail: "/t.jpg", category: "c", duration: "15:00", publishedAt: "2025-01-01" },
    { id: "v3", title: "V3", description: "", youtubeId: "yt3", thumbnail: "/t.jpg", category: "c", duration: "20:00", publishedAt: "2025-01-01" },
  ],
  getCourseTotalDuration: () => "45m",
}));

vi.mock("@/lib/courseProgress", () => ({
  getCourseProgress: () => ({ completed: 0, total: 3, percent: 0, currentStep: 1 }),
  getModuleProgress: () => ({ completed: 0, total: 2 }),
  getNextUnwatchedVideo: () => ({ id: "v1", title: "V1", description: "", youtubeId: "yt1", thumbnail: "/t.jpg", category: "c", duration: "10:00", publishedAt: "2025-01-01" }),
  isCourseCompleted: () => false,
}));

const mockCourse: Course = {
  id: "test",
  slug: "test-course",
  title: "Test Certification Course",
  shortTitle: "TC",
  description: "A test course",
  difficulty: "beginner",
  targetAudience: "Testers",
  learningOutcomes: ["Learn testing"],
  accentColor: "qube-blue",
  modules: [
    { id: "m1", title: "Module 1", description: "First", videoIds: ["v1", "v2"] },
    { id: "m2", title: "Module 2", description: "Second", videoIds: ["v3"] },
  ],
};

describe("CourseCard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders course title", () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText("Test Certification Course")).toBeTruthy();
  });

  it("shows difficulty badge", () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText("Beginner")).toBeTruthy();
  });

  it("shows module/video/duration info", () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText(/2 modules/)).toBeTruthy();
    expect(screen.getByText(/3 videos/)).toBeTruthy();
    expect(screen.getByText(/45m/)).toBeTruthy();
  });

  it("shows course image in header", () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByAltText("Test Certification Course")).toBeTruthy();
  });

  it("renders a start/continue CTA link", () => {
    render(<CourseCard course={mockCourse} />);
    const cta = screen.getByText("Start Course");
    expect(cta.closest("a")?.getAttribute("href")).toContain("/watch/v1?course=test-course");
  });
});
