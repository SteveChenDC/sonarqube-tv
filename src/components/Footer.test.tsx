import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the SonarQube.tv tagline with inline SonarSource link", () => {
    render(<Footer />);
    const tagline = screen.getByText(/a video showcase for/i);
    expect(tagline).toBeTruthy();
    // The inline link inside the tagline paragraph
    const inlineLink = tagline.querySelector("a");
    expect(inlineLink).toHaveAttribute("href", "https://www.sonarsource.com");
    expect(inlineLink).toHaveAttribute("target", "_blank");
    expect(inlineLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders YouTube, GitHub, and SonarSource navigation links", () => {
    render(<Footer />);
    // Footer has internal nav links (Browse + Categories) plus external Connect links
    const allLinks = screen.getAllByRole("link");
    expect(allLinks.length).toBeGreaterThan(4);

    const youtube = screen.getByRole("link", { name: "SonarSource on YouTube" });
    expect(youtube).toHaveAttribute(
      "href",
      "https://www.youtube.com/c/SonarSource"
    );
    expect(youtube).toHaveAttribute("target", "_blank");

    const github = screen.getByRole("link", { name: "SonarSource on GitHub" });
    expect(github).toHaveAttribute("href", "https://github.com/SonarSource");
    expect(github).toHaveAttribute("target", "_blank");
  });

  it("all external links have noopener noreferrer for security", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    // Only external links (with target="_blank") should have rel="noopener noreferrer"
    const externalLinks = links.filter(
      (l) => l.getAttribute("target") === "_blank"
    );
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("renders a sonar-red accent line at the top", () => {
    const { container } = render(<Footer />);
    const accentLine = container.querySelector(".bg-gradient-to-r");
    expect(accentLine).toBeTruthy();
    expect(accentLine?.className).toContain("via-sonar-red");
  });

  it("renders the SonarSource website nav link with correct aria-label and href", () => {
    render(<Footer />);
    const sonarLink = screen.getByRole("link", { name: "SonarSource website" });
    expect(sonarLink).toHaveAttribute("href", "https://www.sonarsource.com");
    expect(sonarLink).toHaveAttribute("target", "_blank");
    expect(sonarLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the Sonar.tv brand name in the footer", () => {
    const { container } = render(<Footer />);
    // Brand heading: "Sonar" + ".tv" span
    const footer = container.querySelector("footer")!;
    expect(footer.textContent).toContain("Sonar");
    expect(footer.textContent).toContain(".tv");
  });

  it("displays the current year in the copyright notice", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    // © {year} SonarSource SA. All rights reserved.
    expect(screen.getByText(new RegExp(String(currentYear)))).toBeTruthy();
  });

  it("copyright text contains 'SonarSource SA'", () => {
    render(<Footer />);
    expect(screen.getByText(/SonarSource SA/)).toBeTruthy();
  });

  it("renders Browse section with All Videos and Certification Courses links", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: "Site sections" });
    expect(nav).toBeTruthy();
    const allVideos = screen.getByRole("link", { name: "All Videos" });
    expect(allVideos).toHaveAttribute("href", "/");
    const courses = screen.getByRole("link", { name: "Certification Courses" });
    expect(courses).toHaveAttribute("href", "/courses");
  });

  it("renders all 11 category links in the Categories section", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: "Video categories" });
    expect(nav).toBeTruthy();
    const categoryLinks = [
      { name: "Getting Started", href: "/category/getting-started" },
      { name: "AI & Code Verification", href: "/category/ai-code-quality" },
      { name: "Code Security", href: "/category/code-security" },
      { name: "Code Quality", href: "/category/code-quality" },
      { name: "DevOps & CI/CD", href: "/category/devops-cicd" },
      { name: "SonarQube Cloud", href: "/category/sonarqube-cloud" },
      { name: "SonarQube for IDE", href: "/category/sonarqube-for-ide" },
      { name: "Product Updates", href: "/category/product-updates" },
      {
        name: "Architecture & Governance",
        href: "/category/architecture-governance",
      },
      { name: "Sonar Summit", href: "/category/sonar-summit" },
      { name: "Customer Stories", href: "/category/customer-stories" },
    ];
    for (const { name, href } of categoryLinks) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("href", href);
    }
  });

  it("renders the brand Sonar.tv link pointing to home", () => {
    render(<Footer />);
    // The brand logo link in the footer goes to /
    const brandLinks = screen
      .getAllByRole("link")
      .filter(
        (l) =>
          l.getAttribute("href") === "/" &&
          l.textContent?.includes("Sonar") &&
          l.textContent?.includes(".tv")
      );
    expect(brandLinks.length).toBeGreaterThan(0);
  });

  it("renders the Connect section with 3 external links", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: "External links" });
    const externalLinks = Array.from(nav.querySelectorAll("a[target='_blank']"));
    expect(externalLinks).toHaveLength(3);
  });
});
