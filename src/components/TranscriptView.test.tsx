import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TranscriptView from "./TranscriptView";
import type { TranscriptSegment, TranscriptChapter } from "@/types";

const segments: TranscriptSegment[] = [
  { text: "Welcome to the video", offset: 0, duration: 5000 },
  { text: "Let's talk about code quality", offset: 5000, duration: 4000 },
  { text: "Here is a demo", offset: 9000, duration: 6000 },
  { text: "Thanks for watching", offset: 15000, duration: 3000 },
];

// ---------------------------------------------------------------------------
// Empty segments edge cases
// ---------------------------------------------------------------------------

describe("TranscriptView — empty segments", () => {
  it("renders without error when segments array is empty and no chapters", () => {
    // Should render the flat-list container div without crashing
    const { container } = render(<TranscriptView segments={[]} />);
    // The outer container div should exist (not null)
    expect(container.firstChild).not.toBeNull();
    // No segment buttons should exist
    expect(container.querySelectorAll("button").length).toBe(0);
  });

  it("renders chapter headings with no segment rows when segments is empty but chapters provided", () => {
    const chapters: TranscriptChapter[] = [
      { title: "Introduction", startIndex: 0 },
      { title: "Main Content", startIndex: 0 }, // both start at 0 since no segments
    ];
    const { getByText } = render(<TranscriptView segments={[]} chapters={chapters} />);
    // Chapter headings should still render even with empty segments
    expect(getByText("Introduction")).toBeTruthy();
    expect(getByText("Main Content")).toBeTruthy();
  });

  it("chapter heading startTime falls back to 0 when segments is empty", () => {
    // segments[start]?.offset ?? 0 — optional chain returns undefined → falls back to 0
    const chapters: TranscriptChapter[] = [
      { title: "Only Chapter", startIndex: 0 },
    ];
    render(<TranscriptView segments={[]} chapters={chapters} />);
    // The chapter heading timestamp should show "0:00"
    const timestamps = document.querySelectorAll(".font-mono");
    const hasZeroTimestamp = Array.from(timestamps).some(
      (el) => el.textContent === "0:00"
    );
    expect(hasZeroTimestamp).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// formatTime — timestamps ≥ 60 seconds
// ---------------------------------------------------------------------------

describe("TranscriptView — formatTime ≥ 60 seconds", () => {
  it("renders '1:00' for a segment with offset 60000ms", () => {
    const longSegments: TranscriptSegment[] = [
      { text: "First segment", offset: 0, duration: 60000 },
      { text: "At one minute", offset: 60000, duration: 5000 },
    ];
    render(<TranscriptView segments={longSegments} />);
    expect(screen.getByText("1:00")).toBeTruthy();
  });

  it("renders '1:05' for a segment with offset 65000ms", () => {
    const longSegments: TranscriptSegment[] = [
      { text: "Short intro", offset: 0, duration: 65000 },
      { text: "One minute five", offset: 65000, duration: 5000 },
    ];
    render(<TranscriptView segments={longSegments} />);
    expect(screen.getByText("1:05")).toBeTruthy();
  });

  it("renders '10:00' for a segment with offset 600000ms", () => {
    const longSegments: TranscriptSegment[] = [
      { text: "First part", offset: 0, duration: 600000 },
      { text: "Ten minute mark", offset: 600000, duration: 5000 },
    ];
    render(<TranscriptView segments={longSegments} />);
    expect(screen.getByText("10:00")).toBeTruthy();
  });

  it("renders '1:01' for a segment with offset 61000ms (pads seconds)", () => {
    const longSegments: TranscriptSegment[] = [
      { text: "Intro", offset: 0, duration: 61000 },
      { text: "One minute one second", offset: 61000, duration: 3000 },
    ];
    render(<TranscriptView segments={longSegments} />);
    expect(screen.getByText("1:01")).toBeTruthy();
  });

  it("dispatches yt-seek in seconds for a long offset segment", () => {
    const handler = vi.fn();
    globalThis.addEventListener("yt-seek", handler);

    const longSegments: TranscriptSegment[] = [
      { text: "Short intro", offset: 0, duration: 65000 },
      { text: "One minute five", offset: 65000, duration: 5000 },
    ];
    render(<TranscriptView segments={longSegments} />);
    fireEvent.click(screen.getByText("One minute five"));

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<number>;
    expect(event.detail).toBe(65); // 65000ms → 65 seconds

    globalThis.removeEventListener("yt-seek", handler);
  });

  it("renders chapter heading timestamp for a chapter starting at a long offset", () => {
    const longSegments: TranscriptSegment[] = [
      { text: "Intro text", offset: 0, duration: 60000 },
      { text: "Main content", offset: 60000, duration: 10000 },
      { text: "More content", offset: 70000, duration: 10000 },
    ];
    const chapters: TranscriptChapter[] = [
      { title: "Main Section", startIndex: 1 },
    ];
    render(<TranscriptView segments={longSegments} chapters={chapters} />);
    // Chapter heading shows 1:00; the segment at offset 60000ms also shows 1:00,
    // so multiple elements with this text are expected — verify at least one exists.
    expect(screen.getAllByText("1:00").length).toBeGreaterThan(0);
    expect(screen.getByText("Main Section")).toBeTruthy();
  });
});

describe("TranscriptView", () => {
  it("renders all segment timestamps and text", () => {
    render(<TranscriptView segments={segments} />);
    expect(screen.getByText("0:00")).toBeTruthy();
    expect(screen.getByText("Welcome to the video")).toBeTruthy();
    expect(screen.getByText("0:05")).toBeTruthy();
    expect(screen.getByText("Let's talk about code quality")).toBeTruthy();
    expect(screen.getByText("0:09")).toBeTruthy();
    expect(screen.getByText("0:15")).toBeTruthy();
  });

  it("dispatches yt-seek with seconds when clicking a row", () => {
    const handler = vi.fn();
    globalThis.addEventListener("yt-seek", handler);

    render(<TranscriptView segments={segments} />);
    // Click on the text portion of the second row
    fireEvent.click(screen.getByText("Let's talk about code quality"));

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<number>;
    expect(event.detail).toBe(5); // 5000ms -> 5 seconds

    globalThis.removeEventListener("yt-seek", handler);
  });

  it("dispatches yt-seek when clicking the timestamp", () => {
    const handler = vi.fn();
    globalThis.addEventListener("yt-seek", handler);

    render(<TranscriptView segments={segments} />);
    fireEvent.click(screen.getByText("0:09"));

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<number>;
    expect(event.detail).toBe(9); // 9000ms -> 9 seconds

    globalThis.removeEventListener("yt-seek", handler);
  });

  it("highlights the active segment when yt-time event fires", () => {
    // jsdom lacks scrollTo
    Element.prototype.scrollTo = vi.fn();

    render(<TranscriptView segments={segments} />);

    // Simulate video playing at 6 seconds (6000ms) — second segment is active
    fireEvent(globalThis, new CustomEvent("yt-time", { detail: 6000 }));

    const activeRow = screen.getByText("Let's talk about code quality").closest("button");
    expect(activeRow?.className).toContain("bg-qube-blue/20");

    const inactiveRow = screen.getByText("Welcome to the video").closest("button");
    expect(inactiveRow?.className).not.toContain("bg-qube-blue/20");
  });

  it("renders chapter headings when chapters are provided", () => {
    const chapters: TranscriptChapter[] = [
      { title: "Getting Started", startIndex: 0 },
      { title: "Demo Section", startIndex: 2 },
    ];

    render(<TranscriptView segments={segments} chapters={chapters} />);
    expect(screen.getByText("Getting Started")).toBeTruthy();
    expect(screen.getByText("Demo Section")).toBeTruthy();
  });

  it("dispatches yt-seek when clicking a chapter heading", () => {
    const handler = vi.fn();
    globalThis.addEventListener("yt-seek", handler);

    const chapters: TranscriptChapter[] = [
      { title: "Getting Started", startIndex: 0 },
      { title: "Demo Section", startIndex: 2 },
    ];

    render(<TranscriptView segments={segments} chapters={chapters} />);
    fireEvent.click(screen.getByText("Demo Section"));

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<number>;
    expect(event.detail).toBe(9); // segment[2].offset = 9000ms -> 9s

    globalThis.removeEventListener("yt-seek", handler);
  });
});

// ---------------------------------------------------------------------------
// Introduction group (chapters[0].startIndex > 0)
// ---------------------------------------------------------------------------

describe("TranscriptView — Introduction group", () => {
  it("inserts an Introduction group when the first chapter does not start at index 0", () => {
    const chapters: TranscriptChapter[] = [
      { title: "Main Content", startIndex: 1 },
    ];
    render(<TranscriptView segments={segments} chapters={chapters} />);
    expect(screen.getByText("Introduction")).toBeTruthy();
    expect(screen.getByText("Main Content")).toBeTruthy();
  });

  it("does NOT insert an Introduction group when the first chapter starts at index 0", () => {
    const chapters: TranscriptChapter[] = [
      { title: "Getting Started", startIndex: 0 },
    ];
    render(<TranscriptView segments={segments} chapters={chapters} />);
    expect(screen.queryByText("Introduction")).toBeNull();
    expect(screen.getByText("Getting Started")).toBeTruthy();
  });

  it("Introduction group contains only the segments before the first chapter", () => {
    // chapters[0] starts at index 2 → Introduction contains segments[0] and segments[1]
    const chapters: TranscriptChapter[] = [
      { title: "Main Content", startIndex: 2 },
    ];
    render(<TranscriptView segments={segments} chapters={chapters} />);
    // Both pre-chapter segments should be visible
    expect(screen.getByText("Welcome to the video")).toBeTruthy();
    expect(screen.getByText("Let's talk about code quality")).toBeTruthy();
  });

  it("dispatches yt-seek at the first segment offset when the Introduction heading is clicked", () => {
    const handler = vi.fn();
    globalThis.addEventListener("yt-seek", handler);

    const chapters: TranscriptChapter[] = [
      { title: "Main Content", startIndex: 2 },
    ];
    render(<TranscriptView segments={segments} chapters={chapters} />);
    fireEvent.click(screen.getByText("Introduction"));

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<number>;
    expect(event.detail).toBe(0); // segments[0].offset = 0ms → 0s

    globalThis.removeEventListener("yt-seek", handler);
  });
});

// ---------------------------------------------------------------------------
// Chapter layout — active segment highlighting
// ---------------------------------------------------------------------------

describe("TranscriptView — chapter layout active highlighting", () => {
  it("highlights the active segment within a chapter group via yt-time", () => {
    Element.prototype.scrollTo = vi.fn();

    const chapters: TranscriptChapter[] = [
      { title: "Getting Started", startIndex: 0 },
      { title: "Demo Section", startIndex: 2 },
    ];
    render(<TranscriptView segments={segments} chapters={chapters} />);

    // 10000ms = 10s — falls inside segment[2] (offset: 9000, duration: 6000)
    fireEvent(globalThis, new CustomEvent("yt-time", { detail: 10000 }));

    const activeRow = screen.getByText("Here is a demo").closest("button");
    expect(activeRow?.className).toContain("bg-qube-blue/20");

    const inactiveRow = screen.getByText("Welcome to the video").closest("button");
    expect(inactiveRow?.className).not.toContain("bg-qube-blue/20");
  });
});

// ---------------------------------------------------------------------------
// Auto-scroll paused indicator
// ---------------------------------------------------------------------------

describe("TranscriptView — auto-scroll paused indicator", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Element.prototype.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows 'Auto-scroll paused' after user scrolls during active playback", () => {
    const { container } = render(<TranscriptView segments={segments} />);

    // Activate a segment so activeOffset >= 0
    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 6000 }));
    });

    // Advance past the 500ms programmatic-scroll guard set by the auto-scroll effect
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Simulate user manually scrolling the transcript container
    const scrollContainer = container.querySelector('[class*="overflow-y-auto"]');
    fireEvent.scroll(scrollContainer!);

    expect(screen.getByText("Auto-scroll paused")).toBeTruthy();
  });

  it("hides 'Auto-scroll paused' when the resume button is clicked", () => {
    const { container } = render(<TranscriptView segments={segments} />);

    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 6000 }));
    });
    act(() => {
      vi.advanceTimersByTime(600);
    });

    const scrollContainer = container.querySelector('[class*="overflow-y-auto"]');
    fireEvent.scroll(scrollContainer!);

    expect(screen.getByText("Auto-scroll paused")).toBeTruthy();

    fireEvent.click(screen.getByText("Auto-scroll paused"));

    expect(screen.queryByText("Auto-scroll paused")).toBeNull();
  });

  it("'Auto-scroll paused' auto-dismisses after 5 seconds of no interaction", () => {
    const { container } = render(<TranscriptView segments={segments} />);

    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 6000 }));
    });
    act(() => {
      vi.advanceTimersByTime(600);
    });

    const scrollContainer = container.querySelector('[class*="overflow-y-auto"]');
    fireEvent.scroll(scrollContainer!);

    expect(screen.getByText("Auto-scroll paused")).toBeTruthy();

    // Advance past the 5-second auto-dismiss timeout
    act(() => {
      vi.advanceTimersByTime(5100);
    });

    expect(screen.queryByText("Auto-scroll paused")).toBeNull();
  });

  it("does NOT show paused indicator when user scrolls but no segment is active (activeOffset=-1)", () => {
    // No yt-time event fired → activeOffset stays -1.
    // Even if isPaused becomes true from the scroll, the guard
    // `isPaused && activeOffset >= 0` keeps the indicator hidden.
    const { container } = render(<TranscriptView segments={segments} />);

    const scrollContainer = container.querySelector('[class*="overflow-y-auto"]');
    fireEvent.scroll(scrollContainer!);

    expect(screen.queryByText("Auto-scroll paused")).toBeNull();
  });

  it("programmatic auto-scroll does NOT trigger the paused indicator", () => {
    // When activeOffset changes, the auto-scroll effect fires:
    //   programmaticScrollRef.current = true → scrollTo() → setTimeout(reset, 500)
    // A scroll event fired BEFORE the 500ms reset should be swallowed by
    // `if (programmaticScrollRef.current) return` in handleScroll.
    const { container } = render(<TranscriptView segments={segments} />);

    // Activate segment 1 (offset=5000ms is within 5000–8999ms)
    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 6000 }));
    });
    // Do NOT advance time — programmaticScrollRef is still true here.

    const scrollContainer = container.querySelector('[class*="overflow-y-auto"]');
    fireEvent.scroll(scrollContainer!);

    // Scroll was blocked by programmatic guard → isPaused stays false → no indicator
    expect(screen.queryByText("Auto-scroll paused")).toBeNull();
  });

  it("paused indicator disappears when active segment ends and activeOffset falls to -1", () => {
    // Confirm the guard holds even when isPaused is already true but there is
    // suddenly no active segment (time jumps past all segments).
    const { container } = render(<TranscriptView segments={segments} />);

    // Step 1: activate a segment
    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 6000 }));
    });
    // Step 2: clear the programmatic-scroll guard
    act(() => {
      vi.advanceTimersByTime(600);
    });
    // Step 3: user scrolls → isPaused = true, indicator visible
    const scrollContainer = container.querySelector('[class*="overflow-y-auto"]');
    fireEvent.scroll(scrollContainer!);
    expect(screen.getByText("Auto-scroll paused")).toBeTruthy();

    // Step 4: time advances past all segments (last ends at 18000ms)
    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 20000 }));
    });

    // activeOffset is now -1 → indicator should disappear despite isPaused still being true
    expect(screen.queryByText("Auto-scroll paused")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Listener and timer cleanup on unmount
// ---------------------------------------------------------------------------

describe("TranscriptView — listener and timer cleanup on unmount", () => {
  beforeEach(() => {
    Element.prototype.scrollTo = vi.fn();
  });

  it("calls globalThis.removeEventListener('yt-time', ...) when unmounted", () => {
    const removeSpy = vi.spyOn(globalThis, "removeEventListener");

    const { unmount } = render(<TranscriptView segments={segments} />);
    unmount();

    // The yt-time listener registered in useActiveSegment must be cleaned up
    const ytTimeRemovals = removeSpy.mock.calls.filter(([event]) => event === "yt-time");
    expect(ytTimeRemovals.length).toBeGreaterThan(0);

    removeSpy.mockRestore();
  });

  it("dispatching yt-time after unmount does not throw or cause errors", () => {
    const { unmount } = render(<TranscriptView segments={segments} />);

    // Confirm the listener is active before unmount
    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 6000 }));
    });

    unmount();

    // After unmount, dispatching yt-time must be a safe no-op
    expect(() => {
      act(() => {
        fireEvent(globalThis, new CustomEvent("yt-time", { detail: 9000 }));
      });
    }).not.toThrow();
  });

  it("clears the auto-resume timeout when unmounting during an active pause", () => {
    vi.useFakeTimers();

    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    const { container, unmount } = render(<TranscriptView segments={segments} />);

    // Activate a segment so activeOffset >= 0
    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 6000 }));
    });
    // Advance past the 500ms programmatic-scroll guard set by the auto-scroll effect
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Simulate user scroll — starts the 5s auto-resume timeout
    const scrollContainer = container.querySelector('[class*="overflow-y-auto"]')!;
    fireEvent.scroll(scrollContainer);

    clearTimeoutSpy.mockClear(); // reset: only count clearTimeout calls during unmount

    unmount();

    // useAutoScroll cleanup calls clearTimeout(timeoutRef.current) to cancel the 5s timer
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
    vi.useRealTimers();
  });

  it("scrollTo is NOT invoked after unmount when yt-time fires post-unmount", () => {
    const scrollToMock = vi.fn();
    Element.prototype.scrollTo = scrollToMock;

    const { unmount } = render(<TranscriptView segments={segments} />);

    // Activate a segment so the auto-scroll effect is primed
    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 6000 }));
    });

    unmount();

    const callsBefore = scrollToMock.mock.calls.length;

    // Dispatch yt-time after unmount — must NOT trigger new scrollTo calls
    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 9000 }));
    });

    expect(scrollToMock.mock.calls.length).toBe(callsBefore);
  });
});

