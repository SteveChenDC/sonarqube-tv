/**
 * VideoRow — category title link (commit 71c6767)
 *
 * When `categorySlug` is provided the h2 row title is wrapped in a <Link>
 * pointing to `/category/${categorySlug}`. Without categorySlug the title
 * renders as plain text with no anchor element.
 *
 * This improves SEO by ensuring every category section on the home page has
 * an explicit hyperlink to its category landing page.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import VideoRow from "./VideoRow";
import { makeVideo } from "@/__tests__/factories";

const videos = [makeVideo({ id: "v1" }), makeVideo({ id: "v2" })];

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

describe("VideoRow — h2 title as category link", () => {
  it("wraps the title in an <a> pointing to /category/{slug} when categorySlug is provided", () => {
    const { getByText } = render(
      <VideoRow title="Getting Started" categorySlug="getting-started" videos={videos} />,
    );
    const titleEl = getByText("Getting Started");
    // The title text should be inside an anchor element
    const link = titleEl.closest("a");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("/category/getting-started");
  });

  it("uses the exact categorySlug value in the href (not the title)", () => {
    const { getByText } = render(
      <VideoRow title="My Row Title" categorySlug="tutorials" videos={videos} />,
    );
    const link = getByText("My Row Title").closest("a");
    expect(link?.getAttribute("href")).toBe("/category/tutorials");
    // Slug and title differ — href must use the slug, not the title
    expect(link?.getAttribute("href")).not.toContain("My Row Title");
  });

  it("renders the title as plain text (no <a> wrapping) when categorySlug is absent", () => {
    const { getByText } = render(
      // No categorySlug prop — title should be bare text inside h2
      <VideoRow title="Standalone Row" videos={videos} />,
    );
    const titleEl = getByText("Standalone Row");
    // Should NOT be wrapped in an anchor
    expect(titleEl.closest("a")).toBeNull();
    // But the title itself must still be present in the document
    expect(titleEl).toBeTruthy();
  });

  it("title link text exactly matches the title prop", () => {
    const { getByText } = render(
      <VideoRow title="Code Quality Tips" categorySlug="tips" videos={videos} />,
    );
    const link = getByText("Code Quality Tips").closest("a");
    expect(link?.textContent?.trim()).toBe("Code Quality Tips");
  });
});
