import { describe, it, expect, beforeEach, vi, afterEach, type MockedFunction } from "vitest";
import { render, act, waitFor, screen, fireEvent } from "@testing-library/react";
import VideoPlayer from "./VideoPlayer";
import { setProgress } from "@/lib/watchProgress";

// Mock YT.Player
function createMockPlayer() {
  return {
    seekTo: vi.fn(),
    getCurrentTime: vi.fn(() => 0),
    getDuration: vi.fn(() => 100),
    destroy: vi.fn(),
  };
}

describe("VideoPlayer", () => {
  let mockPlayer: ReturnType<typeof createMockPlayer>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let capturedEvents: Record<string, (e: unknown) => void>;

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockPlayer = createMockPlayer();
    capturedEvents = {};

    // Mock YT API — must use function() for new-ability
    (window as unknown as Record<string, unknown>).YT = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: vi.fn().mockImplementation(function (this: unknown, _id: string, opts: any) {
        Object.assign(this as object, mockPlayer);
        if (opts?.events) {
          Object.assign(capturedEvents, opts.events);
        }
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

  it("shows resume toast when video resumes from saved progress", async () => {
    setProgress("vid1", 42);

    render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    // Trigger the onReady callback
    act(() => {
      capturedEvents.onReady?.({ target: mockPlayer });
    });

    await waitFor(() => {
      expect(screen.getByText("Resuming from 42%")).toBeTruthy();
    });
  });

  it("hides resume toast after 3 seconds", async () => {
    setProgress("vid1", 75);

    render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    act(() => {
      capturedEvents.onReady?.({ target: mockPlayer });
    });

    await waitFor(() => {
      expect(screen.getByText("Resuming from 75%")).toBeTruthy();
    });

    act(() => {
      vi.advanceTimersByTime(3100);
    });

    await waitFor(() => {
      expect(screen.queryByText("Resuming from 75%")).toBeNull();
    });
  });

  it("does not show resume toast when no saved progress", () => {
    render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    act(() => {
      capturedEvents.onReady?.({ target: mockPlayer });
    });

    expect(screen.queryByText(/Resuming from/)).toBeNull();
  });
});

describe("VideoPlayer — keyboard shortcuts overlay", () => {
  let mockPlayer: ReturnType<typeof createMockPlayer>;

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockPlayer = createMockPlayer();

    (window as unknown as Record<string, unknown>).YT = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: vi.fn().mockImplementation(function (this: unknown, _id: string, opts: any) {
        Object.assign(this as object, mockPlayer);
        if (opts?.events) {
          // capture for tests
        }
        return this;
      }),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (globalThis as unknown as Record<string, unknown>).YT;
  });

  it("pressing ? opens the keyboard shortcuts overlay", () => {
    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);
    expect(screen.queryByRole("dialog")).toBeNull();

    act(() => {
      fireEvent.keyDown(document, { key: "?" });
    });

    expect(screen.getByRole("dialog", { name: "Keyboard shortcuts" })).toBeInTheDocument();
  });

  it("pressing ? again closes the shortcuts overlay", () => {
    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "?" }); });
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    act(() => { fireEvent.keyDown(document, { key: "?" }); });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("pressing Escape closes an open shortcuts overlay", () => {
    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "?" }); });
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    act(() => { fireEvent.keyDown(document, { key: "Escape" }); });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("clicking the overlay backdrop closes the shortcuts dialog", () => {
    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "?" }); });
    const overlay = screen.getByRole("dialog");
    expect(overlay).toBeInTheDocument();

    // Click the outer dialog container (the backdrop)
    fireEvent.click(overlay);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("clicking the close button inside the overlay closes it", () => {
    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "?" }); });
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close shortcuts" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("overlay lists all 5 keyboard shortcuts", () => {
    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "?" }); });

    expect(screen.getByText("Play / Pause")).toBeInTheDocument();
    expect(screen.getByText(/Seek back/)).toBeInTheDocument();
    expect(screen.getByText(/Seek forward/)).toBeInTheDocument();
    expect(screen.getByText("Toggle this panel")).toBeInTheDocument();
    expect(screen.getByText("Close panel")).toBeInTheDocument();
  });
});

