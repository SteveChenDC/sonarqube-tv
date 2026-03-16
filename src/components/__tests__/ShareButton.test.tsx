import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ShareButton from "../ShareButton";

describe("ShareButton", () => {
  beforeEach(() => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the share button", () => {
    render(<ShareButton />);
    expect(screen.getByRole("button", { name: /copy video link/i })).toBeInTheDocument();
    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("copies URL to clipboard on click and shows confirmation", async () => {
    // Mock window.location
    Object.defineProperty(window, "location", {
      value: { href: "http://localhost:3000/watch/test-video" },
      writable: true,
    });

    render(<ShareButton />);
    const button = screen.getByRole("button", { name: /copy video link/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "http://localhost:3000/watch/test-video"
    );

    await waitFor(() => {
      expect(screen.getByText("Link copied!")).toBeInTheDocument();
    });
  });

  it("reverts to Share label after 2 seconds", async () => {
    // Use real timers — fake timers + async clipboard Promise don't play well together.
    // Test the timeout by waiting for the "Link copied!" state first, then relying on
    // the real 2 s timer completing via a longer waitFor timeout.
    render(<ShareButton />);
    const button = screen.getByRole("button", { name: /copy video link/i });

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText("Link copied!")).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(screen.getByText("Share")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  }, 6000);
});
