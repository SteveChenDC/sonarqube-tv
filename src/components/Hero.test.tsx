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
});
