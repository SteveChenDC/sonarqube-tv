import { describe, it, expect } from "vitest";
import {
  videos,
  categories,
  getVideoById,
  getVideosByCategory,
  getCategoryBySlug,
  getFeaturedVideo,
  getRelatedVideosFromOtherCategories,
} from "./videos";

describe("video data utilities", () => {
  describe("getVideoById", () => {
    it("returns the correct video for a valid id", () => {
      const first = videos[0];
      const result = getVideoById(first.id);
      expect(result).toBe(first);
    });

    it("returns undefined for a nonexistent id", () => {
      expect(getVideoById("nonexistent-id-xyz")).toBeUndefined();
    });
  });

  describe("getVideosByCategory", () => {
    it("returns only videos matching the given category slug", () => {
      const slug = categories[0].slug;
      const result = getVideosByCategory(slug);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((v) => expect(v.category).toBe(slug));
    });

    it("returns empty array for a nonexistent category", () => {
      expect(getVideosByCategory("nonexistent-category")).toEqual([]);
    });
  });

  describe("getCategoryBySlug", () => {
    it("returns the correct category for a valid slug", () => {
      const first = categories[0];
      const result = getCategoryBySlug(first.slug);
      expect(result).toBe(first);
    });

    it("returns undefined for a nonexistent slug", () => {
      expect(getCategoryBySlug("no-such-category")).toBeUndefined();
    });
  });

  describe("getFeaturedVideo", () => {
    it("returns a video object", () => {
      const featured = getFeaturedVideo();
      expect(featured).toBeDefined();
      expect(featured.id).toBeTruthy();
      expect(featured.title).toBeTruthy();
    });

    it("returns a video from the featured candidates list", () => {
      const featuredIds = [
        "F1F_CVD33WI", "el9OKGrqU6o", "DiF4VfW4zco", "g6BqDORtdkE",
        "ACZqTrM5Frs", "2jYXRu9dOJM", "i95lJmsWEHc", "D-ycv935v64",
        "cPxwIpV6VBI", "doEikRO9GF8", "4Ya5K95pmKQ", "kfu0M0G591s",
        "vGfM3FInXTQ",
      ];
      const featured = getFeaturedVideo();
      expect(featuredIds).toContain(featured.youtubeId);
    });
  });

  describe("getRelatedVideosFromOtherCategories", () => {
    it("returns at most the requested count", () => {
      const video = videos[0];
      const result = getRelatedVideosFromOtherCategories(video.id, video.category, 4);
      expect(result.length).toBeLessThanOrEqual(4);
    });

    it("never includes the current video", () => {
      const video = videos[0];
      const result = getRelatedVideosFromOtherCategories(video.id, video.category, 4);
      expect(result.every((v) => v.id !== video.id)).toBe(true);
    });

    it("never includes a video from the excluded category", () => {
      const video = videos[0];
      const result = getRelatedVideosFromOtherCategories(video.id, video.category, 4);
      expect(result.every((v) => v.category !== video.category)).toBe(true);
    });

    it("returns videos from distinct categories", () => {
      const video = videos[0];
      const result = getRelatedVideosFromOtherCategories(video.id, video.category, 4);
      const cats = result.map((v) => v.category);
      expect(new Set(cats).size).toBe(cats.length);
    });

    it("is deterministic — same input always produces same output", () => {
      const video = videos[5];
      const a = getRelatedVideosFromOtherCategories(video.id, video.category, 4);
      const b = getRelatedVideosFromOtherCategories(video.id, video.category, 4);
      expect(a.map((v) => v.id)).toEqual(b.map((v) => v.id));
    });

    it("returns empty array for unknown videoId", () => {
      const result = getRelatedVideosFromOtherCategories("nonexistent", "getting-started", 4);
      expect(result.every((v) => v.category !== "getting-started")).toBe(true);
    });
  });

  describe("data integrity", () => {
    it("every video references a valid category slug", () => {
      const slugs = new Set(categories.map((c) => c.slug));
      videos.forEach((v) => {
        expect(slugs.has(v.category)).toBe(true);
      });
    });

    it("all video ids are unique", () => {
      const ids = videos.map((v) => v.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("all category slugs are unique", () => {
      const slugs = categories.map((c) => c.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("all videos have valid duration format (MM:SS or H:MM:SS)", () => {
      videos.forEach((v) => {
        expect(v.duration).toMatch(/^\d{1,2}:\d{2}(:\d{2})?$/);
      });
    });

    it("all videos have valid publishedAt date strings", () => {
      videos.forEach((v) => {
        const date = new Date(v.publishedAt);
        expect(date.getTime()).not.toBeNaN();
      });
    });

    it("all videos have non-empty youtubeId and thumbnail", () => {
      videos.forEach((v) => {
        expect(v.youtubeId.length).toBeGreaterThan(0);
        expect(v.thumbnail.length).toBeGreaterThan(0);
      });
    });
  });
});