describe("VideoPlayer — keyboard seek shortcuts", () => {
  let mockPlayer: ReturnType<typeof createMockPlayer>;

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockPlayer = createMockPlayer();
    mockPlayer.getCurrentTime = vi.fn(() => 30);
    mockPlayer.getDuration = vi.fn(() => 100);

    (window as unknown as Record<string, unknown>).YT = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: vi.fn().mockImplementation(function (this: unknown, _id: string, opts: any) {
        Object.assign(this as object, mockPlayer);
        if (opts?.events) {}
        return this;
      }),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (globalThis as unknown as Record<string, unknown>).YT;
  });

  it("ArrowLeft seeks back 10 seconds and shows seek toast", async () => {
    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "ArrowLeft" }); });

    expect(mockPlayer.seekTo).toHaveBeenCalledWith(20, true); // 30 - 10 = 20
    await waitFor(() => expect(screen.getByText("-10s")).toBeInTheDocument());
  });

  it("j key also seeks back 10 seconds", () => {
    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "j" }); });

    expect(mockPlayer.seekTo).toHaveBeenCalledWith(20, true);
  });

  it("ArrowRight seeks forward 10 seconds and shows seek toast", async () => {
    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "ArrowRight" }); });

    expect(mockPlayer.seekTo).toHaveBeenCalledWith(40, true); // 30 + 10 = 40
    await waitFor(() => expect(screen.getByText("+10s")).toBeInTheDocument());
  });

  it("l key also seeks forward 10 seconds", () => {
    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "l" }); });

    expect(mockPlayer.seekTo).toHaveBeenCalledWith(40, true);
  });

  it("seek toast disappears after 1.2 seconds", async () => {
    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "ArrowRight" }); });
    await waitFor(() => expect(screen.getByText("+10s")).toBeInTheDocument());

    act(() => { vi.advanceTimersByTime(1200); });
    await waitFor(() => expect(screen.queryByText("+10s")).toBeNull());
  });

  it("ArrowLeft clamps seek to 0 at the start of video", () => {
    mockPlayer.getCurrentTime = vi.fn(() => 5); // Only 5s in
    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "ArrowLeft" }); });

    expect(mockPlayer.seekTo).toHaveBeenCalledWith(0, true); // max(0, 5-10) = 0
  });

  it("ArrowRight clamps seek to duration at end of video", () => {
    mockPlayer.getCurrentTime = vi.fn(() => 95);
    mockPlayer.getDuration = vi.fn(() => 100);
    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "ArrowRight" }); });

    expect(mockPlayer.seekTo).toHaveBeenCalledWith(100, true); // min(100, 95+10) = 100
  });

  it("Space key plays the video when paused", () => {
    mockPlayer = { ...mockPlayer, getPlayerState: vi.fn(() => 2), playVideo: vi.fn(), pauseVideo: vi.fn() };
    (window as unknown as Record<string, unknown>).YT = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: vi.fn().mockImplementation(function (this: unknown, _id: string, opts: any) {
        Object.assign(this as object, mockPlayer);
        if (opts?.events) {}
        return this;
      }),
    };

    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);
    act(() => { fireEvent.keyDown(document, { key: " " }); });

    expect(mockPlayer.playVideo).toHaveBeenCalledTimes(1);
    expect(mockPlayer.pauseVideo).not.toHaveBeenCalled();
  });

  it("k key pauses the video when playing", () => {
    mockPlayer = { ...mockPlayer, getPlayerState: vi.fn(() => 1), playVideo: vi.fn(), pauseVideo: vi.fn() };
    (window as unknown as Record<string, unknown>).YT = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: vi.fn().mockImplementation(function (this: unknown, _id: string, opts: any) {
        Object.assign(this as object, mockPlayer);
        if (opts?.events) {}
        return this;
      }),
    };

    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);
    act(() => { fireEvent.keyDown(document, { key: "k" }); });

    expect(mockPlayer.pauseVideo).toHaveBeenCalledTimes(1);
    expect(mockPlayer.playVideo).not.toHaveBeenCalled();
  });

  it("keyboard shortcuts are ignored when focus is on an INPUT element", () => {
    render(
      <>
        <input data-testid="search-input" />
        <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
      </>
    );

    const input = screen.getByTestId("search-input");
    act(() => {
      fireEvent.keyDown(input, { key: "ArrowLeft", target: input });
    });

    // seekTo should NOT be called since key came from an input
    expect(mockPlayer.seekTo).not.toHaveBeenCalled();
  });
});

