import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ScrollToTop from "./ScrollToTop";

describe("ScrollToTop", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "scrollY", { value: 0, writable: true });
    globalThis.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a button with 'Scroll to top' aria-label", () => {
    render(<ScrollToTop />);
    expect(screen.getByRole("button", { name: "Scroll to top" })).toBeTruthy();
  });

  it("is hidden (has opacity-0 class) when scrollY <= 600", () => {
    render(<ScrollToTop />);
    const button = screen.getByRole("button", { name: "Scroll to top" });
    expect(button.className).toContain("opacity-0");
    expect(button.className).toContain("pointer-events-none");
  });

  it("becomes visible (opacity-100) when scrollY > 600", () => {
    render(<ScrollToTop />);
    Object.defineProperty(globalThis, "scrollY", { value: 700, writable: true });
    fireEvent.scroll(globalThis);

    const button = screen.getByRole("button", { name: "Scroll to top" });
    expect(button.className).toContain("opacity-100");
    expect(button.className).not.toContain("pointer-events-none");
  });

  it("calls globalThis.scrollTo with top: 0 when clicked", () => {
    render(<ScrollToTop />);
    // Make visible first
    Object.defineProperty(globalThis, "scrollY", { value: 700, writable: true });
    fireEvent.scroll(globalThis);

    fireEvent.click(screen.getByRole("button", { name: "Scroll to top" }));
    expect(globalThis.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("stays hidden when hidden={true} even after scrolling past 600px", () => {
    render(<ScrollToTop hidden={true} />);
    Object.defineProperty(globalThis, "scrollY", { value: 700, writable: true });
    fireEvent.scroll(globalThis);

    const button = screen.getByRole("button", { name: "Scroll to top" });
    expect(button.className).toContain("opacity-0");
    expect(button.className).toContain("pointer-events-none");
  });

  it("becomes visible when hidden={false} (explicit) and scrolled past 600px", () => {
    render(<ScrollToTop hidden={false} />);
    Object.defineProperty(globalThis, "scrollY", { value: 700, writable: true });
    fireEvent.scroll(globalThis);

    const button = screen.getByRole("button", { name: "Scroll to top" });
    expect(button.className).toContain("opacity-100");
    expect(button.className).not.toContain("pointer-events-none");
  });

  it("transitions from visible to hidden when hidden prop changes to true", () => {
    const { rerender } = render(<ScrollToTop hidden={false} />);
    Object.defineProperty(globalThis, "scrollY", { value: 700, writable: true });
    fireEvent.scroll(globalThis);

    // Visible with hidden=false
    const button = screen.getByRole("button", { name: "Scroll to top" });
    expect(button.className).toContain("opacity-100");

    // Now pass hidden=true
    rerender(<ScrollToTop hidden={true} />);
    expect(button.className).toContain("opacity-0");
    expect(button.className).toContain("pointer-events-none");
  });

  it("hides again when user scrolls back to ≤ 600 after being visible", () => {
    render(<ScrollToTop />);
    // Scroll down past threshold — button becomes visible
    Object.defineProperty(globalThis, "scrollY", { value: 700, writable: true });
    fireEvent.scroll(globalThis);
    const button = screen.getByRole("button", { name: "Scroll to top" });
    expect(button.className).toContain("opacity-100");

    // Scroll back up — button must hide again
    Object.defineProperty(globalThis, "scrollY", { value: 300, writable: true });
    fireEvent.scroll(globalThis);
    expect(button.className).toContain("opacity-0");
    expect(button.className).toContain("pointer-events-none");
  });

  it("is NOT visible when scrollY is exactly 600 (boundary: condition is > not >=)", () => {
    render(<ScrollToTop />);
    Object.defineProperty(globalThis, "scrollY", { value: 600, writable: true });
    fireEvent.scroll(globalThis);
    const button = screen.getByRole("button", { name: "Scroll to top" });
    // scrollY > 600 is the condition — exactly 600 must NOT trigger visibility
    expect(button.className).toContain("opacity-0");
    expect(button.className).toContain("pointer-events-none");
  });

  it("IS visible when scrollY is exactly 601 (first value above threshold)", () => {
    render(<ScrollToTop />);
    Object.defineProperty(globalThis, "scrollY", { value: 601, writable: true });
    fireEvent.scroll(globalThis);
    const button = screen.getByRole("button", { name: "Scroll to top" });
    expect(button.className).toContain("opacity-100");
    expect(button.className).not.toContain("pointer-events-none");
  });

  it("removes the scroll event listener from window on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<ScrollToTop />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("button uses bottom-safe class (not bottom-6) so iOS home-indicator clearance is respected", () => {
    // bottom-safe = calc(env(safe-area-inset-bottom) + 1.5rem) — requires
    // viewport-fit=cover in layout.tsx to return the real 34px inset on iPhone X+.
    // Reverting to bottom-6 would make the button overlap the iOS home indicator.
    render(<ScrollToTop />);
    const button = screen.getByRole("button", { name: "Scroll to top" });
    expect(button.className).toContain("bottom-safe");
    expect(button.className).not.toContain("bottom-6");
  });
});
