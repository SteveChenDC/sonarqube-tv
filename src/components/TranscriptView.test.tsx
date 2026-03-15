import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TranscriptView from "./TranscriptView";
import type { TranscriptSegment, TranscriptChapter } from "@/types";

const segments: TranscriptSegment[] = [
  { text: "Welcome to the video", offset: 0, duration: 5000 },
  { text: "Let's talk about code quality", offset: 5000, duration: 4000 },
  { text: "Here is a demo", offset: 9000, duration: 6000 },
  { text: "Thanks for watching", offset: 15000, duration: 3000 },
];

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
