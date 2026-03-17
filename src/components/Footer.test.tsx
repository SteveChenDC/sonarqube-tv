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

    const youtube = screen.getByRole("link", { name: "SonarSource on YouTube" });
    expect(youtube).toHaveAttribute("href", "https://www.youtube.com/c/SonarSource");
    expect(youtube).toHaveAttribute("target", "_blank");
    expect(youtube).toHaveAttribute("rel", "noopener noreferrer");

    const github = screen.getByRole("link", { name: "SonarSource on GitHub" });
    expect(github).toHaveAttribute("href", "https://github.com/SonarSource");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");

    const sonar = screen.getByRole("link", { name: "SonarSource website" });
    expect(sonar).toHaveAttribute("href", "https://www.sonarsource.com");
    expect(sonar).toHaveAttribute("target", "_blank");
    expect(sonar).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("all external links have noopener noreferrer for security", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    const externalLinks = links.filter(l => l.getAttribute("target") === "_blank");
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
});
