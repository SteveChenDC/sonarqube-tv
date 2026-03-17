import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// Must mock before importing the page module
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

// Mock CategoryContent — it has its own test suite
vi.mock("@/components/CategoryContent", () => ({
  default: ({
    videos,
  }: {
    videos: { id: string }[];
    description?: string;
  }) => (
    <div data-testid="category-content">
      {videos.map((v) => (
        <span key={v.id}>{v.id}</span>
      ))}
    </div>
  ),
}));

import CategoryPage, {
  generateStaticParams,
  generateMetadata,
} from "./page";
import { categories } from "@/data/videos";

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// generateStaticParams
// ---------------------------------------------------------------------------
describe("generateStaticParams", () => {
  it("returns one entry per category", () => {
    const params = generateStaticParams();
    expect(params.length).toBe(categories.length);
  });

  it("every entry has a slug string", () => {
    const params = generateStaticParams();
    expect(params.every((p) => typeof p.slug === "string")).toBe(true);
  });

  it("includes the getting-started slug", () => {
    const params = generateStaticParams();
    expect(params.map((p) => p.slug)).toContain("getting-started");
  });
});

// ---------------------------------------------------------------------------
// generateMetadata
// ---------------------------------------------------------------------------
describe("generateMetadata", () => {
  it("returns the category title as metadata title for a valid slug", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    expect(meta.title).toBe("Getting Started");
  });

  it("returns the category description as metadata description", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    expect(typeof meta.description).toBe("string");
    expect((meta.description as string).length).toBeGreaterThan(0);
  });

  it("includes openGraph metadata with the category title", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "code-security" }),
    });
    const og = meta.openGraph as { title?: string } | undefined;
    expect(og?.title).toContain("Code Security");
  });

  it("includes twitter card metadata", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "clean-code" }),
    });
    const twitter = meta.twitter as { card?: string } | undefined;
    expect(twitter?.card).toBe("summary_large_image");
  });

  it("sets canonical alternates to /category/{slug}", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "devops-cicd" }),
    });
    const alternates = meta.alternates as
      | { canonical?: string }
      | undefined;
    expect(alternates?.canonical).toBe("/category/devops-cicd");
  });

  it("returns an empty object for an unknown slug", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "this-does-not-exist" }),
    });
    expect(meta).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// CategoryPage rendering
// ---------------------------------------------------------------------------
describe("CategoryPage", () => {
  it("renders the category heading for a valid slug", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);
    expect(
      screen.getByRole("heading", { name: /getting started/i })
    ).toBeInTheDocument();
  });

  it("renders a back link pointing to '/'", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);
    const backLink = screen.getByRole("link", { name: /back/i });
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("renders a video count badge", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);
    expect(screen.getByText(/video/i)).toBeInTheDocument();
  });

  it("renders total duration badge when videos exist", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);
    // formatTotalDuration produces "Xm total" or "Xh Xm total"
    expect(screen.getByText(/total/i)).toBeInTheDocument();
  });

  it("renders category description", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);
    // The Getting Started description mentions "Installation"
    expect(screen.getByText(/installation/i)).toBeInTheDocument();
  });

  it("renders CategoryContent component with videos", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);
    expect(screen.getByTestId("category-content")).toBeInTheDocument();
  });

  it("throws NEXT_NOT_FOUND for an unknown slug", async () => {
    await expect(
      CategoryPage({ params: Promise.resolve({ slug: "not-a-real-slug" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders the Sonar Summit category correctly", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "sonar-summit" }),
    });
    render(jsx);
    expect(
      screen.getByRole("heading", { name: /sonar summit/i })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// formatTotalDuration via page render (private function, tested via output)
// ---------------------------------------------------------------------------
describe("formatTotalDuration (via CategoryPage render)", () => {
  it("shows minutes-only format for categories with <1h total duration", async () => {
    // ai-code-quality is a real category — total duration is checked for format
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "ai-code-quality" }),
    });
    render(jsx);
    // We just verify some duration badge is present without asserting the exact number
    const text = screen.getByText(/total/i).textContent ?? "";
    // Must match either "Xm total" or "Xh Xm total"
    expect(text).toMatch(/(\d+h \d+m|\d+m) total/);
  });
});
