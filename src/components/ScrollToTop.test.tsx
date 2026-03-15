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
});
