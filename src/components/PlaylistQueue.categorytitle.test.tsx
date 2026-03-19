/**
 * PlaylistQueue — category title header and active-item ring tests
 *
 * Commit b838ed3 introduced two new UI features that are NOT covered by the
 * main PlaylistQueue.test.tsx:
 *
 * 1. Category title in the header  (`category?.title ?? "Playlist"`)
 *    The main tests all use `category: "tutorials"` which has NO match in the
 *    real `categories` array, so they accidentally exercise the "Playlist"
 *    fallback path only.  The actual feature — showing the real category name
 *    (e.g. "Code Security") — is never asserted.
 *
 * 2. Active-item thumbnail ring  (`ring-2 ring-sonar-red` on the current video)
 *    No test ever checks that the current video's thumbnail receives the ring
 *    styling, nor that other thumbnails don't.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PlaylistQueue from "./PlaylistQueue";
import { makeVideo } from "@/__tests__/factories";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

// Mutable URLSearchParams shared across tests
const mockSearchParams = new URLSearchParams();
vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

// ─── Test data ────────────────────────────────────────────────────────────────

// "code-security" is a real slug in src/data/categories.ts → title "Code Security"
const securityVideos = [
  makeVideo({ id: "s1", category: "code-security", title: "Intro to SAST" }),
  makeVideo({ id: "s2", category: "code-security", title: "Secrets Detection" }),
  makeVideo({ id: "s3", category: "code-security", title: "Taint Analysis" }),
];

// "tutorials" is NOT in the categories array → falls back to "Playlist"
const unknownCatVideos = [
  makeVideo({ id: "u1", category: "tutorials", title: "Tutorial One" }),
  makeVideo({ id: "u2", category: "tutorials", title: "Tutorial Two" }),
];

// ─── Category title tests ──────────────────────────────────────────────────

describe("PlaylistQueue — category title in header", () => {
  it("shows the real category title when slug matches a known category", () => {
    mockSearchParams.set("playlist", "code-security");
    render(<PlaylistQueue currentVideoId="s1" allVideos={securityVideos} />);

    // The header span should render the real category title, NOT the generic fallback
    expect(screen.getByText("Code Security")).toBeInTheDocument();
    expect(screen.queryByText("Playlist")).toBeNull();
  });

  it("falls back to 'Playlist' when slug does not match any category", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="u1" allVideos={unknownCatVideos} />);

    // "tutorials" has no entry in the categories array → title falls back
    expect(screen.getByText("Playlist")).toBeInTheDocument();
  });

  it("shows the correct category title for a different valid slug", () => {
    // "getting-started" → "Getting Started"
    const gsVideos = [
      makeVideo({ id: "gs1", category: "getting-started", title: "First Scan" }),
      makeVideo({ id: "gs2", category: "getting-started", title: "Installation" }),
    ];
    mockSearchParams.set("playlist", "getting-started");
    render(<PlaylistQueue currentVideoId="gs1" allVideos={gsVideos} />);

    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.queryByText("Playlist")).toBeNull();
  });
});

// ─── Active-item ring tests ────────────────────────────────────────────────

describe("PlaylistQueue — active thumbnail ring", () => {
  it("active video's thumbnail wrapper has ring-2 and ring-sonar-red classes", () => {
    mockSearchParams.set("playlist", "code-security");
    const { container } = render(
      <PlaylistQueue currentVideoId="s2" allVideos={securityVideos} />,
    );

    // The thumbnail wrappers are divs inside each playlist <a> link.
    // Only the active item's wrapper should carry the ring classes.
    const thumbnailWrappers = container.querySelectorAll<HTMLElement>(
      "a > div.relative",
    );

    // Find the one that has the ring styling
    const ringWrappers = Array.from(thumbnailWrappers).filter((div) =>
      div.className.includes("ring-2") && div.className.includes("ring-sonar-red"),
    );

    expect(ringWrappers).toHaveLength(1);
  });

  it("only the current video's thumbnail has the sonar-red ring, not others", () => {
    mockSearchParams.set("playlist", "code-security");
    const { container } = render(
      // s2 is current; s1 and s3 are not
      <PlaylistQueue currentVideoId="s2" allVideos={securityVideos} />,
    );

    // Scope to the scrollable playlist list — avoids nav button links
    // which also have /watch/ hrefs but contain no thumbnail div.
    const scrollContainer = container.querySelector<HTMLElement>(".overflow-y-auto");
    expect(scrollContainer).not.toBeNull();

    const playlistLinks = Array.from(
      scrollContainer!.querySelectorAll<HTMLAnchorElement>("a[href]"),
    );
    // 3 videos → 3 playlist links
    expect(playlistLinks).toHaveLength(3);

    // Each playlist link has a thumbnail wrapper (the div with class "relative")
    const thumbnailsByVideo = playlistLinks.map((a) => ({
      href: a.getAttribute("href") ?? "",
      wrapper: a.querySelector<HTMLElement>("div.relative")!,
    }));

    // s2 (current) → ring present
    const s2Entry = thumbnailsByVideo.find((t) => t.href.includes("/s2"));
    expect(s2Entry?.wrapper.className).toContain("ring-2");
    expect(s2Entry?.wrapper.className).toContain("ring-sonar-red");

    // s1 (not current) → no ring
    const s1Entry = thumbnailsByVideo.find((t) => t.href.includes("/s1"));
    expect(s1Entry?.wrapper.className).not.toContain("ring-2");
    expect(s1Entry?.wrapper.className).not.toContain("ring-sonar-red");

    // s3 (not current) → no ring
    const s3Entry = thumbnailsByVideo.find((t) => t.href.includes("/s3"));
    expect(s3Entry?.wrapper.className).not.toContain("ring-2");
    expect(s3Entry?.wrapper.className).not.toContain("ring-sonar-red");
  });

  it("ring moves to the new current video when currentVideoId changes", () => {
    mockSearchParams.set("playlist", "code-security");
    const { rerender, container } = render(
      <PlaylistQueue currentVideoId="s1" allVideos={securityVideos} />,
    );

    // Scope to scrollable area to avoid nav button links
    const getScrollContainer = () =>
      container.querySelector<HTMLElement>(".overflow-y-auto")!;

    const getActiveRingCount = () =>
      Array.from(getScrollContainer().querySelectorAll<HTMLElement>("a > div.relative")).filter(
        (div) => div.className.includes("ring-2") && div.className.includes("ring-sonar-red"),
      ).length;

    // Initially s1 is active → exactly one ring
    expect(getActiveRingCount()).toBe(1);

    // Navigate to s3
    rerender(<PlaylistQueue currentVideoId="s3" allVideos={securityVideos} />);

    // Still exactly one ring (now on s3)
    expect(getActiveRingCount()).toBe(1);

    // Confirm s3's playlist link contains the ring wrapper
    const s3Link = Array.from(
      getScrollContainer().querySelectorAll<HTMLAnchorElement>("a[href]"),
    ).find((a) => a.getAttribute("href")?.includes("/s3"));
    expect(s3Link?.querySelector<HTMLElement>("div.relative")?.className).toContain("ring-sonar-red");
  });
});
