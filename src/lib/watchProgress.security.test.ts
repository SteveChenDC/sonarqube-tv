/**
 * Security tests for watchProgress.ts — validateLocalStorage shape (commit aa7eddd)
 *
 * The security fix in getAllProgress() must:
 *   1. Reject non-plain-object JSON (arrays, null, primitives)
 *   2. Filter individual entries whose values are not finite numbers
 *   3. Clamp out-of-range values when *reading* (in case localStorage was
 *      written externally, bypassing setProgress' write-time clamping)
 */

import { describe, it, expect, beforeEach } from "vitest";
import { getAllProgress, getProgress, setProgress } from "./watchProgress";

const STORAGE_KEY = "sonarqube-tv-watch-progress";

describe("getAllProgress — input shape validation (security)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns {} when localStorage contains a JSON array", () => {
    // An attacker or corrupted write could store a JSON array
    localStorage.setItem(STORAGE_KEY, "[1, 2, 3]");
    expect(getAllProgress()).toEqual({});
  });

  it("returns {} when localStorage contains JSON null", () => {
    localStorage.setItem(STORAGE_KEY, "null");
    expect(getAllProgress()).toEqual({});
  });

  it("returns {} when localStorage contains a JSON number primitive", () => {
    localStorage.setItem(STORAGE_KEY, "42");
    expect(getAllProgress()).toEqual({});
  });

  it("returns {} when localStorage contains a JSON string primitive", () => {
    localStorage.setItem(STORAGE_KEY, '"hello"');
    expect(getAllProgress()).toEqual({});
  });
});

describe("getAllProgress — entry-level value filtering (security)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("keeps only numeric entries and discards string-valued entries", () => {
    // Mixed: one valid numeric entry, one tampered string entry
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ v1: 50, v2: "not-a-number" })
    );
    expect(getAllProgress()).toEqual({ v1: 50 });
  });

  it("discards boolean-valued and null-valued entries", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ v1: 50, v2: true, v3: false, v4: null })
    );
    expect(getAllProgress()).toEqual({ v1: 50 });
  });

  it("discards object-valued and array-valued entries", () => {
    localStorage.setItem(
      STORAGE_KEY,
      '{"v1": 30, "v2": {"nested": 1}, "v3": [10, 20]}'
    );
    expect(getAllProgress()).toEqual({ v1: 30 });
  });

  it("returns {} when all entries are non-numeric", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ a: "string", b: true, c: null })
    );
    expect(getAllProgress()).toEqual({});
  });
});

describe("getAllProgress — out-of-range clamping on read (security)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("clamps values above 100 when read from externally-written localStorage", () => {
    // Simulate a value written directly, bypassing setProgress' write-time clamping
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v1: 150 }));
    expect(getAllProgress()).toEqual({ v1: 100 });
  });

  it("clamps negative values to 0 on read", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v1: -10 }));
    expect(getAllProgress()).toEqual({ v1: 0 });
  });

  it("clamps multiple out-of-range entries in a single read", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v1: 200, v2: -99, v3: 75 }));
    expect(getAllProgress()).toEqual({ v1: 100, v2: 0, v3: 75 });
  });

  it("getProgress returns a clamped value when localStorage holds an out-of-range entry", () => {
    // getProgress delegates to getAllProgress — verify the clamp propagates
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ videoA: 999 }));
    expect(getProgress("videoA")).toBe(100);
  });
});

describe("getAllProgress — interaction with setProgress (regression)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("setProgress-written entries always satisfy the validation (round-trip integrity)", () => {
    setProgress("v1", 60);
    setProgress("v2", 110); // clamped to 100 at write time
    setProgress("v3", -5); // clamped to 0 at write time
    const all = getAllProgress();
    // All entries pass validation — no entries stripped by the security filter
    expect(Object.keys(all)).toHaveLength(3);
    expect(all).toEqual({ v1: 60, v2: 100, v3: 0 });
  });
});
