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
      site: string;
      images: string[];
    };
    expect(twitter.card).toBe("summary_large_image");
    expect(twitter.site).toBe("@SonarSource");
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
    // There may be multiple JSON-LD scripts — find the Organization one
    const parsedScripts = Array.from(scripts).map((s) =>
      JSON.parse(s.textContent ?? "{}")
    );
    const org = parsedScripts.find((p) => p["@type"] === "Organization");
    expect(org).toBeDefined();
    expect(org.name).toBe("SonarSource");
    expect(org.url).toBe("https://www.sonarsource.com");
  });

  it("JSON-LD Organization includes a logo field", () => {
    render(
      <RootLayout>
        <div>content</div>
      </RootLayout>
    );
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const parsedScripts = Array.from(scripts).map((s) =>
      JSON.parse(s.textContent ?? "{}")
    );
    const org = parsedScripts.find((p) => p["@type"] === "Organization");
    expect(org).toBeDefined();
    expect(org.logo).toBeTruthy();
    expect(org.logo).toContain("sonarsource.com");
  });

  it("JSON-LD Organization sameAs includes YouTube, Twitter, LinkedIn, and GitHub", () => {
    render(
      <RootLayout>
        <div>content</div>
      </RootLayout>
    );
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const parsedScripts = Array.from(scripts).map((s) =>
      JSON.parse(s.textContent ?? "{}")
    );
    const org = parsedScripts.find((p) => p["@type"] === "Organization");
    expect(org).toBeDefined();
    const sameAs: string[] = org.sameAs;
    expect(Array.isArray(sameAs)).toBe(true);
    expect(sameAs.some((url) => url.includes("youtube.com"))).toBe(true);
    expect(sameAs.some((url) => url.includes("twitter.com"))).toBe(true);
    expect(sameAs.some((url) => url.includes("linkedin.com"))).toBe(true);
    expect(sameAs.some((url) => url.includes("github.com"))).toBe(true);
  });

  it("includes WebSite JSON-LD script with SearchAction", () => {
    render(
      <RootLayout>
        <div>content</div>
      </RootLayout>
    );
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    const parsedScripts = Array.from(scripts).map((s) =>
      JSON.parse(s.textContent ?? "{}")
    );
    const website = parsedScripts.find((p) => p["@type"] === "WebSite");
    expect(website).toBeDefined();
    expect(website.name).toBe("Sonar.tv");
    expect(website.url).toContain("sonarqube-tv");
  });

  it("WebSite JSON-LD has potentialAction SearchAction with urlTemplate", () => {
    render(
      <RootLayout>
        <div>content</div>
      </RootLayout>
    );
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    const parsedScripts = Array.from(scripts).map((s) =>
      JSON.parse(s.textContent ?? "{}")
    );
    const website = parsedScripts.find((p) => p["@type"] === "WebSite");
    expect(website).toBeDefined();
    expect(website.potentialAction).toBeDefined();
    expect(website.potentialAction["@type"]).toBe("SearchAction");
    expect(website.potentialAction.target.urlTemplate).toContain(
      "{search_term_string}"
    );
  });

  describe("security meta tags", () => {
    it("has a Content-Security-Policy meta tag", () => {
      render(
        <RootLayout>
          <div>content</div>
        </RootLayout>
      );
      const cspMeta = document.querySelector(
        'meta[http-equiv="Content-Security-Policy"]'
      );
      expect(cspMeta).not.toBeNull();
    });

    it("CSP restricts frame-src to YouTube domains only", () => {
      render(
        <RootLayout>
          <div>content</div>
        </RootLayout>
      );
      const cspMeta = document.querySelector(
        'meta[http-equiv="Content-Security-Policy"]'
      );
      const content = cspMeta?.getAttribute("content") ?? "";
      expect(content).toContain("frame-src");
      expect(content).toContain("youtube.com");
      // Must not permit wildcard frames
      expect(content).not.toContain("frame-src *");
    });

    it("CSP blocks object-src (prevents plugin-based attacks)", () => {
      render(
        <RootLayout>
          <div>content</div>
        </RootLayout>
      );
      const cspMeta = document.querySelector(
        'meta[http-equiv="Content-Security-Policy"]'
      );
      const content = cspMeta?.getAttribute("content") ?? "";
      expect(content).toContain("object-src 'none'");
    });

    it("CSP restricts base-uri to self (prevents base-tag injection)", () => {
      render(
        <RootLayout>
          <div>content</div>
        </RootLayout>
      );
      const cspMeta = document.querySelector(
        'meta[http-equiv="Content-Security-Policy"]'
      );
      const content = cspMeta?.getAttribute("content") ?? "";
      expect(content).toContain("base-uri 'self'");
    });

    it("has a Referrer-Policy meta tag set to strict-origin-when-cross-origin", () => {
      render(
        <RootLayout>
          <div>content</div>
        </RootLayout>
      );
      const referrerMeta = document.querySelector('meta[name="referrer"]');
      expect(referrerMeta).not.toBeNull();
      expect(referrerMeta?.getAttribute("content")).toBe(
        "strict-origin-when-cross-origin"
      );
    });

    it("CSP has default-src 'none' as restrictive baseline", () => {
      render(
        <RootLayout>
          <div>content</div>
        </RootLayout>
      );
      const cspMeta = document.querySelector(
        'meta[http-equiv="Content-Security-Policy"]'
      );
      const content = cspMeta?.getAttribute("content") ?? "";
      // default-src 'none' ensures no resource type is implicitly allowed;
      // every directive must be explicitly listed — weakening this widens the attack surface
      expect(content).toContain("default-src 'none'");
    });

    it("CSP script-src allowlists YouTube IFrame API origin", () => {
      render(
        <RootLayout>
          <div>content</div>
        </RootLayout>
      );
      const cspMeta = document.querySelector(
        'meta[http-equiv="Content-Security-Policy"]'
      );
      const content = cspMeta?.getAttribute("content") ?? "";
      // https://www.youtube.com must be in script-src so the YouTube IFrame API
      // script can load; removing it would break all video embeds
      expect(content).toContain("script-src");
      expect(content).toContain("https://www.youtube.com");
    });

    it("CSP img-src includes YouTube thumbnail CDN (i.ytimg.com)", () => {
      render(
        <RootLayout>
          <div>content</div>
        </RootLayout>
      );
      const cspMeta = document.querySelector(
        'meta[http-equiv="Content-Security-Policy"]'
      );
      const content = cspMeta?.getAttribute("content") ?? "";
      // i.ytimg.com serves YouTube thumbnails; omitting it would cause thumbnail
      // images to fail to load on browsers that enforce CSP
      expect(content).toContain("img-src");
      expect(content).toContain("https://i.ytimg.com");
    });

    it("CSP frame-src includes youtube-nocookie.com for privacy-enhanced embeds", () => {
      render(
        <RootLayout>
          <div>content</div>
        </RootLayout>
      );
      const cspMeta = document.querySelector(
        'meta[http-equiv="Content-Security-Policy"]'
      );
      const content = cspMeta?.getAttribute("content") ?? "";
      // youtube-nocookie.com is the privacy-enhanced embed domain; removing it
      // would break players configured with enablejsapi=1 on nocookie URLs
      expect(content).toContain("https://www.youtube-nocookie.com");
    });

    it("CSP restricts form-action to self (prevents form-hijack attacks)", () => {
      render(
        <RootLayout>
          <div>content</div>
        </RootLayout>
      );
      const cspMeta = document.querySelector(
        'meta[http-equiv="Content-Security-Policy"]'
      );
      const content = cspMeta?.getAttribute("content") ?? "";
      // form-action 'self' ensures any future form submission cannot be redirected
      // to a third-party URL by an injected <form action="..."> element
      expect(content).toContain("form-action 'self'");
    });
  });

  it("html element has lang='en' for accessibility", () => {
    render(
      <RootLayout>
        <div>content</div>
      </RootLayout>
    );
    // jsdom sets document.documentElement.lang from the lang attribute
    expect(document.documentElement.lang).toBe("en");
  });

  describe("skip-to-main-content link (WCAG 2.4.1)", () => {
    it("renders a skip link with 'Skip to main content' text", () => {
      render(
        <RootLayout>
          <div>content</div>
        </RootLayout>
      );
      const skipLink = screen.getByText("Skip to main content");
      expect(skipLink).toBeInTheDocument();
      expect(skipLink.tagName).toBe("A");
    });

    it("skip link href points to #main-content", () => {
      render(
        <RootLayout>
          <div>content</div>
        </RootLayout>
      );
      const skipLink = screen.getByText("Skip to main content");
      expect(skipLink.getAttribute("href")).toBe("#main-content");
    });

    it("main element has id='main-content' so skip link target exists", () => {
      render(
        <RootLayout>
          <div>content</div>
        </RootLayout>
      );
      const main = document.querySelector("main");
      expect(main).not.toBeNull();
      expect(main!.id).toBe("main-content");
    });

    it("main element has tabIndex={-1} so focus lands on it after skip", () => {
      render(
        <RootLayout>
          <div>content</div>
        </RootLayout>
      );
      const main = document.querySelector("main");
      expect(main).not.toBeNull();
      expect(main!.tabIndex).toBe(-1);
    });
  });
});
