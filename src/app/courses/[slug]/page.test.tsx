/**
 * Tests for the /courses/[slug] detail page (server component).
 * Verifies generateStaticParams, generateMetadata, render, notFound, JSON-LD.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import React from "react";

// ── next/ mocks ───────────────────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

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

// ── Dynamic CourseTimeline + CourseSidebar: mock them ─────────────────────────
vi.mock("@/components/CourseTimeline", () => ({
  default: ({ course }: { course: { title: string } }) => (
    <div data-testid="course-timeline">{course.title} timeline</div>
  ),
}));

vi.mock("@/components/CourseSidebar", () => ({
  default: ({ course }: { course: { title: string } }) => (
    <div data-testid="course-sidebar">{course.title} sidebar</div>
  ),
}));

// ── courses data mock — data inlined to avoid hoisting issues ─────────────────
vi.mock("@/data/courses", () => {
  const courseA = {
    id: "scd",
    slug: "sonarqube-certified-developer",
    title: "SonarQube Certified Developer",
    shortTitle: "SCD",
    description: "Master the fundamentals of SonarQube.",
    difficulty: "beginner",
    targetAudience: "Developers new to SonarQube",
    learningOutcomes: [
      "Install and configure SonarQube",
      "Run your first scan",
      "Apply Clean as You Code",
    ],
    accentColor: "qube-blue",
    modules: [
      { id: "m1", title: "Introduction", description: "First module", videoIds: ["v1", "v2"] },
      { id: "m2", title: "Deep Dive", description: "Second module", videoIds: ["v3"] },
    ],
  };

  const courseB = {
    id: "sca",
    slug: "sonarqube-certified-architect",
    title: "SonarQube Certified Architect",
    shortTitle: "SCA",
    description: "Advanced enterprise SonarQube.",
    difficulty: "advanced",
    targetAudience: "Enterprise architects",
    learningOutcomes: ["Enterprise governance", "Advanced config"],
    accentColor: "sonar-red",
    modules: [
      { id: "m1", title: "Enterprise", description: "Enterprise module", videoIds: ["v4"] },
    ],
  };

  return {
    courses: [courseA, courseB],
    getCourseBySlug: (slug: string) => {
      if (slug === "sonarqube-certified-developer") return courseA;
      if (slug === "sonarqube-certified-architect") return courseB;
      return undefined;
    },
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
      const total = course.modules.reduce(
        (s: number, m: { videoIds: string[] }) => s + m.videoIds.length * 10,
        0
      );
      return `${total}m`;
    },
  };
});

import CourseDetailPage, { generateStaticParams, generateMetadata } from "./page";

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

// ── generateStaticParams ──────────────────────────────────────────────────────
describe("generateStaticParams", () => {
  it("returns a param object for every course", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(2);
    expect(params.map((p) => p.slug)).toContain("sonarqube-certified-developer");
    expect(params.map((p) => p.slug)).toContain("sonarqube-certified-architect");
  });
});

// ── generateMetadata ──────────────────────────────────────────────────────────
describe("generateMetadata", () => {
  it("returns title including course name", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    expect((meta as { title: string }).title).toBe("SonarQube Certified Developer | Sonar.tv");
  });

  it("returns the course description in metadata", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    expect((meta as { description: string }).description).toContain("SonarQube");
  });

  it("sets canonical URL to /courses/[slug]", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "sonarqube-certified-architect" }),
    });
    expect(
      (meta as { alternates: { canonical: string } }).alternates.canonical
    ).toBe("/courses/sonarqube-certified-architect");
  });

  it("returns empty object for unknown slug", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "does-not-exist" }),
    });
    expect(meta).toEqual({});
  });
});

// ── CourseDetailPage render ───────────────────────────────────────────────────
describe("CourseDetailPage — render", () => {
  it("renders the course title as h1", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    await act(async () => { render(jsx); });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "SonarQube Certified Developer"
    );
  });

  it("renders the course description", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    await act(async () => { render(jsx); });
    expect(screen.getByText("Master the fundamentals of SonarQube.")).toBeTruthy();
  });

  it("shows the difficulty badge", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    await act(async () => { render(jsx); });
    expect(screen.getByText("Beginner")).toBeTruthy();
  });

  it("shows the shortTitle badge", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    await act(async () => { render(jsx); });
    expect(screen.getByText("SCD")).toBeTruthy();
  });

  it("shows module and video count stats", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    await act(async () => { render(jsx); });
    expect(screen.getByText(/2 modules/)).toBeTruthy();
    expect(screen.getByText(/3 videos/)).toBeTruthy();
  });

  it("shows back link to /courses", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    await act(async () => { render(jsx); });
    const link = screen.getByRole("link", { name: /all courses/i });
    expect(link.getAttribute("href")).toBe("/courses");
  });
});

// ── What you'll learn ─────────────────────────────────────────────────────────
describe("CourseDetailPage — learning outcomes", () => {
  it("renders all learning outcomes", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    await act(async () => { render(jsx); });
    expect(screen.getByText("Install and configure SonarQube")).toBeTruthy();
    expect(screen.getByText("Run your first scan")).toBeTruthy();
    expect(screen.getByText("Apply Clean as You Code")).toBeTruthy();
  });

  it("renders the 'What you'll learn' section header", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    await act(async () => { render(jsx); });
    expect(screen.getByText(/what you.ll learn/i)).toBeTruthy();
  });
});

// ── Target audience ───────────────────────────────────────────────────────────
describe("CourseDetailPage — target audience", () => {
  it("renders the target audience text", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    await act(async () => { render(jsx); });
    expect(screen.getByText("Developers new to SonarQube")).toBeTruthy();
  });

  it("renders the 'Who this course is for' header", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    await act(async () => { render(jsx); });
    expect(screen.getByText(/who this course is for/i)).toBeTruthy();
  });
});

// ── notFound ──────────────────────────────────────────────────────────────────
describe("CourseDetailPage — notFound", () => {
  it("throws NEXT_NOT_FOUND for an unknown slug", async () => {
    await expect(
      CourseDetailPage({ params: Promise.resolve({ slug: "does-not-exist" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

// ── JSON-LD ───────────────────────────────────────────────────────────────────
describe("CourseDetailPage — JSON-LD", () => {
  it("injects a Course JSON-LD script", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    const { container } = render(jsx);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const jsonLds = Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
    const course = jsonLds.find((j) => j["@type"] === "Course");
    expect(course).toBeTruthy();
    expect(course.name).toBe("SonarQube Certified Developer");
    expect(course.educationalLevel).toBe("Beginner");
  });

  it("Course JSON-LD has teaches array from learningOutcomes", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    const { container } = render(jsx);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const jsonLds = Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
    const course = jsonLds.find((j) => j["@type"] === "Course");
    expect(course.teaches).toContain("Install and configure SonarQube");
  });

  it("injects a BreadcrumbList JSON-LD with 3 items (Home > Courses > Title)", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    const { container } = render(jsx);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const jsonLds = Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
    const breadcrumb = jsonLds.find((j) => j["@type"] === "BreadcrumbList");
    expect(breadcrumb).toBeTruthy();
    expect(breadcrumb.itemListElement).toHaveLength(3);
    expect(breadcrumb.itemListElement[0].name).toBe("Home");
    expect(breadcrumb.itemListElement[1].name).toBe("Courses");
    expect(breadcrumb.itemListElement[2].name).toBe("SonarQube Certified Developer");
  });

  it("Course JSON-LD has audience from targetAudience", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    const { container } = render(jsx);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const jsonLds = Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
    const course = jsonLds.find((j) => j["@type"] === "Course");
    expect(course.audience.audienceType).toBe("Developers new to SonarQube");
  });

  it("CourseInstance has courseMode: online", async () => {
    const jsx = await CourseDetailPage({
      params: Promise.resolve({ slug: "sonarqube-certified-developer" }),
    });
    const { container } = render(jsx);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const jsonLds = Array.from(scripts).map((s) => JSON.parse(s.innerHTML));
    const course = jsonLds.find((j) => j["@type"] === "Course");
    expect(course.hasCourseInstance.courseMode).toBe("online");
  });
});
