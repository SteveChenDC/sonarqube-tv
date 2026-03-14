import { describe, it, expect, beforeEach } from "vitest";
import { getProgress, setProgress, getAllProgress } from "@/lib/watchProgress";

describe("Watch progress (localStorage)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns 0 for a video with no progress", () => {
    expect(getProgress("v1")).toBe(0);
  });

  it("stores and retrieves progress", () => {
    setProgress("v1", 42);
    expect(getProgress("v1")).toBe(42);
  });

  it("clamps progress to 0-100", () => {
    setProgress("v1", 150);
    expect(getProgress("v1")).toBe(100);

    setProgress("v2", -10);
    expect(getProgress("v2")).toBe(0);
  });

  it("rounds progress to integer", () => {
    setProgress("v1", 33.7);
    expect(getProgress("v1")).toBe(34);
  });

  it("getAllProgress returns all stored entries", () => {
    setProgress("v1", 25);
    setProgress("v2", 75);
    const all = getAllProgress();
    expect(all).toEqual({ v1: 25, v2: 75 });
  });

  it("overwrites previous progress for the same video", () => {
    setProgress("v1", 25);
    setProgress("v1", 80);
    expect(getProgress("v1")).toBe(80);
  });
});
