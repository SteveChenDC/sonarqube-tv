import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import HomeContent from "./HomeContent";
import type { Video, Category } from "@/types";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

const categories: Category[] = [
  { slug: "tutorials", title: "Tutorials", description: "Tutorial videos" },
  { slug: "webinars", title: "Webinars", description: "Webinar recordings" },
];

function makeVideo(overrides: Partial<Video> & { id: string }): Video {
  return {
    title: `Video ${overrides.id}`,
    description: "desc",
    youtubeId: `yt-${overrides.id}`,
    thumbnail: `/thumb-${overrides.id}.jpg`,
    category: "tutorials",
    duration: "10:00",
    publishedAt: "2025-06-15T00:00:00Z",
    ...overrides,
  };
}

const videos: Video[] = [
  makeVideo({
    id: "short-vid",
    title: "Short Tutorial",
    duration: "2:30",
    category: "tutorials",
    publishedAt: "2025-12-01T00:00:00Z",
  }),
  makeVideo({
    id: "medium-vid",
    title: "Medium Tutorial",
    duration: "15:00",
    category: "tutorials",
    publishedAt: "2025-06-01T00:00:00Z",
  }),
  makeVideo({
    id: "long-vid",
    title: "Long Webinar",
    duration: "1:05:00",
    category: "webinars",
    publishedAt: "2024-01-01T00:00:00Z",
  }),
];

const featuredVideo = makeVideo({
  id: "featured",
  title: "Featured Highlight",
  category: "tutorials",
  publishedAt: "2025-11-01T00:00:00Z",
});

function openFilters() {
  fireEvent.click(screen.getByRole("button", { name: "Filters" }));
}

