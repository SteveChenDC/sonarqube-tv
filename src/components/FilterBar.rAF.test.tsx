/**
 * FilterBar — rAF cancellation + fallback unmount timeout
 *
 * Isolated from FilterBar.test.tsx so fake-timer setup doesn't bleed into
 * the main suite which uses real timers.
 *
 * The animation-guard code added in fix(FilterBar) introduces:
 *   1. A 250ms fallback `setTimeout` (isOpen→false) that unmounts the modal
 *      even if `transitionend` never fires (e.g. rapid open/close before CSS
 *      transition has a chance to start).
 *   2. A `cancelled` flag + `cancelAnimationFrame` calls that prevent stale
 *      `setVisible(true)` from firing if the effect cleanup runs before the
 *      double rAF completes.
 *   3. Effect cleanup cancels the fallback timer when isOpen flips back to
 *      true, preventing a spurious unmount.
 *
 * Coverage:
 *   - Fallback timer fires at 250ms → modal unmounts without transitionend
 *   - At 249ms modal is still mounted (off-by-one boundary)
 *   - Re-opening before 250ms cancels the timer (no spurious unmount)
 *   - cancelAnimationFrame is called when component unmounts mid-animation
 *   - cancelled flag blocks stale setVisible(true) after rapid open→close
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import FilterBar from "./FilterBar";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/** Minimal valid props for FilterBar */
function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    uploadDate: "anytime" as const,
    duration: "any" as const,
    sortBy: "newest" as const,
    onUploadDateChange: vi.fn(),
    onDurationChange: vi.fn(),
    onSortByChange: vi.fn(),
    onReset: vi.fn(),
    hasActiveFilters: false,
    isOpen: true,
    onOpenChange: vi.fn(),
    ...overrides,
  };
}

// ─── Fallback 250ms unmount timeout ──────────────────────────────────────────

describe("FilterBar — fallback 250ms unmount timeout", () => {
  it("modal unmounts after 250ms even when transitionend never fires", () => {
    vi.useFakeTimers();
    const props = makeProps({ isOpen: true });
    const { rerender } = render(<FilterBar {...props} />);

    // Confirm modal is in the DOM after open
    expect(document.querySelector("[role='dialog']")).not.toBeNull();

    // Close the modal — starts the 250ms fallback timer
    act(() => {
      rerender(<FilterBar {...props} isOpen={false} />);
    });

    // Modal is still mounted (exit animation in progress, transitionend hasn't fired)
    expect(document.querySelector("[role='dialog']")).not.toBeNull();

    // Advance exactly to the 250ms threshold
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Modal should now be unmounted by the fallback timer
    expect(document.querySelector("[role='dialog']")).toBeNull();
  });

  it("modal is still mounted at 249ms — fallback has not fired yet", () => {
    vi.useFakeTimers();
    const props = makeProps({ isOpen: true });
    const { rerender } = render(<FilterBar {...props} />);

    act(() => {
      rerender(<FilterBar {...props} isOpen={false} />);
    });

    // 1ms before the fallback fires
    act(() => {
      vi.advanceTimersByTime(249);
    });

    // Should still be mounted
    expect(document.querySelector("[role='dialog']")).not.toBeNull();
  });

  it("fallback timer is cancelled on re-open — no spurious unmount after 250ms", () => {
    vi.useFakeTimers();
    const props = makeProps({ isOpen: true });
    const { rerender } = render(<FilterBar {...props} />);

    // Close the modal — starts the 250ms fallback timer
    act(() => {
      rerender(<FilterBar {...props} isOpen={false} />);
    });

    // Re-open before the timer fires — effect cleanup cancels the timer
    act(() => {
      rerender(<FilterBar {...props} isOpen={true} />);
    });

    // Advance well past 250ms — the cancelled timer must NOT unmount the modal
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Modal is still present because re-open cancelled the fallback timer
    expect(document.querySelector("[role='dialog']")).not.toBeNull();
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });
});

// ─── cancelAnimationFrame called on cleanup ──────────────────────────────────

describe("FilterBar — cancelAnimationFrame on cleanup", () => {
  it("cancelAnimationFrame is called when component unmounts while open (rAFs still pending)", () => {
    vi.useFakeTimers();
    const cancelSpy = vi.spyOn(globalThis, "cancelAnimationFrame");

    const props = makeProps({ isOpen: true });
    const { unmount } = render(<FilterBar {...props} />);

    // rAFs are scheduled but not yet executed (fake timers)
    // Unmounting triggers effect cleanup which must call cancelAnimationFrame
    act(() => {
      unmount();
    });

    // raf1 was assigned a real id; cleanup checks `if (raf1 !== null)` → calls cancel
    expect(cancelSpy).toHaveBeenCalled();
  });

  it("cancelAnimationFrame is called when isOpen flips false before rAFs fire", () => {
    vi.useFakeTimers();
    const cancelSpy = vi.spyOn(globalThis, "cancelAnimationFrame");

    const props = makeProps({ isOpen: true });
    const { rerender } = render(<FilterBar {...props} />);

    // Close before double rAF fires — cleanup of the isOpen=true effect runs
    act(() => {
      rerender(<FilterBar {...props} isOpen={false} />);
    });

    // raf1 was assigned before the close; cleanup must cancel it
    expect(cancelSpy).toHaveBeenCalled();
  });
});

// ─── cancelled flag prevents stale setVisible(true) ─────────────────────────

describe("FilterBar — cancelled flag blocks stale setVisible after rapid open→close", () => {
  it("dialog stays in 'not visible' state when closed before double rAF fires", () => {
    vi.useFakeTimers();

    // Start closed
    const props = makeProps({ isOpen: false });
    const { rerender } = render(<FilterBar {...props} />);

    // Open → schedules double rAF for setVisible(true)
    act(() => {
      rerender(<FilterBar {...props} isOpen={true} />);
    });

    // Immediately close → effect cleanup sets cancelled=true, cancels raf1
    act(() => {
      rerender(<FilterBar {...props} isOpen={false} />);
    });

    // Now advance time enough to cover the double rAF (2 × 16ms) — these
    // are cancelled/no-op so setVisible(true) must NOT have fired.
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Dialog may still be mounted (from the isOpen=true phase) but must NOT
    // be in the visible/opaque state; if present, it should have the hidden class.
    const dialog = document.querySelector("[role='dialog']");
    if (dialog) {
      // visible=false → backdrop uses transparent class
      expect(dialog.className).toContain("bg-black/0");
      expect(dialog.className).not.toContain("bg-black/60");
    }
    // Whether mounted or not, the dialog must NOT show the opaque backdrop
    expect(document.querySelector(".bg-black\\/60")).toBeNull();
  });
});
