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

  it("mobile grid layout matches snapshot", () => {
    const { container } = render(
      <VideoRow title="Test Row" categorySlug="tutorials" videos={videos} />
    );
    const mobileLayout = container.querySelector(".sm\\:hidden");
    expect(mobileLayout).toBeTruthy();
    expect(mobileLayout).toMatchSnapshot();
  });

  it("desktop scroll layout matches snapshot", () => {
    const { container } = render(
      <VideoRow title="Test Row" categorySlug="tutorials" videos={videos} />
    );
    const desktopLayout = container.querySelector(".hidden.sm\\:block");
    expect(desktopLayout).toBeTruthy();
    expect(desktopLayout).toMatchSnapshot();
  });

  it("mobile grid uses grid-cols-2 class", () => {
    const { container } = render(
      <VideoRow title="Test Row" categorySlug="tutorials" videos={videos} />
    );
    const mobileLayout = container.querySelector(".sm\\:hidden");
    const grid = mobileLayout?.querySelector(".grid-cols-2");
    expect(grid).toBeTruthy();
  });

  it("mobile grid cards have fluid width (w-full)", () => {
    const { container } = render(
      <VideoRow title="Test Row" categorySlug="tutorials" videos={videos} />
    );
    const mobileLayout = container.querySelector(".sm\\:hidden")!;
    const cardContainers = mobileLayout.querySelectorAll(".w-full");
    expect(cardContainers.length).toBeGreaterThan(0);
  });

  it("mobile grid caps at 6 cards", () => {
    const { container } = render(
      <VideoRow title="Test Row" categorySlug="tutorials" videos={videos} />
    );
    const mobileLayout = container.querySelector(".sm\\:hidden")!;
    const grid = mobileLayout.querySelector(".grid-cols-2")!;
    // 8 videos but only 6 rendered in mobile grid (each VideoCard is an <a> tag)
    const cards = grid.querySelectorAll(":scope > a");
    expect(cards.length).toBe(6);
  });
});
