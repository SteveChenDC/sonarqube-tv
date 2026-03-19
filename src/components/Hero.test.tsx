import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Hero from "./Hero";
import type { Video } from "@/types";

const mockVideo: Video = {
  id: "hero-1",
  title: "SonarQube for Enterprise",
  description: "Learn how to deploy SonarQube at scale",
  youtubeId: "xyz789",
  thumbnail: "/hero-thumb.jpg",
  category: "getting-started",
  duration: "45:00",
  publishedAt: "2025-06-01T00:00:00Z",
};

describe("Hero", () => {
  it("renders video title, description, duration, and Watch Now link", () => {
    const { getAllByText, container } = render(<Hero video={mockVideo} />);
    expect(getAllByText("SonarQube for Enterprise").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("Learn how to deploy SonarQube at scale").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("45:00").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("Watch Now").length).toBeGreaterThanOrEqual(1);
    const link = container.querySelector('a[href="/watch/hero-1"]');
    expect(link).toBeTruthy();
  });

  it("shows category badge when video category matches a known category", () => {
    const { getAllByText } = render(<Hero video={mockVideo} />);
    expect(getAllByText("Getting Started").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("Featured").length).toBeGreaterThanOrEqual(1);
  });

  it("omits category badge for an unknown category slug", () => {
    const unknownCatVideo: Video = { ...mockVideo, category: "nonexistent-slug" };
    const { queryByText, getAllByText } = render(<Hero video={unknownCatVideo} />);
    // Featured badge still shows
    expect(getAllByText("Featured").length).toBeGreaterThanOrEqual(1);
    // But no category badge should appear (Getting Started should not be rendered)
    expect(queryByText("Getting Started")).toBeNull();
  });

  it("renders custom actions content when provided", () => {
    const { getAllByText } = render(
      <Hero video={mockVideo} actions={<button>Custom Action</button>} />
    );
    expect(getAllByText("Custom Action").length).toBeGreaterThanOrEqual(1);
  });

  it("renders without actions when none are provided", () => {
    const { queryByText } = render(<Hero video={mockVideo} />);
    expect(queryByText("Custom Action")).toBeNull();
  });

  it("hides description when it exactly matches the title", () => {
    const dupeVideo: Video = { ...mockVideo, description: mockVideo.title };
    const { container } = render(<Hero video={dupeVideo} />);
    // Title still shows as h1 (in both layouts)
    expect(container.querySelectorAll("h1").length).toBeGreaterThanOrEqual(1);
    // Description paragraph should not render (same text as title)
    const paragraphs = document.querySelectorAll("p");
    const descP = Array.from(paragraphs).find((p) => p.textContent === mockVideo.title);
    expect(descP).toBeUndefined();
  });

  it("hides description when it contains the title as a substring", () => {
    const redundantVideo: Video = {
      ...mockVideo,
      description: `${mockVideo.title} is a great topic to learn about.`,
    };
    const { container } = render(<Hero video={redundantVideo} />);
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs.length).toBe(0);
  });

  it("shows description when it is meaningfully different from the title", () => {
    const { getAllByText } = render(<Hero video={mockVideo} />);
    expect(getAllByText("Learn how to deploy SonarQube at scale").length).toBeGreaterThanOrEqual(1);
  });

  // ── isDescriptionRedundant edge cases missing from this file ────────────────

  it("hides description when the title appears in the middle of the description", () => {
    // Tests the d.includes(t) branch — title is NOT at the start of description
    const middleVideo: Video = {
      ...mockVideo,
      description: `Everything about ${mockVideo.title} in production environments.`,
    };
    const { container } = render(<Hero video={middleVideo} />);
    // The `d.includes(t)` guard fires → showDescription = false → no <p>
    expect(container.querySelectorAll("p").length).toBe(0);
  });

  it("hides description when it is an empty string", () => {
    // `video.description && !isRedundant` — empty string is falsy, short-circuits
    const emptyDescVideo: Video = { ...mockVideo, description: "" };
    const { container } = render(<Hero video={emptyDescVideo} />);
    expect(container.querySelectorAll("p").length).toBe(0);
  });

  it("hides description when it is the title in a different case (case-insensitive check)", () => {
    // isDescriptionRedundant lowercases both sides before comparing
    const upperDescVideo: Video = {
      ...mockVideo,
      description: mockVideo.title.toUpperCase(),
    };
    const { container } = render(<Hero video={upperDescVideo} />);
    // d.toLowerCase() === t.toLowerCase() → redundant → no <p>
    expect(container.querySelectorAll("p").length).toBe(0);
  });

  // ── heroSrc YouTube CDN upgrade logic ───────────────────────────────────────

  it("upgrades a YouTube CDN thumbnail to maxresdefault URL for the hero image", () => {
    // When video.thumbnail starts with "https://", Hero replaces it with
    // `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` for LCP quality.
    const ytVideo: Video = {
      ...mockVideo,
      youtubeId: "myYtId",
      thumbnail: "https://i.ytimg.com/vi/myYtId/hqdefault.jpg",
    };
    const { container } = render(<Hero video={ytVideo} />);
    const imgs = Array.from(container.querySelectorAll("img")).filter(
      (img) => img.getAttribute("alt") === mockVideo.title
    );
    // Both mobile and desktop sections render the hero image
    expect(imgs.length).toBeGreaterThanOrEqual(2);
    for (const img of imgs) {
      expect(img.getAttribute("src")).toBe(
        "https://img.youtube.com/vi/myYtId/maxresdefault.jpg"
      );
    }
  });

  it("uses video.youtubeId (not any ID inside the thumbnail URL) for maxresdefault", () => {
    // Ensures the src is built from video.youtubeId, not parsed from the hqdefault URL
    const ytVideo: Video = {
      ...mockVideo,
      youtubeId: "correctId",
      thumbnail: "https://i.ytimg.com/vi/differentId/hqdefault.jpg",
    };
    const { container } = render(<Hero video={ytVideo} />);
    const imgs = Array.from(container.querySelectorAll("img"));
    const upgraded = imgs.find((img) =>
      img.getAttribute("src")?.includes("maxresdefault")
    );
    expect(upgraded?.getAttribute("src")).toBe(
      "https://img.youtube.com/vi/correctId/maxresdefault.jpg"
    );
  });

  it("uses the local thumbnail path as-is when it does not start with https://", () => {
    // mockVideo.thumbnail = "/hero-thumb.jpg" (local path — no upgrade)
    const { container } = render(<Hero video={mockVideo} />);
    const imgs = Array.from(container.querySelectorAll("img")).filter(
      (img) => img.getAttribute("alt") === mockVideo.title
    );
    expect(imgs.length).toBeGreaterThanOrEqual(2);
    for (const img of imgs) {
      expect(img.getAttribute("src")).toBe("/hero-thumb.jpg");
    }
  });
});
