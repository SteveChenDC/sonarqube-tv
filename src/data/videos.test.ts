import { describe, it, expect } from "vitest";
import {
  videos,
  categories,
  getVideoById,
  getVideosByCategory,
  getCategoryBySlug,
  getFeaturedVideo,
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

    it("returns the designated featured video when it exists", () => {
      const featured = getFeaturedVideo();
      const designated = videos.find((v) => v.youtubeId === "el9OKGrqU6o");
      if (designated) {
        expect(featured).toBe(designated);
      } else {
        // Falls back to first video
        expect(featured).toBe(videos[0]);
      }
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
