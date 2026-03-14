import { describe, it, expect, beforeEach } from "vitest";
import { render, act, waitFor } from "@testing-library/react";
import VideoPlayer from "./VideoPlayer";
import { setProgress } from "@/lib/watchProgress";

describe("VideoPlayer", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders iframe with correct src and title", () => {
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );
    const iframe = container.querySelector("iframe")!;
    expect(iframe).toBeTruthy();
    expect(iframe.src).toContain("abc123");
    expect(iframe.title).toBe("Test Video");
  });

  it("shows progress bar when localStorage has existing progress", async () => {
    setProgress("vid1", 50);
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );
    await waitFor(() => {
      expect(container.querySelector(".bg-sonar-red")).toBeTruthy();
    });
  });

  it("no progress bar when no progress exists", () => {
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );
    expect(container.querySelector(".bg-sonar-red")).toBeNull();
  });

  it("updates progress bar on YouTube postMessage", async () => {
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://www.youtube.com",
          data: JSON.stringify({
            event: "infoDelivery",
            info: { currentTime: 30, duration: 100 },
          }),
        })
      );
    });

    await waitFor(() => {
      const bar = container.querySelector(".bg-sonar-red") as HTMLElement;
      expect(bar).toBeTruthy();
      expect(bar.style.width).toBe("30%");
    });
  });

  it("ignores YouTube postMessage when currentTime is zero", async () => {
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://www.youtube.com",
          data: JSON.stringify({
            event: "infoDelivery",
            info: { currentTime: 0, duration: 100 },
          }),
        })
      );
    });

    await new Promise((r) => setTimeout(r, 50));
    expect(container.querySelector(".bg-sonar-red")).toBeNull();
  });

  it("handles non-JSON postMessage from YouTube without crashing", async () => {
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://www.youtube.com",
          data: "not-valid-json{{{",
        })
      );
    });

    await new Promise((r) => setTimeout(r, 50));
    // Should not crash and should not show progress
    expect(container.querySelector(".bg-sonar-red")).toBeNull();
  });

  it("ignores YouTube infoDelivery when duration or currentTime is missing", async () => {
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://www.youtube.com",
          data: JSON.stringify({
            event: "infoDelivery",
            info: { currentTime: 50 },
          }),
        })
      );
    });

    await new Promise((r) => setTimeout(r, 50));
    expect(container.querySelector(".bg-sonar-red")).toBeNull();
  });

  it("handles postMessage with object data (non-string) from YouTube", async () => {
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://www.youtube.com",
          data: {
            event: "infoDelivery",
            info: { currentTime: 75, duration: 100 },
          },
        })
      );
    });

    await waitFor(() => {
      const bar = container.querySelector(".bg-sonar-red") as HTMLElement;
      expect(bar).toBeTruthy();
      expect(bar.style.width).toBe("75%");
    });
  });

  it("caps progress bar at 100% even when reported progress exceeds 100", async () => {
    setProgress("vid1", 150);
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );
    await waitFor(() => {
      const bar = container.querySelector(".bg-sonar-red") as HTMLElement;
      expect(bar).toBeTruthy();
      expect(bar.style.width).toBe("100%");
    });
  });

  it("ignores postMessage from non-YouTube origins", async () => {
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://evil.com",
          data: JSON.stringify({
            event: "infoDelivery",
            info: { currentTime: 50, duration: 100 },
          }),
        })
      );
    });

    // Small wait to ensure no async update happens
    await new Promise((r) => setTimeout(r, 50));
    expect(container.querySelector(".bg-sonar-red")).toBeNull();
  });
});
