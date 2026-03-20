/**
 * Header — mouseenter/mouseleave hover behaviour and mobile body-scroll lock.
 *
 * Two distinct behaviour areas that are NOT covered by the other Header test
 * files (Header.test.tsx, Header.dropdown.test.tsx, Header.search.test.tsx):
 *
 *  1. The hover open/close cycle driven by the ref-attached mouseenter and
 *     mouseleave DOM listeners.  mouseleave schedules a 3-second setTimeout;
 *     a subsequent mouseenter cancels it.
 *
 *  2. The mobile body-scroll lock: when the menu opens on a narrow viewport
 *     (matchMedia "max-width: 639px" → true) document.body.style.overflow is
 *     set to "hidden" and restored when the menu closes.
 *
 * Key technique:
 *  - Hover tests use vi.useFakeTimers() so the 3-second close timer can be
 *    advanced precisely with vi.advanceTimersByTime().
 *  - The open/close state is verified via the chevron's "rotate-180" CSS class,
 *    which is bound directly to the `menuOpen` state variable — not to the
 *    animation-layer `dropdownVisible` flag — making it immune to fake-timer
 *    rAF scheduling.
 *  - Scroll-lock tests override globalThis.matchMedia before rendering and
 *    restore the global after each test.
 *
 * Global mocks (next/link → <a>, next/image → <img>, IntersectionObserver,
 * ResizeObserver, matchMedia) are configured in src/__tests__/setup.tsx.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import Header from "./Header";

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the div that has `ref={menuRef}` in Header.
 * It is the direct parent of the "Categories" toggle button.
 */
function getMenuDiv(): HTMLElement {
  return screen.getByRole("button", { name: /categories/i })
    .parentElement as HTMLElement;
}

/**
 * Returns the chevron SVG inside the "Categories" button.
 * Its class contains "rotate-180" when menuOpen=true, nothing otherwise.
 */
function getChevron(): SVGElement {
  return screen.getByRole("button", { name: /categories/i })
    .querySelector("svg") as SVGElement;
}

/** matchMedia stub that reports the "narrow mobile" viewport. */
const mobileMatchMedia = (query: string) => ({
  matches: query === "(max-width: 639px)",
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

/** Default matchMedia stub (desktop — only dark-mode preference matches). */
const desktopMatchMedia = (query: string) => ({
  matches: query === "(prefers-color-scheme: dark)",
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

// ─────────────────────────────────────────────────────────────────────────────
// Hover open / close
// ─────────────────────────────────────────────────────────────────────────────
describe("Header — hover open/close (fake timers)", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("mouseenter on the menu container opens the categories dropdown", () => {
    render(<Header />);
    const menuDiv = getMenuDiv();

    act(() => {
      fireEvent.mouseEnter(menuDiv);
    });

    // dropdownMounted=true → heading appears in DOM
    expect(screen.getByText("Browse by Category")).toBeInTheDocument();
    // menuOpen=true → chevron rotated
    expect(getChevron().getAttribute("class")).toContain("rotate-180");
  });

  it("mouseleave keeps the dropdown open immediately (3-second delay has not elapsed)", () => {
    render(<Header />);
    const menuDiv = getMenuDiv();

    act(() => { fireEvent.mouseEnter(menuDiv); });
    // Confirm open
    expect(getChevron().getAttribute("class")).toContain("rotate-180");

    act(() => { fireEvent.mouseLeave(menuDiv); });
    // Timer started but 3 s haven't passed — still open
    expect(screen.getByText("Browse by Category")).toBeInTheDocument();
    expect(getChevron().getAttribute("class")).toContain("rotate-180");
  });

  it("after 3000 ms following mouseleave the dropdown closes", () => {
    render(<Header />);
    const menuDiv = getMenuDiv();

    act(() => { fireEvent.mouseEnter(menuDiv); });
    act(() => { fireEvent.mouseLeave(menuDiv); });

    // Advance past the 3-second delay — timer callback fires, setMenuOpen(false)
    act(() => { vi.advanceTimersByTime(3001); });

    // menuOpen=false → chevron no longer rotated
    expect(getChevron().getAttribute("class")).not.toContain("rotate-180");
  });

  it("mouseenter after mouseleave cancels the close timer — menu stays open after 3 s", () => {
    render(<Header />);
    const menuDiv = getMenuDiv();

    act(() => { fireEvent.mouseEnter(menuDiv); });
    act(() => { fireEvent.mouseLeave(menuDiv); }); // sets close timer
    act(() => { fireEvent.mouseEnter(menuDiv); }); // clears close timer

    // Advance past where close would have happened
    act(() => { vi.advanceTimersByTime(3001); });

    // Timer was cancelled — menu is still open
    expect(getChevron().getAttribute("class")).toContain("rotate-180");
    expect(screen.getByText("Browse by Category")).toBeInTheDocument();
  });

  it("mouseleave followed immediately by another mouseleave does not double-close after 3 s each", () => {
    // Only one setTimeout is tracked via timeoutRef; the second mouseleave overwrites it.
    render(<Header />);
    const menuDiv = getMenuDiv();

    act(() => { fireEvent.mouseEnter(menuDiv); });
    act(() => { fireEvent.mouseLeave(menuDiv); }); // first leave — timer 1
    act(() => { fireEvent.mouseLeave(menuDiv); }); // second leave — timer 2 (timer 1 overwritten)

    // After 3 s the most-recent timer fires → menu closes once
    act(() => { vi.advanceTimersByTime(3001); });
    expect(getChevron().getAttribute("class")).not.toContain("rotate-180");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Mobile body scroll lock
// ─────────────────────────────────────────────────────────────────────────────
describe("Header — mobile body scroll lock", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    Object.defineProperty(globalThis, "matchMedia", {
      writable: true,
      value: mobileMatchMedia,
    });
  });

  afterEach(() => {
    // Restore to the default desktop stub used by setup.tsx
    Object.defineProperty(globalThis, "matchMedia", {
      writable: true,
      value: desktopMatchMedia,
    });
    document.body.style.overflow = "";
    vi.restoreAllMocks();
  });

  it("sets body overflow to 'hidden' when the menu opens on mobile", () => {
    render(<Header />);
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /categories/i }));
    });
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body overflow to '' when the menu closes on mobile", () => {
    render(<Header />);
    const btn = screen.getByRole("button", { name: /categories/i });

    act(() => { fireEvent.click(btn); }); // open
    expect(document.body.style.overflow).toBe("hidden");

    act(() => { fireEvent.click(btn); }); // close (toggle)
    expect(document.body.style.overflow).toBe("");
  });

  it("does NOT lock body scroll when the menu opens on desktop", () => {
    // Temporarily restore desktop matchMedia within this test
    Object.defineProperty(globalThis, "matchMedia", {
      writable: true,
      value: desktopMatchMedia,
    });

    render(<Header />);
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /categories/i }));
    });
    // overflow must remain "" on a non-mobile viewport
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("pressing Escape to close the menu also restores body overflow on mobile", () => {
    render(<Header />);
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /categories/i }));
    });
    expect(document.body.style.overflow).toBe("hidden");

    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    // Effect cleanup triggered when menuOpen → false removes the overflow lock
    expect(document.body.style.overflow).toBe("");
  });
});
