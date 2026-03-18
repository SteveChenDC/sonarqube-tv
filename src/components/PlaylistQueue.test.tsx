import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PlaylistQueue from "./PlaylistQueue";
import { makeVideo } from "@/__tests__/factories";

// Mock next/navigation
const mockSearchParams = new URLSearchParams();
vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

const videos = [
  makeVideo({ id: "v1", category: "tutorials", title: "First Tutorial" }),
  makeVideo({ id: "v2", category: "tutorials", title: "Second Tutorial" }),
  makeVideo({ id: "v3", category: "tutorials", title: "Third Tutorial" }),
  makeVideo({ id: "v4", category: "webinars", title: "A Webinar" }),
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
    expect(otherTitle.className).not.toMatch(/(?<![:\w])text-n1(?![\w-])/);

  });

  it("disabled prev span has aria-label 'No previous video' on first video", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v1" allVideos={videos} />);
    const disabledPrev = screen.getByLabelText("No previous video");
    expect(disabledPrev).toBeInTheDocument();
    expect(disabledPrev.tagName.toLowerCase()).toBe("span");
    expect(disabledPrev).toHaveAttribute("aria-disabled", "true");
  });

  it("disabled next span has aria-label 'No next video' on last video", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v3" allVideos={videos} />);
    const disabledNext = screen.getByLabelText("No next video");
    expect(disabledNext).toBeInTheDocument();
    expect(disabledNext.tagName.toLowerCase()).toBe("span");
    expect(disabledNext).toHaveAttribute("aria-disabled", "true");
  });

  it("shows video duration for each playlist item", () => {
    const videosWithDurations = [
      makeVideo({ id: "d1", category: "tutorials", title: "Short Video", duration: "3:30" }),
      makeVideo({ id: "d2", category: "tutorials", title: "Long Video", duration: "45:00" }),
    ];
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="d1" allVideos={videosWithDurations} />);
    expect(screen.getByText("3:30")).toBeInTheDocument();
    expect(screen.getByText("45:00")).toBeInTheDocument();
  });

  it("each playlist list item is a link with the correct watch URL", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v1" allVideos={videos} />);

    // All 3 tutorial videos should have list item links
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/watch/v1?playlist=tutorials");
    expect(hrefs).toContain("/watch/v2?playlist=tutorials");
    expect(hrefs).toContain("/watch/v3?playlist=tutorials");
    // Webinar video (different category) should not appear
    expect(hrefs).not.toContain("/watch/v4?playlist=tutorials");
  });

  it("shows animate-pulse play icon for the current video instead of its index number", () => {
    mockSearchParams.set("playlist", "tutorials");
    const { container } = render(<PlaylistQueue currentVideoId="v2" allVideos={videos} />);

    // The current video's index cell should have the animate-pulse span
    const pulseSpan = container.querySelector(".animate-pulse");
    expect(pulseSpan).not.toBeNull();

    // The number "2" (index of current video) should NOT appear as a plain text node
    // The first video shows "1" and third shows "3", but "2" is replaced by the icon
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.queryByText("2")).toBeNull();
  });

  it("currentVideoId not in playlist shows position 0 / N and only next nav", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="not-in-list" allVideos={videos} />);

    // currentIndex = -1, so counter shows 0 / 3
    expect(screen.getByText("0 / 3")).toBeInTheDocument();
    // prevVideo = null (−1 > 0 is false), nextVideo = playlistVideos[0]
    expect(screen.queryByLabelText("Previous video")).toBeNull();
    expect(screen.getByLabelText("Next video")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// scrollIntoView — active item auto-scroll
//
// PlaylistQueue calls `activeItemRef.current?.scrollIntoView?.({ block: "nearest",
// behavior: "instant" })` inside a useEffect([currentVideoId]) so that the
// currently-playing item is always visible in the scroll container without
// jarring smooth-scroll animation.
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// scrollIntoView — active item auto-scroll
//
// PlaylistQueue calls `activeItemRef.current?.scrollIntoView?.({ block: "nearest",
// behavior: "instant" })` inside a useEffect([currentVideoId]) so that the
// currently-playing item is always visible in the scroll container without
// jarring smooth-scroll animation.
//
// jsdom does NOT implement scrollIntoView, so we define it on
// HTMLElement.prototype before each test and delete it after.
// ─────────────────────────────────────────────────────────────────────────────
describe("PlaylistQueue — scrollIntoView on active item", () => {
  let scrollSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollSpy = vi.fn();
    // jsdom doesn't define scrollIntoView — install a mock so the optional-
    // chain call `activeItemRef.current?.scrollIntoView?.({...})` fires.
    HTMLElement.prototype.scrollIntoView = scrollSpy;
  });

  afterEach(() => {
    // Remove the property so it doesn't leak into unrelated tests
    // @ts-expect-error — intentionally deleting a property we added
    delete HTMLElement.prototype.scrollIntoView;
    vi.restoreAllMocks();
  });

  it("calls scrollIntoView on the active playlist item immediately after mount", () => {
    mockSearchParams.set("playlist", "tutorials");

    render(<PlaylistQueue currentVideoId="v2" allVideos={videos} />);

    // useEffect fires after mount — the active item (v2) should be scrolled into view
    expect(scrollSpy).toHaveBeenCalledWith({ block: "nearest", behavior: "instant" });
  });

  it("re-calls scrollIntoView when currentVideoId changes to a different playlist video", () => {
    mockSearchParams.set("playlist", "tutorials");

    const { rerender } = render(
      <PlaylistQueue currentVideoId="v1" allVideos={videos} />
    );

    // Initial mount triggers one scroll call
    const callsAfterMount = scrollSpy.mock.calls.length;
    expect(callsAfterMount).toBeGreaterThanOrEqual(1);

    // Navigate to a different video within the same playlist
    rerender(<PlaylistQueue currentVideoId="v3" allVideos={videos} />);

    // useEffect dependency [currentVideoId] re-fires — another scroll call expected
    expect(scrollSpy.mock.calls.length).toBeGreaterThan(callsAfterMount);
    expect(scrollSpy).toHaveBeenLastCalledWith({ block: "nearest", behavior: "instant" });
  });

  it("does NOT call scrollIntoView when currentVideoId is not in the playlist", () => {
    // When no video matches currentVideoId, activeItemRef stays null.
    // `null?.scrollIntoView?.({...})` short-circuits without calling the function.
    mockSearchParams.set("playlist", "tutorials");

    render(<PlaylistQueue currentVideoId="not-in-list" allVideos={videos} />);

    expect(scrollSpy).not.toHaveBeenCalled();
  });
});
