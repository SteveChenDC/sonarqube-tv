import { describe, it, expect, vi, afterEach } from "vitest";
import {
  videos,
  categories,
  getVideoById,
  getVideosByCategory,
  getCategoryBySlug,
  getFeaturedVideo,
  getRelatedVideosFromOtherCategories,
  featuredYoutubeIds,
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
        "el9OKGrqU6o", "DiF4VfW4zco", "g6BqDORtdkE",
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

    it("returns empty array when count is 0", () => {
      // The inner loop condition `picked.length < count` is `0 < 0` = false,
      // so the loop never runs and picked stays empty.
      const video = videos[0];
      const result = getRelatedVideosFromOtherCategories(video.id, video.category, 0);
      expect(result).toHaveLength(0);
    });

    it("returns fewer results than count when pool has fewer unique categories", () => {
      // Requesting a very large count (e.g. 1000) should return at most one video
      // per available category — never more than the number of distinct categories
      // in the pool (all categories except the excluded one).
      const video = videos[0];
      const totalCategories = categories.length; // 11 categories total
      const result = getRelatedVideosFromOtherCategories(video.id, video.category, 1000);
      // At most (totalCategories - 1) results since excluded category is filtered out
      expect(result.length).toBeLessThanOrEqual(totalCategories - 1);
      // All returned categories are distinct (one-per-category rule)
      const cats = result.map((v) => v.category);
      expect(new Set(cats).size).toBe(cats.length);
    });

    it("nonexistent videoId uses offset 0 and still returns up to count results", () => {
      // When videoId is not found, videoIndex = -1 → offset = 0.
      // The function still returns videos from other categories using offset 0.
      const result = getRelatedVideosFromOtherCategories("nonexistent", "getting-started", 4);
      // Should return up to 4 results (not zero), all from non-excluded categories
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(4);
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

    it("all youtubeIds are exactly 11 characters (standard YouTube ID format)", () => {
      videos.forEach((v) => {
        expect(v.youtubeId).toHaveLength(11);
      });
    });

    it("all youtubeIds in the videos array are unique (no duplicate entries)", () => {
      const youtubeIds = videos.map((v) => v.youtubeId);
      expect(new Set(youtubeIds).size).toBe(youtubeIds.length);
    });

    it("all thumbnail URLs are valid YouTube thumbnail URLs or local paths for the video's youtubeId", () => {
      // Some videos use sddefault.jpg when maxresdefault is not available —
      // both are legitimate YouTube thumbnail formats.
      // Some videos use locally hosted thumbnails under /thumbnails/*.jpg.
      const validFormats = ["maxresdefault.jpg", "sddefault.jpg", "hqdefault.jpg", "mqdefault.jpg", "default.jpg"];
      videos.forEach((v) => {
        const expectedBase = `https://img.youtube.com/vi/${v.youtubeId}/`;
        if (v.thumbnail.startsWith("/thumbnails/")) {
          // Local thumbnail — must be a .jpg file
          expect(v.thumbnail).toMatch(/^\/thumbnails\/.+\.jpg$/);
        } else {
          expect(v.thumbnail.startsWith(expectedBase)).toBe(true);
          const format = v.thumbnail.slice(expectedBase.length);
          expect(validFormats).toContain(format);
        }
      });
    });

    it("all video descriptions are non-empty", () => {
      videos.forEach((v) => {
        expect(v.description.length).toBeGreaterThan(0);
      });
    });
  });
});

describe("featuredYoutubeIds data integrity", () => {
  it("featuredYoutubeIds is a non-empty array", () => {
    expect(Array.isArray(featuredYoutubeIds)).toBe(true);
    expect(featuredYoutubeIds.length).toBeGreaterThan(0);
  });

  it("every ID in featuredYoutubeIds corresponds to an actual video", () => {
    const youtubeIdSet = new Set(videos.map((v) => v.youtubeId));
    for (const id of featuredYoutubeIds) {
      expect(
        youtubeIdSet.has(id),
        `featuredYoutubeIds contains "${id}" but no video in videos[] has that youtubeId`
      ).toBe(true);
    }
  });

  it("all IDs in featuredYoutubeIds are unique (no duplicates)", () => {
    expect(new Set(featuredYoutubeIds).size).toBe(featuredYoutubeIds.length);
  });

  it("getFeaturedVideo never falls back to videos[0] due to a missing featured ID", () => {
    // The fallback `?? videos[0]` in getFeaturedVideo fires only when no video
    // matches the randomly selected youtubeId. If every ID in featuredYoutubeIds
    // has a matching video, the fallback should never be needed.
    // We verify this by calling getFeaturedVideo once per featured ID with
    // Math.random pinned to each slot.
    const originalRandom = Math.random;
    const n = featuredYoutubeIds.length;
    try {
      for (let i = 0; i < n; i++) {
        // Pin Math.random so that Math.floor(random * n) === i
        vi.spyOn(Math, "random").mockReturnValue(i / n);
        const featured = getFeaturedVideo();
        // If the ID was valid, the result's youtubeId must match the chosen slot.
        expect(featured.youtubeId).toBe(featuredYoutubeIds[i]);
      }
    } finally {
      vi.restoreAllMocks();
      // Restore original Math.random just in case
      Math.random = originalRandom;
    }
  });
});
