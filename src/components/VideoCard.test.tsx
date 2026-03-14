import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, waitFor, cleanup } from "@testing-library/react";
import VideoCard from "./VideoCard";
import { setProgress } from "@/lib/watchProgress";
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
  id: "vid1",
  title: "Getting Started with SonarQube",
  description: "A tutorial",
  youtubeId: "abc123",
  thumbnail: "/thumb.jpg",
  category: "tutorials",
  duration: "12:34",
  publishedAt: "2025-01-01T00:00:00Z",
};

function videoWithDate(publishedAt: string): Video {
  return { ...mockVideo, publishedAt };
}

describe("VideoCard", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date("2026-03-14T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders title, duration, and link to /watch/{id}", () => {
    const { container, getByText, getAllByText } = render(<VideoCard video={mockVideo} />);
    expect(getByText("Getting Started with SonarQube")).toBeTruthy();
    expect(getAllByText(/12:34/).length).toBeGreaterThanOrEqual(1);
    const link = container.querySelector("a")!;
    expect(link.getAttribute("href")).toBe("/watch/vid1");
  });

  it("shows progress bar and watched badge when progress exists", async () => {
    setProgress("vid1", 65);
    const { container, getByText } = render(<VideoCard video={mockVideo} />);

    await waitFor(() => {
      expect(container.querySelector(".bg-sonar-red")).toBeTruthy();
      expect(getByText("65% watched")).toBeTruthy();
    });
  });

  it("hides progress bar and badge when no progress", () => {
    const { container, queryByText } = render(<VideoCard video={mockVideo} />);
    expect(container.querySelector(".bg-sonar-red")).toBeNull();
    expect(queryByText(/watched/)).toBeNull();
  });

  it("shows category badge for a known category slug", () => {
    const knownCatVideo: Video = { ...mockVideo, category: "getting-started" };
    const { getByText } = render(<VideoCard video={knownCatVideo} />);
    expect(getByText("Getting Started")).toBeTruthy();
  });

  it("hides category badge for an unknown category slug", () => {
    const unknownCatVideo: Video = { ...mockVideo, category: "nonexistent-slug" };
    const { container } = render(<VideoCard video={unknownCatVideo} />);
    // No badge with bg-sonar-purple should render
    expect(container.querySelector(".bg-sonar-purple\\/30")).toBeNull();
  });

  it("shows 'New' badge for a video published within the last 7 days with no progress", () => {
    const recentDate = new Date("2026-03-13T00:00:00Z").toISOString();
    const { getByText } = render(
      <VideoCard video={videoWithDate(recentDate)} />
    );
    expect(getByText("New")).toBeTruthy();
  });

  it("hides 'New' badge for a video published more than 7 days ago", () => {
    const oldDate = new Date("2026-03-01T00:00:00Z").toISOString();
    const { queryByText } = render(
      <VideoCard video={videoWithDate(oldDate)} />
    );
    expect(queryByText("New")).toBeNull();
  });

  it("hides 'New' badge when video has watch progress even if recent", () => {
    setProgress("vid1", 30);
    const recentDate = new Date("2026-03-13T00:00:00Z").toISOString();
    const recentVideo = { ...mockVideo, publishedAt: recentDate };
    const { queryByText } = render(<VideoCard video={recentVideo} />);
    // Wait for effect to set progress
    expect(queryByText("New")).toBeNull();
  });

  describe("timeAgo rendering", () => {
    it("shows 'Just now' for a video published seconds ago", () => {
      const { getByText } = render(
        <VideoCard video={videoWithDate("2026-03-14T11:59:50Z")} />
      );
      expect(getByText("Just now")).toBeTruthy();
    });

    it("shows singular minute", () => {
      const { getByText } = render(
        <VideoCard video={videoWithDate("2026-03-14T11:58:00Z")} />
      );
      expect(getByText("2 minutes ago")).toBeTruthy();
    });

    it("shows '1 minute ago' (singular)", () => {
      const { getByText } = render(
        <VideoCard video={videoWithDate("2026-03-14T11:58:30Z")} />
      );
      expect(getByText("1 minute ago")).toBeTruthy();
    });

    it("shows hours ago", () => {
      const { getByText } = render(
        <VideoCard video={videoWithDate("2026-03-14T09:00:00Z")} />
      );
      expect(getByText("3 hours ago")).toBeTruthy();
    });

    it("shows '1 hour ago' (singular)", () => {
      const { getByText } = render(
        <VideoCard video={videoWithDate("2026-03-14T10:30:00Z")} />
      );
      expect(getByText("1 hour ago")).toBeTruthy();
    });

    it("shows days ago", () => {
      const { getByText } = render(
        <VideoCard video={videoWithDate("2026-03-10T12:00:00Z")} />
      );
      expect(getByText("4 days ago")).toBeTruthy();
    });

    it("shows '1 day ago' (singular)", () => {
      const { getByText } = render(
        <VideoCard video={videoWithDate("2026-03-13T10:00:00Z")} />
      );
      expect(getByText("1 day ago")).toBeTruthy();
    });

    it("shows months ago", () => {
      const { getByText } = render(
        <VideoCard video={videoWithDate("2026-01-10T12:00:00Z")} />
      );
      expect(getByText("2 months ago")).toBeTruthy();
    });

    it("shows '1 month ago' (singular)", () => {
      const { getByText } = render(
        <VideoCard video={videoWithDate("2026-02-10T12:00:00Z")} />
      );
      expect(getByText("1 month ago")).toBeTruthy();
    });

    it("shows years ago", () => {
      const { getByText } = render(
        <VideoCard video={videoWithDate("2024-01-01T00:00:00Z")} />
      );
      expect(getByText("2 years ago")).toBeTruthy();
    });

    it("shows '1 year ago' (singular)", () => {
      const { getByText } = render(
        <VideoCard video={videoWithDate("2025-02-01T00:00:00Z")} />
      );
      expect(getByText("1 year ago")).toBeTruthy();
    });
  });
});
