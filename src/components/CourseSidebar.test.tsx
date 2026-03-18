/**
 * Tests for CourseSidebar — sticky sidebar component on the course detail page.
 * Shows course stats, a progress ring (when in progress), or course image (when not started).
 * CTA changes between "Start Course", "Continue Course", and "Course Completed".
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import React from "react";

// ── next/link mock ────────────────────────────────────────────────────────────
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// ── next/image mock ───────────────────────────────────────────────────────────
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

// ── @/data/courses mock ───────────────────────────────────────────────────────
vi.mock("@/data/courses", () => ({
  getCourseVideos: (course: { modules: { videoIds: string[] }[] }) =>
    course.modules.flatMap((m) =>
      m.videoIds.map((id) => ({
        id,
        title: id,
        description: "",
        youtubeId: id,
        thumbnail: "/t.jpg",
        category: "c",
        duration: "10:00",
        publishedAt: "2025-01-01",
      }))
    ),
  getCourseTotalDuration: () => "30m",
}));

// ── @/lib/courseProgress mock — overridden per test ───────────────────────────
const mockGetCourseProgress = vi.fn(() => ({ completed: 0, total: 3, percent: 0, currentStep: 1 }));
const mockIsCourseCompleted = vi.fn(() => false);
const mockGetNextUnwatchedVideo = vi.fn(() => ({
  id: "v1",
  title: "V1",
  description: "",
  youtubeId: "yt1",
  thumbnail: "/t.jpg",
  category: "c",
  duration: "10:00",
  publishedAt: "2025-01-01",
}));

vi.mock("@/lib/courseProgress", () => ({
  get getCourseProgress() { return mockGetCourseProgress; },
  get isCourseCompleted() { return mockIsCourseCompleted; },
  get getNextUnwatchedVideo() { return mockGetNextUnwatchedVideo; },
}));

import CourseSidebar from "./CourseSidebar";
import type { Course } from "@/types";

const mockCourse: Course = {
  id: "scd",
  slug: "sonarqube-certified-developer",
  title: "SonarQube Certified Developer",
  shortTitle: "SCD",
  description: "Master SonarQube",
  difficulty: "beginner",
  targetAudience: "Developers",
  learningOutcomes: ["Learn SonarQube"],
  accentColor: "qube-blue",
  modules: [
    { id: "m1", title: "Module 1", description: "First", videoIds: ["v1", "v2", "v3"] },
  ],
};

beforeEach(() => {
  cleanup();
  localStorage.clear();
  mockGetCourseProgress.mockReturnValue({ completed: 0, total: 3, percent: 0, currentStep: 1 });
  mockIsCourseCompleted.mockReturnValue(false);
  mockGetNextUnwatchedVideo.mockReturnValue({
    id: "v1",
    title: "V1",
    description: "",
    youtubeId: "yt1",
    thumbnail: "/t.jpg",
    category: "c",
    duration: "10:00",
    publishedAt: "2025-01-01",
  });
});

// ── Stats panel ───────────────────────────────────────────────────────────────
describe("CourseSidebar — stats panel", () => {
  it("shows module count", async () => {
    await act(async () => { render(<CourseSidebar course={mockCourse} />); });
    expect(screen.getByText("Modules")).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
  });

  it("shows total video count from getCourseVideos", async () => {
    await act(async () => { render(<CourseSidebar course={mockCourse} />); });
    expect(screen.getByText("Videos")).toBeTruthy();
    // 3 videos in mockCourse
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("shows total duration from getCourseTotalDuration", async () => {
    await act(async () => { render(<CourseSidebar course={mockCourse} />); });
    expect(screen.getByText("Duration")).toBeTruthy();
    expect(screen.getByText("30m")).toBeTruthy();
  });

  it("shows difficulty level", async () => {
    await act(async () => { render(<CourseSidebar course={mockCourse} />); });
    expect(screen.getByText("Level")).toBeTruthy();
    expect(screen.getByText("beginner")).toBeTruthy();
  });
});

// ── CTA states (not-started) ──────────────────────────────────────────────────
describe("CourseSidebar — CTA (not started, no progress)", () => {
  it("shows 'Start Course' CTA when no progress and has next video", async () => {
    await act(async () => { render(<CourseSidebar course={mockCourse} />); });
    expect(screen.getByText("Start Course")).toBeTruthy();
  });

  it("'Start Course' CTA links to first video with course param", async () => {
    await act(async () => { render(<CourseSidebar course={mockCourse} />); });
    const link = screen.getByText("Start Course").closest("a");
    expect(link?.getAttribute("href")).toBe(
      "/watch/v1?course=sonarqube-certified-developer"
    );
  });

  it("shows course image (not progress ring) when percent is 0", async () => {
    await act(async () => { render(<CourseSidebar course={mockCourse} />); });
    // Course image should be present
    const img = screen.getByAltText("SonarQube Certified Developer");
    expect(img).toBeTruthy();
    expect(img.getAttribute("src")).toContain("/courses/scd.png");
  });
});

// ── CTA states (in progress) ──────────────────────────────────────────────────
describe("CourseSidebar — CTA (in progress)", () => {
  beforeEach(() => {
    mockGetCourseProgress.mockReturnValue({ completed: 1, total: 3, percent: 33, currentStep: 2 });
    mockGetNextUnwatchedVideo.mockReturnValue({
      id: "v2",
      title: "V2",
      description: "",
      youtubeId: "yt2",
      thumbnail: "/t.jpg",
      category: "c",
      duration: "10:00",
      publishedAt: "2025-01-01",
    });
  });

  it("shows 'Continue Course' when progress > 0 and not completed", async () => {
    await act(async () => { render(<CourseSidebar course={mockCourse} />); });
    expect(screen.getByText("Continue Course")).toBeTruthy();
  });

  it("'Continue Course' links to the next unwatched video", async () => {
    await act(async () => { render(<CourseSidebar course={mockCourse} />); });
    const link = screen.getByText("Continue Course").closest("a");
    expect(link?.getAttribute("href")).toBe(
      "/watch/v2?course=sonarqube-certified-developer"
    );
  });

  it("shows progress percentage in the ring", async () => {
    await act(async () => { render(<CourseSidebar course={mockCourse} />); });
    // The progress ring shows "33%" and "complete"
    expect(screen.getByText("33%")).toBeTruthy();
    expect(screen.getByText("complete")).toBeTruthy();
  });

  it("shows completed video count when in progress", async () => {
    await act(async () => { render(<CourseSidebar course={mockCourse} />); });
    expect(screen.getByText("Completed")).toBeTruthy();
    expect(screen.getByText("1 of 3 videos")).toBeTruthy();
  });
});

// ── CTA states (completed) ────────────────────────────────────────────────────
describe("CourseSidebar — CTA (course completed)", () => {
  beforeEach(() => {
    mockGetCourseProgress.mockReturnValue({ completed: 3, total: 3, percent: 100, currentStep: 3 });
    mockIsCourseCompleted.mockReturnValue(true);
    mockGetNextUnwatchedVideo.mockReturnValue(null);
  });

  it("shows 'Course Completed' when all videos watched", async () => {
    await act(async () => { render(<CourseSidebar course={mockCourse} />); });
    expect(screen.getByText("Course Completed")).toBeTruthy();
  });

  it("does NOT show a CTA link when course is completed", async () => {
    await act(async () => { render(<CourseSidebar course={mockCourse} />); });
    // "Course Completed" is a div, not a link
    const completedEl = screen.getByText("Course Completed");
    expect(completedEl.closest("a")).toBeNull();
  });
});
