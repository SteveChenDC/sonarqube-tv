import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import ShareButton from "./ShareButton";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Helper: flush all pending microtasks (resolved promises)
function flushPromises() {
  return act(async () => {
    await Promise.resolve();
  });
}

describe("ShareButton", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: { href: "https://example.com/watch/test-video" },
      writable: true,
      configurable: true,
    });
  });

  it("renders a button with aria-label and 'Share' text initially", () => {
    render(<ShareButton />);
    const btn = screen.getByRole("button", { name: /copy video link to clipboard/i });
    expect(btn).toBeTruthy();
    expect(screen.getByText("Share")).toBeTruthy();
    expect(screen.queryByText("Link copied!")).toBeNull();
  });

  it("copies URL via clipboard API and shows 'Link copied!'", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    render(<ShareButton />);
    fireEvent.click(screen.getByRole("button"));
    await flushPromises();

    expect(screen.getByText("Link copied!")).toBeTruthy();
    expect(writeText).toHaveBeenCalledWith("https://example.com/watch/test-video");
  });

  it("reverts to 'Share' after 2 seconds", async () => {
    vi.useFakeTimers();

    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    render(<ShareButton />);
    fireEvent.click(screen.getByRole("button"));

    // Flush the clipboard promise using real microtasks before advancing timers
    await act(async () => {
      await writeText.mock.results[0].value; // wait for the resolved promise
    });

    expect(screen.getByText("Link copied!")).toBeTruthy();

    // Now advance past the 2-second reset
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText("Share")).toBeTruthy();

    vi.useRealTimers();
  });

  it("falls back to execCommand when clipboard API is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const execCommand = vi.fn().mockReturnValue(true);
    document.execCommand = execCommand;

    render(<ShareButton />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });

    expect(screen.getByText("Link copied!")).toBeTruthy();
    expect(execCommand).toHaveBeenCalledWith("copy");
  });

  it("silently swallows clipboard errors without crashing", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Permission denied"));
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    render(<ShareButton />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
      await writeText.mock.results[0].value.catch(() => {});
    });

    // On error, copied stays false — button still shows "Share"
    expect(screen.getByText("Share")).toBeTruthy();
    expect(screen.queryByText("Link copied!")).toBeNull();
  });
});
