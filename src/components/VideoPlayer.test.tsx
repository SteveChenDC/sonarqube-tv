import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, act, waitFor } from "@testing-library/react";
import VideoPlayer from "./VideoPlayer";
import { setProgress } from "@/lib/watchProgress";

// Mock YT.Player
function createMockPlayer() {
  return {
    seekTo: vi.fn(),
    getCurrentTime: vi.fn(() => 0),
    getDuration: vi.fn(() => 0),
    destroy: vi.fn(),
  };
}

describe("VideoPlayer", () => {
  let mockPlayer: ReturnType<typeof createMockPlayer>;

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockPlayer = createMockPlayer();

    // Mock YT API — must use function() for new-ability
    (globalThis as unknown as Record<string, unknown>).YT = {
      Player: vi.fn().mockImplementation(function (this: unknown) {
        Object.assign(this as object, mockPlayer);
        return this;
      }),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (globalThis as unknown as Record<string, unknown>).YT;
  });

  it("renders player container with title", () => {
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );
    const div = container.querySelector("#yt-player");
    expect(div).toBeTruthy();
    expect(div?.getAttribute("title")).toBe("Test Video");
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

  it("updates progress bar via polling interval", async () => {
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    mockPlayer.getCurrentTime.mockReturnValue(30);
    mockPlayer.getDuration.mockReturnValue(100);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      const bar = container.querySelector(".bg-sonar-red") as HTMLElement;
      expect(bar).toBeTruthy();
      expect(bar.style.width).toBe("30%");
    });
  });

  it("does not show progress when currentTime is zero", async () => {
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    mockPlayer.getCurrentTime.mockReturnValue(0);
    mockPlayer.getDuration.mockReturnValue(100);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(container.querySelector(".bg-sonar-red")).toBeNull();
    });
  });

  it("seeks when yt-seek custom event is dispatched", () => {
    render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    act(() => {
      globalThis.dispatchEvent(new CustomEvent("yt-seek", { detail: 45 }));
    });

    expect(mockPlayer.seekTo).toHaveBeenCalledWith(45, true);
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

  it("handles player errors gracefully during polling", async () => {
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    mockPlayer.getCurrentTime.mockImplementation(() => {
      throw new Error("player not ready");
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Should not crash and should not show progress
    expect(container.querySelector(".bg-sonar-red")).toBeNull();
  });
});
