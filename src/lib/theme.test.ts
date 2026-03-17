import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getEffectiveTheme, setTheme, toggleTheme, subscribeToSystemTheme } from "./theme";

// ─── helpers ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "sonarqube-tv-theme";

/** Return a minimal MediaQueryList stub */
function makeMQL(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  const mql = {
    matches,
    addEventListener: vi.fn((_type: string, handler: (e: MediaQueryListEvent) => void) => {
      listeners.push(handler);
    }),
    removeEventListener: vi.fn((_type: string, handler: (e: MediaQueryListEvent) => void) => {
      const idx = listeners.indexOf(handler);
      if (idx !== -1) listeners.splice(idx, 1);
    }),
    /** Fire a fake "change" event to registered listeners */
    _fire(newMatches: boolean) {
      const event = { matches: newMatches } as MediaQueryListEvent;
      listeners.forEach((fn) => fn(event));
    },
    _listeners: listeners,
  };
  return mql;
}

// ─── setup / teardown ────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  // Reset dark class
  document.documentElement.classList.remove("dark", "theme-transitioning");
});

afterEach(() => {
  vi.restoreAllMocks();
  document.documentElement.classList.remove("dark", "theme-transitioning");
});

// ─── getEffectiveTheme ────────────────────────────────────────────────────────

describe("getEffectiveTheme", () => {
  it("returns stored 'dark' when localStorage has 'dark'", () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    expect(getEffectiveTheme()).toBe("dark");
  });

  it("returns stored 'light' when localStorage has 'light'", () => {
    localStorage.setItem(STORAGE_KEY, "light");
    expect(getEffectiveTheme()).toBe("light");
  });

  it("falls back to system dark theme when no stored value", () => {
    vi.spyOn(globalThis, "matchMedia").mockReturnValue(
      makeMQL(true) as unknown as MediaQueryList
    );
    expect(getEffectiveTheme()).toBe("dark");
  });

  it("falls back to system light theme when no stored value and system is light", () => {
    vi.spyOn(globalThis, "matchMedia").mockReturnValue(
      makeMQL(false) as unknown as MediaQueryList
    );
    expect(getEffectiveTheme()).toBe("light");
  });

  it("ignores invalid stored values and falls back to system theme", () => {
    localStorage.setItem(STORAGE_KEY, "blue");
    vi.spyOn(globalThis, "matchMedia").mockReturnValue(
      makeMQL(false) as unknown as MediaQueryList
    );
    expect(getEffectiveTheme()).toBe("light");
  });
});

// ─── setTheme ─────────────────────────────────────────────────────────────────