describe("VideoPlayer — autoPlay and playerId props", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let PlayerConstructor: MockedFunction<any>;

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });

    PlayerConstructor = vi.fn().mockImplementation(function (this: unknown) {
      Object.assign(this as object, {
        seekTo: vi.fn(),
        getCurrentTime: vi.fn(() => 0),
        getDuration: vi.fn(() => 100),
        destroy: vi.fn(),
        getPlayerState: vi.fn(() => 2),
        playVideo: vi.fn(),
        pauseVideo: vi.fn(),
      });
      return this;
    });

    (window as unknown as Record<string, unknown>).YT = { Player: PlayerConstructor };
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (globalThis as unknown as Record<string, unknown>).YT;
  });

  it("passes autoplay: 1 in playerVars when autoPlay prop is true", () => {
    render(
      <VideoPlayer youtubeId="abc123" title="Test" videoId="v1" autoPlay />
    );
    expect(PlayerConstructor).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const opts = PlayerConstructor.mock.calls[0][1] as any;
    expect(opts.playerVars.autoplay).toBe(1);
  });

  it("does NOT include autoplay key in playerVars when autoPlay prop is omitted", () => {
    render(
      <VideoPlayer youtubeId="abc123" title="Test" videoId="v1" />
    );
    expect(PlayerConstructor).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const opts = PlayerConstructor.mock.calls[0][1] as any;
    expect(opts.playerVars.autoplay).toBeUndefined();
  });

  it("uses custom playerId as the first argument to YT.Player constructor", () => {
    render(
      <VideoPlayer youtubeId="abc123" title="Test" videoId="v1" playerId="my-custom-player" />
    );
    expect(PlayerConstructor).toHaveBeenCalledTimes(1);
    expect(PlayerConstructor.mock.calls[0][0]).toBe("my-custom-player");
  });

  it("defaults to 'yt-player' as the playerId when not provided", () => {
    render(
      <VideoPlayer youtubeId="abc123" title="Test" videoId="v1" />
    );
    expect(PlayerConstructor).toHaveBeenCalledTimes(1);
    expect(PlayerConstructor.mock.calls[0][0]).toBe("yt-player");
  });
});

describe("VideoPlayer — resume toast boundary cases", () => {
  let mockPlayer: ReturnType<typeof createMockPlayer>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let capturedEvents: Record<string, (e: unknown) => void>;

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockPlayer = createMockPlayer();
    capturedEvents = {};

    (window as unknown as Record<string, unknown>).YT = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: vi.fn().mockImplementation(function (this: unknown, _id: string, opts: any) {
        Object.assign(this as object, mockPlayer);
        if (opts?.events) {
          Object.assign(capturedEvents, opts.events);
        }
        return this;
      }),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (globalThis as unknown as Record<string, unknown>).YT;
  });

  it("does NOT show resume toast when savedProgress is exactly 95 (boundary: condition is < 95)", () => {
    setProgress("vid1", 95);

    render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    act(() => {
      capturedEvents.onReady?.({ target: mockPlayer });
    });

    expect(screen.queryByText(/Resuming from/)).toBeNull();
    expect(mockPlayer.seekTo).not.toHaveBeenCalled();
  });

  it("DOES show resume toast when savedProgress is 94 (just below boundary)", async () => {
    setProgress("vid1", 94);

    render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    act(() => {
      capturedEvents.onReady?.({ target: mockPlayer });
    });

    await waitFor(() => {
      expect(screen.getByText("Resuming from 94%")).toBeInTheDocument();
    });
  });

  it("does NOT seek or show toast when onReady fires but getDuration returns 0", () => {
    setProgress("vid1", 50);
    // Override getDuration to return 0 for this test
    mockPlayer.getDuration = vi.fn(() => 0);

    render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    act(() => {
      capturedEvents.onReady?.({ target: mockPlayer });
    });

    expect(mockPlayer.seekTo).not.toHaveBeenCalled();
    expect(screen.queryByText(/Resuming from/)).toBeNull();
  });
});

