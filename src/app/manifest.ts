import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sonar.tv — Video Tutorials for Code Quality & Security",
    short_name: "Sonar.tv",
    description:
      "Video tutorials, webinars, and demos for code verification, code quality, and code security with SonarQube.",
    start_url: "/sonarqube-tv/",
    scope: "/sonarqube-tv/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#D3121D",
    icons: [
      {
        src: "/sonarqube-tv/og-image.png",
        sizes: "1200x630",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["education", "developer tools"],
    lang: "en",
    dir: "ltr",
    orientation: "portrait-primary",
  };
}
