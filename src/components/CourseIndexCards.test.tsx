/**
 * Tests for CourseIndexCards — the client component that renders
 * the course grid with difficulty filter tabs on the /courses page.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
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

// ── @/data/courses mock — inline to avoid vi.mock hoisting issues ─────────────
vi.mock("@/data/courses", () => {
  const courses = [
    {
      id: "scd",
      slug: "sonarqube-certified-developer",
      title: "SonarQube Certified Developer",
      shortTitle: "SCD",
      description: "Beginner level course for new developers.",
      difficulty: "beginner",
      targetAudience: "Developers",
      learningOutcomes: ["Learn A", "Learn B", "Learn C", "Learn D"],
      accentColor: "qube-blue",
      modules: [
        { id: "m1", title: "Module 1", description: "d", videoIds: ["v1", "v2"] },
      ],
    },
    {
      id: "sci",
      slug: "sonarqube-certified-intermediate",
      title: "SonarQube Certified Practitioner",
      shortTitle: "SCP",
      description: "Intermediate course.",
      difficulty: "intermediate",
      targetAudience: "Practitioners",
      learningOutcomes: ["Intermediate A"],
      accentColor: "sonar-purple",
      modules: [
        { id: "m1", title: "Module 1", description: "d", videoIds: ["v3"] },
      ],
    },
    {
      id: "sca",
      slug: "sonarqube-certified-architect",
      title: "SonarQube Certified Architect",
      shortTitle: "SCA",
      description: "Advanced course for enterprise architects.",
      difficulty: "advanced",
      targetAudience: "Architects",
      learningOutcomes: ["Advanced A", "Advanced B"],
      accentColor: "sonar-red",
      modules: [
        { id: "m1", title: "Module 1", description: "d", videoIds: ["v4", "v5", "v6"] },
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
    getCourseTotalDuration: (course: { modules: { videoIds: string[] }[] }) => {
      const count = course.modules.reduce(
        (s: number, m: { videoIds: string[] }) => s + m.videoIds.length,
        0
      );
      return `${count * 10}m`;
    },
  };
});

vi.mock("@/lib/courseProgress", () => ({
  getCourseProgress: () => ({ completed: 0, total: 2, percent: 0, currentStep: 1 }),
  getModuleProgress: () => ({ completed: 0, total: 2 }),
  getNextUnwatchedVideo: (course: { modules: { id: string; title: string; videoIds: string[] }[]; slug: string }) => ({
    id: course.modules[0].videoIds[0],
    title: "V1",
    description: "",
    youtubeId: "yt1",
    thumbnail: "/t.jpg",
    category: "c",
    duration: "10:00",
    publishedAt: "2025-01-01",
  }),
  isCourseCompleted: () => false,
}));

import CourseIndexCards from "./CourseIndexCards";

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

// ── Filter tabs ───────────────────────────────────────────────────────────────
describe("CourseIndexCards — filter tabs", () => {
  it("renders All Courses tab with total count", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    expect(screen.getByText("All Courses")).toBeTruthy();
    // The "3" count badge for All Courses
    const allBtn = screen.getByRole("button", { name: /all courses/i });
    expect(allBtn.textContent).toContain("3");
  });

  it("renders Beginner tab with correct count", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    const btn = screen.getByRole("button", { name: /beginner/i });
    expect(btn.textContent).toContain("1");
  });

  it("renders Intermediate tab with correct count", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    const btn = screen.getByRole("button", { name: /intermediate/i });
    expect(btn.textContent).toContain("1");
  });

  it("renders Advanced tab with correct count", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    const btn = screen.getByRole("button", { name: /advanced/i });
    expect(btn.textContent).toContain("1");
  });

  it("All Courses tab is active by default showing all 3 courses", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    expect(screen.getByText("SonarQube Certified Developer")).toBeTruthy();
    expect(screen.getByText("SonarQube Certified Practitioner")).toBeTruthy();
    expect(screen.getByText("SonarQube Certified Architect")).toBeTruthy();
  });
});

// ── Filtering ─────────────────────────────────────────────────────────────────
describe("CourseIndexCards — difficulty filtering", () => {
  it("clicking Beginner shows only beginner courses", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    fireEvent.click(screen.getByRole("button", { name: /beginner/i }));
    expect(screen.getByText("SonarQube Certified Developer")).toBeTruthy();
    expect(screen.queryByText("SonarQube Certified Practitioner")).toBeNull();
    expect(screen.queryByText("SonarQube Certified Architect")).toBeNull();
  });

  it("clicking Intermediate shows only intermediate courses", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    fireEvent.click(screen.getByRole("button", { name: /intermediate/i }));
    expect(screen.queryByText("SonarQube Certified Developer")).toBeNull();
    expect(screen.getByText("SonarQube Certified Practitioner")).toBeTruthy();
    expect(screen.queryByText("SonarQube Certified Architect")).toBeNull();
  });

  it("clicking Advanced shows only advanced courses", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    fireEvent.click(screen.getByRole("button", { name: /advanced/i }));
    expect(screen.queryByText("SonarQube Certified Developer")).toBeNull();
    expect(screen.queryByText("SonarQube Certified Practitioner")).toBeNull();
    expect(screen.getByText("SonarQube Certified Architect")).toBeTruthy();
  });

  it("clicking All Courses after filtering restores all courses", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    fireEvent.click(screen.getByRole("button", { name: /beginner/i }));
    // Only beginner visible
    expect(screen.queryByText("SonarQube Certified Architect")).toBeNull();
    // Switch back
    fireEvent.click(screen.getByRole("button", { name: /all courses/i }));
    expect(screen.getByText("SonarQube Certified Developer")).toBeTruthy();
    expect(screen.getByText("SonarQube Certified Architect")).toBeTruthy();
  });
});

// ── Card content ──────────────────────────────────────────────────────────────
describe("CourseIndexCards — course card content", () => {
  it("shows course description", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    expect(screen.getByText("Beginner level course for new developers.")).toBeTruthy();
  });

  it("shows difficulty badge for each course", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    expect(screen.getByText("beginner")).toBeTruthy();
    expect(screen.getByText("intermediate")).toBeTruthy();
    expect(screen.getByText("advanced")).toBeTruthy();
  });

  it("shows module count in stats", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    // Each course has 1 module
    const moduleTexts = screen.getAllByText(/1 modules/i);
    expect(moduleTexts.length).toBeGreaterThan(0);
  });

  it("shows video count in stats for the beginner course (2 videos)", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    // Beginner course: 2 videos
    expect(screen.getByText("2 videos")).toBeTruthy();
  });

  it("shows duration in stats for the beginner course", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    // Beginner course: 2 videos × 10m = 20m
    expect(screen.getByText("20m")).toBeTruthy();
  });

  it("renders learning outcomes (up to 3) for each card", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    expect(screen.getByText("Learn A")).toBeTruthy();
    expect(screen.getByText("Learn B")).toBeTruthy();
    expect(screen.getByText("Learn C")).toBeTruthy();
    // 4th outcome should NOT appear directly (hidden behind "+1 more")
    expect(screen.queryByText("Learn D")).toBeNull();
  });

  it('shows "+N more" when course has more than 3 learning outcomes', async () => {
    await act(async () => { render(<CourseIndexCards />); });
    // Beginner course has 4 outcomes → "+1 more"
    expect(screen.getByText("+1 more")).toBeTruthy();
  });

  it("'Start Course' CTA links to the first unwatched video", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    const ctaLinks = screen.getAllByText("Start Course");
    // All CTAs should link to watch/[videoId]?course=[slug]
    for (const cta of ctaLinks) {
      const href = cta.closest("a")?.getAttribute("href") ?? "";
      expect(href).toMatch(/^\/watch\//);
      expect(href).toContain("?course=");
    }
  });

  it("'View syllabus' link points to the course detail page", async () => {
    await act(async () => { render(<CourseIndexCards />); });
    const syllabusLinks = screen.getAllByText("View syllabus");
    expect(syllabusLinks[0].closest("a")?.getAttribute("href")).toBe(
      "/courses/sonarqube-certified-developer"
    );
  });
});