describe("HomeContent", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("renders all category rows with their videos", () => {
    render(
      <HomeContent
        categories={categories}
        videos={videos}
        featuredVideo={featuredVideo}
      />
    );
    expect(screen.getByText("Tutorials")).toBeTruthy();
    expect(screen.getByText("Webinars")).toBeTruthy();
    expect(screen.getByText("Short Tutorial")).toBeTruthy();
    expect(screen.getByText("Medium Tutorial")).toBeTruthy();
    expect(screen.getByText("Long Webinar")).toBeTruthy();
  });

  it("filters videos by short duration (under 4 min)", () => {
    render(
      <HomeContent
        categories={categories}
        videos={videos}
        featuredVideo={featuredVideo}
      />
    );

    openFilters();
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));

    expect(screen.getByText("Short Tutorial")).toBeTruthy();
    expect(screen.queryByText("Medium Tutorial")).toBeNull();
    expect(screen.queryByText("Long Webinar")).toBeNull();
  });

  it("filters videos by medium duration (4–20 min)", () => {
    render(
      <HomeContent
        categories={categories}
        videos={videos}
        featuredVideo={featuredVideo}
      />
    );

    openFilters();
    fireEvent.click(screen.getByText("4–20 min"));
    fireEvent.click(screen.getByText("Apply"));

    expect(screen.queryByText("Short Tutorial")).toBeNull();
    expect(screen.getByText("Medium Tutorial")).toBeTruthy();
    expect(screen.queryByText("Long Webinar")).toBeNull();
  });

  it("filters videos by long duration (over 20 min)", () => {
    render(
      <HomeContent
        categories={categories}
        videos={videos}
        featuredVideo={featuredVideo}
      />
    );

    openFilters();
    fireEvent.click(screen.getByText("Over 20 min"));
    fireEvent.click(screen.getByText("Apply"));

    expect(screen.queryByText("Short Tutorial")).toBeNull();
    expect(screen.queryByText("Medium Tutorial")).toBeNull();
    expect(screen.getByText("Long Webinar")).toBeTruthy();
  });

  it("sorts videos oldest first", () => {
    const { container } = render(
      <HomeContent
        categories={categories}
        videos={videos}
        featuredVideo={featuredVideo}
      />
    );

    openFilters();
    fireEvent.click(screen.getByText("Oldest"));
    fireEvent.click(screen.getByText("Apply"));

    const headings = Array.from(container.querySelectorAll("h3"));
    const tutorialTitles = headings
      .map((h) => h.textContent)
      .filter((t) => t === "Short Tutorial" || t === "Medium Tutorial");
    // medium-vid (2025-06) should come before short-vid (2025-12) in oldest-first
    expect(tutorialTitles).toEqual(["Medium Tutorial", "Short Tutorial"]);
  });

  it("shows empty state when all videos are filtered out", () => {
    const oldVideos = [
      makeVideo({
        id: "old",
        title: "Ancient Video",
        publishedAt: "2020-01-01T00:00:00Z",
        category: "tutorials",
      }),
    ];

    render(
      <HomeContent
        categories={categories}
        videos={oldVideos}
        featuredVideo={oldVideos[0]}
      />
    );

    openFilters();
    fireEvent.click(screen.getByText("Today"));
    fireEvent.click(screen.getByText("Apply"));

    expect(screen.getByText("No videos match your filters.")).toBeTruthy();
  });

  it("resets filters via empty-state Reset filters button", () => {
    const oldVideos = [
      makeVideo({
        id: "old",
        title: "Ancient Video",
        publishedAt: "2020-01-01T00:00:00Z",
        category: "tutorials",
      }),
    ];

    render(
      <HomeContent
        categories={categories}
        videos={oldVideos}
        featuredVideo={oldVideos[0]}
      />
    );

    openFilters();
    fireEvent.click(screen.getByText("Today"));
    fireEvent.click(screen.getByText("Apply"));

    expect(screen.getByText("No videos match your filters.")).toBeTruthy();
    const resetButton = screen.getByText("Reset filters");
    expect(resetButton).toBeTruthy();

    fireEvent.click(resetButton);

    // After reset, the video should be visible again and the empty state gone
    expect(screen.getAllByText("Ancient Video").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("No videos match your filters.")).toBeNull();
  });

  it("hides category rows with no matching videos when filters are active", () => {
    render(
      <HomeContent
        categories={categories}
        videos={videos}
        featuredVideo={featuredVideo}
      />
    );

    // Both category rows should be visible initially
    expect(screen.getByText("Tutorials")).toBeTruthy();
    expect(screen.getByText("Webinars")).toBeTruthy();

    // Apply "Under 4 min" filter — only short-vid (tutorials) matches
    openFilters();
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));

    // Tutorials row should still show; Webinars row should be hidden
    expect(screen.getByText("Tutorials")).toBeTruthy();
    expect(screen.queryByText("Webinars")).toBeNull();
    expect(screen.queryByText("Long Webinar")).toBeNull();
  });

  it("treats exactly 20 minutes as medium duration", () => {
    const boundaryVideos = [
      makeVideo({
        id: "exact-20",
        title: "Exactly Twenty",
        duration: "20:00",
        category: "tutorials",
      }),
      makeVideo({
        id: "over-20",
        title: "Twenty One Min",
        duration: "21:00",
        category: "tutorials",
      }),
    ];

    render(
      <HomeContent
        categories={categories}
        videos={boundaryVideos}
        featuredVideo={boundaryVideos[0]}
      />
    );

    openFilters();
    fireEvent.click(screen.getByText("4–20 min"));
    fireEvent.click(screen.getByText("Apply"));

    expect(screen.getAllByText("Exactly Twenty").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Twenty One Min")).toBeNull();
  });

  it("resets filters and shows all videos again", () => {
    render(
      <HomeContent
        categories={categories}
        videos={videos}
        featuredVideo={featuredVideo}
      />
    );

    openFilters();
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));
    expect(screen.queryByText("Medium Tutorial")).toBeNull();

    openFilters();
    fireEvent.click(screen.getByText("Reset all"));

    expect(screen.getByText("Medium Tutorial")).toBeTruthy();
    expect(screen.getByText("Long Webinar")).toBeTruthy();
  });
});
