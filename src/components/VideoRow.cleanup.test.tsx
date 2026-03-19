/**
 * VideoRow — effect cleanup tests (ResizeObserver + scroll listener +
 * IntersectionObserver reveal effect).
 *
 * VideoRow's scroll-state effect creates two resources that must be cleaned up:
 *   1. el.addEventListener("scroll", handleScroll, { passive: true })
 *      → cleaned up via: el.removeEventListener("scroll", handleScroll)
 *   2. const ro = new ResizeObserver(updateScrollState); ro.observe(el)
 *      → cleaned up via: ro.disconnect()
 *
 * VideoRow's lazy-reveal effect creates one more:
 *   3. const observer = new IntersectionObserver(cb, { rootMargin: "400px" });
 *      observer.observe(el)
 *      → cleaned up via: return () => observer.disconnect()
 *      (also called inside the callback if entry.isIntersecting is true)
 *
 * These tests verify that all three cleanup calls fire correctly when VideoRow
 * unmounts, ensuring there are no memory leaks in production.
 *
 * Kept in a separate file to isolate the spy setup from the main VideoRow suite.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import VideoRow from "./VideoRow";
import { makeVideo } from "@/__tests__/factories";

describe("VideoRow — effect cleanup on unmount", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  // ── ResizeObserver.disconnect() ─────────────────────────────────────────────

  it("calls ResizeObserver.disconnect() when VideoRow unmounts", () => {
    // setup.tsx assigns globalThis.ResizeObserver = MockResizeObserver (writable).
    // Spy on its prototype so every instance's disconnect() call is tracked.
    const disconnectSpy = vi.spyOn(
      globalThis.ResizeObserver.prototype as { disconnect: () => void },
      "disconnect"
    );

    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
    const { unmount } = render(<VideoRow title="Row" videos={videos} />);

    // Clear any disconnect() calls from initial render / IntersectionObserver reveal.
    disconnectSpy.mockClear();

    unmount();

    // The scroll-state effect cleanup fires: ro.disconnect() must have been called.
    expect(disconnectSpy).toHaveBeenCalled();

    disconnectSpy.mockRestore();
  });

  // ── scroll event listener removeEventListener ────────────────────────────────

  it("calls removeEventListener('scroll') when VideoRow unmounts", () => {
    // Spy on HTMLElement.prototype.removeEventListener to intercept the scroll
    // listener removal that fires in the scroll-state effect cleanup.
    const removeListenerSpy = vi.spyOn(
      HTMLElement.prototype,
      "removeEventListener"
    );

    const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
    const { unmount } = render(<VideoRow title="Row" videos={videos} />);

    // Clear any removeEventListener calls from initial render.
    removeListenerSpy.mockClear();

    unmount();

    // Filter for "scroll" event removal specifically — this confirms
    // el.removeEventListener("scroll", handleScroll) ran in the cleanup.
    const scrollRemovals = removeListenerSpy.mock.calls.filter(
      ([event]) => event === "scroll"
    );
    expect(scrollRemovals.length).toBeGreaterThan(0);

    removeListenerSpy.mockRestore();
  });

  // ── IntersectionObserver.disconnect() (reveal effect cleanup) ────────────────

  it("calls IntersectionObserver.disconnect() when VideoRow unmounts", () => {
    // Replace IntersectionObserver with a non-firing mock so the component
    // stays in skeleton state (isRevealed stays false). This ensures the
    // reveal callback never fires and the ONLY disconnect() call we observe
    // comes from the reveal effect's cleanup on unmount.
    const disconnectSpy = vi.fn();
    const originalIO = globalThis.IntersectionObserver;

    // Using a class field so all instances share the same spy reference.
    class NonFiringIO {
      observe() { /* never fires */ }
      unobserve() { /* no-op */ }
      disconnect = disconnectSpy;
    }
    globalThis.IntersectionObserver = NonFiringIO as unknown as typeof IntersectionObserver;

    try {
      const videos = [makeVideo({ id: "v1" })];
      const { unmount } = render(<VideoRow title="Row" videos={videos} />);

      // The effect has run once (observe was called), but the callback never fired
      // (non-firing mock). disconnectSpy should have 0 calls so far.
      expect(disconnectSpy).not.toHaveBeenCalled();

      unmount();

      // The reveal effect cleanup: `return () => observer.disconnect()` fires.
      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    } finally {
      globalThis.IntersectionObserver = originalIO;
    }
  });

  // ── Early-return guard: no throw when unmounted before reveal ────────────────

  it("does not throw when unmounted before the IntersectionObserver reveal fires", () => {
    // If VideoRow is unmounted before isRevealed becomes true, the scroll-state
    // effect will have returned early (`if (!el) return;`) because the scroll
    // container `<div>` is not yet in the DOM. The effect cleanup is undefined
    // for that run. This test confirms the component handles null scrollRef
    // gracefully and does not throw.
    const originalIO = globalThis.IntersectionObserver;

    class NonFiringIO {
      observe() { /* never fires */ }
      unobserve() { /* no-op */ }
      disconnect() { /* no-op */ }
    }
    globalThis.IntersectionObserver = NonFiringIO as unknown as typeof IntersectionObserver;

    try {
      const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];
      const { unmount } = render(<VideoRow title="Row" videos={videos} />);
      expect(() => unmount()).not.toThrow();
    } finally {
      globalThis.IntersectionObserver = originalIO;
    }
  });
});
