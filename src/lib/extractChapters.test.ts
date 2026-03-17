import { describe, it, expect } from "vitest";
import { extractChapters } from "./extractChapters";
import type { TranscriptSegment } from "@/types";

function seg(text: string, start = 0): TranscriptSegment {
  return { text, start, duration: 5 };
}

describe("extractChapters", () => {
  describe("empty / degenerate inputs", () => {
    it("returns empty array when markdown has no headings", () => {
      const segments = [seg("some content here"), seg("more content")];
      expect(extractChapters("Just plain text, no headings.", segments)).toEqual([]);
    });

    it("returns empty array when segments array is empty", () => {
      const markdown = "## Introduction\nThis section covers the basics.";
      expect(extractChapters(markdown, [])).toEqual([]);
    });

    it("returns empty array when both inputs are empty", () => {
      expect(extractChapters("", [])).toEqual([]);
    });
  });

  describe("Key Takeaways filtering", () => {
    it("skips sections titled 'Key Takeaways'", () => {
      const markdown = [
        "## Key Takeaways",
        "Remember to use clean code principles.",
        "## Introduction",
        "This section covers setup and installation of SonarQube analysis.",
      ].join("\n");
      const segments = [
        seg("setup installation analysis quality", 0),
        seg("remember clean code principles", 10),
      ];
      const chapters = extractChapters(markdown, segments);
      // Key Takeaways should not appear as a chapter
      expect(chapters.every((c) => !/key\s*takeaway/i.test(c.title))).toBe(true);
    });

    it("skips sections titled 'Key Takeaway' (singular)", () => {
      const markdown = "## Key Takeaway\nThis is important.\n## Real Section\nDetailed content about linting rules and security.";
      const segments = [seg("linting rules security detailed content", 0)];
      const chapters = extractChapters(markdown, segments);
      expect(chapters.every((c) => !/key\s*takeaway/i.test(c.title))).toBe(true);
    });
  });

  describe("single section matching", () => {
    it("matches a single section to the segment with most keyword overlap", () => {
      const markdown = "## Introduction\nThis section covers SonarQube installation configuration properties.";
      const segments = [
        seg("today weather sunny warm", 0),
        seg("sonarqube installation configuration properties setup", 5),
        seg("unrelated content here none", 10),
      ];
      const chapters = extractChapters(markdown, segments);
      expect(chapters).toHaveLength(1);
      expect(chapters[0].title).toBe("Introduction");
      // startIndex should be in range (window size=15 means early segments absorb later matches)
      expect(chapters[0].startIndex).toBeGreaterThanOrEqual(0);
      expect(chapters[0].startIndex).toBeLessThanOrEqual(1);
    });

    it("uses startIndex 0 when best match is the first segment", () => {
      const markdown = "## Overview\nCoverage analysis dashboard metrics quality gate.";
      const segments = [
        seg("coverage analysis dashboard metrics quality gate overview", 0),
        seg("random other stuff here", 5),
      ];
      const chapters = extractChapters(markdown, segments);
      expect(chapters).toHaveLength(1);
      expect(chapters[0].startIndex).toBe(0);
    });
  });

  describe("multiple sections in order", () => {
    it("assigns chapters in transcript order", () => {
      const markdown = [
        "## Introduction",
        "Getting started with SonarQube setup configuration installation.",
        "## Rules Engine",
        "Understanding rules violations detection security bugs.",
        "## Quality Gates",
        "Quality gate threshold metrics dashboard status reporting.",
      ].join("\n");

      const segments = [
        seg("setup configuration installation getting started", 0),
        seg("random filler between sections", 5),
        seg("rules violations detection security bugs analysis", 10),
        seg("more filler content here", 15),
        seg("quality gate threshold metrics dashboard status", 20),
      ];

      const chapters = extractChapters(markdown, segments);
      expect(chapters).toHaveLength(3);
      // Chapters must be in ascending startIndex order
      expect(chapters[0].startIndex).toBeLessThan(chapters[1].startIndex);
      expect(chapters[1].startIndex).toBeLessThan(chapters[2].startIndex);
      expect(chapters[0].title).toBe("Introduction");
      expect(chapters[1].title).toBe("Rules Engine");
      expect(chapters[2].title).toBe("Quality Gates");
    });

    it("advances searchFrom so chapters cannot overlap", () => {
      const markdown = [
        "## Part One",
        "Analysis scanning code coverage report.",
        "## Part Two",
        "Analysis scanning code coverage report.",
      ].join("\n");

      const segments = [
        seg("analysis scanning code coverage report", 0),
        seg("analysis scanning code coverage report", 5),
        seg("unrelated filler", 10),
      ];

      const chapters = extractChapters(markdown, segments);
      // Both sections have identical keywords — Part Two must be at index >= 1
      expect(chapters).toHaveLength(2);
      expect(chapters[0].startIndex).toBe(0);
      expect(chapters[1].startIndex).toBeGreaterThan(0);
    });
  });

  describe("stop word filtering", () => {
    it("ignores stop words when computing keywords", () => {
      // Section body is all stop words — extractKeywords returns []
      const markdown = "## All Stop Words\nThe and or but in on at to for of with.";
      const segments = [seg("the and or but in on at to for of with", 0)];
      // Section has no usable keywords → chapter should be skipped
      const chapters = extractChapters(markdown, segments);
      expect(chapters).toHaveLength(0);
    });

    it("still matches when section mixes stop words with real keywords", () => {
      const markdown = "## Authentication\nThe authentication token validation process and the security rules.";
      const segments = [
        seg("authentication token validation security rules process", 0),
        seg("random unrelated words here", 5),
      ];
      const chapters = extractChapters(markdown, segments);
      expect(chapters).toHaveLength(1);
      expect(chapters[0].title).toBe("Authentication");
    });
  });

  describe("top-level headings", () => {
    it("ignores H1 headings (single #)", () => {
      const markdown = [
        "# Title of Article",
        "Intro content here.",
        "## Real Section",
        "SonarQube analysis quality coverage scanning detection.",
      ].join("\n");
      const segments = [seg("sonarqube analysis quality coverage scanning detection", 0)];
      const chapters = extractChapters(markdown, segments);
      // Should only produce 1 chapter from the ## section, not the # title
      expect(chapters).toHaveLength(1);
      expect(chapters[0].title).toBe("Real Section");
    });
  });

  describe("returned chapter shape", () => {
    it("returns objects with title and startIndex properties", () => {
      const markdown = "## Getting Started\nSonarQube scanner analysis configuration setup project.";
      const segments = [
        seg("sonarqube scanner analysis configuration setup project", 0),
      ];
      const chapters = extractChapters(markdown, segments);
      expect(chapters).toHaveLength(1);
      expect(chapters[0]).toHaveProperty("title");
      expect(chapters[0]).toHaveProperty("startIndex");
      expect(typeof chapters[0].title).toBe("string");
      expect(typeof chapters[0].startIndex).toBe("number");
    });
  });
});
