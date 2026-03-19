/**
 * VideoCard.onRemove — argument verification tests
 *
 * PR 9d452f0 changed the onRemove prop signature from `() => void` to
 * `(id: string) => void`.  VideoCard now calls `onRemove(video.id)` internally
 * so that VideoRow can pass the stable `handleRemoveVideo` callback directly
 * (no per-render wrapper lambda) and React.memo bails out correctly.
 *
 * The existing VideoCard tests in VideoCard.test.tsx only verify
 * `toHaveBeenCalledTimes(1)` — they do NOT check the argument.  These tests
 * explicitly verify that the correct video id is passed to onRemove, and that
 * the id flows end-to-end through VideoRow → VideoCard → callback.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import VideoCard from "./VideoCard";
import VideoRow from "./VideoRow";
import { makeVideo } from "@/__tests__/factories";

// ── VideoCard — onRemove argument ────────────────────────────────────────────

describe("VideoCard — onRemove receives video.id as argument", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("calls onRemove with the video's id when the remove button is clicked", () => {
    const video = makeVideo({ id: "test-video-id", title: "Test Video" });
    const onRemove = vi.fn();

    const { getByLabelText } = render(
      <VideoCard video={video} onRemove={onRemove} />
    );

    fireEvent.click(getByLabelText("Remove Test Video from continue watching"));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledWith("test-video-id");
  });

  it("passes the exact id of the specific video, not a generic value", () => {
    const video = makeVideo({ id: "abc-xyz-789", title: "Another Video" });
    const onRemove = vi.fn();

    const { getByLabelText } = render(
      <VideoCard video={video} onRemove={onRemove} />
    );

    fireEvent.click(getByLabelText("Remove Another Video from continue watching"));

    // Verify the id is the specific video's id, not a default or empty string
    expect(onRemove).toHaveBeenCalledWith("abc-xyz-789");
    expect(onRemove).not.toHaveBeenCalledWith("");
    expect(onRemove).not.toHaveBeenCalledWith(undefined);
  });

  it("does not call onRemove with zero arguments (verifies new (id) signature is used)", () => {
    const video = makeVideo({ id: "my-video", title: "My Video" });
    const onRemove = vi.fn();

    const { getByLabelText } = render(
      <VideoCard video={video} onRemove={onRemove} />
    );

    fireEvent.click(getByLabelText("Remove My Video from continue watching"));

    // The call must carry exactly one argument (the id), not zero
    const [firstCallArgs] = onRemove.mock.calls;
    expect(firstCallArgs).toHaveLength(1);
    expect(firstCallArgs[0]).toBe("my-video");
  });
});

// ── VideoRow → VideoCard — id propagation (end-to-end) ──────────────────────

describe("VideoRow — onRemoveVideo receives the removed video's id", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("flat list: clicking remove button calls onRemoveVideo with the correct video id", () => {
    const video = makeVideo({ id: "row-vid-1", title: "Row Video One" });
    const onRemoveVideo = vi.fn();

    const { getByLabelText } = render(
      <VideoRow title="Test Row" videos={[video]} onRemoveVideo={onRemoveVideo} />
    );

    fireEvent.click(getByLabelText("Remove Row Video One from continue watching"));

    expect(onRemoveVideo).toHaveBeenCalledTimes(1);
    expect(onRemoveVideo).toHaveBeenCalledWith("row-vid-1");
  });

  it("flat list: clicking remove on second card passes second card's id (not first)", () => {
    const video1 = makeVideo({ id: "vid-alpha", title: "Alpha Video" });
    const video2 = makeVideo({ id: "vid-beta", title: "Beta Video" });
    const onRemoveVideo = vi.fn();

    const { getByLabelText } = render(
      <VideoRow title="Test Row" videos={[video1, video2]} onRemoveVideo={onRemoveVideo} />
    );

    // Click the second card's remove button — should receive vid-beta's id
    fireEvent.click(getByLabelText("Remove Beta Video from continue watching"));

    expect(onRemoveVideo).toHaveBeenCalledTimes(1);
    expect(onRemoveVideo).toHaveBeenCalledWith("vid-beta");
    expect(onRemoveVideo).not.toHaveBeenCalledWith("vid-alpha");
  });

  it("sectionLabels path: first-section remove button passes the correct id to onRemoveVideo", () => {
    const cwVideo = makeVideo({ id: "cw-section-id", title: "CW Video" });
    const latestVideo = makeVideo({ id: "latest-section-id", title: "Latest Video" });
    const onRemoveVideo = vi.fn();

    const { getByLabelText } = render(
      <VideoRow
        title="Mixed Row"
        videos={[cwVideo, latestVideo]}
        onRemoveVideo={onRemoveVideo}
        sectionLabels={{
          firstLabel: "Continue Watching",
          firstCount: 1,
          secondLabel: "Latest",
          secondCount: 1,
          splitAt: 1,
        }}
      />
    );

    // First section card has a remove button — it should pass the CW video's id
    fireEvent.click(getByLabelText("Remove CW Video from continue watching"));

    expect(onRemoveVideo).toHaveBeenCalledTimes(1);
    expect(onRemoveVideo).toHaveBeenCalledWith("cw-section-id");
  });

  it("removes correct video when two cards exist and first one is removed", () => {
    const video1 = makeVideo({ id: "first-id", title: "First Video" });
    const video2 = makeVideo({ id: "second-id", title: "Second Video" });
    const onRemoveVideo = vi.fn();

    const { getByLabelText } = render(
      <VideoRow title="Test Row" videos={[video1, video2]} onRemoveVideo={onRemoveVideo} />
    );

    // Remove the FIRST card — should pass first-id, not second-id
    fireEvent.click(getByLabelText("Remove First Video from continue watching"));

    expect(onRemoveVideo).toHaveBeenCalledWith("first-id");
    expect(onRemoveVideo).not.toHaveBeenCalledWith("second-id");
  });
});
