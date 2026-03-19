import { describe, it, expect } from "vitest";
import {
  categories,
  videos,
  getVideoById,
  getVideosByCategory,
  getCategoryBySlug,
  getFeaturedVideo,
  getRelatedVideosFromOtherCategories,
} from "@/data/videos";

describe("Video data integrity", () => {
  it("has 11 categories defined", () => {
    expect(categories).toHaveLength(11);
  });

  it("has unique category slugs", () => {
    const slugs = categories.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has no empty category titles or descriptions", () => {
    for (const cat of categories) {
      expect(cat.title.length).toBeGreaterThan(0);
      expect(cat.description.length).toBeGreaterThan(0);
    }
  });

  it("has unique video IDs", () => {
    const ids = videos.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has no videos with empty required fields", () => {
    for (const video of videos) {
      expect(video.id).toBeTruthy();
      expect(video.title).toBeTruthy();
      expect(video.youtubeId).toBeTruthy();
      expect(video.category).toBeTruthy();
      expect(video.duration).toBeTruthy();
      expect(video.publishedAt).toBeTruthy();
    }
  });

  it("every video references a valid category slug", () => {
    const validSlugs = new Set(categories.map((c) => c.slug));
    for (const video of videos) {
      expect(validSlugs.has(video.category)).toBe(true);
    }
  });

  it("no category is empty (every category has at least one video)", () => {
    for (const cat of categories) {
      const count = videos.filter((v) => v.category === cat.slug).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it("does not contain the removed webinars-talks category", () => {
    const slugs = categories.map((c) => c.slug);
    expect(slugs).not.toContain("webinars-talks");
  });

  it("does not have any videos in webinars-talks", () => {
    const webinarVideos = videos.filter((v) => v.category === "webinars-talks");
    expect(webinarVideos).toHaveLength(0);
  });

  it("does not contain removed legacy slugs", () => {
    const slugs = new Set(categories.map((c) => c.slug));
    expect(slugs.has("security")).toBe(false);
    expect(slugs.has("sonarlint-ide")).toBe(false);
    expect(slugs.has("architecture-scalability")).toBe(false);
  });

  it("no videos reference removed legacy slugs", () => {
    const legacySlugs = ["security", "sonarlint-ide", "architecture-scalability", "webinars-talks"];
    for (const video of videos) {
      expect(legacySlugs).not.toContain(video.category);
    }
  });

  it("contains the expected new category slugs", () => {
    const slugs = new Set(categories.map((c) => c.slug));
    const expected = [
      "getting-started",
      "sonar-summit",
      "ai-code-quality",
      "code-security",
      "code-quality",
      "product-updates",
      "sonarqube-cloud",
      "devops-cicd",
      "sonarqube-for-ide",
      "architecture-governance",
      "customer-stories",
    ];
    for (const slug of expected) {
      expect(slugs.has(slug)).toBe(true);
    }
  });

  it("getting-started is the first category", () => {
    expect(categories[0].slug).toBe("getting-started");
  });

  it("sonar-summit category exists and has videos", () => {
    const summit = categories.find((c) => c.slug === "sonar-summit");
    expect(summit).toBeDefined();
    const summitVideos = videos.filter((v) => v.category === "sonar-summit");
    expect(summitVideos.length).toBeGreaterThan(0);
  });

  it("all Sonar Summit titled videos are in the sonar-summit category", () => {
    const summitTitled = videos.filter((v) =>
      v.title.includes("Sonar Summit")
    );
    for (const video of summitTitled) {
      expect(video.category).toBe("sonar-summit");
    }
  });

  it("publishedAt dates are valid ISO date strings", () => {
    for (const video of videos) {
      const date = new Date(video.publishedAt);
      expect(date.toString()).not.toBe("Invalid Date");
    }
  });

  it("duration strings match expected format (H:MM:SS or M:SS or MM:SS)", () => {
    const durationRegex = /^\d{1,2}(:\d{2}){1,2}$/;
    for (const video of videos) {
      expect(video.duration).toMatch(durationRegex);
    }
  });
});

describe("Video data helper functions", () => {
  it("getVideoById returns the correct video", () => {
    const video = getVideoById("v1");
    expect(video).toBeDefined();
    expect(video!.id).toBe("v1");
  });

  it("getVideoById returns undefined for non-existent ID", () => {
    expect(getVideoById("nonexistent")).toBeUndefined();
  });

  it("getVideosByCategory returns only videos in that category", () => {
    const result = getVideosByCategory("code-quality");
    expect(result.length).toBeGreaterThan(0);
    for (const v of result) {
      expect(v.category).toBe("code-quality");
    }
  });

  it("getVideosByCategory returns empty array for invalid category", () => {
    expect(getVideosByCategory("nonexistent")).toHaveLength(0);
  });

  it("getCategoryBySlug returns the correct category", () => {
    const cat = getCategoryBySlug("code-security");
    expect(cat).toBeDefined();
    expect(cat!.slug).toBe("code-security");
    expect(cat!.title).toBe("Code Security");
  });

  it("getCategoryBySlug returns undefined for invalid slug", () => {
    expect(getCategoryBySlug("nonexistent")).toBeUndefined();
  });

  it("getFeaturedVideo returns a valid video", () => {
    const featured = getFeaturedVideo();
    expect(featured).toBeDefined();
    expect(featured.id).toBeTruthy();
    expect(featured.youtubeId).toBeTruthy();
  });
});

describe("getRelatedVideosFromOtherCategories", () => {
  // Pick a real video to use as the base for most tests
  const baseVideo = videos[0];
  const baseCategory = baseVideo.category;

  it("returns at most count videos (default count=4)", () => {
    const result = getRelatedVideosFromOtherCategories(baseVideo.id, baseCategory);
    expect(result.length).toBeLessThanOrEqual(4);
  });

  it("returns exactly count videos when the pool is large enough", () => {
    // With 11 categories and many videos, there are always ≥ 4 other categories
    const result = getRelatedVideosFromOtherCategories(baseVideo.id, baseCategory, 4);
    expect(result).toHaveLength(4);
  });

  it("never includes a video from the excluded category", () => {
    const result = getRelatedVideosFromOtherCategories(baseVideo.id, baseCategory);
    for (const v of result) {
      expect(v.category).not.toBe(baseCategory);
    }
  });

  it("never includes the video itself in the results", () => {
    const result = getRelatedVideosFromOtherCategories(baseVideo.id, baseCategory);
    for (const v of result) {
      expect(v.id).not.toBe(baseVideo.id);
    }
  });

  it("returns at most one video per category (variety guarantee)", () => {
    // Request up to 6 to exercise the deduplication path across multiple categories
    const result = getRelatedVideosFromOtherCategories(baseVideo.id, baseCategory, 6);
    const returnedCategories = result.map((v) => v.category);
    // All categories in the result must be unique
    expect(new Set(returnedCategories).size).toBe(returnedCategories.length);
  });

  it("respects the count override (count=2)", () => {
    const result = getRelatedVideosFromOtherCategories(baseVideo.id, baseCategory, 2);
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it("returns an empty array when count=0", () => {
    const result = getRelatedVideosFromOtherCategories(baseVideo.id, baseCategory, 0);
    expect(result).toHaveLength(0);
  });

  it("returns valid Video objects with all required fields populated", () => {
    const result = getRelatedVideosFromOtherCategories(baseVideo.id, baseCategory, 4);
    for (const v of result) {
      expect(v.id).toBeTruthy();
      expect(v.title).toBeTruthy();
      expect(v.youtubeId).toBeTruthy();
      expect(v.category).toBeTruthy();
      expect(v.duration).toBeTruthy();
      expect(v.publishedAt).toBeTruthy();
    }
  });

  it("falls back gracefully (offset=0) when videoId is not found", () => {
    // Unknown videoId → videoIndex = -1 → offset = 0, same as videos[0]
    // Pool differs only by ID exclusion: unknown excludes nothing extra by ID
    // Key assertion: does not throw and returns valid results
    const result = getRelatedVideosFromOtherCategories("nonexistent-video-id", baseCategory);
    expect(result.length).toBeLessThanOrEqual(4);
    for (const v of result) {
      expect(v.category).not.toBe(baseCategory);
      expect(v.id).toBeTruthy();
    }
  });

  it("uses the video's index as rotation offset — two videos in the same category produce different selections", () => {
    // Find at least two videos in the same category so the exclusion category is the same
    const catSlug = baseCategory;
    const sameCatVideos = videos.filter((v) => v.category === catSlug);
    // Need at least 2 videos in the category to compare offsets
    if (sameCatVideos.length < 2) return;

    const v0 = sameCatVideos[0];
    const v1 = sameCatVideos[1];
    const idx0 = videos.findIndex((v) => v.id === v0.id); // offset for v0
    const idx1 = videos.findIndex((v) => v.id === v1.id); // offset for v1

    // Offsets must differ for this test to be meaningful
    if (idx0 === idx1) return;

    const resultA = getRelatedVideosFromOtherCategories(v0.id, catSlug, 4);
    const resultB = getRelatedVideosFromOtherCategories(v1.id, catSlug, 4);

    // Both results must be valid (no excluded category)
    for (const v of resultA) expect(v.category).not.toBe(catSlug);
    for (const v of resultB) expect(v.category).not.toBe(catSlug);

    // Rotation should produce at least one different video between the two selections
    const idsA = new Set(resultA.map((v) => v.id));
    const idsB = new Set(resultB.map((v) => v.id));
    const allSame = resultA.every((v) => idsB.has(v.id)) && resultA.length === resultB.length;
    expect(allSame).toBe(false);
  });

  it("treats an unknown excludeCategory as excluding nothing — all non-self videos are candidates", () => {
    const result = getRelatedVideosFromOtherCategories(baseVideo.id, "nonexistent-category", 4);
    // The base video itself should still be excluded
    for (const v of result) {
      expect(v.id).not.toBe(baseVideo.id);
    }
    // Pool includes all categories, so result can span any category
    expect(result.length).toBeLessThanOrEqual(4);
    expect(result.length).toBeGreaterThan(0);
  });

  it("returned videos are all distinct (no duplicates)", () => {
    const result = getRelatedVideosFromOtherCategories(baseVideo.id, baseCategory, 6);
    const ids = result.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
