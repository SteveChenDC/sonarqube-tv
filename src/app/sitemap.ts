import type { MetadataRoute } from "next";
import { videos, categories } from "@/data/videos";

const BASE_URL = "https://sonarqube-tv.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const videoEntries: MetadataRoute.Sitemap = videos.map((video) => ({
    url: `${BASE_URL}/watch/${video.id}`,
    lastModified: new Date(video.publishedAt),
    priority: 0.6,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      priority: 1.0,
    },
    ...categoryEntries,
    ...videoEntries,
  ];
}
