import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import VideoRow from "@/components/VideoRow";
import PlaylistQueue from "@/components/PlaylistQueue";
import { Video } from "@/types";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

// Mock next/navigation
const mockSearchParams = new URLSearchParams();
vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

// Mock watch progress
vi.mock("@/lib/watchProgress", () => ({
  getProgress: () => 0,
  setProgress: vi.fn(),
  getAllProgress: () => ({}),
}));

function makeVideo(overrides: Partial<Video> = {}): Video {
  return {
    id: "v1",
    title: "Test Video",
    description: "A test video",
    youtubeId: "abc123",
    thumbnail: "/thumbnails/abc123.jpg",
    category: "clean-code",
    duration: "5:00",
    publishedAt: "2026-01-01",
    ...overrides,
  };
}

function makeVideos(count: number, category = "clean-code"): Video[] {
  return Array.from({ length: count }, (_, i) =>
    makeVideo({
      id: `v${i + 1}`,
      title: `Video ${i + 1}`,
      youtubeId: `yt${i + 1}`,
      thumbnail: `/thumbnails/yt${i + 1}.jpg`,
      category,
    })
  );
}

afterEach(cleanup);

describe("VideoRow", () => {
  it("renders the category title", () => {
    const videos = makeVideos(3);
    render(
      <VideoRow title="Clean Code" categorySlug="clean-code" videos={videos} />
    );
    expect(screen.getByText("Clean Code")).toBeTruthy();
  });

  it("renders all video cards", () => {
    const videos = makeVideos(3);
    render(
      <VideoRow title="Clean Code" categorySlug="clean-code" videos={videos} />
    );
    const links = screen.getAllByRole("link").filter((a) =>
      a.getAttribute("href")?.startsWith("/watch/v")
    );
    // 3 video card links
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it("renders nothing when videos array is empty", () => {
    const { container } = render(
      <VideoRow title="Empty" categorySlug="empty" videos={[]} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders category title as a heading with video count", () => {
    const videos = makeVideos(2);
    render(
      <VideoRow title="Clean Code" categorySlug="clean-code" videos={videos} />
    );
    expect(screen.getByText("Clean Code")).toBeTruthy();
    // Category section has an id for anchor scrolling
    const section = screen.getByText("Clean Code").closest("section");
    expect(section?.id).toBe("clean-code");
  });
});

describe("PlaylistQueue", () => {
  beforeEach(() => {
    mockSearchParams.delete("playlist");
  });

  it("renders nothing when no playlist param is present", () => {
    const { container } = render(
      <PlaylistQueue currentVideoId="v1" allVideos={makeVideos(3)} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders the playlist queue when playlist param matches", () => {
    mockSearchParams.set("playlist", "clean-code");
    const videos = makeVideos(5);
    render(<PlaylistQueue currentVideoId="v1" allVideos={videos} />);

    expect(screen.getByText("Clean Code")).toBeInTheDocument();
    expect(screen.getByText("1 / 5")).toBeInTheDocument();
  });

  it("shows correct position indicator for middle video", () => {
    mockSearchParams.set("playlist", "clean-code");
    const videos = makeVideos(5);
    render(<PlaylistQueue currentVideoId="v3" allVideos={videos} />);
    expect(screen.getByText("3 / 5")).toBeInTheDocument();
  });

  it("renders all videos in the playlist", () => {
    mockSearchParams.set("playlist", "clean-code");
    const videos = makeVideos(4);
    render(<PlaylistQueue currentVideoId="v1" allVideos={videos} />);

    for (let i = 1; i <= 4; i++) {
      expect(screen.getByText(`Video ${i}`)).toBeInTheDocument();
    }
  });

  it("filters videos to only the playlist category", () => {
    mockSearchParams.set("playlist", "clean-code");
    const videos = [
      ...makeVideos(2, "clean-code"),
      makeVideo({
        id: "v99",
        title: "Other Category Video",
        category: "code-security",
      }),
    ];
    render(<PlaylistQueue currentVideoId="v1" allVideos={videos} />);

    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(screen.queryByText("Other Category Video")).not.toBeInTheDocument();
  });

  it("next link points to the next video with playlist param preserved", () => {
    mockSearchParams.set("playlist", "clean-code");
    const videos = makeVideos(3);
    render(<PlaylistQueue currentVideoId="v1" allVideos={videos} />);

    const nextLink = screen.getByLabelText("Next video");
    expect(nextLink).toHaveAttribute("href", "/watch/v2?playlist=clean-code");
  });

  it("previous link points to the previous video", () => {
    mockSearchParams.set("playlist", "clean-code");
    const videos = makeVideos(3);
    render(<PlaylistQueue currentVideoId="v2" allVideos={videos} />);

    const prevLink = screen.getByLabelText("Previous video");
    expect(prevLink).toHaveAttribute("href", "/watch/v1?playlist=clean-code");
  });

  it("disables previous on first video", () => {
    mockSearchParams.set("playlist", "clean-code");
    const videos = makeVideos(3);
    render(<PlaylistQueue currentVideoId="v1" allVideos={videos} />);
    expect(screen.queryByLabelText("Previous video")).not.toBeInTheDocument();
  });

  it("disables next on last video", () => {
    mockSearchParams.set("playlist", "clean-code");
    const videos = makeVideos(3);
    render(<PlaylistQueue currentVideoId="v3" allVideos={videos} />);
    expect(screen.queryByLabelText("Next video")).not.toBeInTheDocument();
  });

  it("renders nothing for an invalid playlist slug", () => {
    mockSearchParams.set("playlist", "nonexistent");
    const videos = makeVideos(3);
    const { container } = render(
      <PlaylistQueue currentVideoId="v1" allVideos={videos} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("each playlist item links with playlist param preserved", () => {
    mockSearchParams.set("playlist", "clean-code");
    const videos = makeVideos(3);
    render(<PlaylistQueue currentVideoId="v1" allVideos={videos} />);

    const links = screen.getAllByRole("link");
    const playlistLinks = links.filter((a) =>
      a.getAttribute("href")?.includes("playlist=clean-code")
    );
    // 3 video items + next button = 4 links with playlist param
    expect(playlistLinks.length).toBeGreaterThanOrEqual(3);
  });
});
