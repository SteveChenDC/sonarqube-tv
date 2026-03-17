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
});
