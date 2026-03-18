import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import Header from "./Header";

/**
 * Header scroll-shadow behavior
 *
 * The Header tracks window.scrollY via a `scrolled` state that is set:
 *   1. Immediately on mount via an explicit `onScroll()` call inside useEffect
 *   2. On every subsequent window "scroll" event
 *
 * When `scrolled === true`, the header element gains an additional drop-shadow
 * class (`shadow-[0_2px_8px_rgba(0,0,0,0.12)]`).  The threshold is *strictly*
 * greater than 10px (`window.scrollY > 10`).
 *
 * We use the same Object.defineProperty pattern as ScrollToTop.test.tsx to
 * override the read-only jsdom `window.scrollY` property.
 */

function setScrollY(value: number) {
  Object.defineProperty(globalThis, "scrollY", {
    value,
    writable: true,
    configurable: true,
  });
}

describe("Header — scroll shadow behavior", () => {
  beforeEach(() => {
    setScrollY(0);
  });

  afterEach(() => {
    cleanup();
    setScrollY(0);
    vi.restoreAllMocks();
  });

  it("has no extra scroll shadow class when scrollY is 0 (initial state)", () => {
    const { container } = render(<Header />);
    const header = container.querySelector("header");
    expect(header?.className).not.toContain("shadow-[0_2px_8px");
  });

  it("gains the scroll shadow class after a window scroll event with scrollY = 15", () => {
    const { container } = render(<Header />);
    setScrollY(15);
    fireEvent.scroll(window);
    const header = container.querySelector("header");
    expect(header?.className).toContain("shadow-[0_2px_8px");
  });

  it("applies the scroll shadow immediately on mount when scrollY is already > 10 before render", () => {
    // Header's useEffect calls onScroll() immediately after adding the listener.
    // Setting scrollY > 10 before rendering means that call should set scrolled=true.
    setScrollY(50);
    const { container } = render(<Header />);
    const header = container.querySelector("header");
    expect(header?.className).toContain("shadow-[0_2px_8px");
  });

  it("removes the scroll shadow class when scrolled back to ≤ 10px", () => {
    const { container } = render(<Header />);

    // Scroll past threshold — shadow appears
    setScrollY(200);
    fireEvent.scroll(window);
    expect(container.querySelector("header")?.className).toContain("shadow-[0_2px_8px");

    // Scroll back below threshold — shadow disappears
    setScrollY(8);
    fireEvent.scroll(window);
    expect(container.querySelector("header")?.className).not.toContain("shadow-[0_2px_8px");
  });

  it("does NOT gain scroll shadow at exactly scrollY = 10 (condition is strictly > 10, not >=)", () => {
    const { container } = render(<Header />);
    setScrollY(10);
    fireEvent.scroll(window);
    expect(container.querySelector("header")?.className).not.toContain("shadow-[0_2px_8px");
  });

  it("gains scroll shadow at exactly scrollY = 11 (first value strictly above the threshold)", () => {
    const { container } = render(<Header />);
    setScrollY(11);
    fireEvent.scroll(window);
    expect(container.querySelector("header")?.className).toContain("shadow-[0_2px_8px");
  });
});

describe("Header — scroll listener cleanup on unmount", () => {
  beforeEach(() => {
    setScrollY(0);
  });

  afterEach(() => {
    cleanup();
    setScrollY(0);
    vi.restoreAllMocks();
  });

  it("removes the scroll event listener from window when the Header unmounts", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<Header />);
    unmount();
    const scrollCalls = removeSpy.mock.calls.filter(([event]) => event === "scroll");
    expect(scrollCalls.length).toBeGreaterThanOrEqual(1);
  });
});
