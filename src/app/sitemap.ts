import type { MetadataRoute } from "next";
import { videos, categories } from "@/data/videos";
import { courses } from "@/data/courses";

export const dynamic = "force-static";

const BASE_URL = "https://stevechendc.github.io/sonarqube-tv";

export default function sitemap(): MetadataRoute.Sitemap {
  // Home page
  const home: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Category pages
  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Video watch pages — use publishedAt for lastModified
  const videoUrls: MetadataRoute.Sitemap = videos.map((video) => ({
    url: `${BASE_URL}/watch/${video.id}`,
    lastModified: new Date(video.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Courses index page
  const coursesIndex: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/courses`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  // Individual course detail pages
  const courseUrls: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${BASE_URL}/courses/${course.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...home, ...categoryUrls, ...coursesIndex, ...courseUrls, ...videoUrls];
}
