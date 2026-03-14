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
    const links = screen.getAllByRole("link");
    // 4 links total: inline SonarSource + YouTube, GitHub, SonarSource nav
    expect(links).toHaveLength(4);

    const youtube = screen.getByRole("link", { name: "YouTube" });
    expect(youtube).toHaveAttribute(
      "href",
      "https://www.youtube.com/c/SonarSource"
    );
    expect(youtube).toHaveAttribute("target", "_blank");

    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("href", "https://github.com/SonarSource");
    expect(github).toHaveAttribute("target", "_blank");
  });

  it("all external links have noopener noreferrer for security", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    for (const link of links) {
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