// ---------------------------------------------------------------------------
// useActiveSegment exact boundary conditions
//
// The active-segment lookup uses:
//   currentTimeMs >= seg.offset && currentTimeMs < seg.offset + seg.duration
//
// Key invariants:
//   - "currentTimeMs >= 0" guard means negative time → activeOffset = -1
//   - The upper bound is STRICT (<), so exactly at offset+duration → NOT active
//   - The next segment becomes active at its exact offset (>=)
//   - A time in a gap between non-contiguous segments → no segment active
// ---------------------------------------------------------------------------

describe("TranscriptView — useActiveSegment exact boundary conditions", () => {
  beforeEach(() => {
    Element.prototype.scrollTo = vi.fn();
  });

  it("first segment (offset=0) is active when yt-time fires with detail=0ms", () => {
    // condition: 0 >= 0 (currentTimeMs guard passes) AND 0 >= 0 AND 0 < 0+5000 → active
    render(<TranscriptView segments={segments} />);

    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 0 }));
    });

    const firstRow = screen.getByText("Welcome to the video").closest("button");
    expect(firstRow?.className).toContain("bg-qube-blue/20");

    const secondRow = screen.getByText("Let's talk about code quality").closest("button");
    expect(secondRow?.className).not.toContain("bg-qube-blue/20");
  });

  it("first segment still active at time=4999ms (just inside upper bound offset+duration=5000ms)", () => {
    // 4999 >= 0 (true) AND 4999 >= 0 AND 4999 < 5000 (true) → active
    render(<TranscriptView segments={segments} />);

    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 4999 }));
    });

    const firstRow = screen.getByText("Welcome to the video").closest("button");
    expect(firstRow?.className).toContain("bg-qube-blue/20");

    const secondRow = screen.getByText("Let's talk about code quality").closest("button");
    expect(secondRow?.className).not.toContain("bg-qube-blue/20");
  });

  it("second segment becomes active at time=5000ms (its exact offset); first segment inactive", () => {
    // First segment:  5000 >= 0 AND 5000 < 0+5000=5000 → FALSE (strict <)
    // Second segment: 5000 >= 5000 AND 5000 < 5000+4000=9000 → TRUE
    render(<TranscriptView segments={segments} />);

    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 5000 }));
    });

    const firstRow = screen.getByText("Welcome to the video").closest("button");
    expect(firstRow?.className).not.toContain("bg-qube-blue/20");

    const secondRow = screen.getByText("Let's talk about code quality").closest("button");
    expect(secondRow?.className).toContain("bg-qube-blue/20");
  });

  it("last segment is NOT active at time=18000ms (exactly at offset+duration = 15000+3000)", () => {
    // Last segment: 18000 >= 15000 (true) AND 18000 < 15000+3000=18000 → FALSE (strict <)
    // No other segment covers 18000ms → activeOffset = -1 → no highlight
    render(<TranscriptView segments={segments} />);

    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 18000 }));
    });

    // None of the four segments should be highlighted
    (
      [
        "Welcome to the video",
        "Let's talk about code quality",
        "Here is a demo",
        "Thanks for watching",
      ] as const
    ).forEach((text) => {
      const row = screen.getByText(text).closest("button");
      expect(row?.className).not.toContain("bg-qube-blue/20");
    });
  });

  it("no segment is active when yt-time fires with a negative detail value", () => {
    // currentTimeMs = -5000 → currentTimeMs >= 0 is FALSE → activeOffset = -1
    render(<TranscriptView segments={segments} />);

    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: -5000 }));
    });

    (
      [
        "Welcome to the video",
        "Let's talk about code quality",
        "Here is a demo",
        "Thanks for watching",
      ] as const
    ).forEach((text) => {
      const row = screen.getByText(text).closest("button");
      expect(row?.className).not.toContain("bg-qube-blue/20");
    });
  });

  it("no segment is active when time falls in a gap between two non-contiguous segments", () => {
    // seg1: offset=0, duration=5000 → active [0, 5000)
    // seg2: offset=6000, duration=5000 → active [6000, 11000)
    // Gap: [5000, 6000) — at t=5500, neither segment's condition is satisfied
    const gappedSegments: TranscriptSegment[] = [
      { text: "First segment", offset: 0, duration: 5000 },
      { text: "Second segment", offset: 6000, duration: 5000 },
    ];
    render(<TranscriptView segments={gappedSegments} />);

    act(() => {
      fireEvent(globalThis, new CustomEvent("yt-time", { detail: 5500 }));
    });

    const firstRow = screen.getByText("First segment").closest("button");
    expect(firstRow?.className).not.toContain("bg-qube-blue/20");

    const secondRow = screen.getByText("Second segment").closest("button");
    expect(secondRow?.className).not.toContain("bg-qube-blue/20");
  });
});
