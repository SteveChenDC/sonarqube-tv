import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Must mock next/font/google before importing the module — it errors in jsdom
vi.mock("next/font/google", () => ({
  Poppins: () => ({ variable: "--font-poppins" }),
  Inter: () => ({ variable: "--font-inter" }),
}));

vi.mock("./globals.css", () => ({}));

vi.mock("@/components/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("@/components/Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("@/components/SearchContext", () => ({
  SearchProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="search-provider">{children}</div>
  ),
}));

import RootLayout, { metadata } from "./layout";

describe("layout metadata", () => {
  it("has correct metadataBase URL", () => {
    expect(metadata.metadataBase?.toString()).toBe(
      "https://stevechendc.github.io/sonarqube-tv"
    );
  });

  it("has default title string", () => {
    const title = metadata.title as { default: string; template: string };
    expect(title.default).toBe(
      "Sonar.tv — Video Tutorials for Code Quality & Security"
    );
  });

  it("has correct title template", () => {
    const title = metadata.title as { default: string; template: string };
    expect(title.template).toBe("%s | Sonar.tv");
  });

  it("has a description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("has keywords including SonarQube and code quality", () => {
    const keywords = metadata.keywords as string[];
    expect(keywords).toContain("SonarQube");
    expect(keywords).toContain("code quality");
  });

  it("has correct openGraph type and siteName", () => {
    const og = metadata.openGraph as {
      type: string;
      siteName: string;
      locale: string;
    };
    expect(og.type).toBe("website");
    expect(og.siteName).toBe("Sonar.tv");
    expect(og.locale).toBe("en_US");
  });

  it("has openGraph image with correct dimensions", () => {
    const og = metadata.openGraph as {
      images: { url: string; width: number; height: number; alt: string }[];
    };
    expect(og.images[0].url).toBe("/og-image.png");
    expect(og.images[0].width).toBe(1200);
    expect(og.images[0].height).toBe(630);
  });

  it("has twitter card type summary_large_image", () => {
    const twitter = metadata.twitter as {
      card: string;
      images: string[];
    };
    expect(twitter.card).toBe("summary_large_image");
    expect(twitter.images).toContain("/og-image.png");
  });
});

describe("RootLayout", () => {
  it("renders children inside a main element", () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Hello World</div>
      </RootLayout>
    );
    const main = document.querySelector("main");
    expect(main).not.toBeNull();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("renders the Header", () => {
    render(
      <RootLayout>
        <div>content</div>
      </RootLayout>
    );
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("renders the Footer", () => {
    render(
      <RootLayout>
        <div>content</div>
      </RootLayout>
    );
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("wraps content in SearchProvider", () => {
    render(
      <RootLayout>
        <div>content</div>
      </RootLayout>
    );
    expect(screen.getByTestId("search-provider")).toBeInTheDocument();
  });

  it("includes Organization JSON-LD script in the document", () => {
    render(
      <RootLayout>
        <div>content</div>
      </RootLayout>
    );
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    const parsed = Array.from(scripts)
      .map((s) => JSON.parse(s.textContent ?? "{}"))
      .find((obj) => obj["@type"] === "Organization");
    expect(parsed).toBeDefined();
    expect(parsed?.name).toBe("SonarSource");
    expect(parsed?.url).toBe("https://www.sonarsource.com");
  });
});
