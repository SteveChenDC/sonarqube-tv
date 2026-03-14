import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PlaylistQueue from "./PlaylistQueue";
import type { Video } from "@/types";

// Mock next/navigation
const mockSearchParams = new URLSearchParams();
vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

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

function makeVideo(id: string, category: string, title: string): Video {
  return {
    id,
    title,
    description: "desc",
    youtubeId: `yt-${id}`,
    thumbnail: `/thumb-${id}.jpg`,
    category,
    duration: "5:00",
    publishedAt: "2025-01-01T00:00:00Z",
  };
}

const videos: Video[] = [
  makeVideo("v1", "tutorials", "First Tutorial"),
  makeVideo("v2", "tutorials", "Second Tutorial"),
  makeVideo("v3", "tutorials", "Third Tutorial"),
  makeVideo("v4", "webinars", "A Webinar"),
];

describe("PlaylistQueue", () => {
  it("renders nothing when no playlist param is present", () => {
    mockSearchParams.delete("playlist");
    const { container } = render(
      <PlaylistQueue currentVideoId="v1" allVideos={videos} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when playlist has no matching videos", () => {
    mockSearchParams.set("playlist", "nonexistent");
    const { container } = render(
      <PlaylistQueue currentVideoId="v1" allVideos={videos} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders playlist videos filtered by category", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v1" allVideos={videos} />);

    expect(screen.getByText("First Tutorial")).toBeTruthy();
    expect(screen.getByText("Second Tutorial")).toBeTruthy();
    expect(screen.getByText("Third Tutorial")).toBeTruthy();
    expect(screen.queryByText("A Webinar")).toBeNull();
  });

  it("shows correct position counter (1 / 3 for first video)", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v1" allVideos={videos} />);
    expect(screen.getByText("1 / 3")).toBeTruthy();
  });

  it("shows correct position counter (2 / 3 for middle video)", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v2" allVideos={videos} />);
    expect(screen.getByText("2 / 3")).toBeTruthy();
  });

  it("disables prev button on first video and enables next", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v1" allVideos={videos} />);

    // Next should be a link
    expect(screen.getByLabelText("Next video")).toBeTruthy();
    expect(
      screen.getByLabelText("Next video").getAttribute("href"),
    ).toBe("/watch/v2?playlist=tutorials");

    // Prev should not exist as a link (it's a disabled span)
    expect(screen.queryByLabelText("Previous video")).toBeNull();
  });

  it("disables next button on last video and enables prev", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v3" allVideos={videos} />);

    expect(screen.getByLabelText("Previous video")).toBeTruthy();
    expect(
      screen.getByLabelText("Previous video").getAttribute("href"),
    ).toBe("/watch/v2?playlist=tutorials");

    expect(screen.queryByLabelText("Next video")).toBeNull();
  });

  it("enables both prev and next for middle video", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v2" allVideos={videos} />);

    expect(
      screen.getByLabelText("Previous video").getAttribute("href"),
    ).toBe("/watch/v1?playlist=tutorials");
    expect(
      screen.getByLabelText("Next video").getAttribute("href"),
    ).toBe("/watch/v3?playlist=tutorials");
  });

  it("highlights the currently playing video", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v2" allVideos={videos} />);

    // Current video title should have the active highlight classes
    const currentTitle = screen.getByText("Second Tutorial");
    expect(currentTitle.className).toContain("font-semibold");
    expect(currentTitle.className).toContain("text-n1");

    // Other titles should have the inactive class
    const otherTitle = screen.getByText("First Tutorial");
    expect(otherTitle.className).toContain("text-n3");
    expect(otherTitle.className).not.toContain("text-n1");
  });
});
