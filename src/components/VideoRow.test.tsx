import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import VideoRow from "./VideoRow";
import { makeVideo } from "@/__tests__/factories";

// Helper: replace IntersectionObserver with one that never fires the callback,
// so VideoRow stays in its skeleton (unrevealed) state.
function useNonFiringIntersectionObserver() {
  let original: typeof IntersectionObserver;
  beforeEach(() => {
    original = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = class {
      observe() { /* never fires */ }
      unobserve() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
  });
  afterEach(() => {
    globalThis.IntersectionObserver = original;
  });
}

describe("VideoRow", () => {
  it("renders nothing when videos array is empty", () => {
    const { container } = render(
      <VideoRow title="Empty Row" categorySlug="tutorials" videos={[]} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders title as heading with all video cards", () => {
    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" }), makeVideo({ id: "v3" })];
    const { getByText, getAllByText } = render(
      <VideoRow title="Tutorials" categorySlug="tutorials" videos={videos} />
    );
    // Title is a heading inside a section with anchor id
    const titleEl = getByText("Tutorials");
    expect(titleEl.closest("section")?.id).toBe("tutorials");
    // All video cards rendered (may appear in both mobile + desktop layouts)
    expect(getAllByText("Video v1").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("Video v2").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("Video v3").length).toBeGreaterThanOrEqual(1);
  });

  it("scroll buttons call scrollBy on the container", () => {
    const videos = [makeVideo({ id: "v1" })];
    const scrollBySpy = vi.fn();
    // Mock scrollBy and dimensions on scroll containers to simulate overflow
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string, options?: ElementCreationOptions) => {
      const el = originalCreateElement(tag, options);
      if (tag === "div") {
        Object.defineProperty(el, "scrollBy", { value: scrollBySpy, writable: true });
        Object.defineProperty(el, "scrollWidth", { value: 2000, configurable: true });
        Object.defineProperty(el, "clientWidth", { value: 800, configurable: true });
        Object.defineProperty(el, "scrollLeft", { value: 100, writable: true, configurable: true });
      }
      return el;
    });

    const { getByLabelText } = render(
      <VideoRow title="Row" categorySlug="cat" videos={videos} />
    );

    fireEvent.click(getByLabelText("Scroll right"));
    expect(scrollBySpy).toHaveBeenCalledWith({ left: 340, behavior: "smooth" });

    fireEvent.click(getByLabelText("Scroll left"));
    expect(scrollBySpy).toHaveBeenCalledWith({ left: -340, behavior: "smooth" });

    vi.restoreAllMocks();
  });

  it("hides scroll arrows when content does not overflow", () => {
    const videos = [makeVideo({ id: "v1" })];
    // In jsdom, scrollWidth === clientWidth === 0, so no overflow
    const { queryByLabelText } = render(
      <VideoRow title="Row" categorySlug="cat" videos={videos} />
    );
    expect(queryByLabelText("Scroll left")).toBeNull();
    expect(queryByLabelText("Scroll right")).toBeNull();
  });

  it("ArrowRight moves focus to the next card", () => {
    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" }), makeVideo({ id: "v3" })];
    const { container } = render(
      <VideoRow title="Row" categorySlug="cat" videos={videos} />
    );

    const links = container.querySelectorAll<HTMLAnchorElement>("a[href*='/watch/']");
    expect(links.length).toBeGreaterThanOrEqual(2);

    // Focus the first card and fire ArrowRight
    links[0].focus();
    expect(document.activeElement).toBe(links[0]);

    fireEvent.keyDown(links[0].closest("[role='region']")!, { key: "ArrowRight" });
    expect(document.activeElement).toBe(links[1]);
  });

  it("ArrowLeft moves focus to the previous card", () => {
    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
    const { container } = render(
      <VideoRow title="Row" categorySlug="cat" videos={videos} />
    );

    const links = container.querySelectorAll<HTMLAnchorElement>("a[href*='/watch/']");
    links[1].focus();
    expect(document.activeElement).toBe(links[1]);

    fireEvent.keyDown(links[1].closest("[role='region']")!, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(links[0]);
  });

  it("ArrowLeft does not go before the first card", () => {
    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
    const { container } = render(
      <VideoRow title="Row" categorySlug="cat" videos={videos} />
    );

    const links = container.querySelectorAll<HTMLAnchorElement>("a[href*='/watch/']");
    links[0].focus();

    fireEvent.keyDown(links[0].closest("[role='region']")!, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(links[0]);
  });

  it("End key moves focus to the last card", () => {
    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" }), makeVideo({ id: "v3" })];
    const { container } = render(
      <VideoRow title="Row" categorySlug="cat" videos={videos} />
    );

    const links = container.querySelectorAll<HTMLAnchorElement>("a[href*='/watch/']");
    links[0].focus();

    fireEvent.keyDown(links[0].closest("[role='region']")!, { key: "End" });
    expect(document.activeElement).toBe(links[links.length - 1]);
  });

  it("Home key moves focus to the first card", () => {
    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" }), makeVideo({ id: "v3" })];
    const { container } = render(
      <VideoRow title="Row" categorySlug="cat" videos={videos} />
    );

    const links = container.querySelectorAll<HTMLAnchorElement>("a[href*='/watch/']");
    links[2].focus();
    expect(document.activeElement).toBe(links[2]);

    fireEvent.keyDown(links[2].closest("[role='region']")!, { key: "Home" });
    expect(document.activeElement).toBe(links[0]);
  });

  it("does not render header when hideHeader is true", () => {
    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
    const { queryByText } = render(
      <VideoRow title="Hidden Row" categorySlug="cat" videos={videos} hideHeader />
    );
    expect(queryByText("Hidden Row")).toBeNull();
  });

  it("renders header when hideHeader is false (default)", () => {
    const videos = [makeVideo({ id: "v1" })];
    const { getByText } = render(
      <VideoRow title="Visible Row" categorySlug="cat" videos={videos} />
    );
    expect(getByText("Visible Row")).toBeTruthy();
  });

  it("shows View all link when totalCount > videos.length and categorySlug is provided", () => {
    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
    const { getByText } = render(
      <VideoRow title="Tutorials" categorySlug="tutorials" videos={videos} totalCount={10} />
    );
    const viewAll = getByText("View all");
    expect(viewAll).toBeTruthy();
    expect(viewAll.closest("a")?.getAttribute("href")).toBe("/category/tutorials");
  });

  it("does not show View all link when totalCount equals videos.length", () => {
    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
    const { queryByText } = render(
      <VideoRow title="Tutorials" categorySlug="tutorials" videos={videos} totalCount={2} />
    );
    expect(queryByText("View all")).toBeNull();
  });

  it("does not show View all link when no categorySlug", () => {
    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
    const { queryByText } = render(
      <VideoRow title="Mixed" videos={videos} totalCount={10} />
    );
    expect(queryByText("View all")).toBeNull();
  });

  it("renders two labeled sections when sectionLabels prop is provided", () => {
    const videos = [
      makeVideo({ id: "v1", title: "Continue 1" }),
      makeVideo({ id: "v2", title: "Continue 2" }),
      makeVideo({ id: "v3", title: "Latest 1" }),
      makeVideo({ id: "v4", title: "Latest 2" }),
    ];
    const { getByText, getAllByText } = render(
      <VideoRow
        title="Mixed Row"
        videos={videos}
        sectionLabels={{
          firstLabel: "Continue Watching",
          firstCount: 2,
          secondLabel: "Latest",
          secondCount: 2,
          splitAt: 2,
        }}
      />
    );
    expect(getByText("Continue Watching")).toBeTruthy();
    expect(getByText("Latest")).toBeTruthy();
    expect(getAllByText("Continue 1").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("Latest 1").length).toBeGreaterThanOrEqual(1);
  });

  it("calls onRemoveVideo callback when remove button is clicked", () => {
    const videos = [makeVideo({ id: "v1", title: "Removable Video" })];
    const onRemove = vi.fn();
    const { getByLabelText } = render(
      <VideoRow title="Row" videos={videos} onRemoveVideo={onRemove} />
    );
    const removeBtn = getByLabelText("Remove Removable Video from continue watching");
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("does not render remove buttons when onRemoveVideo is not provided", () => {
    const videos = [makeVideo({ id: "v1", title: "Plain Video" })];
    const { queryByLabelText } = render(
      <VideoRow title="Row" videos={videos} />
    );
    expect(queryByLabelText("Remove Plain Video from continue watching")).toBeNull();
  });

  it("ArrowRight does not move focus past the last card", () => {
    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" }), makeVideo({ id: "v3" })];
    const { container } = render(
      <VideoRow title="Row" categorySlug="cat" videos={videos} />
    );

    const links = container.querySelectorAll<HTMLAnchorElement>("a[href*='/watch/']");
    const lastLink = links[links.length - 1];
    lastLink.focus();
    expect(document.activeElement).toBe(lastLink);

    fireEvent.keyDown(lastLink.closest("[role='region']")!, { key: "ArrowRight" });
    // Focus should remain on the last card
    expect(document.activeElement).toBe(lastLink);
  });

  it("scroll region has an accessible aria-label containing the row title", () => {
    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
    const { container } = render(
      <VideoRow title="My Row Title" categorySlug="cat" videos={videos} />
    );
    const region = container.querySelector("[role='region']");
    expect(region).not.toBeNull();
    expect(region?.getAttribute("aria-label")).toContain("My Row Title");
  });

  it("arrow keys have no effect when no card inside the row is focused", () => {
    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" }), makeVideo({ id: "v3" })];
    const { container } = render(
      <VideoRow title="Row" categorySlug="cat" videos={videos} />
    );

    const links = container.querySelectorAll<HTMLAnchorElement>("a[href*='/watch/']");
    const region = links[0].closest("[role='region']")!;

    // Fire ArrowRight with no card focused
    fireEvent.keyDown(region, { key: "ArrowRight" });

    // No card should have gained focus as a result
    expect(document.activeElement).not.toBe(links[0]);
    expect(document.activeElement).not.toBe(links[1]);
    expect(document.activeElement).not.toBe(links[2]);
  });

  it("unhandled keys (e.g. Tab) inside the row region do not move card focus", () => {
    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
    const { container } = render(
      <VideoRow title="Row" categorySlug="cat" videos={videos} />
    );

    const links = container.querySelectorAll<HTMLAnchorElement>("a[href*='/watch/']");
    links[0].focus();

    fireEvent.keyDown(links[0].closest("[role='region']")!, { key: "Tab" });
    // Tab is not handled by VideoRow — focus stays on the first card (native browser behavior)
    expect(document.activeElement).toBe(links[0]);
  });

  describe("sectionLabels — remove button only on first section", () => {
    it("first-section cards get a remove button when onRemoveVideo is provided", () => {
      const videos = [
        makeVideo({ id: "cw1", title: "CW Video" }),
        makeVideo({ id: "latest1", title: "Latest Video" }),
      ];
      const onRemove = vi.fn();
      const { getByLabelText } = render(
        <VideoRow
          title="Mixed"
          videos={videos}
          onRemoveVideo={onRemove}
          sectionLabels={{
            firstLabel: "Continue Watching",
            firstCount: 1,
            secondLabel: "Latest",
            secondCount: 1,
            splitAt: 1,
          }}
        />
      );
      // First section card has a remove button
      expect(getByLabelText("Remove CW Video from continue watching")).toBeTruthy();
    });

    it("second-section cards do NOT get a remove button even when onRemoveVideo is provided", () => {
      const videos = [
        makeVideo({ id: "cw1", title: "CW Video" }),
        makeVideo({ id: "latest1", title: "Latest Video" }),
      ];
      const onRemove = vi.fn();
      const { queryByLabelText } = render(
        <VideoRow
          title="Mixed"
          videos={videos}
          onRemoveVideo={onRemove}
          sectionLabels={{
            firstLabel: "Continue Watching",
            firstCount: 1,
            secondLabel: "Latest",
            secondCount: 1,
            splitAt: 1,
          }}
        />
      );
      // Second section card must not have a remove button
      expect(queryByLabelText("Remove Latest Video from continue watching")).toBeNull();
    });
  });

  describe("RowSkeleton — before IntersectionObserver fires", () => {
    useNonFiringIntersectionObserver();

    it("renders a skeleton with 4 placeholder cards before content is revealed", () => {
      const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
      const { container } = render(
        <VideoRow title="My Row" videos={videos} />
      );
      // Skeleton root is aria-hidden
      const skeleton = container.querySelector("[aria-hidden='true']");
      expect(skeleton).not.toBeNull();
      // 4 aspect-video placeholder divs
      const placeholders = skeleton!.querySelectorAll(".aspect-video");
      expect(placeholders.length).toBe(4);
      // Real video card links should NOT be rendered yet
      expect(container.querySelectorAll("a[href*='/watch/']").length).toBe(0);
    });

    it("skeleton shows header placeholder text by default", () => {
      const videos = [makeVideo({ id: "v1" })];
      const { container } = render(
        <VideoRow title="My Row" videos={videos} />
      );
      const skeleton = container.querySelector("[aria-hidden='true']");
      // Header skeleton: two animate-pulse divs inside the header area
      expect(skeleton!.querySelector(".w-40")).not.toBeNull();
    });

    it("skeleton omits the header row when hideHeader is true", () => {
      const videos = [makeVideo({ id: "v1" })];
      const { container } = render(
        <VideoRow title="My Row" videos={videos} hideHeader />
      );
      const skeleton = container.querySelector("[aria-hidden='true']");
      // No header skeleton when hideHeader
      expect(skeleton!.querySelector(".w-40")).toBeNull();
    });
  });
});
