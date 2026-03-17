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
});
