import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
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

// Mock heavy child components — each has its own test suite
vi.mock("@/components/VideoPlayer", () => ({
  default: ({ title, videoId }: { title: string; youtubeId: string; videoId: string }) => (
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

// Mock articles — by default return null (no article/transcript)
vi.mock("@/data/articles", () => ({
  getArticleByVideoId: vi.fn(() => null),
  getTranscriptByVideoId: vi.fn(() => null),
}));

import WatchPage, { generateStaticParams, generateMetadata } from "./page";
import { videos } from "@/data/videos";

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// generateStaticParams
// ---------------------------------------------------------------------------
describe("generateStaticParams", () => {
  it("returns one entry per video", () => {
    const params = generateStaticParams();
    expect(params.length).toBe(videos.length);
  });

  it("every entry has an id string", () => {
    const params = generateStaticParams();
    expect(params.every((p) => typeof p.id === "string" && p.id.length > 0)).toBe(
      true
    );
  });

  it("includes video id v1", () => {
    const params = generateStaticParams();
    expect(params.map((p) => p.id)).toContain("v1");
  });
});

// ---------------------------------------------------------------------------
// generateMetadata
// ---------------------------------------------------------------------------
describe("generateMetadata", () => {
  it("returns the video title as metadata title for a valid id", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ id: "v1" }),
    });
    expect(typeof meta.title).toBe("string");
    expect((meta.title as string).length).toBeGreaterThan(0);
  });

  it("returns the video description as metadata description", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ id: "v1" }),
    });
    expect(typeof meta.description).toBe("string");
    expect((meta.description as string).length).toBeGreaterThan(0);
  });

  it("includes openGraph metadata with an image", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ id: "v1" }),
    });
    const og = meta.openGraph as { images?: { url: string }[] } | undefined;
    expect(og?.images?.[0]?.url).toBeTruthy();
  });

  it("sets openGraph type to video.other", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ id: "v1" }),
    });
    const og = meta.openGraph as { type?: string } | undefined;
    expect(og?.type).toBe("video.other");
  });

  it("includes twitter card summary_large_image", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ id: "v1" }),
    });
    const twitter = meta.twitter as { card?: string } | undefined;
    expect(twitter?.card).toBe("summary_large_image");
  });

  it("sets canonical alternates to /watch/{id}", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ id: "v1" }),
    });
    const alternates = meta.alternates as { canonical?: string } | undefined;
    expect(alternates?.canonical).toBe("/watch/v1");
  });

  it("returns an empty object for an unknown id", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ id: "not-a-real-video" }),
    });
    expect(meta).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// WatchPage rendering
