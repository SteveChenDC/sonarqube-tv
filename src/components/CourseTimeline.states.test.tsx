/**
 * CourseTimeline state-dependent rendering tests.
 *
 * The base CourseTimeline.test.tsx covers the zero-progress happy path only.
 * This file covers the three major state branches that change the UI:
 *   1. Course complete → banner appears
 *   2. Module complete → checkmark circle replaces index number
 *   3. Video step states → completed (red checkmark), current (play icon + highlight), upcoming (grey number)
 *   4. Watch progress bar on thumbnail (>0% and <90%)
 *
 * Uses vi.fn() mocks with per-test overrides so each state can be isolated.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseTimeline from "./CourseTimeline";
import type { Course } from "@/types";

// ── video data mock ──────────────────────────────────────────────────────────
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

// ── controllable courseProgress mocks ────────────────────────────────────────
const mockGetModuleProgress = vi.fn(() => ({ completed: 0, total: 2 }));
const mockGetVideoStepState = vi.fn(
  () => "upcoming" as "upcoming" | "completed" | "current"
);
const mockIsCourseCompleted = vi.fn(() => false);
const mockGetCourseProgress = vi.fn(() => ({
  completed: 0,
  total: 4,
  percent: 0,
  currentStep: 1,
}));

vi.mock("@/lib/courseProgress", () => ({
  get getModuleProgress() {
    return mockGetModuleProgress;
  },
  get getVideoStepState() {
    return mockGetVideoStepState;
  },
  get isCourseCompleted() {
    return mockIsCourseCompleted;
  },
  get getCourseProgress() {
    return mockGetCourseProgress;
  },
}));

// ── controllable watchProgress mock ──────────────────────────────────────────
const mockGetProgress = vi.fn(() => 0);
vi.mock("@/lib/watchProgress", () => ({
  get getProgress() {
    return mockGetProgress;
  },
  getAllProgress: () => ({}),
}));

// ── fixture ──────────────────────────────────────────────────────────────────
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
    { id: "m1", title: "First Module", description: "Module 1 desc", videoIds: ["v1", "v2"] },
    { id: "m2", title: "Second Module", description: "Module 2 desc", videoIds: ["v3", "v4"] },
  ],
};

// ── tests ────────────────────────────────────────────────────────────────────
describe("CourseTimeline — course complete banner", () => {
  beforeEach(() => {
    localStorage.clear();
    mockGetModuleProgress.mockReturnValue({ completed: 0, total: 2 });
    mockGetVideoStepState.mockReturnValue("upcoming");
    mockIsCourseCompleted.mockReturnValue(false);
    mockGetCourseProgress.mockReturnValue({ completed: 0, total: 4, percent: 0, currentStep: 1 });
    mockGetProgress.mockReturnValue(0);
  });

  it("shows 'Course Complete' heading when isCourseCompleted returns true", () => {
    mockIsCourseCompleted.mockReturnValue(true);
    mockGetCourseProgress.mockReturnValue({ completed: 4, total: 4, percent: 100, currentStep: 4 });
    render(<CourseTimeline course={mockCourse} />);
    expect(screen.getByText("Course Complete")).toBeTruthy();
  });

  it("shows course title in the complete banner", () => {
    mockIsCourseCompleted.mockReturnValue(true);
    mockGetCourseProgress.mockReturnValue({ completed: 4, total: 4, percent: 100, currentStep: 4 });
    render(<CourseTimeline course={mockCourse} />);
    // The banner's <p> repeats the course title beneath "Course Complete"
    expect(screen.getByText("Test Course")).toBeTruthy();
  });

  it("does NOT show 'Course Complete' banner when course has no progress", () => {
    // default: isCourseCompleted = false
    render(<CourseTimeline course={mockCourse} />);
    expect(screen.queryByText("Course Complete")).toBeNull();
  });
});

describe("CourseTimeline — summary bar progress percentage", () => {
  beforeEach(() => {
    localStorage.clear();
    mockGetModuleProgress.mockReturnValue({ completed: 0, total: 2 });
    mockGetVideoStepState.mockReturnValue("upcoming");
    mockIsCourseCompleted.mockReturnValue(false);
    mockGetCourseProgress.mockReturnValue({ completed: 0, total: 4, percent: 0, currentStep: 1 });
    mockGetProgress.mockReturnValue(0);
  });

  it("shows '50% complete' in summary bar when getCourseProgress.percent = 50", () => {
    mockGetCourseProgress.mockReturnValue({ completed: 2, total: 4, percent: 50, currentStep: 3 });
    render(<CourseTimeline course={mockCourse} />);
    expect(screen.getByText("50% complete")).toBeTruthy();
  });

  it("does NOT render a percent text when percent is 0", () => {
    // default: percent=0
    render(<CourseTimeline course={mockCourse} />);
    expect(screen.queryByText(/% complete/)).toBeNull();
  });
});

describe("CourseTimeline — module header complete state", () => {
  beforeEach(() => {
    localStorage.clear();
    mockGetVideoStepState.mockReturnValue("upcoming");
    mockIsCourseCompleted.mockReturnValue(false);
    mockGetCourseProgress.mockReturnValue({ completed: 0, total: 4, percent: 0, currentStep: 1 });
    mockGetProgress.mockReturnValue(0);
  });

  it("shows checkmark circle (bg-sonar-red, no text) on complete module header", () => {
    // All modules complete: completed === total
    mockGetModuleProgress.mockReturnValue({ completed: 2, total: 2 });
    render(<CourseTimeline course={mockCourse} />);

    const firstModBtn = screen.getByText("First Module").closest("button")!;
    // The small circle is the first <span> inside the button
    const circle = firstModBtn.querySelector("span")!;
    // Complete modules use bg-sonar-red, incomplete use bg-n8
    expect(circle.className).toContain("bg-sonar-red");
    // Checkmark is a pure SVG — no text content in the span
    expect(circle.textContent?.trim()).toBe("");
  });

  it("shows index number (not checkmark, bg-n8) on incomplete module header", () => {
    // default: completed=0 < total=2 → incomplete
    mockGetModuleProgress.mockReturnValue({ completed: 0, total: 2 });
    render(<CourseTimeline course={mockCourse} />);

    const firstModBtn = screen.getByText("First Module").closest("button")!;
    const circle = firstModBtn.querySelector("span")!;
    // Incomplete modules use bg-n8
    expect(circle.className).toContain("bg-n8");
    // Shows the 1-based module index "1"
    expect(circle.textContent?.trim()).toBe("1");
  });
});

describe("CourseTimeline — video step state rendering", () => {
  // Module 0 is open by default when mp.completed < mp.total (which is true
  // with the default mock: {completed:0, total:2}).  This exposes v1 & v2.
  beforeEach(() => {
    localStorage.clear();
    mockGetModuleProgress.mockReturnValue({ completed: 0, total: 2 });
    mockGetVideoStepState.mockReturnValue("upcoming");
    mockIsCourseCompleted.mockReturnValue(false);
    mockGetCourseProgress.mockReturnValue({ completed: 0, total: 4, percent: 0, currentStep: 1 });
    mockGetProgress.mockReturnValue(0);
  });

  it("step circle shows red checkmark (bg-sonar-red, no text) for completed video", () => {
    mockGetVideoStepState.mockReturnValue("completed");
    const { container } = render(<CourseTimeline course={mockCourse} />);

    const v1Link = container.querySelector(
      'a[href="/watch/v1?course=test-course"]'
    )!;
    expect(v1Link).toBeTruthy();

    // Step circle sits at .absolute.left-0 inside the link
    const stepCircle = v1Link.querySelector(".absolute.left-0")!;
    expect(stepCircle.className).toContain("bg-sonar-red");
    // Checkmark SVG has no text content
    expect(stepCircle.textContent?.trim()).toBe("");
  });

  it("step circle shows grey number for upcoming video", () => {
    // default: "upcoming"
    const { container } = render(<CourseTimeline course={mockCourse} />);

    const v1Link = container.querySelector(
      'a[href="/watch/v1?course=test-course"]'
    )!;
    const stepCircle = v1Link.querySelector(".absolute.left-0")!;
    // Upcoming uses bg-n8
    expect(stepCircle.className).toContain("bg-n8");
    // Shows step number "1" (v1 is globalStepOffset 0 + vi index 0 + 1 = 1)
    expect(stepCircle.textContent?.trim()).toBe("1");
  });

  it("shows play icon and bg-n8/20 highlight for current video step", () => {
    mockGetVideoStepState.mockImplementation(
      (_course: unknown, videoId: string) =>
        videoId === "v1" ? "current" : "upcoming"
    );
    const { container } = render(<CourseTimeline course={mockCourse} />);

    const v1Link = container.querySelector(
      'a[href="/watch/v1?course=test-course"]'
    )!;
    // Current step gets a highlighted background class
    expect(v1Link.className).toContain("bg-n8/20");
    // Play icon SVG path is rendered for the current step
    const playPath = v1Link.querySelector('path[d="M8 5v14l11-7z"]');
    expect(playPath).toBeTruthy();
  });
});

describe("CourseTimeline — thumbnail watch progress bar", () => {
  beforeEach(() => {
    localStorage.clear();
    mockGetModuleProgress.mockReturnValue({ completed: 0, total: 2 });
    mockGetVideoStepState.mockReturnValue("upcoming");
    mockIsCourseCompleted.mockReturnValue(false);
    mockGetCourseProgress.mockReturnValue({ completed: 0, total: 4, percent: 0, currentStep: 1 });
    mockGetProgress.mockReturnValue(0);
  });

  it("renders a progress bar with correct width when watchProgress > 0 and < 90", () => {
    // v1 has 50% watch progress
    mockGetProgress.mockImplementation((videoId: string) =>
      videoId === "v1" ? 50 : 0
    );
    const { container } = render(<CourseTimeline course={mockCourse} />);

    // The progress bar inner div has classes "h-full bg-sonar-red" and inline style.width
    const bar = container.querySelector(".bg-sonar-red.h-full") as HTMLElement;
    expect(bar).toBeTruthy();
    expect(bar.style.width).toBe("50%");
  });

  it("does NOT render a progress bar when watchProgress is 0", () => {
    // default: getProgress returns 0
    const { container } = render(<CourseTimeline course={mockCourse} />);
    expect(container.querySelector(".bg-sonar-red.h-full")).toBeNull();
  });

  it("does NOT render a progress bar when watchProgress is exactly 90 (completed threshold)", () => {
    // 90 is the COMPLETION_THRESHOLD — the condition is `watchProgress < 90` (strict <)
    mockGetProgress.mockImplementation((videoId: string) =>
      videoId === "v1" ? 90 : 0
    );
    const { container } = render(<CourseTimeline course={mockCourse} />);
    expect(container.querySelector(".bg-sonar-red.h-full")).toBeNull();
  });
});
