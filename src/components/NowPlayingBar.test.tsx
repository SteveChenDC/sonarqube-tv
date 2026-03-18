import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import NowPlayingBar from "./NowPlayingBar";

// IntersectionObserver mock
type IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => void;
let observerCallback: IntersectionObserverCallback | null = null;
let observedElement: Element | null = null;

const mockObserve = vi.fn((el: Element) => {
  observedElement = el;
});
const mockDisconnect = vi.fn();

class MockIntersectionObserver {
  constructor(cb: IntersectionObserverCallback) {
    observerCallback = cb;
  }
  observe = mockObserve;
  disconnect = mockDisconnect;
  unobserve = vi.fn();
}

beforeEach(() => {
  observerCallback = null;
  observedElement = null;
  vi.clearAllMocks();
  Object.defineProperty(globalThis, "IntersectionObserver", {
    value: MockIntersectionObserver,
    writable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

/** Fire the IntersectionObserver callback to simulate intersection state */
function triggerIntersection(isIntersecting: boolean) {
  act(() => {
    observerCallback?.([
      { isIntersecting, target: observedElement } as IntersectionObserverEntry,
    ]);
  });
}

describe("NowPlayingBar", () => {
  it("renders the sentinel div with aria-hidden", () => {
    const { container } = render(<NowPlayingBar title="My Video" />);
    const sentinel = container.querySelector('[aria-hidden="true"]');
    expect(sentinel).not.toBeNull();
  });

  it("renders a role=status element with aria-live=polite", () => {
    render(<NowPlayingBar title="My Video" />);
    const bar = screen.getByRole("status");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-live", "polite");
  });

  it("is initially hidden (opacity-0 and pointer-events-none)", () => {
    render(<NowPlayingBar title="My Video" />);
    const bar = screen.getByRole("status");
    expect(bar.className).toContain("opacity-0");
    expect(bar.className).toContain("pointer-events-none");
  });

  it("becomes visible when sentinel scrolls out of viewport (isIntersecting=false)", () => {
    render(<NowPlayingBar title="My Video" />);
    triggerIntersection(false);
    const bar = screen.getByRole("status");
    expect(bar.className).toContain("opacity-100");
    expect(bar.className).not.toContain("pointer-events-none");
  });

  it("hides again when sentinel re-enters viewport (isIntersecting=true)", () => {
    render(<NowPlayingBar title="My Video" />);
    // Make visible
    triggerIntersection(false);
    expect(screen.getByRole("status").className).toContain("opacity-100");
    // Scroll back so sentinel is visible
    triggerIntersection(true);
    const bar = screen.getByRole("status");
    expect(bar.className).toContain("opacity-0");
    expect(bar.className).toContain("pointer-events-none");
  });

  it("displays the video title text", () => {
    render(<NowPlayingBar title="Getting Started with SonarQube" />);
    expect(screen.getByText("Getting Started with SonarQube")).toBeInTheDocument();
  });

  it("shows 'Now Playing' label text", () => {
    render(<NowPlayingBar title="My Video" />);
    expect(screen.getByText("Now Playing")).toBeInTheDocument();
  });

  it("sets aria-label when visible", () => {
    render(<NowPlayingBar title="My Video" />);
    triggerIntersection(false);
    const bar = screen.getByRole("status");
    expect(bar).toHaveAttribute("aria-label", "Now playing: My Video");
  });

  it("removes aria-label when hidden", () => {
    render(<NowPlayingBar title="My Video" />);
    // Initially hidden: no aria-label
    expect(screen.getByRole("status")).not.toHaveAttribute("aria-label");
  });

  it("calls IntersectionObserver.disconnect on unmount", () => {
    const { unmount } = render(<NowPlayingBar title="My Video" />);
    unmount();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it("observes the sentinel element via IntersectionObserver", () => {
    render(<NowPlayingBar title="My Video" />);
    expect(mockObserve).toHaveBeenCalledTimes(1);
    expect(observedElement).not.toBeNull();
  });

  it("updates aria-label reactively when title prop changes while visible", () => {
    const { rerender } = render(<NowPlayingBar title="Original Title" />);
    triggerIntersection(false); // make visible
    const bar = screen.getByRole("status");
    expect(bar).toHaveAttribute("aria-label", "Now playing: Original Title");

    rerender(<NowPlayingBar title="New Title" />);
    // aria-label is a reactive expression — must reflect the updated title
    expect(bar).toHaveAttribute("aria-label", "Now playing: New Title");
  });

  it("title prop change while hidden does not add an aria-label", () => {
    const { rerender } = render(<NowPlayingBar title="Original Title" />);
    // Not yet visible — no aria-label
    const bar = screen.getByRole("status");
    expect(bar).not.toHaveAttribute("aria-label");

    rerender(<NowPlayingBar title="New Title" />);
    // Still hidden — aria-label must remain absent
    expect(bar).not.toHaveAttribute("aria-label");
  });
});
