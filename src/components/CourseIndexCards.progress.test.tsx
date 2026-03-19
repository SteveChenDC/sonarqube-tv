/**
 * CourseIndexCards — progress / completion state branches
 *
 * The main CourseIndexCards.test.tsx always mocks:
 *   - isCourseCompleted → false
 *   - getCourseProgress → { percent: 0, completed: 0 }
 *   - getNextUnwatchedVideo → { id: "v1", ... }
 *
 * This file covers the UNtested branches:
 *   1. completed = true  → "Complete" badge + "Review Course" single CTA
 *   2. percent > 0       → progress % text, progress bar, "Continue" CTA label
 *   3. nextVideo = null && !completed  → "View Syllabus" single CTA (no "Start"/"Continue")
 *   4. Tab active state  → active tab has bg-sonar-red class
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, act, fireEvent } from "@testing-library/react";
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

// ── @/data/courses mock — single beginner course ───────────────────────────────
vi.mock("@/data/courses", () => {
  const courses = [
    {
      id: "scd",
      slug: "sonarqube-certified-developer",
      title: "SonarQube Certified Developer",
      shortTitle: "SCD",
      description: "Beginner level course.",
      difficulty: "beginner" as const,
      targetAudience: "Developers",
      learningOutcomes: ["Learn A", "Learn B"],
      accentColor: "qube-blue" as const,
      modules: [
        { id: "m1", title: "Module 1", description: "d", videoIds: ["v1", "v2"] },
      ],
    },
  ];

  return {
    courses,
    getCourseVideos: (course: { modules: { videoIds: string[] }[] }) =>
      course.modules.flatMap((m: { videoIds: string[] }) =>
        m.videoIds.map((id: string) => ({
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
    getCourseTotalDuration: () => "20m",
  };
});

// ── @/lib/courseProgress — mutable fns so tests can override per-test ─────────
// Must use `let` + getter accessor pattern so beforeEach reassignments work
// after vi.mock hoisting (see CLAUDE.md key patterns).
let mockGetCourseProgress = vi.fn(() => ({
  completed: 0,
  total: 2,
  percent: 0,
  currentStep: 1,
}));
let mockIsCourseCompleted = vi.fn(() => false);
let mockGetNextUnwatchedVideo = vi.fn(() => ({
  id: "v1",
  title: "V1",
  description: "",
  youtubeId: "yt1",
  thumbnail: "/t.jpg",
  category: "c",
  duration: "10:00",
  publishedAt: "2025-01-01",
}));
let mockGetModuleProgress = vi.fn(() => ({ completed: 0, total: 2 }));

vi.mock("@/lib/courseProgress", () => ({
  get getCourseProgress() {
    return mockGetCourseProgress;
  },
  get isCourseCompleted() {
    return mockIsCourseCompleted;
  },
  get getNextUnwatchedVideo() {
    return mockGetNextUnwatchedVideo;
  },
  get getModuleProgress() {
    return mockGetModuleProgress;
  },
}));

import CourseIndexCards from "./CourseIndexCards";

beforeEach(() => {
  cleanup();
  localStorage.clear();
  // Reset all mocks to default (not started, no progress)
  mockGetCourseProgress = vi.fn(() => ({
    completed: 0,
    total: 2,
    percent: 0,
    currentStep: 1,
  }));
  mockIsCourseCompleted = vi.fn(() => false);
  mockGetNextUnwatchedVideo = vi.fn(() => ({
    id: "v1",
    title: "V1",
    description: "",
    youtubeId: "yt1",
    thumbnail: "/t.jpg",
    category: "c",
    duration: "10:00",
    publishedAt: "2025-01-01",
  }));
  mockGetModuleProgress = vi.fn(() => ({ completed: 0, total: 2 }));
});

// ── Completed course ──────────────────────────────────────────────────────────
describe("CourseIndexCards — completed course state", () => {
  beforeEach(() => {
    mockIsCourseCompleted = vi.fn(() => true);
    mockGetNextUnwatchedVideo = vi.fn(() => null);
    mockGetCourseProgress = vi.fn(() => ({
      completed: 2,
      total: 2,
      percent: 100,
      currentStep: 3,
    }));
  });

  it('shows the "Complete" badge', async () => {
    await act(async () => {
      render(<CourseIndexCards />);
    });
    expect(screen.getByText("Complete")).toBeTruthy();
  });

  it('renders "Review Course" CTA link (not "Start Course")', async () => {
    await act(async () => {
      render(<CourseIndexCards />);
    });
    expect(screen.getByText("Review Course")).toBeTruthy();
    expect(screen.queryByText("Start Course")).toBeNull();
  });

  it('"Review Course" link points to the course detail page', async () => {
    await act(async () => {
      render(<CourseIndexCards />);
    });
    const link = screen.getByText("Review Course").closest("a");
    expect(link?.getAttribute("href")).toBe("/courses/sonarqube-certified-developer");
  });

  it('does NOT show a "View syllabus" secondary link (only single CTA when completed)', async () => {
    await act(async () => {
      render(<CourseIndexCards />);
    });
    // In completed state the secondary "View syllabus" link is not rendered —
    // only the single "Review Course" button appears in the CTA area.
    expect(screen.queryByText("View syllabus")).toBeNull();
  });
});

// ── In-progress course (percent > 0, not completed) ───────────────────────────
describe("CourseIndexCards — in-progress course state", () => {
  beforeEach(() => {
    mockIsCourseCompleted = vi.fn(() => false);
    mockGetCourseProgress = vi.fn(() => ({
      completed: 1,
      total: 2,
      percent: 50,
      currentStep: 2,
    }));
    mockGetModuleProgress = vi.fn(() => ({ completed: 1, total: 2 }));
    // nextVideo is still available (first unwatched)
    mockGetNextUnwatchedVideo = vi.fn(() => ({
      id: "v2",
      title: "V2",
      description: "",
      youtubeId: "yt2",
      thumbnail: "/t.jpg",
      category: "c",
      duration: "10:00",
      publishedAt: "2025-01-01",
    }));
  });

  it('shows the progress percentage text (e.g. "50%")', async () => {
    await act(async () => {
      render(<CourseIndexCards />);
    });
    expect(screen.getByText("50%")).toBeTruthy();
  });

  it("renders the progress bar fill at correct width", async () => {
    const { container } = render(<></>);
    cleanup();
    await act(async () => {
      render(<CourseIndexCards />);
    });
    // The progress bar fill div has className containing "bg-sonar-red h-full"
    // and an inline style of width: 50%
    const fillEl = document.querySelector(".bg-sonar-red.h-full") as HTMLElement | null;
    expect(fillEl).toBeTruthy();
    expect(fillEl?.style.width).toBe("50%");
  });

  it('renders the "Continue" CTA label when progress.completed > 0', async () => {
    await act(async () => {
      render(<CourseIndexCards />);
    });
    expect(screen.getByText("Continue")).toBeTruthy();
    expect(screen.queryByText("Start Course")).toBeNull();
  });

  it('"Continue" CTA links to the next unwatched video with ?course= param', async () => {
    await act(async () => {
      render(<CourseIndexCards />);
    });
    const link = screen.getByText("Continue").closest("a");
    expect(link?.getAttribute("href")).toBe(
      "/watch/v2?course=sonarqube-certified-developer"
    );
  });

  it("shows progress video count (e.g. 1/2 videos)", async () => {
    await act(async () => {
      render(<CourseIndexCards />);
    });
    // progress bar header shows "{completed}/{total} videos"
    expect(screen.getByText("1/2 videos")).toBeTruthy();
  });

  it('does NOT show the "Complete" badge when percent < 100', async () => {
    await act(async () => {
      render(<CourseIndexCards />);
    });
    expect(screen.queryByText("Complete")).toBeNull();
  });
});

// ── No next video + NOT completed (e.g. empty course) ────────────────────────
describe("CourseIndexCards — null nextVideo, not completed", () => {
  beforeEach(() => {
    mockIsCourseCompleted = vi.fn(() => false);
    mockGetNextUnwatchedVideo = vi.fn(() => null);
    mockGetCourseProgress = vi.fn(() => ({
      completed: 0,
      total: 0,
      percent: 0,
      currentStep: 1,
    }));
  });

  it('renders a "View Syllabus" CTA instead of "Start Course"', async () => {
    await act(async () => {
      render(<CourseIndexCards />);
    });
    expect(screen.getByText("View Syllabus")).toBeTruthy();
    expect(screen.queryByText("Start Course")).toBeNull();
  });

  it('"View Syllabus" CTA links to the course detail page', async () => {
    await act(async () => {
      render(<CourseIndexCards />);
    });
    const link = screen.getByText("View Syllabus").closest("a");
    expect(link?.getAttribute("href")).toBe("/courses/sonarqube-certified-developer");
  });
});

// ── Tab active state styling ──────────────────────────────────────────────────
describe("CourseIndexCards — tab active state styling", () => {
  it('the "All Courses" tab is active by default (has bg-sonar-red class)', async () => {
    await act(async () => {
      render(<CourseIndexCards />);
    });
    const allBtn = screen.getByRole("button", { name: /all courses/i });
    expect(allBtn.className).toContain("bg-sonar-red");
  });

  it('clicking "Beginner" gives that tab the bg-sonar-red active class', async () => {
    await act(async () => {
      render(<CourseIndexCards />);
    });
    const beginnerBtn = screen.getByRole("button", { name: /beginner/i });
    fireEvent.click(beginnerBtn);
    expect(beginnerBtn.className).toContain("bg-sonar-red");
  });

  it('clicking "Beginner" removes the active class from "All Courses"', async () => {
    await act(async () => {
      render(<CourseIndexCards />);
    });
    const allBtn = screen.getByRole("button", { name: /all courses/i });
    const beginnerBtn = screen.getByRole("button", { name: /beginner/i });
    fireEvent.click(beginnerBtn);
    expect(allBtn.className).not.toContain("bg-sonar-red");
  });
});
