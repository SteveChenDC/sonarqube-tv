/**
 * WatchPage edge-case tests that require mocking @/data/videos.
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

// ── heavy child-component mocks ───────────────────────────────────────────────
vi.mock("@/components/VideoPlayer", () => ({
  default: ({ title, videoId }: { title: string; videoId: string }) => (
    <div data-testid="video-player" data-video-id={videoId}>
      {title}
    </div>
  ),
}));

vi.mock("@/components/NowPlayingBar", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="now-playing-bar">{title}</div>
  ),
}));

vi.mock("@/components/PlaylistQueue", () => ({
  default: ({ currentVideoId }: { currentVideoId: string }) => (
    <div data-testid="playlist-queue" data-current={currentVideoId} />
  ),
}));

vi.mock("@/components/ArticleTabs", () => ({
  default: () => <div data-testid="article-tabs" />,
}));

vi.mock("@/components/ShareButton", () => ({
  default: () => <button data-testid="share-button">Share</button>,
}));

vi.mock("@/components/VideoRow", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="video-row">{title}</div>
  ),
}));

// articles — always null in these tests
vi.mock("@/data/articles", () => ({
  getArticleByVideoId: vi.fn(() => null),
  getTranscriptByVideoId: vi.fn(() => null),
}));

// ── @/data/videos — partially mocked so individual tests can override helpers ─
vi.mock("@/data/videos", async (importActual) => {
  const actual = await importActual<typeof import("@/data/videos")>();
  return {
    ...actual,
    // Make these vi.fn() so individual tests can override them via mockReturnValueOnce.
    // Default: delegate to the actual implementations.
    getCategoryBySlug: vi.fn(actual.getCategoryBySlug),
    getVideosByCategory: vi.fn(actual.getVideosByCategory),
    getRelatedVideosFromOtherCategories: vi.fn(
      actual.getRelatedVideosFromOtherCategories
    ),
  };
});

import WatchPage, { generateMetadata } from "./page";
import * as videosModule from "@/data/videos";

beforeEach(() => {
  cleanup();
  localStorage.clear();
  // Reset to real implementations before each test so tests are independent.
  vi.mocked(videosModule.getCategoryBySlug).mockImplementation(
    (slug: string) => {
      // Re-import not needed — we can look up directly from the real data.
      return videosModule.categories.find((c) => c.slug === slug);
    }
  );
  vi.mocked(videosModule.getVideosByCategory).mockImplementation(
    (slug: string) => videosModule.videos.filter((v) => v.category === slug)
  );
  vi.mocked(videosModule.getRelatedVideosFromOtherCategories).mockImplementation(
    (videoId: string, excludeCategory: string, count: number = 4) => {
      const pool = videosModule.videos.filter(
        (v) => v.id !== videoId && v.category !== excludeCategory
      );
      const seenCats = new Set<string>();
      const picked: typeof videosModule.videos = [];
      const offset = Math.max(
        0,
        videosModule.videos.findIndex((v) => v.id === videoId)
      );
      for (let i = 0; i < pool.length && picked.length < count; i++) {
        const candidate = pool[(offset + i) % pool.length];
        if (!seenCats.has(candidate.category)) {
          seenCats.add(candidate.category);
          picked.push(candidate);
        }
      }
      return picked;
    }
  );
});

// ── null-category branch ──────────────────────────────────────────────────────
describe("WatchPage — undefined category (getCategoryBySlug returns undefined)", () => {
  it("does not render a category badge link when category is undefined", async () => {
    vi.mocked(videosModule.getCategoryBySlug).mockReturnValueOnce(undefined);

    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);

    // The category badge links to /#<category-slug>; it should be absent.
    const links = screen.getAllByRole("link");
    const categoryBadge = links.find((l) =>
      (l.getAttribute("href") ?? "").startsWith("/#")
    );
    expect(categoryBadge).toBeUndefined();
  });

  it("breadcrumb JSON-LD has only 2 items when category is undefined", async () => {
    vi.mocked(videosModule.getCategoryBySlug).mockReturnValueOnce(undefined);

    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    const { container } = render(jsx);

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const breadcrumbLd = Array.from(scripts)
      .map((s) => s.textContent ?? "")
      .find((c) => c.includes("BreadcrumbList"));

    expect(breadcrumbLd).toBeTruthy();
    const parsed = JSON.parse(breadcrumbLd!);
    // Without a category, itemListElement should have exactly 2 entries: Home + Video.
    expect(parsed.itemListElement).toHaveLength(2);
    expect(parsed.itemListElement[0].name).toBe("Home");
    expect(parsed.itemListElement[0].position).toBe(1);
    expect(parsed.itemListElement[1].position).toBe(2);
  });

  it("breadcrumb second item is the video title when category is undefined", async () => {
    vi.mocked(videosModule.getCategoryBySlug).mockReturnValueOnce(undefined);

    const video = videosModule.videos[0];
    const jsx = await WatchPage({ params: Promise.resolve({ id: video.id }) });
    const { container } = render(jsx);

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const breadcrumbLd = Array.from(scripts)
      .map((s) => s.textContent ?? "")
      .find((c) => c.includes("BreadcrumbList"));

    const parsed = JSON.parse(breadcrumbLd!);
    expect(parsed.itemListElement[1].name).toBe(video.title);
  });

  it('"More in" VideoRow title falls back to "More in this category" when category is undefined', async () => {
    vi.mocked(videosModule.getCategoryBySlug).mockReturnValueOnce(undefined);

    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);

    const rows = screen.getAllByTestId("video-row");
    const titles = rows.map((r) => r.textContent ?? "");
    expect(titles.some((t) => t === "More in this category")).toBe(true);
  });
});

// ── "More in" row visibility ──────────────────────────────────────────────────
describe("WatchPage — 'More in …' VideoRow visibility", () => {
  it("does not render 'More in' row when there are no related videos in the same category", async () => {
    // Only the current video is returned — after .filter(v => v.id !== video.id) the list is empty.
    const currentVideo = videosModule.videos[0];
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([
      currentVideo,
    ]);

    const jsx = await WatchPage({ params: Promise.resolve({ id: currentVideo.id }) });
    render(jsx);

    const rows = screen.queryAllByTestId("video-row");
    const moreInRow = rows.find((r) =>
      (r.textContent ?? "").toLowerCase().startsWith("more in")
    );
    expect(moreInRow).toBeUndefined();
  });
});

// ── "You Might Also Like" row visibility ─────────────────────────────────────
describe("WatchPage — 'You Might Also Like' VideoRow visibility", () => {
  it("does not render the row when fewer than 2 cross-category videos are found", async () => {
    // Return only 1 video — the >= 2 guard should hide the row.
    vi.mocked(videosModule.getRelatedVideosFromOtherCategories).mockReturnValueOnce(
      [videosModule.videos[1]]
    );

    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);

    const rows = screen.queryAllByTestId("video-row");
    const ymalRow = rows.find((r) =>
      (r.textContent ?? "").toLowerCase().includes("you might also like")
    );
    expect(ymalRow).toBeUndefined();
  });

  it("does not render the row when getRelatedVideosFromOtherCategories returns an empty array", async () => {
    vi.mocked(videosModule.getRelatedVideosFromOtherCategories).mockReturnValueOnce(
      []
    );

    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);

    const rows = screen.queryAllByTestId("video-row");
    const ymalRow = rows.find((r) =>
      (r.textContent ?? "").toLowerCase().includes("you might also like")
    );
    expect(ymalRow).toBeUndefined();
  });

  it("renders the row when exactly 2 cross-category videos are found", async () => {
    vi.mocked(videosModule.getRelatedVideosFromOtherCategories).mockReturnValueOnce(
      videosModule.videos.slice(1, 3)
    );

    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);

    const rows = screen.queryAllByTestId("video-row");
    const ymalRow = rows.find((r) =>
      (r.textContent ?? "").toLowerCase().includes("you might also like")
    );
    expect(ymalRow).toBeDefined();
  });
});

// ── generateMetadata — twitter images ────────────────────────────────────────
describe("generateMetadata — twitter fields", () => {
  it("twitter images array uses maxresdefault for social card quality", async () => {
    const video = videosModule.videos[0];
    const meta = await generateMetadata({
      params: Promise.resolve({ id: video.id }),
    });
    const twitter = meta.twitter as { images?: string[] } | undefined;
    expect(Array.isArray(twitter?.images)).toBe(true);
    // Twitter cards use maxresdefault — independent of VideoCard hqdefault thumbnails.
    expect(twitter?.images?.[0]).toBe(
      `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`
    );
  });

  it("twitter title matches the video title", async () => {
    const video = videosModule.videos[0];
    const meta = await generateMetadata({
      params: Promise.resolve({ id: video.id }),
    });
    const twitter = meta.twitter as { title?: string } | undefined;
    expect(twitter?.title).toBe(video.title);
  });

  it("twitter description matches the video description", async () => {
    const video = videosModule.videos[0];
    const meta = await generateMetadata({
      params: Promise.resolve({ id: video.id }),
    });
    const twitter = meta.twitter as { description?: string } | undefined;
    expect(twitter?.description).toBe(video.description);
  });
});
