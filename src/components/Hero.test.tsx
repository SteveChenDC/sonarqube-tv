import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import Hero from "./Hero";
import type { Video } from "@/types";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

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
    const { getByText, container } = render(<Hero video={mockVideo} />);
    expect(getByText("SonarQube for Enterprise")).toBeTruthy();
    expect(getByText("Learn how to deploy SonarQube at scale")).toBeTruthy();
    expect(getByText("45:00")).toBeTruthy();
    expect(getByText("Watch Now")).toBeTruthy();
    const link = container.querySelector('a[href="/watch/hero-1"]');
    expect(link).toBeTruthy();
  });

  it("shows category badge when video category matches a known category", () => {
    const { getByText } = render(<Hero video={mockVideo} />);
    expect(getByText("Getting Started")).toBeTruthy();
    expect(getByText("Featured")).toBeTruthy();
  });

  it("omits category badge for an unknown category slug", () => {
    const unknownCatVideo: Video = { ...mockVideo, category: "nonexistent-slug" };
    const { queryByText, getByText } = render(<Hero video={unknownCatVideo} />);
    // Featured badge still shows
    expect(getByText("Featured")).toBeTruthy();
    // But no category badge should appear (Getting Started should not be rendered)
    expect(queryByText("Getting Started")).toBeNull();
  });

  it("renders custom actions content when provided", () => {
    const { getByText } = render(
      <Hero video={mockVideo} actions={<button>Custom Action</button>} />
    );
    expect(getByText("Custom Action")).toBeTruthy();
  });

  it("renders without actions when none are provided", () => {
    const { queryByText } = render(<Hero video={mockVideo} />);
    expect(queryByText("Custom Action")).toBeNull();
  });
});
