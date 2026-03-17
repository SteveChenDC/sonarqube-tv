import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import VideoRow from "./VideoRow";
import { makeVideo } from "@/__tests__/factories";

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
});
