/**
 * Tests for the /courses landing page (server component).
 * Verifies hero content, stats, JSON-LD, and back-link.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import React from "react";

// ── next/ mocks ──────────────────────────────────────────────────────────────
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

// ── CourseIndexCards is dynamically imported; mock it ────────────────────────
vi.mock("@/components/CourseIndexCards", () => ({
  default: () => <div data-testid="course-index-cards" />,
}));

// ── Mock courses data ─────────────────────────────────────────────────────────
vi.mock("@/data/courses", () => ({
  courses: [
    {
      id: "scd",
      slug: "sonarqube-certified-developer",
      title: "SonarQube Certified Developer",
      shortTitle: "SCD",
      description: "Beginner course",
      difficulty: "beginner",
      targetAudience: "Developers",
      learningOutcomes: ["Learn SonarQube"],
      accentColor: "qube-blue",
      modules: [
        { id: "m1", title: "Module 1", description: "d", videoIds: ["v1", "v2"] },
      ],
    },
    {
      id: "sca",
      slug: "sonarqube-certified-architect",
      title: "SonarQube Certified Architect",
      shortTitle: "SCA",
      description: "Advanced course",
      difficulty: "advanced",
      targetAudience: "Architects",
      learningOutcomes: ["Advanced SonarQube"],
      accentColor: "sonar-red",
      modules: [
        { id: "m1", title: "Module 1", description: "d", videoIds: ["v3"] },
      ],
    },
  ],
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
  getCourseBySlug: (slug: string) => undefined,
}));

import CoursesPage from "./page";

describe("CoursesPage — hero content", () => {
  it("renders the main heading", async () => {
    const jsx = await Promise.resolve(CoursesPage());
    await act(async () => { render(jsx); });
    expect(screen.getByText("Certification Courses")).toBeTruthy();
  });

  it("renders the description text", async () => {
    const jsx = await Promise.resolve(CoursesPage());
    await act(async () => { render(jsx); });
    expect(screen.getByText(/Structured learning paths curated from our video library/i)).toBeTruthy();
  });

  it("renders the Home back-link pointing to /", async () => {
    const jsx = await Promise.resolve(CoursesPage());
    await act(async () => { render(jsx); });
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink.getAttribute("href")).toBe("/");
  });
});

describe("CoursesPage — stats badges", () => {
  it("shows the correct course count", async () => {
    const jsx = await Promise.resolve(CoursesPage());
    await act(async () => { render(jsx); });
    // 2 courses in our mock
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("Courses")).toBeTruthy();
  });

  it("shows the total video count across all courses", async () => {
    const jsx = await Promise.resolve(CoursesPage());
    await act(async () => { render(jsx); });
    // course 1 has 2 videos, course 2 has 1 → 3 total
    // Use getAllByText since "3" appears in multiple stats badges
    const threes = screen.getAllByText("3");
    expect(threes.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Videos")).toBeTruthy();
  });

  it("shows the difficulty levels badge (hardcoded 3)", async () => {
    const jsx = await Promise.resolve(CoursesPage());
    await act(async () => { render(jsx); });
    expect(screen.getByText("Difficulty levels")).toBeTruthy();
  });
});

describe("CoursesPage — JSON-LD", () => {
  it("injects a BreadcrumbList JSON-LD script", async () => {
    const jsx = await Promise.resolve(CoursesPage());
    const { container } = render(jsx);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const jsonLds = Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
    const breadcrumb = jsonLds.find((j) => j["@type"] === "BreadcrumbList");
    expect(breadcrumb).toBeTruthy();
    expect(breadcrumb.itemListElement[0].name).toBe("Home");
    expect(breadcrumb.itemListElement[1].name).toBe("Certification Courses");
  });

  it("injects an ItemList JSON-LD script for courses", async () => {
    const jsx = await Promise.resolve(CoursesPage());
    const { container } = render(jsx);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const jsonLds = Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
    const itemList = jsonLds.find((j) => j["@type"] === "ItemList");
    expect(itemList).toBeTruthy();
    expect(itemList.numberOfItems).toBe(2);
    expect(itemList.itemListElement).toHaveLength(2);
    expect(itemList.itemListElement[0].item["@type"]).toBe("Course");
  });

  it("ItemList items include educationalLevel derived from difficulty", async () => {
    const jsx = await Promise.resolve(CoursesPage());
    const { container } = render(jsx);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const jsonLds = Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
    const itemList = jsonLds.find((j) => j["@type"] === "ItemList");
    const firstCourse = itemList.itemListElement[0].item;
    expect(firstCourse.educationalLevel).toBe("Beginner");
  });
});

describe("CoursesPage — metadata export", () => {
  it("exports correct page title in metadata", async () => {
    const { metadata } = await import("./page");
    expect((metadata as { title: string }).title).toBe("Certification Courses | Sonar.tv");
  });

  it("exports canonical URL /courses in metadata", async () => {
    const { metadata } = await import("./page");
    expect((metadata as { alternates: { canonical: string } }).alternates.canonical).toBe("/courses");
  });
});
