import { describe, it, expect } from "vitest";
import { videos, categories } from "@/data/videos";
import sitemap from "./sitemap";

const BASE_URL = "https://stevechendc.github.io/sonarqube-tv";

describe("sitemap()", () => {
  it("returns the correct total number of entries", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(1 + categories.length + videos.length);
  });

  it("includes the home page as the first entry", () => {
    const entries = sitemap();
    expect(entries[0].url).toBe(BASE_URL);
  });

  it("home page has priority 1.0", () => {
    const entries = sitemap();
    expect(entries[0].priority).toBe(1.0);
  });

  it("home page has changeFrequency 'daily'", () => {
    const entries = sitemap();
    expect(entries[0].changeFrequency).toBe("daily");
  });

  it("includes all category pages with correct URLs", () => {
    const entries = sitemap();
    for (const category of categories) {
      const match = entries.find(
        (e) => e.url === `${BASE_URL}/category/${category.slug}`
      );
      expect(match).toBeDefined();
    }
  });

  it("category pages have priority 0.8", () => {
    const entries = sitemap();
    const categoryEntries = entries.filter((e) =>
      e.url.includes("/category/")
    );
    expect(categoryEntries).toHaveLength(categories.length);
    for (const entry of categoryEntries) {
      expect(entry.priority).toBe(0.8);
    }
  });

  it("category pages have changeFrequency 'weekly'", () => {
    const entries = sitemap();
    const categoryEntries = entries.filter((e) =>
      e.url.includes("/category/")
    );
    for (const entry of categoryEntries) {
      expect(entry.changeFrequency).toBe("weekly");
    }
  });

  it("includes all video watch pages with correct URLs", () => {
    const entries = sitemap();
    for (const video of videos) {
      const match = entries.find(
        (e) => e.url === `${BASE_URL}/watch/${video.id}`
      );
      expect(match).toBeDefined();
    }
  });

  it("video pages have priority 0.6", () => {
    const entries = sitemap();
    const videoEntries = entries.filter((e) => e.url.includes("/watch/"));
    expect(videoEntries).toHaveLength(videos.length);
    for (const entry of videoEntries) {
      expect(entry.priority).toBe(0.6);
    }
  });

  it("video pages have changeFrequency 'monthly'", () => {
    const entries = sitemap();
    const videoEntries = entries.filter((e) => e.url.includes("/watch/"));
    for (const entry of videoEntries) {
      expect(entry.changeFrequency).toBe("monthly");
    }
  });

  it("video lastModified matches the video's publishedAt date", () => {
    const entries = sitemap();
    for (const video of videos) {
      const entry = entries.find(
        (e) => e.url === `${BASE_URL}/watch/${video.id}`
      );
      expect(entry).toBeDefined();
      expect(entry!.lastModified).toEqual(new Date(video.publishedAt));
    }
  });

  it("all entry URLs start with the base URL", () => {
    const entries = sitemap();
    for (const entry of entries) {
      expect(entry.url).toMatch(new RegExp(`^${BASE_URL}`));
    }
  });

  it("no duplicate URLs in the sitemap", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBe(urls.length);
  });
});
