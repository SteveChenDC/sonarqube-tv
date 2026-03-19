/**
 * VideoCard / VideoRow — onRemove(id) argument verification
 *
 * Commit 9d452f0 changed VideoCard.onRemove from `() => void` to `(id: string) => void`
 * so VideoRow can pass a stable callback without an inline wrapper lambda. This file
 * verifies the argument-passing contract throughout the call chain.
 *
 * The base VideoCard.test.tsx "onRemove prop" suite only checks `toHaveBeenCalledTimes(1)`.
 * These tests additionally verify the *argument* passed to the callback.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import VideoCard from "./VideoCard";
import VideoRow from "./VideoRow";
import { makeVideo } from "@/__tests__/factories";

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

// ── VideoCard single-component tests ─────────────────────────────────────────

describe("VideoCard — onRemove(id) argument", () => {
  it("calls onRemove with the video's id when remove button is clicked", () => {
    const video = makeVideo({ id: "abc-123" });
    const onRemove = vi.fn();
    const { getByLabelText } = render(<VideoCard video={video} onRemove={onRemove} />);
    fireEvent.click(getByLabelText(/Remove.*from continue watching/));
    expect(onRemove).toHaveBeenCalledWith("abc-123");
  });

  it("passes the exact video id — not an empty string or undefined", () => {
    const video = makeVideo({ id: "xyz-456" });
    const onRemove = vi.fn();
    const { getByLabelText } = render(<VideoCard video={video} onRemove={onRemove} />);
    fireEvent.click(getByLabelText(/Remove.*from continue watching/));
    const arg = onRemove.mock.calls[0][0];
    expect(arg).toBe("xyz-456");
    expect(arg).not.toBe("");
    expect(arg).not.toBeUndefined();
  });

  it("calls onRemove with exactly one argument (regression guard against zero-arg rollback)", () => {
    const video = makeVideo({ id: "test-id" });
    const onRemove = vi.fn();
    const { getByLabelText } = render(<VideoCard video={video} onRemove={onRemove} />);
    fireEvent.click(getByLabelText(/Remove.*from continue watching/));
    // Must be exactly 1 arg — `() => void` would produce 0 args
    expect(onRemove.mock.calls[0].length).toBe(1);
  });

  it("uses the video's own id even when multiple VideoCard instances exist", () => {
    const videoA = makeVideo({ id: "first-video" });
    const videoB = makeVideo({ id: "second-video" });
    const onRemoveA = vi.fn();
    const onRemoveB = vi.fn();

    const { getByLabelText: getA, unmount } = render(
      <VideoCard video={videoA} onRemove={onRemoveA} />,
    );
    fireEvent.click(getA(/Remove.*from continue watching/));
    expect(onRemoveA).toHaveBeenCalledWith("first-video");
    unmount();

    cleanup();
    const { getByLabelText: getB } = render(
      <VideoCard video={videoB} onRemove={onRemoveB} />,
    );
    fireEvent.click(getB(/Remove.*from continue watching/));
    expect(onRemoveB).toHaveBeenCalledWith("second-video");
  });
});

// ── VideoRow end-to-end: flat list ────────────────────────────────────────────

describe("VideoRow — onRemoveVideo(id) propagation (flat list)", () => {
  it("passes the clicked card's id to onRemoveVideo", () => {
    const videos = [makeVideo({ id: "row-vid-1", title: "Row Video 1" })];
    const onRemoveVideo = vi.fn();
    const { getByLabelText } = render(
      <VideoRow title="Row" videos={videos} onRemoveVideo={onRemoveVideo} />,
    );
    fireEvent.click(getByLabelText("Remove Row Video 1 from continue watching"));
    expect(onRemoveVideo).toHaveBeenCalledWith("row-vid-1");
  });

  it("passes the second card's id when the second card is removed (not the first)", () => {
    const videos = [
      makeVideo({ id: "first-id", title: "First Video" }),
      makeVideo({ id: "second-id", title: "Second Video" }),
    ];
    const onRemoveVideo = vi.fn();
    const { getByLabelText } = render(
      <VideoRow title="Row" videos={videos} onRemoveVideo={onRemoveVideo} />,
    );
    fireEvent.click(getByLabelText("Remove Second Video from continue watching"));
    expect(onRemoveVideo).toHaveBeenCalledWith("second-id");
    expect(onRemoveVideo).not.toHaveBeenCalledWith("first-id");
  });

  it("passes the first card's id when the first card is removed (not the second)", () => {
    const videos = [
      makeVideo({ id: "alpha", title: "Alpha Video" }),
      makeVideo({ id: "beta", title: "Beta Video" }),
    ];
    const onRemoveVideo = vi.fn();
    const { getByLabelText } = render(
      <VideoRow title="Row" videos={videos} onRemoveVideo={onRemoveVideo} />,
    );
    fireEvent.click(getByLabelText("Remove Alpha Video from continue watching"));
    expect(onRemoveVideo).toHaveBeenCalledWith("alpha");
    expect(onRemoveVideo).not.toHaveBeenCalledWith("beta");
  });
});

// ── VideoRow end-to-end: sectionLabels (first-section) path ──────────────────

describe("VideoRow — onRemoveVideo(id) propagation (sectionLabels path)", () => {
  it("passes correct id via the videos.slice(0, splitAt) first-section code path", () => {
    const videos = [
      makeVideo({ id: "cw-vid-1", title: "CW Video 1" }),
      makeVideo({ id: "cw-vid-2", title: "CW Video 2" }),
      makeVideo({ id: "cw-vid-3", title: "CW Video 3" }),
    ];
    const onRemoveVideo = vi.fn();
    const { getByLabelText } = render(
      <VideoRow
        title="Continue Watching"
        videos={videos}
        onRemoveVideo={onRemoveVideo}
        sectionLabels={{
          firstLabel: "Continue Watching",
          firstCount: 2,
          secondLabel: "Latest",
          secondCount: 1,
          splitAt: 2,
        }}
      />,
    );
    // Only first-section cards get a remove button
    fireEvent.click(getByLabelText("Remove CW Video 1 from continue watching"));
    expect(onRemoveVideo).toHaveBeenCalledWith("cw-vid-1");
  });
});
