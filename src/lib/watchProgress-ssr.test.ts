import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("watchProgress SSR safety", () => {
  let originalWindow: typeof globalThis.window;

  beforeEach(() => {
    originalWindow = globalThis.window;
  });

  afterEach(() => {
    // Restore window
    if (originalWindow !== undefined) {
      globalThis.window = originalWindow;
    }
    vi.resetModules();
  });

  it("getAllProgress returns empty object when window is undefined", async () => {
    // @ts-expect-error simulate SSR
    delete globalThis.window;
    const { getAllProgress } = await import("./watchProgress");
    expect(getAllProgress()).toEqual({});
  });

  it("getProgress returns 0 when window is undefined", async () => {
    // @ts-expect-error simulate SSR
    delete globalThis.window;
    const { getProgress } = await import("./watchProgress");
    expect(getProgress("any-video")).toBe(0);
  });

  it("setProgress is a no-op when window is undefined", async () => {
    // @ts-expect-error simulate SSR
    delete globalThis.window;
    const { setProgress, getAllProgress } = await import("./watchProgress");
    // Should not throw
    expect(() => setProgress("vid1", 50)).not.toThrow();
    expect(getAllProgress()).toEqual({});
  });

  it("removeProgress is a no-op when window is undefined", async () => {
    // @ts-expect-error simulate SSR
    delete globalThis.window;
    const { removeProgress, getAllProgress } = await import("./watchProgress");
    // Should not throw
    expect(() => removeProgress("vid1")).not.toThrow();
    expect(getAllProgress()).toEqual({});
  });
});