describe("VideoPlayer — yt-time event dispatch", () => {
  let mockPlayer: ReturnType<typeof createMockPlayer>;

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockPlayer = createMockPlayer();

    (window as unknown as Record<string, unknown>).YT = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: vi.fn().mockImplementation(function (this: unknown, _id: string, opts: any) {
        Object.assign(this as object, mockPlayer);
        if (opts?.events) {}
        return this;
      }),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (globalThis as unknown as Record<string, unknown>).YT;
  });

  it("dispatches yt-time event with current time in milliseconds during polling", async () => {
    mockPlayer.getCurrentTime = vi.fn(() => 45);
    mockPlayer.getDuration = vi.fn(() => 100);

    const receivedTimes: number[] = [];
    const handler = (e: Event) => receivedTimes.push((e as CustomEvent<number>).detail);
    globalThis.addEventListener("yt-time", handler);

    render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    act(() => { vi.advanceTimersByTime(600); });

    await waitFor(() => {
      expect(receivedTimes.length).toBeGreaterThan(0);
      // current time is 45s → dispatched as 45000ms
      expect(receivedTimes[0]).toBe(45000);
    });

    globalThis.removeEventListener("yt-time", handler);
  });

  it("does NOT dispatch yt-time event when currentTime is 0", async () => {
    mockPlayer.getCurrentTime = vi.fn(() => 0);
    mockPlayer.getDuration = vi.fn(() => 100);

    const receivedTimes: number[] = [];
    const handler = (e: Event) => receivedTimes.push((e as CustomEvent<number>).detail);
    globalThis.addEventListener("yt-time", handler);

    render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    act(() => { vi.advanceTimersByTime(600); });

    await waitFor(() => {
      // Polling has run but no event should have been dispatched (current > 0 is false)
      expect(receivedTimes).toHaveLength(0);
    });

    globalThis.removeEventListener("yt-time", handler);
  });
});

describe("VideoPlayer — Escape key when overlay is closed", () => {
  let mockPlayer: ReturnType<typeof createMockPlayer>;

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockPlayer = createMockPlayer();

    (window as unknown as Record<string, unknown>).YT = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: vi.fn().mockImplementation(function (this: unknown, _id: string, opts: any) {
        Object.assign(this as object, mockPlayer);
        if (opts?.events) {}
        return this;
      }),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (globalThis as unknown as Record<string, unknown>).YT;
  });

  it("pressing Escape when the shortcuts overlay is not open has no effect", () => {
    render(<VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />);
    // No overlay is showing
    expect(screen.queryByRole("dialog")).toBeNull();

    // Pressing Escape should be a no-op (no crash, no overlay appears)
    act(() => { fireEvent.keyDown(document, { key: "Escape" }); });

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("VideoPlayer — compact mode", () => {
  let mockPlayer: ReturnType<typeof createMockPlayer>;

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockPlayer = createMockPlayer();

    (window as unknown as Record<string, unknown>).YT = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: vi.fn().mockImplementation(function (this: unknown, _id: string, opts: any) {
        Object.assign(this as object, mockPlayer);
        if (opts?.events) {}
        return this;
      }),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (globalThis as unknown as Record<string, unknown>).YT;
  });

  it("hides the progress bar in compact mode", async () => {
    setProgress("vid1", 60);
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" compact />
    );
    // The progress bar container (h-1 div below the player) should not exist
    await waitFor(() => {
      const progressContainer = container.querySelector(".h-1.w-full.bg-n8");
      expect(progressContainer).toBeNull();
    });
  });

  it("shortcuts hint is hidden in compact mode", () => {
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" compact />
    );
    // The hint div with "keyboard shortcuts" text should not exist
    expect(container.querySelector('[class*="bottom-4"][class*="right-4"]')).toBeNull();
  });

  it("shortcuts hint auto-dismisses after 4 seconds in normal mode", async () => {
    const { container } = render(
      <VideoPlayer youtubeId="abc123" title="Test Video" videoId="vid1" />
    );

    // Initially the hint is visible (hidden sm:flex — it's in the DOM but sm:hidden on mobile)
    const hint = container.querySelector("div[class*='keyboard shortcuts']");
    // The hint element should exist in the DOM initially
    expect(screen.getByText("keyboard shortcuts")).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(4000); });

    await waitFor(() => {
      expect(screen.queryByText("keyboard shortcuts")).toBeNull();
    });
  });
});
