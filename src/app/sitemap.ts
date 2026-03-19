import type { MetadataRoute } from "next";
import { videos, categories } from "@/data/videos";
import { courses } from "@/data/courses";

export const dynamic = "force-static";

const BASE_URL = "https://stevechendc.github.io/sonarqube-tv";

// Build a quick lookup: category slug → most recent publishedAt date among its videos.
// Googlebot uses lastModified to prioritise recrawls — returning new Date() on every
// build falsely signals that ALL pages changed today, wasting crawl budget on
// unchanged category/course pages. Real content dates give accurate freshness signals.
const videosByCategory = new Map<string, Date>();
for (const video of videos) {
  const date = new Date(video.publishedAt);
  const existing = videosByCategory.get(video.category);
  if (!existing || date > existing) {
    videosByCategory.set(video.category, date);
  }
}

// Build a lookup: video id → publishedAt date for fast course-video age lookups.
const videoDateById = new Map<string, Date>(
  videos.map((v) => [v.id, new Date(v.publishedAt)])
);

/** Latest publishedAt among all videos in a course's modules (or undefined if none found). */
function courseLastModified(videoIds: string[]): Date | undefined {
  let latest: Date | undefined;
  for (const id of videoIds) {
    const date = videoDateById.get(id);
    if (date && (!latest || date > latest)) {
      latest = date;
    }
  }
  return latest;
}

// Global most-recent video date — used as lastModified for the home page.
const globalLatest = videos.reduce<Date | undefined>((max, v) => {
  const d = new Date(v.publishedAt);
  return !max || d > max ? d : max;
}, undefined) ?? new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  // Home page — reflects the most recently published video so Googlebot knows
  // to recrawl after new content is added, not just after every build.
  const home: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: globalLatest,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Category pages — each dated by the newest video in that category so unchanged
  // categories don't compete for crawl budget with freshly updated ones.
  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/category/${category.slug}`,
    lastModified: videosByCategory.get(category.slug) ?? globalLatest,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Video watch pages — use publishedAt for lastModified (unchanged from before)
  const videoUrls: MetadataRoute.Sitemap = videos.map((video) => ({
    url: `${BASE_URL}/watch/${video.id}`,
    lastModified: new Date(video.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // All video IDs referenced by any course — used to date the courses index.
  const allCourseVideoIds = courses.flatMap((c) =>
    c.modules.flatMap((m) => m.videoIds)
  );
  const coursesIndexDate = courseLastModified(allCourseVideoIds) ?? globalLatest;

  // Courses index page — dated by the most recently published video across all courses.
  const coursesIndex: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/courses`,
      lastModified: coursesIndexDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  // Individual course detail pages — each dated by the newest video in that course.
  const courseUrls: MetadataRoute.Sitemap = courses.map((course) => {
    const courseVideoIds = course.modules.flatMap((m) => m.videoIds);
    return {
      url: `${BASE_URL}/courses/${course.slug}`,
      lastModified: courseLastModified(courseVideoIds) ?? globalLatest,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  return [...home, ...categoryUrls, ...coursesIndex, ...courseUrls, ...videoUrls];
}
