import { describe, it, expect } from "vitest";
import {
  getArticleByVideoId,
  getTranscriptByVideoId,
  hasArticle,
} from "./articles";

/**
 * articles.ts uses require() internally, so these tests use real data files
 * that exist on disk (v1.json) rather than mocking require().
 */

describe("getArticleByVideoId", () => {
  it("returns an Article object for a known video ID", () => {
    const article = getArticleByVideoId("v1");
    expect(article).not.toBeNull();
    expect(article).toMatchObject({
      videoId: "v1",
      title: expect.any(String),
      markdown: expect.any(String),
      keyTakeaways: expect.any(Array),
      generatedAt: expect.any(String),
      wordCount: expect.any(Number),
    });
  });

  it("returns null for a non-existent video ID", () => {
    const article = getArticleByVideoId("v99999-nonexistent");
    expect(article).toBeNull();
  });

  it("returned article has non-empty title and markdown", () => {
    const article = getArticleByVideoId("v1");
    expect(article?.title.length).toBeGreaterThan(0);
    expect(article?.markdown.length).toBeGreaterThan(0);
  });

  it("returned article keyTakeaways is an array of strings", () => {
    const article = getArticleByVideoId("v1");
    expect(Array.isArray(article?.keyTakeaways)).toBe(true);
    expect(article?.keyTakeaways.every((k) => typeof k === "string")).toBe(
      true
    );
  });
});

describe("getTranscriptByVideoId", () => {
  it("returns a Transcript object for a known video ID", () => {
    const transcript = getTranscriptByVideoId("v1");
    expect(transcript).not.toBeNull();
    expect(transcript).toMatchObject({
      videoId: "v1",
      youtubeId: expect.any(String),
      segments: expect.any(Array),
      fullText: expect.any(String),
      fetchedAt: expect.any(String),
    });
  });

  it("returns null for a non-existent video ID", () => {
    const transcript = getTranscriptByVideoId("v99999-nonexistent");
    expect(transcript).toBeNull();
  });

  it("returned transcript segments each have text, offset, duration", () => {
    const transcript = getTranscriptByVideoId("v1");
    expect(transcript?.segments.length).toBeGreaterThan(0);
    const first = transcript!.segments[0];
    expect(typeof first.text).toBe("string");
    expect(typeof first.offset).toBe("number");
    expect(typeof first.duration).toBe("number");
  });
});

describe("hasArticle", () => {
  it("returns true for a video that has an article", () => {
    expect(hasArticle("v1")).toBe(true);
  });

  it("returns false for a video with no article file", () => {
    expect(hasArticle("v99999-nonexistent")).toBe(false);
  });

  it("is consistent with getArticleByVideoId", () => {
    expect(hasArticle("v1")).toBe(getArticleByVideoId("v1") !== null);
    expect(hasArticle("v99999-nonexistent")).toBe(
      getArticleByVideoId("v99999-nonexistent") !== null
    );
  });
});
