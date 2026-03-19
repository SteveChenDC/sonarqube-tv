/**
 * WatchPage — "More in" VideoRow 15-video cap
 *
 * Tests that the WatchPage correctly applies a 15-video cap when passing
 * related videos to VideoRow (`relatedVideos.slice(0, 15)`) while still
 * passing the full count via `totalCount={relatedVideos.length}`.
 *
 * Uses a VideoRow mock that exposes received props as data attributes so we
 * can assert what the parent passes without rendering real VideoRow internals.
 *
 * Kept separate from page.edge-cases.test.tsx because it needs a different
 * VideoRow mock that captures `videos` and `totalCount` props.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
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

// VideoRow mock that exposes key props as data attributes for assertion.
vi.mock("@/components/VideoRow", () => ({
  default: ({
    title,
    videos,
    totalCount,
    categorySlug,
  }: {
    title: string;
    videos?: { id: string }[];
    totalCount?: number;
    categorySlug?: string;
  }) => (
    <div
      data-testid="video-row"
      data-video-count={videos?.length}
      data-total-count={totalCount}
      data-category-slug={categorySlug ?? ""}
    >
      {title}
    </div>
  ),
}));

vi.mock("@/data/articles", () => ({
  getArticleByVideoId: vi.fn(() => null),
  getTranscriptByVideoId: vi.fn(() => null),
}));

// Partial mock — only wrap the helper functions we need to control per-test.
vi.mock("@/data/videos", async (importActual) => {
  const actual = await importActual<typeof import("@/data/videos")>();
  return {
    ...actual,
    getCategoryBySlug: vi.fn(actual.getCategoryBySlug),
    getVideosByCategory: vi.fn(actual.getVideosByCategory),
    getRelatedVideosFromOtherCategories: vi.fn(
      actual.getRelatedVideosFromOtherCategories
    ),
  };
});

import WatchPage from "./page";
import * as videosModule from "@/data/videos";

beforeEach(() => {
  cleanup();
  localStorage.clear();
  // Reset mocks to their real implementations so tests are independent.
  vi.mocked(videosModule.getCategoryBySlug).mockImplementation((slug: string) =>
    videosModule.categories.find((c) => c.slug === slug)
  );
  vi.mocked(videosModule.getVideosByCategory).mockImplementation((slug: string) =>
    videosModule.videos.filter((v) => v.category === slug)
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

/**
 * Helper: find the "More in …" VideoRow element rendered by WatchPage.
 */
function getMoreInRow() {
  const rows = screen.getAllByTestId("video-row");
  return rows.find((r) => (r.textContent ?? "").startsWith("More in"));
}

describe("WatchPage — 'More in' VideoRow 15-video cap", () => {
  it("passes at most 15 videos to the VideoRow when category has 16 related videos", async () => {
    // Arrange: 17 videos total (current + 16 siblings).
    // After WatchPage's .filter(v => v.id !== video.id), relatedVideos = 16.
    // relatedVideos.slice(0, 15) must cap to 15.
    const currentVideo = videosModule.videos[0];
    const relatedPool = Array.from({ length: 16 }, (_, i) => ({
      ...currentVideo,
      id: `related-cap-${i}`,
      title: `Related Cap Video ${i}`,
    }));
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([
      currentVideo,
      ...relatedPool,
    ]);

    const jsx = await WatchPage({ params: Promise.resolve({ id: currentVideo.id }) });
    render(jsx);

    const moreInRow = getMoreInRow();
    expect(moreInRow).toBeDefined();
    // Cap: only 15 of the 16 relatedVideos are passed to VideoRow.
    expect(moreInRow!.getAttribute("data-video-count")).toBe("15");
  });

  it("passes totalCount equal to the full related count (not the capped 15)", async () => {
    // totalCount must reflect ALL related videos so VideoRow can show
    // a "View all" link pointing to the full category page.
    const currentVideo = videosModule.videos[0];
    const relatedPool = Array.from({ length: 16 }, (_, i) => ({
      ...currentVideo,
      id: `related-tc-${i}`,
      title: `Related TC Video ${i}`,
    }));
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([
      currentVideo,
      ...relatedPool,
    ]);

    const jsx = await WatchPage({ params: Promise.resolve({ id: currentVideo.id }) });
    render(jsx);

    const moreInRow = getMoreInRow();
    expect(moreInRow).toBeDefined();
    // totalCount = 16 (all related), not 15 (the capped render count).
    expect(moreInRow!.getAttribute("data-total-count")).toBe("16");
  });

  it("passes categorySlug to the 'More in' VideoRow (enables 'View all' link)", async () => {
    // categorySlug wires the VideoRow's "View all → /category/<slug>" link.
    const currentVideo = videosModule.videos[0];
    const sibling = { ...currentVideo, id: "related-slug-check", title: "Sibling" };
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([
      currentVideo,
      sibling,
    ]);

    const jsx = await WatchPage({ params: Promise.resolve({ id: currentVideo.id }) });
    render(jsx);

    const moreInRow = getMoreInRow();
    expect(moreInRow).toBeDefined();
    expect(moreInRow!.getAttribute("data-category-slug")).toBe(currentVideo.category);
  });

  it("renders all 15 related videos when exactly 15 exist (boundary — cap does not fire)", async () => {
    // 16 videos total (current + 15 siblings).
    // relatedVideos = 15 → slice(0, 15) = 15 (no truncation at the boundary).
    const currentVideo = videosModule.videos[0];
    const relatedPool = Array.from({ length: 15 }, (_, i) => ({
      ...currentVideo,
      id: `related-boundary-${i}`,
      title: `Related Boundary Video ${i}`,
    }));
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([
      currentVideo,
      ...relatedPool,
    ]);

    const jsx = await WatchPage({ params: Promise.resolve({ id: currentVideo.id }) });
    render(jsx);

    const moreInRow = getMoreInRow();
    expect(moreInRow).toBeDefined();
    // Exactly 15 related → all 15 rendered, no cap.
    expect(moreInRow!.getAttribute("data-video-count")).toBe("15");
    // totalCount also equals 15 (no "View all" link needed since all are shown).
    expect(moreInRow!.getAttribute("data-total-count")).toBe("15");
  });

  it("renders all related videos when fewer than 15 exist", async () => {
    // When there are only 5 related videos, all 5 are shown with totalCount=5.
    const currentVideo = videosModule.videos[0];
    const relatedPool = Array.from({ length: 5 }, (_, i) => ({
      ...currentVideo,
      id: `related-small-${i}`,
      title: `Related Small Video ${i}`,
    }));
    vi.mocked(videosModule.getVideosByCategory).mockReturnValueOnce([
      currentVideo,
      ...relatedPool,
    ]);

    const jsx = await WatchPage({ params: Promise.resolve({ id: currentVideo.id }) });
    render(jsx);

    const moreInRow = getMoreInRow();
    expect(moreInRow).toBeDefined();
    // 5 related → no cap, all 5 rendered.
    expect(moreInRow!.getAttribute("data-video-count")).toBe("5");
    expect(moreInRow!.getAttribute("data-total-count")).toBe("5");
  });
});
