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

  describe("Swipe hint — mobile scroll affordance", () => {
    // Helper: mock all new divs to report overflow dimensions so canScrollRight becomes true
    function withScrollOverflow(fn: () => void) {
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, "createElement").mockImplementation((tag: string, options?: ElementCreationOptions) => {
        const el = originalCreateElement(tag, options);
        if (tag === "div") {
          Object.defineProperty(el, "scrollWidth", { value: 2000, configurable: true });
          Object.defineProperty(el, "clientWidth", { value: 800, configurable: true });
          Object.defineProperty(el, "scrollLeft", { value: 0, writable: true, configurable: true });
        }
        return el;
      });
      fn();
      vi.restoreAllMocks();
    }

    it("shows swipe hint when content overflows and user has not yet scrolled", () => {
      withScrollOverflow(() => {
        const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
        const { container } = render(
          <VideoRow title="Row" categorySlug="cat" videos={videos} />
        );
        const hint = container.querySelector('[class*="sm:hidden"]');
        expect(hint).not.toBeNull();
        expect(hint?.textContent).toContain("Swipe");
      });
    });

    it("does not show swipe hint when content does not overflow", () => {
      // Default jsdom: scrollWidth === clientWidth === 0, so canScrollRight is false
      const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
      const { container } = render(
        <VideoRow title="Row" categorySlug="cat" videos={videos} />
      );
      expect(container.querySelector('[class*="sm:hidden"]')).toBeNull();
    });

    it("swipe hint disappears after the user first scrolls", () => {
      withScrollOverflow(() => {
        const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
        const { container } = render(
          <VideoRow title="Row" categorySlug="cat" videos={videos} />
        );
        // Hint is visible before any scroll
        expect(container.querySelector('[class*="sm:hidden"]')).not.toBeNull();

        // Simulate the user scrolling the row
        const region = container.querySelector("[role='region']")!;
        fireEvent.scroll(region);

        // Hint must be gone — hasScrolled is now true
        expect(container.querySelector('[class*="sm:hidden"]')).toBeNull();
      });
    });

    it("does not show swipe hint when hideHeader is true (hint lives in the header)", () => {
      withScrollOverflow(() => {
        const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
        const { container } = render(
          <VideoRow title="Row" categorySlug="cat" videos={videos} hideHeader />
        );
        expect(container.querySelector('[class*="sm:hidden"]')).toBeNull();
      });
    });
  });

  describe("sectionLabels — count badges", () => {
    it("renders firstCount in the first section's label badge", () => {
      const videos = [
        makeVideo({ id: "v1" }),
        makeVideo({ id: "v2" }),
        makeVideo({ id: "v3" }),
      ];
      const { container } = render(
        <VideoRow
          title="Row"
          videos={videos}
          sectionLabels={{
            firstLabel: "Continue Watching",
            firstCount: 2,
            secondLabel: "Latest",
            secondCount: 1,
            splitAt: 2,
          }}
        />
      );
      const h2Els = Array.from(container.querySelectorAll("h2"));
      const cwH2 = h2Els.find((h) => h.textContent?.includes("Continue Watching"));
      expect(cwH2).toBeDefined();
      // Count badge is the <span> inside the h2
      const countSpan = cwH2?.querySelector("span");
      expect(countSpan?.textContent).toBe("2");
    });

    it("renders secondCount in the second section's label badge", () => {
      const videos = [
        makeVideo({ id: "v1" }),
        makeVideo({ id: "v2" }),
        makeVideo({ id: "v3" }),
      ];
      const { container } = render(
        <VideoRow
          title="Row"
          videos={videos}
          sectionLabels={{
            firstLabel: "Continue Watching",
            firstCount: 2,
            secondLabel: "Latest",
            secondCount: 1,
            splitAt: 2,
          }}
        />
      );
      const h2Els = Array.from(container.querySelectorAll("h2"));
      const latestH2 = h2Els.find((h) => h.textContent?.includes("Latest"));
      expect(latestH2).toBeDefined();
      const countSpan = latestH2?.querySelector("span");
      expect(countSpan?.textContent).toBe("1");
    });

    it("count badge reflects secondCount even when it exceeds actual rendered video count (MAX_TOP_ROW cap)", () => {
      // Mirrors HomeContent behaviour: secondCount=15 shown even if only 1 video renders
      const videos = [makeVideo({ id: "cw1" }), makeVideo({ id: "latest1" })];
      const { container } = render(
        <VideoRow
          title="Row"
          videos={videos}
          sectionLabels={{
            firstLabel: "Continue Watching",
            firstCount: 1,
            secondLabel: "Latest",
            secondCount: 15,
            splitAt: 1,
          }}
        />
      );
      const h2Els = Array.from(container.querySelectorAll("h2"));
      const latestH2 = h2Els.find((h) => h.textContent?.includes("Latest"));
      const countSpan = latestH2?.querySelector("span");
      expect(countSpan?.textContent).toBe("15");
    });
  });

  describe("sectionLabels — orthogonal to hideHeader", () => {
    it("section labels still appear when hideHeader=true", () => {
      const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
      const { getByText } = render(
        <VideoRow
          title="Hidden Row Title"
          videos={videos}
          hideHeader={true}
          sectionLabels={{
            firstLabel: "Continue Watching",
            firstCount: 1,
            secondLabel: "Latest",
            secondCount: 1,
            splitAt: 1,
          }}
        />
      );
      // Section labels inside the scroll region are rendered independently of the top header
      expect(getByText("Continue Watching")).toBeTruthy();
      expect(getByText("Latest")).toBeTruthy();
    });

    it("top-level row title h2 is absent when hideHeader=true, even with sectionLabels", () => {
      const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
      const { queryByText } = render(
        <VideoRow
          title="Hidden Row Title"
          videos={videos}
          hideHeader={true}
          sectionLabels={{
            firstLabel: "Continue Watching",
            firstCount: 1,
            secondLabel: "Latest",
            secondCount: 1,
            splitAt: 1,
          }}
        />
      );
      // The title prop text must NOT appear as visible content (only in aria-label attr)
      expect(queryByText("Hidden Row Title")).toBeNull();
    });

    it("hideHeader=true + sectionLabels renders exactly 2 h2 elements (only section labels)", () => {
      const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
      const { container } = render(
        <VideoRow
          title="Hidden Row Title"
          videos={videos}
          hideHeader={true}
          sectionLabels={{
            firstLabel: "Continue Watching",
            firstCount: 1,
            secondLabel: "Latest",
            secondCount: 1,
            splitAt: 1,
          }}
        />
      );
      expect(container.querySelectorAll("h2").length).toBe(2);
    });

    it("hideHeader=false (default) + sectionLabels renders 3 h2 elements (top header + 2 section labels)", () => {
      const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
      const { container } = render(
        <VideoRow
          title="Row Title"
          videos={videos}
          sectionLabels={{
            firstLabel: "Continue Watching",
            firstCount: 1,
            secondLabel: "Latest",
            secondCount: 1,
            splitAt: 1,
          }}
        />
      );
      // 1 top-level h2 (row title) + 2 section label h2s = 3
      expect(container.querySelectorAll("h2").length).toBe(3);
    });

    it("renders a vertical divider element between the two sections when sectionLabels is provided", () => {
      const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
      const { container } = render(
        <VideoRow
          title="Row"
          videos={videos}
          sectionLabels={{
            firstLabel: "Continue Watching",
            firstCount: 1,
            secondLabel: "Latest",
            secondCount: 1,
            splitAt: 1,
          }}
        />
      );
      // The divider is a div with className "w-px bg-n7/50" between the two sections
      const divider = container.querySelector(".w-px");
      expect(divider).not.toBeNull();
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

  describe("top-level header count badge (totalCount ?? videos.length)", () => {
    it("shows videos.length in the count badge when totalCount is not provided", () => {
      const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" }), makeVideo({ id: "v3" })];
      const { container } = render(<VideoRow title="My Row" videos={videos} />);
      // The top-level h2 contains a <span> with the count value
      const h2 = container.querySelector("h2");
      expect(h2).not.toBeNull();
      const countSpan = h2!.querySelector("span");
      expect(countSpan?.textContent).toBe("3");
    });

    it("shows totalCount in the count badge when it exceeds the rendered video count", () => {
      // 3 videos rendered, but totalCount=10 (the full category size)
      const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" }), makeVideo({ id: "v3" })];
      const { container } = render(
        <VideoRow title="My Row" videos={videos} totalCount={10} />
      );
      const h2 = container.querySelector("h2");
      const countSpan = h2!.querySelector("span");
      // Badge must reflect totalCount (10), not videos.length (3)
      expect(countSpan?.textContent).toBe("10");
    });

    it("shows totalCount=1 when a single video is explicitly counted", () => {
      const videos = [makeVideo({ id: "v1" })];
      const { container } = render(
        <VideoRow title="My Row" videos={videos} totalCount={1} />
      );
      const h2 = container.querySelector("h2");
      const countSpan = h2!.querySelector("span");
      expect(countSpan?.textContent).toBe("1");
    });

    it("falls back to videos.length=1 when totalCount is undefined and only one video exists", () => {
      const videos = [makeVideo({ id: "v1" })];
      const { container } = render(<VideoRow title="My Row" videos={videos} />);
      const h2 = container.querySelector("h2");
      const countSpan = h2!.querySelector("span");
      expect(countSpan?.textContent).toBe("1");
    });

    it("count badge is absent from DOM when hideHeader=true", () => {
      const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
      const { container } = render(
        <VideoRow title="My Row" videos={videos} hideHeader />
      );
      // With hideHeader, the top-level h2 (with its count span) is not rendered
      // — the only h2 elements would be from sectionLabels (none provided here)
      const h2s = container.querySelectorAll("h2");
      expect(h2s).toHaveLength(0);
    });
  });

  describe("hideCategoryBadge — categorySlug propagation to VideoCard hideCategory", () => {
    // VideoRow derives hideCategoryBadge = !!categorySlug and passes it as
    // hideCategory to every VideoCard it renders. Category rows should suppress
    // the badge (all cards share the same category), while cross-category rows
    // (e.g. "You Might Also Like") should show it.

    it("hides category badge on VideoCards when categorySlug is provided", () => {
      // All videos have category "getting-started" → badge would say "Getting Started"
      const videos = [
        makeVideo({ id: "a", category: "getting-started" }),
        makeVideo({ id: "b", category: "getting-started" }),
      ];
      const { queryByText } = render(
        <VideoRow title="Getting Started" categorySlug="getting-started" videos={videos} />
      );
      // hideCategoryBadge=true → VideoCard renders with hideCategory={true} → no badge
      expect(queryByText("Getting Started", { selector: "span" })).toBeNull();
    });

    it("shows category badge on VideoCards when categorySlug is not provided", () => {
      // No categorySlug → hideCategoryBadge=false → badges are visible
      const videos = [
        makeVideo({ id: "a", category: "getting-started" }),
        makeVideo({ id: "b", category: "getting-started" }),
      ];
      const { getAllByText } = render(
        <VideoRow title="You Might Also Like" videos={videos} />
      );
      // The category title "Getting Started" should appear as a badge on each card
      const badges = getAllByText("Getting Started");
      expect(badges.length).toBeGreaterThanOrEqual(1);
    });

    it("section element has an empty id attribute when categorySlug is not provided", () => {
      const videos = [makeVideo({ id: "a" })];
      const { container } = render(<VideoRow title="Latest" videos={videos} />);
      const section = container.querySelector("section");
      // React does not render the id attribute when categorySlug is undefined.
      // jsdom reports element.id as "" when no id is set.
      expect(section?.id).toBe("");
    });

    it("hides category badges in both sectionLabels sections when categorySlug is provided", () => {
      // Scenario: a row with sectionLabels AND a categorySlug.
      // Both first-section and second-section cards should suppress their badges.
      const videos = [
        makeVideo({ id: "cw1", category: "getting-started" }),
        makeVideo({ id: "latest1", category: "getting-started" }),
      ];
      const { queryByText } = render(
        <VideoRow
          title="Getting Started"
          categorySlug="getting-started"
          videos={videos}
          sectionLabels={{
            firstLabel: "Continue Watching",
            firstCount: 1,
            secondLabel: "Latest",
            secondCount: 1,
            splitAt: 1,
          }}
        />
      );
      // hideCategoryBadge=true in both sections → no "Getting Started" span badges
      expect(queryByText("Getting Started", { selector: "span" })).toBeNull();
    });

    it("shows category badges in both sectionLabels sections when categorySlug is not provided", () => {
      // Scenario: the top "Continue Watching + Latest" merged row has no categorySlug.
      // Both sections should show category badges on their VideoCards.
      const videos = [
        makeVideo({ id: "cw1", category: "getting-started" }),
        makeVideo({ id: "latest1", category: "getting-started" }),
      ];
      const { getAllByText } = render(
        <VideoRow
          title="Latest"
          videos={videos}
          sectionLabels={{
            firstLabel: "Continue Watching",
            firstCount: 1,
            secondLabel: "Latest",
            secondCount: 1,
            splitAt: 1,
          }}
        />
      );
      // hideCategoryBadge=false → both sections' cards show "Getting Started"
      const badges = getAllByText("Getting Started");
      expect(badges.length).toBeGreaterThanOrEqual(2);
    });
  });
});
