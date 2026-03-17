import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { categories, videos } from "@/data/videos";

export const metadata: Metadata = {
  title: "Sonar.tv — Video Tutorials for Code Quality & Security",
  description:
    "Video tutorials, webinars, and demos for code verification, code quality, and code security with Sonar.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sonar.tv — Video Tutorials for Code Quality & Security",
    description:
      "Video tutorials, webinars, and demos for code verification, code quality, and code security with Sonar.",
    url: "/",
    type: "website",
  },
};

const BASE_URL = "https://stevechendc.github.io/sonarqube-tv";

// Newest 12 videos for the home page featured ItemList.
// This lets Google discover individual videos via rich carousels directly
// from the home URL, without waiting to crawl every /watch/[id] page.
const recentVideos = [...videos]
  .sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  .slice(0, 12);

const featuredVideoListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Latest SonarQube Video Tutorials on Sonar.tv",
  description:
    "The newest video tutorials, webinars, and demos covering code quality, code security, and clean code practices with SonarQube.",
  url: BASE_URL,
  numberOfItems: recentVideos.length,
  itemListElement: recentVideos.map((video, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "VideoObject",
      name: video.title,
      description: video.description,
      thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
      uploadDate: video.publishedAt,
      contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
      embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
      url: `${BASE_URL}/watch/${video.id}`,
      publisher: {
        "@type": "Organization",
        name: "SonarSource",
        url: "https://www.sonarsource.com",
      },
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(featuredVideoListJsonLd),
        }}
      />
      <HomeContent categories={categories} videos={videos} />
    </>
  );
}
