import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, waitFor, cleanup, fireEvent } from "@testing-library/react";
import VideoCard from "./VideoCard";
import { setProgress } from "@/lib/watchProgress";
import type { Video } from "@/types";

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
    expect(container.querySelector(String.raw`.bg-sonar-purple\/30`)).toBeNull();
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

  describe("duration badge color coding", () => {
    it("uses qube-blue badge for short videos (<4 min)", () => {
      const shortVideo: Video = { ...mockVideo, duration: "3:45" };
      const { container } = render(<VideoCard video={shortVideo} />);
      expect(container.querySelector(".bg-qube-blue\\/80")).toBeTruthy();
    });

    it("uses black badge for medium videos (4-20 min)", () => {
      const medVideo: Video = { ...mockVideo, duration: "12:34" };
      const { container } = render(<VideoCard video={medVideo} />);
      expect(container.querySelector(".bg-black\\/80")).toBeTruthy();
    });

    it("uses sonar-purple badge for long videos (>20 min)", () => {
      const longVideo: Video = { ...mockVideo, duration: "45:00" };
      const { container } = render(<VideoCard video={longVideo} />);
      expect(container.querySelector(".bg-sonar-purple\\/80")).toBeTruthy();
    });

    it("uses qube-blue badge for very short videos (1:30)", () => {
      const shortVideo: Video = { ...mockVideo, duration: "1:30" };
      const { container } = render(<VideoCard video={shortVideo} />);
      expect(container.querySelector(".bg-qube-blue\\/80")).toBeTruthy();
    });

    it("uses sonar-purple badge for H:MM:SS format over 20 min", () => {
      const longVideo: Video = { ...mockVideo, duration: "1:05:00" };
      const { container } = render(<VideoCard video={longVideo} />);
      expect(container.querySelector(".bg-sonar-purple\\/80")).toBeTruthy();
    });
  });

  describe("onRemove prop", () => {
    it("renders a remove button with accessible label when onRemove is provided", () => {
      const onRemove = vi.fn();
      const { getByLabelText } = render(<VideoCard video={mockVideo} onRemove={onRemove} />);
      const btn = getByLabelText("Remove Getting Started with SonarQube from continue watching");
      expect(btn).toBeTruthy();
    });

    it("calls onRemove when the remove button is clicked", () => {
      const onRemove = vi.fn();
      const { getByLabelText } = render(<VideoCard video={mockVideo} onRemove={onRemove} />);
      fireEvent.click(getByLabelText("Remove Getting Started with SonarQube from continue watching"));
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it("does not navigate to watch page when remove button is clicked (prevents default)", () => {
      const onRemove = vi.fn();
      const { getByLabelText } = render(<VideoCard video={mockVideo} onRemove={onRemove} />);
      const btn = getByLabelText("Remove Getting Started with SonarQube from continue watching");
      const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
      btn.dispatchEvent(clickEvent);
      expect(onRemove).toHaveBeenCalled();
    });

    it("does not render a remove button when onRemove is not provided", () => {
      const { queryByLabelText } = render(<VideoCard video={mockVideo} />);
      expect(queryByLabelText(/Remove.*from continue watching/)).toBeNull();
    });
  });

  describe("hideCategory prop", () => {
    it("hides the category badge when hideCategory is true", () => {
      const catVideo: Video = { ...mockVideo, category: "getting-started" };
      const { queryByText } = render(<VideoCard video={catVideo} hideCategory />);
      expect(queryByText("Getting Started")).toBeNull();
    });

    it("shows the category badge when hideCategory is false (default)", () => {
      const catVideo: Video = { ...mockVideo, category: "getting-started" };
      const { getByText } = render(<VideoCard video={catVideo} />);
      expect(getByText("Getting Started")).toBeTruthy();
    });
  });

  describe("fluid prop", () => {
    it("applies w-full to the thumbnail container when fluid is true", () => {
      const { container } = render(<VideoCard video={mockVideo} fluid />);
      const thumbDiv = container.querySelector(".aspect-video");
      expect(thumbDiv?.className).toContain("w-full");
    });

    it("applies fixed width class to the thumbnail container when fluid is false (default)", () => {
      const { container } = render(<VideoCard video={mockVideo} />);
      const thumbDiv = container.querySelector(".aspect-video");
      expect(thumbDiv?.className).toContain("w-[280px]");
    });

    it("applies text-base to title when fluid is true", () => {
      const { container } = render(<VideoCard video={mockVideo} fluid />);
      const heading = container.querySelector("h3");
      expect(heading?.className).toContain("text-base");
    });

    it("applies fixed width class to title when fluid is false (default)", () => {
      const { container } = render(<VideoCard video={mockVideo} />);
      const heading = container.querySelector("h3");
      expect(heading?.className).toContain("w-[280px]");
    });
  });

  describe("shimmer skeleton loading state", () => {
    it("renders the shimmer overlay before image loads (opacity-100)", () => {
      const { container } = render(<VideoCard video={mockVideo} />);
      // The shimmer div is aria-hidden and initially has opacity-100 (image not yet loaded)
      const shimmer = container.querySelector("[aria-hidden='true'].animate-shimmer");
      expect(shimmer).toBeTruthy();
      expect(shimmer?.className).toContain("opacity-100");
      expect(shimmer?.className).not.toContain("opacity-0");
    });

    it("hides the shimmer overlay after image onLoad fires (opacity-0)", () => {
      const { container } = render(<VideoCard video={mockVideo} />);
      const img = container.querySelector("img")!;
      // Simulate image load
      fireEvent.load(img);
      const shimmer = container.querySelector("[aria-hidden='true'].animate-shimmer");
      expect(shimmer?.className).toContain("opacity-0");
      expect(shimmer?.className).not.toContain("opacity-100");
    });

    it("adds pointer-events-none to shimmer after image loads", () => {
      const { container } = render(<VideoCard video={mockVideo} />);
      const img = container.querySelector("img")!;
      fireEvent.load(img);
      const shimmer = container.querySelector("[aria-hidden='true'].animate-shimmer");
      expect(shimmer?.className).toContain("pointer-events-none");
    });
  });

  describe("duration badge boundary conditions", () => {
    it("uses black badge for a video at exactly 4:00 (first medium boundary)", () => {
      const video: Video = { ...mockVideo, duration: "4:00" };
      const { container } = render(<VideoCard video={video} />);
      expect(container.querySelector(".bg-black\\/80")).toBeTruthy();
      expect(container.querySelector(".bg-qube-blue\\/80")).toBeNull();
    });

    it("uses black badge for a video at exactly 20:00 (last medium boundary)", () => {
      const video: Video = { ...mockVideo, duration: "20:00" };
      const { container } = render(<VideoCard video={video} />);
      expect(container.querySelector(".bg-black\\/80")).toBeTruthy();
      expect(container.querySelector(".bg-sonar-purple\\/80")).toBeNull();
    });

    it("uses sonar-purple badge for a video at 20:01 (first long boundary)", () => {
      const video: Video = { ...mockVideo, duration: "20:01" };
      const { container } = render(<VideoCard video={video} />);
      expect(container.querySelector(".bg-sonar-purple\\/80")).toBeTruthy();
      expect(container.querySelector(".bg-black\\/80")).toBeNull();
    });

    it("uses qube-blue badge for a video at 3:59 (last short boundary)", () => {
      const video: Video = { ...mockVideo, duration: "3:59" };
      const { container } = render(<VideoCard video={video} />);
      expect(container.querySelector(".bg-qube-blue\\/80")).toBeTruthy();
      expect(container.querySelector(".bg-black\\/80")).toBeNull();
    });
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
