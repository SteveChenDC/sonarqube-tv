/**
 * VideoPlayer — keyboard-shortcut try/catch error-handling tests.
 *
 * VideoPlayer wraps all YT player calls in try/catch blocks with the comment
 * "// player not ready yet". The progress-interval catch is already covered in
 * VideoPlayer.test.tsx (line 131). This file covers the three separate
 * try/catch blocks inside the keyboard-shortcut handler:
 *
 *  1. ArrowLeft / j  — try { getCurrentTime → seekTo → setSeekToast } catch {}
 *  2. ArrowRight / l — try { getDuration + getCurrentTime → seekTo → setSeekToast } catch {}
 *  3. Space / k      — try { getPlayerState → playVideo / pauseVideo } catch {}
 *
 * When a player method throws, the catch block prevents a crash and ensures no
 * visible side-effect (seek toast, play/pause call) occurs.
 *
 * Kept separate from VideoPlayer.test.tsx to isolate the error-path concern
 * and avoid polluting the main suite with throw-based mock implementations.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import VideoPlayer from "./VideoPlayer";

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

function buildMockPlayer(overrides: Partial<{
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: () => void;
  getPlayerState: () => number;
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
}> = {}) {
  return {
    getCurrentTime: vi.fn(() => 30),
    getDuration: vi.fn(() => 100),
    seekTo: vi.fn(),
    getPlayerState: vi.fn(() => 2), // 2 = paused (not YT_PLAYING=1)
    playVideo: vi.fn(),
    pauseVideo: vi.fn(),
    destroy: vi.fn(),
    ...overrides,
  };
}

function installYT(player: ReturnType<typeof buildMockPlayer>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).YT = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Player: vi.fn().mockImplementation(function (this: unknown, _id: string, _opts: any) {
      Object.assign(this as object, player);
      return this;
    }),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("VideoPlayer — keyboard-shortcut try/catch (player-not-ready errors)", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).YT;
  });

  // ── ArrowLeft try/catch ────────────────────────────────────────────────────

  it("ArrowLeft: seekTo is NOT called when getCurrentTime() throws (player not ready)", () => {
    const player = buildMockPlayer({
      getCurrentTime: vi.fn(() => { throw new Error("player not ready"); }),
    });
    installYT(player);

    render(<VideoPlayer youtubeId="abc123" title="Test" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "ArrowLeft" }); });

    // getCurrentTime threw → execution never reached seekTo
    expect(player.seekTo).not.toHaveBeenCalled();
  });

  it("ArrowLeft: no '-10s' seek toast when getCurrentTime() throws", () => {
    const player = buildMockPlayer({
      getCurrentTime: vi.fn(() => { throw new Error("player not ready"); }),
    });
    installYT(player);

    render(<VideoPlayer youtubeId="abc123" title="Test" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "ArrowLeft" }); });

    // setSeekToast is skipped — the toast element should not appear in the DOM
    expect(screen.queryByText("-10s")).toBeNull();
  });

  it("ArrowLeft: no '-10s' seek toast when seekTo() itself throws (error after getCurrentTime succeeds)", () => {
    // getCurrentTime and getDuration return normally — seekTo is the one that throws.
    // This tests that setSeekToast (called after seekTo) is also skipped.
    const player = buildMockPlayer({
      getCurrentTime: vi.fn(() => 30),
      seekTo: vi.fn(() => { throw new Error("seekTo failed"); }),
    });
    installYT(player);

    render(<VideoPlayer youtubeId="abc123" title="Test" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "ArrowLeft" }); });

    // seekTo threw → setSeekToast was never reached → no toast
    expect(screen.queryByText("-10s")).toBeNull();
  });

  // ── ArrowRight try/catch ───────────────────────────────────────────────────

  it("ArrowRight: seekTo is NOT called when getDuration() throws (player not ready)", () => {
    // getDuration() is evaluated first in the ArrowRight handler:
    //   Math.min(player.getDuration(), player.getCurrentTime() + SEEK_SECONDS)
    // If getDuration throws, getCurrentTime is never called and seekTo is skipped.
    const player = buildMockPlayer({
      getDuration: vi.fn(() => { throw new Error("player not ready"); }),
    });
    installYT(player);

    render(<VideoPlayer youtubeId="abc123" title="Test" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "ArrowRight" }); });

    expect(player.seekTo).not.toHaveBeenCalled();
  });

  it("ArrowRight: no '+10s' seek toast when getDuration() throws", () => {
    const player = buildMockPlayer({
      getDuration: vi.fn(() => { throw new Error("player not ready"); }),
    });
    installYT(player);

    render(<VideoPlayer youtubeId="abc123" title="Test" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: "ArrowRight" }); });

    expect(screen.queryByText("+10s")).toBeNull();
  });

  // ── Space / k try/catch ────────────────────────────────────────────────────

  it("Space: playVideo is NOT called when getPlayerState() throws (player not ready)", () => {
    const player = buildMockPlayer({
      getPlayerState: vi.fn(() => { throw new Error("player not ready"); }),
    });
    installYT(player);

    render(<VideoPlayer youtubeId="abc123" title="Test" videoId="vid1" />);

    act(() => { fireEvent.keyDown(document, { key: " " }); });

    // getPlayerState threw → the if-branch was never evaluated → playVideo/pauseVideo not called
    expect(player.playVideo).not.toHaveBeenCalled();
    expect(player.pauseVideo).not.toHaveBeenCalled();
  });

  it("k key: component does not throw when getPlayerState() throws during pause attempt", () => {
    // Companion test for the 'k' alias of the Space shortcut.
    // Verifies the same try/catch protects the 'k' code path without throwing to the test runner.
    const player = buildMockPlayer({
      getPlayerState: vi.fn(() => { throw new Error("player not ready"); }),
    });
    installYT(player);

    expect(() => {
      render(<VideoPlayer youtubeId="abc123" title="Test" videoId="vid2" />);
      act(() => { fireEvent.keyDown(document, { key: "k" }); });
    }).not.toThrow();

    expect(player.playVideo).not.toHaveBeenCalled();
    expect(player.pauseVideo).not.toHaveBeenCalled();
  });
});