// ---------------------------------------------------------------------------
describe("WatchPage", () => {
  it("renders the video title in a heading", async () => {
    const video = videos[0];
    const jsx = await WatchPage({ params: Promise.resolve({ id: video.id }) });
    render(jsx);
    expect(
      screen.getByRole("heading", { name: new RegExp(video.title.slice(0, 20), "i") })
    ).toBeInTheDocument();
  });

  it("renders a Back link pointing to '/'", async () => {
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);
    const backLink = screen.getByRole("link", { name: /back/i });
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("renders the VideoPlayer with the correct video id", async () => {
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);
    const player = screen.getByTestId("video-player");
    expect(player).toBeInTheDocument();
    expect(player).toHaveAttribute("data-video-id", "v1");
  });

  it("renders the NowPlayingBar", async () => {
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);
    expect(screen.getByTestId("now-playing-bar")).toBeInTheDocument();
  });

  it("renders the PlaylistQueue", async () => {
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);
    const queue = screen.getByTestId("playlist-queue");
    expect(queue).toBeInTheDocument();
    expect(queue).toHaveAttribute("data-current", "v1");
  });

  it("renders the ShareButton", async () => {
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);
    expect(screen.getByTestId("share-button")).toBeInTheDocument();
  });

  it("renders the video description text", async () => {
    const video = videos[0];
    const jsx = await WatchPage({ params: Promise.resolve({ id: video.id }) });
    render(jsx);
    // Description begins with unique text
    expect(screen.getByText(video.description)).toBeInTheDocument();
  });

  it("renders the video duration badge", async () => {
    const video = videos[0];
    const jsx = await WatchPage({ params: Promise.resolve({ id: video.id }) });
    render(jsx);
    expect(screen.getByText(video.duration)).toBeInTheDocument();
  });

  it("renders a category badge linking to /category/category-slug", async () => {
    const video = videos[0];
    const jsx = await WatchPage({ params: Promise.resolve({ id: video.id }) });
    render(jsx);
    // Category link points to /category/sonarqube-cloud
    const links = screen.getAllByRole("link");
    const categoryLink = links.find(
      (l) => l.getAttribute("href") === `/category/${video.category}`
    );
    expect(categoryLink).toBeTruthy();
  });

  it("throws NEXT_NOT_FOUND for an unknown video id", async () => {
    await expect(
      WatchPage({ params: Promise.resolve({ id: "not-a-real-video" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders the 'More in …' VideoRow when related videos exist", async () => {
    // v1 is in sonarqube-cloud which has multiple videos
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);
    const rows = screen.getAllByTestId("video-row");
    const titles = rows.map((r) => r.textContent ?? "");
    expect(titles.some((t) => t.toLowerCase().includes("more in"))).toBe(true);
  });

  it("renders the 'You Might Also Like' VideoRow when enough cross-category videos exist", async () => {
    // v1 has many other categories available
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);
    const rows = screen.getAllByTestId("video-row");
    const titles = rows.map((r) => r.textContent ?? "");
    expect(titles.some((t) => t.toLowerCase().includes("you might also like"))).toBe(
      true
    );
  });

  it("does not render ArticleTabs when there is no article or transcript", async () => {
    // articles module is mocked to return null
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);
    expect(screen.queryByTestId("article-tabs")).not.toBeInTheDocument();
  });

  it("renders ArticleTabs when an article is present", async () => {
    const { getArticleByVideoId } = await import("@/data/articles");
    vi.mocked(getArticleByVideoId).mockReturnValueOnce({
      title: "Test Article",
      sections: [],
    } as never);
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    await act(async () => { render(jsx); });
    expect(screen.getByTestId("article-tabs")).toBeInTheDocument();
  });

  it("renders JSON-LD script tags for video and breadcrumb structured data", async () => {
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    const { container } = render(jsx);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(2);

    const scriptContents = Array.from(scripts).map((s) => s.textContent ?? "");
    const videoLd = scriptContents.find((c) => c.includes("VideoObject"));
    const breadcrumbLd = scriptContents.find((c) => c.includes("BreadcrumbList"));
    expect(videoLd).toBeTruthy();
    expect(breadcrumbLd).toBeTruthy();
  });

  it("breadcrumb JSON-LD includes category item when category exists", async () => {
    // v1 is in sonarqube-cloud — category exists
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    const { container } = render(jsx);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const breadcrumbLd = Array.from(scripts)
      .map((s) => s.textContent ?? "")
      .find((c) => c.includes("BreadcrumbList"));
    expect(breadcrumbLd).toBeTruthy();
    // Category slug appears in breadcrumb item URL
    const parsed = JSON.parse(breadcrumbLd!);
    const itemNames = parsed.itemListElement.map((el: { name: string }) => el.name);
    expect(itemNames.length).toBe(3); // Home, Category, Video
  });

  it("renders ArticleTabs when only a transcript is present (no article)", async () => {
    const { getTranscriptByVideoId } = await import("@/data/articles");
    vi.mocked(getTranscriptByVideoId).mockReturnValueOnce({
      videoId: "v1",
      youtubeId: "BNvEWvFeKEs",
      segments: [{ text: "Hello world", offset: 0, duration: 5000 }],
      fullText: "Hello world",
      fetchedAt: "2026-01-01T00:00:00Z",
    });
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);
    expect(screen.getByTestId("article-tabs")).toBeInTheDocument();
  });

  it("videoJsonLd contentUrl and embedUrl include the video's youtubeId", async () => {
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    const { container } = render(jsx);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const videoLd = Array.from(scripts)
      .map((s) => s.textContent ?? "")
      .find((c) => c.includes("VideoObject"));
    expect(videoLd).toBeTruthy();
    const parsed = JSON.parse(videoLd!);
    // v1 has youtubeId = "BNvEWvFeKEs"
    expect(parsed.contentUrl).toContain("BNvEWvFeKEs");
    expect(parsed.embedUrl).toContain("BNvEWvFeKEs");
  });

  it("renders the formatted publishedAt date in the metadata badge", async () => {
    // v1 has publishedAt: "2026-03-12" → formatDate produces "March 12th, 2026"
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    render(jsx);
    // The date badge uses formatDate — verify "March" appears (robust to ordinal variant)
    expect(screen.getByText(/march/i)).toBeInTheDocument();
  });

  it("videoJsonLd publisher is SonarSource", async () => {
    const jsx = await WatchPage({ params: Promise.resolve({ id: "v1" }) });
    const { container } = render(jsx);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const videoLd = Array.from(scripts)
      .map((s) => s.textContent ?? "")
      .find((c) => c.includes("VideoObject"));
    const parsed = JSON.parse(videoLd!);
    expect(parsed.publisher.name).toBe("SonarSource");
  });
});
