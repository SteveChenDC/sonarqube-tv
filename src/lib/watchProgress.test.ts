import { describe, it, expect, beforeEach } from "vitest";
import { getProgress, setProgress, getAllProgress, removeProgress } from "./watchProgress";

describe("watchProgress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("getProgress returns 0 for unknown video", () => {
    expect(getProgress("unknown-id")).toBe(0);
  });

  it("setProgress + getProgress round-trip", () => {
    setProgress("vid1", 42);
    expect(getProgress("vid1")).toBe(42);
  });

  it("clamps values above 100", () => {
    setProgress("vid1", 150);
    expect(getProgress("vid1")).toBe(100);
  });

  it("clamps values below 0", () => {
    setProgress("vid1", -10);
    expect(getProgress("vid1")).toBe(0);
  });

  it("rounds fractional values", () => {
    setProgress("vid1", 33.7);
    expect(getProgress("vid1")).toBe(34);
  });

  it("getAllProgress returns full map", () => {
    setProgress("a", 10);
    setProgress("b", 20);
    expect(getAllProgress()).toEqual({ a: 10, b: 20 });
  });

  it("getAllProgress returns empty object when no data", () => {
    expect(getAllProgress()).toEqual({});
  });

  it("overwrites previous progress for the same video", () => {
    setProgress("vid1", 25);
    expect(getProgress("vid1")).toBe(25);
    setProgress("vid1", 80);
    expect(getProgress("vid1")).toBe(80);
    // Ensure other videos are not affected
    setProgress("vid2", 50);
    expect(getProgress("vid1")).toBe(80);
    expect(getProgress("vid2")).toBe(50);
  });

  it("handles corrupted localStorage JSON gracefully", () => {
    localStorage.setItem("sonarqube-tv-watch-progress", "not-json{{{");
    expect(getAllProgress()).toEqual({});
  });
});

describe("removeProgress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("removes a video entry so getProgress returns 0 afterward", () => {
    setProgress("vid1", 55);
    expect(getProgress("vid1")).toBe(55);
    removeProgress("vid1");
    expect(getProgress("vid1")).toBe(0);
  });

  it("does not affect other videos when one is removed", () => {
    setProgress("vid1", 30);
    setProgress("vid2", 70);
    removeProgress("vid1");
    expect(getProgress("vid1")).toBe(0);
    expect(getProgress("vid2")).toBe(70);
  });

  it("removes the key from getAllProgress", () => {
    setProgress("vid1", 40);
    setProgress("vid2", 80);
    removeProgress("vid1");
    const all = getAllProgress();
    expect("vid1" in all).toBe(false);
    expect(all.vid2).toBe(80);
  });

  it("is a no-op when the video ID does not exist — does not throw", () => {
    setProgress("vid1", 50);
    expect(() => removeProgress("nonexistent-id")).not.toThrow();
    // Existing data is untouched
    expect(getProgress("vid1")).toBe(50);
  });

  it("leaves localStorage empty when the last entry is removed", () => {
    setProgress("only", 99);
    removeProgress("only");
    expect(getAllProgress()).toEqual({});
  });
});
