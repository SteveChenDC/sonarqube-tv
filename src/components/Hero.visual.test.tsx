import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Hero from "./Hero";
import type { Video } from "@/types";

const mockVideo: Video = {
  id: "hero-vis-1",
  title: "Visual Test Hero Video",
  description: "A unique description for snapshot testing",
  youtubeId: "snap123",
  thumbnail: "/snap-thumb.jpg",
  category: "getting-started",
  duration: "12:34",
  publishedAt: "2025-06-01T00:00:00Z",
};

describe("Hero visual snapshots", () => {
  it("mobile card layout matches snapshot", () => {
    const { container } = render(<Hero video={mockVideo} />);
    const mobileLayout = container.querySelector(String.raw`.sm\:hidden`);
    expect(mobileLayout).toBeTruthy();
    expect(mobileLayout).toMatchSnapshot();
  });

  it("desktop hero layout matches snapshot", () => {
    const { container } = render(<Hero video={mockVideo} />);
    const desktopLayout = container.querySelector(String.raw`.hidden.sm\:block`);
    expect(desktopLayout).toBeTruthy();
    expect(desktopLayout).toMatchSnapshot();
  });

  it("both layouts render the same video data", () => {
    const { container } = render(<Hero video={mockVideo} />);
    const mobileLayout = container.querySelector(String.raw`.sm\:hidden`)!;
    const desktopLayout = container.querySelector(String.raw`.hidden.sm\:block`)!;

    // Both show the title
    expect(mobileLayout.querySelector("h1")?.textContent).toBe(mockVideo.title);
    expect(desktopLayout.querySelector("h1")?.textContent).toBe(mockVideo.title);

    // Both link to the watch page
    expect(mobileLayout.querySelector(`a[href="/watch/${mockVideo.id}"]`)).toBeTruthy();
    expect(desktopLayout.querySelector(`a[href="/watch/${mockVideo.id}"]`)).toBeTruthy();

    // Both show the thumbnail
    expect(mobileLayout.querySelector(`img[src="${mockVideo.thumbnail}"]`)).toBeTruthy();
    expect(desktopLayout.querySelector(`img[src="${mockVideo.thumbnail}"]`)).toBeTruthy();
  });
});
