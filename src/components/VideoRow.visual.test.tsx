import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import VideoRow from "./VideoRow";
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

function makeVideo(id: string): Video {
  return {
    id,
    title: `Video ${id}`,
    description: "desc",
    youtubeId: `yt-${id}`,
    thumbnail: `/thumb-${id}.jpg`,
    category: "tutorials",
    duration: "10:00",
    publishedAt: "2025-06-15T00:00:00Z",
  };
}

const videos: Video[] = Array.from({ length: 8 }, (_, i) => makeVideo(`v${i + 1}`));

describe("VideoRow visual snapshots", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders a horizontal scroll container with all videos", () => {
    const { container } = render(
      <VideoRow title="Test Row" categorySlug="tutorials" videos={videos} />
    );
    const scrollContainer = container.querySelector(".overflow-x-auto");
    expect(scrollContainer).toBeTruthy();
    // All 8 videos rendered (each VideoCard is an <a> tag)
    const cards = scrollContainer!.querySelectorAll(":scope > a");
    expect(cards.length).toBe(8);
  });

  it("cards use fixed width (not fluid)", () => {
    const { container } = render(
      <VideoRow title="Test Row" categorySlug="tutorials" videos={videos} />
    );
    const scrollContainer = container.querySelector(".overflow-x-auto")!;
    const cards = scrollContainer.querySelectorAll(":scope > a");
    // Cards should have the fixed-width thumbnail container, not fluid w-full
    for (const card of cards) {
      const thumbnail = card.querySelector(".aspect-video");
      expect(thumbnail).toBeTruthy();
      expect(thumbnail!.className).not.toContain("w-full");
    }
  });

  it("scroll layout matches snapshot", () => {
    const { container } = render(
      <VideoRow title="Test Row" categorySlug="tutorials" videos={videos} />
    );
    const scrollContainer = container.querySelector(".overflow-x-auto");
    expect(scrollContainer).toBeTruthy();
    expect(scrollContainer).toMatchSnapshot();
  });
});
