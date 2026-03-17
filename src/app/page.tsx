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

export default function Home() {
  return (
    <HomeContent
      categories={categories}
      videos={videos}
    />
  );
}
