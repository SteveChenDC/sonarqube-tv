import { describe, it, expect } from "vitest";
import {
  categories,
  videos,
  getVideoById,
  getVideosByCategory,
  getCategoryBySlug,
  getFeaturedVideo,
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
      "clean-code",
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
    const result = getVideosByCategory("clean-code");
    expect(result.length).toBeGreaterThan(0);
    for (const v of result) {
      expect(v.category).toBe("clean-code");
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
