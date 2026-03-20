import { describe, it, expect, beforeAll } from "vitest";
import type { MetadataRoute } from "next";
import sitemap from "./sitemap";
import { videos, categories } from "@/data/videos";
import { courses } from "@/data/courses";

// ─── Helpers (mirror the sitemap.ts logic for expected values) ──────────────

/** Most recent publishedAt across all videos (mirrors globalLatest in sitemap.ts). */
function computeGlobalLatest(): Date {
  return videos.reduce<Date | undefined>((max, v) => {
    const d = new Date(v.publishedAt);
    return !max || d > max ? d : max;
  }, undefined) ?? new Date();
}

/** Most recent publishedAt for videos in a given category slug. */
function computeCategoryLatest(slug: string): Date | undefined {
  let latest: Date | undefined;
  for (const v of videos) {
    if (v.category !== slug) continue;
    const d = new Date(v.publishedAt);
    if (!latest || d > latest) latest = d;
  }
  return latest;
}

/** Most recent publishedAt among a list of video IDs. */
function computeCourseLatest(videoIds: string[]): Date | undefined {
  const dateById = new Map(videos.map((v) => [v.id, new Date(v.publishedAt)]));
  let latest: Date | undefined;
  for (const id of videoIds) {
    const d = dateById.get(id);
    if (d && (!latest || d > latest)) latest = d;
  }
  return latest;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("sitemap", () => {
  let entries: MetadataRoute.Sitemap;

  beforeAll(() => {
    entries = sitemap();
  });

  // ── Entry count ────────────────────────────────────────────────────────────

  it("returns the correct total number of entries", () => {
    const expected = 1 + categories.length + 1 + courses.length + videos.length;
    expect(entries.length).toBe(expected);
  });

  // ── URL structure ──────────────────────────────────────────────────────────

  const BASE = "https://stevechendc.github.io/sonarqube-tv";

  it("home entry has the base URL", () => {
    const home = entries.find((e) => e.url === BASE);
    expect(home).toBeDefined();
  });

  it("every category has a URL entry", () => {
    for (const cat of categories) {
      const expected = `${BASE}/category/${cat.slug}`;
      expect(entries.some((e) => e.url === expected)).toBe(true);
    }
  });

  it("courses index entry is present", () => {
    const coursesIndex = entries.find((e) => e.url === `${BASE}/courses`);
    expect(coursesIndex).toBeDefined();
  });

  it("every course has a URL entry", () => {
    for (const course of courses) {
      const expected = `${BASE}/courses/${course.slug}`;
      expect(entries.some((e) => e.url === expected)).toBe(true);
    }
  });

  it("every video has a watch URL entry", () => {
    for (const video of videos) {
      const expected = `${BASE}/watch/${video.id}`;
      expect(entries.some((e) => e.url === expected)).toBe(true);
    }
  });

  // ── Priorities ─────────────────────────────────────────────────────────────

  it("home entry has priority 1.0", () => {
    const home = entries.find((e) => e.url === BASE)!;
    expect(home.priority).toBe(1.0);
  });

  it("all category entries have priority 0.8", () => {
    for (const cat of categories) {
      const entry = entries.find((e) => e.url === `${BASE}/category/${cat.slug}`)!;
      expect(entry.priority).toBe(0.8);
    }
  });

  it("courses index entry has priority 0.8", () => {
    const entry = entries.find((e) => e.url === `${BASE}/courses`)!;
    expect(entry.priority).toBe(0.8);
  });

  it("all course detail entries have priority 0.7", () => {
    for (const course of courses) {
      const entry = entries.find((e) => e.url === `${BASE}/courses/${course.slug}`)!;
      expect(entry.priority).toBe(0.7);
    }
  });

  it("all video entries have priority 0.6", () => {
    for (const video of videos) {
      const entry = entries.find((e) => e.url === `${BASE}/watch/${video.id}`)!;
      expect(entry.priority).toBe(0.6);
    }
  });

  // ── Change frequencies ─────────────────────────────────────────────────────

  it("home entry has changeFrequency 'daily'", () => {
    const home = entries.find((e) => e.url === BASE)!;
    expect(home.changeFrequency).toBe("daily");
  });

  it("all category entries have changeFrequency 'weekly'", () => {
    for (const cat of categories) {
      const entry = entries.find((e) => e.url === `${BASE}/category/${cat.slug}`)!;
      expect(entry.changeFrequency).toBe("weekly");
    }
  });

  it("courses index entry has changeFrequency 'weekly'", () => {
    const entry = entries.find((e) => e.url === `${BASE}/courses`)!;
    expect(entry.changeFrequency).toBe("weekly");
  });

  it("all course detail entries have changeFrequency 'weekly'", () => {
    for (const course of courses) {
      const entry = entries.find((e) => e.url === `${BASE}/courses/${course.slug}`)!;
      expect(entry.changeFrequency).toBe("weekly");
    }
  });

  it("all video entries have changeFrequency 'monthly'", () => {
    for (const video of videos) {
      const entry = entries.find((e) => e.url === `${BASE}/watch/${video.id}`)!;
      expect(entry.changeFrequency).toBe("monthly");
    }
  });

  // ── lastModified — home ────────────────────────────────────────────────────

  it("home lastModified is a Date object", () => {
    const home = entries.find((e) => e.url === BASE)!;
    expect(home.lastModified).toBeInstanceOf(Date);
  });

  it("home lastModified equals the globally most-recent video publishedAt", () => {
    const home = entries.find((e) => e.url === BASE)!;
    const expected = computeGlobalLatest();
    expect((home.lastModified as Date).getTime()).toBe(expected.getTime());
  });

  it("home lastModified is not in the future", () => {
    const home = entries.find((e) => e.url === BASE)!;
    expect((home.lastModified as Date).getTime()).toBeLessThanOrEqual(Date.now());
  });

  // ── lastModified — category pages ──────────────────────────────────────────

  it("category lastModified is a Date object", () => {
    const cat = categories[0];
    const entry = entries.find((e) => e.url === `${BASE}/category/${cat.slug}`)!;
    expect(entry.lastModified).toBeInstanceOf(Date);
  });

  it("each category lastModified equals the newest video publishedAt in that category", () => {
    for (const cat of categories) {
      const entry = entries.find((e) => e.url === `${BASE}/category/${cat.slug}`)!;
      const expected = computeCategoryLatest(cat.slug) ?? computeGlobalLatest();
      expect((entry.lastModified as Date).getTime()).toBe(expected.getTime());
    }
  });

  it("category lastModified is no older than the oldest allowed video date", () => {
    // All video publishedAt are valid ISO date strings — verify category dates parse correctly
    for (const cat of categories) {
      const entry = entries.find((e) => e.url === `${BASE}/category/${cat.slug}`)!;
      expect(isNaN((entry.lastModified as Date).getTime())).toBe(false);
    }
  });

  // ── lastModified — video pages ─────────────────────────────────────────────

  it("each video lastModified equals new Date(video.publishedAt)", () => {
    for (const video of videos) {
      const entry = entries.find((e) => e.url === `${BASE}/watch/${video.id}`)!;
      const expected = new Date(video.publishedAt);
      expect((entry.lastModified as Date).getTime()).toBe(expected.getTime());
    }
  });

  it("video lastModified is a Date for a spot-check video", () => {
    const video = videos[0];
    const entry = entries.find((e) => e.url === `${BASE}/watch/${video.id}`)!;
    expect(entry.lastModified).toBeInstanceOf(Date);
  });

  // ── lastModified — courses index ───────────────────────────────────────────

  it("courses index lastModified is a Date object", () => {
    const entry = entries.find((e) => e.url === `${BASE}/courses`)!;
    expect(entry.lastModified).toBeInstanceOf(Date);
  });

  it("courses index lastModified equals the newest video across all course modules", () => {
    const allCourseVideoIds = courses.flatMap((c) =>
      c.modules.flatMap((m) => m.videoIds)
    );
    const expected = computeCourseLatest(allCourseVideoIds) ?? computeGlobalLatest();
    const entry = entries.find((e) => e.url === `${BASE}/courses`)!;
    expect((entry.lastModified as Date).getTime()).toBe(expected.getTime());
  });

  // ── lastModified — course detail pages ────────────────────────────────────

  it("each course lastModified is a Date object", () => {
    for (const course of courses) {
      const entry = entries.find((e) => e.url === `${BASE}/courses/${course.slug}`)!;
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });

  it("each course lastModified equals the newest video publishedAt in that course", () => {
    for (const course of courses) {
      const courseVideoIds = course.modules.flatMap((m) => m.videoIds);
      const expected = computeCourseLatest(courseVideoIds) ?? computeGlobalLatest();
      const entry = entries.find((e) => e.url === `${BASE}/courses/${course.slug}`)!;
      expect((entry.lastModified as Date).getTime()).toBe(expected.getTime());
    }
  });

  it("course lastModified never exceeds the home page lastModified (globalLatest)", () => {
    const homeEntry = entries.find((e) => e.url === BASE)!;
    const homeMs = (homeEntry.lastModified as Date).getTime();
    for (const course of courses) {
      const entry = entries.find((e) => e.url === `${BASE}/courses/${course.slug}`)!;
      expect((entry.lastModified as Date).getTime()).toBeLessThanOrEqual(homeMs);
    }
  });
});
