/**
 * CategoryPage edge-case tests that require mocking @/data/videos.
 * Kept separate from page.test.tsx so that file can import @/data/videos
 * without any module mock interfering with the real data.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// ── next/ mocks ──────────────────────────────────────────────────────────────
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

// ── @/data/videos — partially mocked so individual tests can override helpers ─
vi.mock("@/data/videos", async (importActual) => {
  const actual = await importActual<typeof import("@/data/videos")>();
  return {
    ...actual,
    getCategoryBySlug: vi.fn(actual.getCategoryBySlug),
    getVideosByCategory: vi.fn(actual.getVideosByCategory),
  };
});

import CategoryPage from "./page";
import * as videosModule from "@/data/videos";
import type { Video } from "@/types";

function makeVideo(overrides: Partial<Video> = {}): Video {
  return {
    id: "v-edge-1",
    title: "Edge Case Video",
    description: "A test video",
    youtubeId: "edge123",
    thumbnail: "https://img.youtube.com/vi/edge123/maxresdefault.jpg",
    category: "getting-started",
    duration: "5:00",
    publishedAt: "2026-01-01",
    ...overrides,
  };
}

beforeEach(() => {
  cleanup();
  localStorage.clear();
  // Reset mocks to real implementations before each test.
  vi.mocked(videosModule.getCategoryBySlug).mockImplementation(
    (slug: string) => videosModule.categories.find((c) => c.slug === slug)
  );
  vi.mocked(videosModule.getVideosByCategory).mockImplementation(
    (slug: string) => videosModule.videos.filter((v) => v.category === slug)
  );
});

// ── empty-state branch ────────────────────────────────────────────────────────
describe("CategoryPage — empty category (no videos)", () => {
  it('renders "No videos in this category yet." when category has zero videos', async () => {
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([]);

    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);

    expect(
      screen.getByText(/no videos in this category yet/i)
    ).toBeInTheDocument();
  });

  it('renders a "Browse all videos" link back to "/" for empty category', async () => {
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([]);

    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);

    const browseLink = screen.getByRole("link", { name: /browse all videos/i });
    expect(browseLink).toHaveAttribute("href", "/");
  });

  it("does NOT render CategoryContent when category has zero videos", async () => {
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([]);

    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);

    expect(screen.queryByTestId("category-content")).not.toBeInTheDocument();
  });

  it("does NOT render a total-duration badge when category has zero videos", async () => {
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([]);

    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);

    expect(screen.queryByText(/total/i)).not.toBeInTheDocument();
  });
});

// ── formatTotalDuration hours branch ─────────────────────────────────────────
describe("CategoryPage — formatTotalDuration hours format", () => {
  it('renders "Xh Xm total" when videos sum to ≥ 3600 seconds', async () => {
    // 1 hour + 5 minutes = 3900 seconds total
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([
      makeVideo({ id: "long-1", duration: "1:00:00" }), // 3600s
      makeVideo({ id: "long-2", duration: "5:00" }),    // 300s
    ]);

    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);

    // Should match "1h 5m total"
    expect(screen.getByText(/\dh \dm total/)).toBeInTheDocument();
    expect(screen.getByText(/1h 5m total/)).toBeInTheDocument();
  });

  it("renders minutes-only format when total is < 3600 seconds", async () => {
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([
      makeVideo({ id: "short-1", duration: "10:00" }), // 600s
      makeVideo({ id: "short-2", duration: "5:30" }),  // 330s
    ]);

    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);

    // "15m total" — no hours component
    const badge = screen.getByText(/total/i);
    expect(badge.textContent).toMatch(/^\d+m total$/);
    expect(badge.textContent).not.toMatch(/h/);
  });

  it("handles exact 1-hour boundary (3600s → 1h 0m total)", async () => {
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([
      makeVideo({ id: "exact-1", duration: "1:00:00" }), // exactly 3600s
    ]);

    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);

    expect(screen.getByText(/1h 0m total/)).toBeInTheDocument();
  });
});

// ── singular video count ──────────────────────────────────────────────────────
describe("CategoryPage — video count badge", () => {
  it('shows "1 video" (singular) when category has exactly one video', async () => {
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([
      makeVideo({ id: "solo-1" }),
    ]);

    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);

    expect(screen.getByText(/1 video$/)).toBeInTheDocument();
    // Ensure it does NOT say "1 videos"
    expect(screen.queryByText(/1 videos/)).not.toBeInTheDocument();
  });

  it('shows "N videos" (plural) when category has multiple videos', async () => {
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([
      makeVideo({ id: "multi-1" }),
      makeVideo({ id: "multi-2" }),
      makeVideo({ id: "multi-3" }),
    ]);

    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);

    expect(screen.getByText(/3 videos/)).toBeInTheDocument();
  });
});

// ── breadcrumb JSON-LD ────────────────────────────────────────────────────────
describe("CategoryPage — breadcrumb JSON-LD", () => {
  it("injects a BreadcrumbList JSON-LD script tag", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    const { container } = render(jsx);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const json = JSON.parse(script!.innerHTML);
    expect(json["@type"]).toBe("BreadcrumbList");
  });

  it("JSON-LD contains Home as the first breadcrumb item", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    const { container } = render(jsx);

    const script = container.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script!.innerHTML);

    const firstItem = json.itemListElement[0];
    expect(firstItem.position).toBe(1);
    expect(firstItem.name).toBe("Home");
  });

  it("JSON-LD contains the category title as the second breadcrumb item", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "code-security" }),
    });
    const { container } = render(jsx);

    const script = container.querySelector('script[type="application/ld+json"]');
    const json = JSON.parse(script!.innerHTML);

    const secondItem = json.itemListElement[1];
    expect(secondItem.position).toBe(2);
    expect(secondItem.name).toBe("Code Security");
  });
});