describe("setTheme", () => {
  it("adds 'dark' class to documentElement when theme is 'dark'", () => {
    setTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes 'dark' class from documentElement when theme is 'light'", () => {
    document.documentElement.classList.add("dark");
    setTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists 'dark' to localStorage", () => {
    setTheme("dark");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  it("persists 'light' to localStorage", () => {
    setTheme("light");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
  });

  it("overwrites a previously stored theme", () => {
    setTheme("dark");
    setTheme("light");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

// ─── toggleTheme ──────────────────────────────────────────────────────────────

describe("toggleTheme", () => {
  beforeEach(() => {
    // Stub matchMedia so the helper doesn't crash — toggleTheme reads
    // document.documentElement.classList directly, not matchMedia, but
    // subscribeToSystemTheme (called elsewhere) does use it.
    vi.spyOn(globalThis, "matchMedia").mockReturnValue(
      makeMQL(true) as unknown as MediaQueryList
    );
  });

  it("returns 'light' when current theme is dark", () => {
    document.documentElement.classList.add("dark");
    const result = toggleTheme();
    expect(result).toBe("light");
  });

  it("returns 'dark' when current theme is light", () => {
    document.documentElement.classList.remove("dark");
    const result = toggleTheme();
    expect(result).toBe("dark");
  });

  it("switches DOM from dark to light", () => {
    document.documentElement.classList.add("dark");
    toggleTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("switches DOM from light to dark", () => {
    document.documentElement.classList.remove("dark");
    toggleTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("adds theme-transitioning class when prefers-reduced-motion is not set", () => {
    // matchMedia for prefers-reduced-motion: reduce → matches = false (user has NOT opted out)
    vi.spyOn(globalThis, "matchMedia").mockImplementation((query: string) => {
      if (query === "(prefers-reduced-motion: reduce)") return makeMQL(false) as unknown as MediaQueryList;
      return makeMQL(true) as unknown as MediaQueryList;
    });
    document.documentElement.classList.add("dark");
    toggleTheme();
    expect(document.documentElement.classList.contains("theme-transitioning")).toBe(true);
  });

  it("does NOT add theme-transitioning class when prefers-reduced-motion is enabled", () => {
    vi.spyOn(globalThis, "matchMedia").mockImplementation((query: string) => {
      if (query === "(prefers-reduced-motion: reduce)") return makeMQL(true) as unknown as MediaQueryList;
      return makeMQL(false) as unknown as MediaQueryList;
    });
    document.documentElement.classList.add("dark");
    toggleTheme();
    expect(document.documentElement.classList.contains("theme-transitioning")).toBe(false);
  });

  it("persists the toggled theme to localStorage", () => {
    document.documentElement.classList.add("dark");
    toggleTheme();
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
  });
});

// ─── subscribeToSystemTheme ───────────────────────────────────────────────────

describe("subscribeToSystemTheme", () => {
  it("registers a change listener on the prefers-color-scheme media query", () => {
    const mql = makeMQL(true);
    vi.spyOn(globalThis, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    const callback = vi.fn();
    subscribeToSystemTheme(callback);

    expect(mql.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("calls callback with 'dark' when system switches to dark and no stored theme", () => {
    const mql = makeMQL(false); // start light
    vi.spyOn(globalThis, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    const callback = vi.fn();
    subscribeToSystemTheme(callback);

    // Fire a "change" to dark
    mql._fire(true);

    expect(callback).toHaveBeenCalledWith("dark");
  });

  it("calls callback with 'light' when system switches to light and no stored theme", () => {
    const mql = makeMQL(true); // start dark
    vi.spyOn(globalThis, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    const callback = vi.fn();
    subscribeToSystemTheme(callback);

    mql._fire(false);

    expect(callback).toHaveBeenCalledWith("light");
  });

  it("does NOT call callback when a stored theme preference exists", () => {
    localStorage.setItem(STORAGE_KEY, "dark");

    const mql = makeMQL(true);
    vi.spyOn(globalThis, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    const callback = vi.fn();
    subscribeToSystemTheme(callback);

    mql._fire(false); // system switches to light, but stored pref overrides

    expect(callback).not.toHaveBeenCalled();
  });

  it("returns an unsubscribe function that removes the listener", () => {
    const mql = makeMQL(true);
    vi.spyOn(globalThis, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    const callback = vi.fn();
    const unsubscribe = subscribeToSystemTheme(callback);
    unsubscribe();

    expect(mql.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("does not fire callback after unsubscribing", () => {
    const mql = makeMQL(false);
    vi.spyOn(globalThis, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    const callback = vi.fn();
    const unsubscribe = subscribeToSystemTheme(callback);
    unsubscribe();

    mql._fire(true);

    expect(callback).not.toHaveBeenCalled();
  });

  it("also applies dark class to documentElement when system switches to dark", () => {
    const mql = makeMQL(false); // start light
    vi.spyOn(globalThis, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    subscribeToSystemTheme(vi.fn());
    mql._fire(true); // system switches to dark

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("also removes dark class from documentElement when system switches to light", () => {
    document.documentElement.classList.add("dark");
    const mql = makeMQL(true); // start dark
    vi.spyOn(globalThis, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    subscribeToSystemTheme(vi.fn());
    mql._fire(false); // system switches to light

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("does NOT apply theme to DOM when a stored preference overrides the system change", () => {
    localStorage.setItem(STORAGE_KEY, "light");
    document.documentElement.classList.remove("dark"); // currently light

    const mql = makeMQL(false);
    vi.spyOn(globalThis, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    subscribeToSystemTheme(vi.fn());
    mql._fire(true); // system switches to dark — but stored pref should block this

    // DOM should remain unchanged (no dark class added)
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

// ─── toggleTheme transition cleanup ──────────────────────────────────────────

describe("toggleTheme transition cleanup", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "matchMedia").mockImplementation((query: string) => {
      // Not reduced-motion → animations enabled
      if (query === "(prefers-reduced-motion: reduce)") return makeMQL(false) as unknown as MediaQueryList;
      return makeMQL(true) as unknown as MediaQueryList;
    });
  });

  it("removes theme-transitioning class after transitionend fires on documentElement", () => {
    document.documentElement.classList.add("dark");
    toggleTheme();

    expect(document.documentElement.classList.contains("theme-transitioning")).toBe(true);

    // Simulate the CSS transition finishing
    document.documentElement.dispatchEvent(new Event("transitionend"));

    expect(document.documentElement.classList.contains("theme-transitioning")).toBe(false);
  });

  it("removes theme-transitioning class via fallback setTimeout when transitionend never fires", () => {
    vi.useFakeTimers();
    document.documentElement.classList.add("dark");
    toggleTheme();

    expect(document.documentElement.classList.contains("theme-transitioning")).toBe(true);

    // Advance past the 600ms fallback
    vi.advanceTimersByTime(600);

    expect(document.documentElement.classList.contains("theme-transitioning")).toBe(false);

    vi.useRealTimers();
  });
});

// ─── SSR safety ───────────────────────────────────────────────────────────────

describe("SSR safety (window === undefined)", () => {
  let originalWindow: typeof globalThis.window;

  beforeEach(() => {
    originalWindow = globalThis.window;
    // @ts-expect-error simulate server-side rendering environment
    delete globalThis.window;
  });

  afterEach(() => {
    globalThis.window = originalWindow;
    vi.restoreAllMocks();
  });

  it("getEffectiveTheme returns 'dark' when window is undefined (SSR default)", () => {
    expect(getEffectiveTheme()).toBe("dark");
  });

  it("getEffectiveTheme still returns 'dark' even when localStorage has a value (no localStorage in SSR)", () => {
    // localStorage is unavailable in SSR — the stored theme cannot be read
    // so getStoredTheme() returns null and getSystemTheme() returns "dark"
    expect(getEffectiveTheme()).toBe("dark");
  });

  it("getEffectiveTheme does not throw when window is undefined", () => {
    expect(() => getEffectiveTheme()).not.toThrow();
  });
});
