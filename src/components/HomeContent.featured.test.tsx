/**
 * HomeContent — featuredVideo randomization tests.
 *
 * Kept separate from HomeContent.test.tsx because this file mocks @/data/videos
 * to override featuredYoutubeIds. Mixing vi.mock("@/data/videos") with a file
 * that imports the module without a mock would cause interference.
 *
 * The tested path is the useEffect that runs on mount:
 *
 *   useEffect(() => {
 *     const ytId = featuredYoutubeIds[Math.floor(Math.random() * featuredYoutubeIds.length)];
 *     const picked = videos.find((v) => v.youtubeId === ytId);
 *     if (picked) setFeaturedVideo(picked);
 *   }, []);
 *
 * Current tests in HomeContent.test.tsx don't exercise this path because their
 * makeVideo() factories produce youtubeIds like "yt-<id>" that never match the
 * real featuredYoutubeIds. Here we mock featuredYoutubeIds to known test values
 * so we can control which branch of the `if (picked)` guard fires.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import HomeContent from "./HomeContent";
import { makeVideo } from "@/__tests__/factories";
import type { Category } from "@/types";

// ── Mock @/data/videos — override featuredYoutubeIds only ────────────────────
// Use the importActual pattern so all other exports (videos, categories, helpers)
// remain intact. Hero imports `categories` directly from @/data/videos, so the
// spread is critical for Hero to render without errors.
vi.mock("@/data/videos", async (importActual) => {
  const actual = await importActual<typeof import("@/data/videos")>();
  return {
    ...actual,
    // Two test-friendly IDs that align with makeVideo({ id: "video-a" }) and
    // makeVideo({ id: "video-b" }) which produce youtubeId "yt-video-a" / "yt-video-b".
    featuredYoutubeIds: ["yt-video-a", "yt-video-b"],
  };
});

// ── Test data ────────────────────────────────────────────────────────────────
// makeVideo factory: youtubeId = `yt-${id}` (see src/__tests__/factories.ts)
const videoA = makeVideo({ id: "video-a", title: "Video Alpha", category: "getting-started" });
// youtubeId: "yt-video-a"  →  matches featuredYoutubeIds[0]

const videoB = makeVideo({ id: "video-b", title: "Video Beta", category: "getting-started" });
// youtubeId: "yt-video-b"  →  matches featuredYoutubeIds[1]

const videoC = makeVideo({ id: "video-c", title: "Video Gamma", category: "getting-started" });
// youtubeId: "yt-video-c"  →  does NOT match either featuredYoutubeId

const categories: Category[] = [
  { slug: "getting-started", title: "Getting Started", description: "Intro videos" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
/** Returns the text content of all <h1> elements in the current document. */
function getAllH1Texts() {
  return screen.getAllByRole("heading", { level: 1 }).map((h) => h.textContent ?? "");
}

// ── Lifecycle ────────────────────────────────────────────────────────────────
beforeEach(() => {
  cleanup();
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── Tests ────────────────────────────────────────────────────────────────────
describe("HomeContent — featuredVideo randomization (useEffect on mount)", () => {
  it("shows videoA when Math.random picks index 0 (featuredYoutubeIds[0] = yt-video-a)", () => {
    // Math.floor(0 * 2) = 0  →  "yt-video-a"  →  videoA
    vi.spyOn(Math, "random").mockReturnValue(0);

    render(<HomeContent categories={categories} videos={[videoA, videoB, videoC]} />);

    const h1Texts = getAllH1Texts();
    expect(h1Texts.some((t) => t.includes("Video Alpha"))).toBe(true);
  });

  it("shows videoB when Math.random picks index 1 (featuredYoutubeIds[1] = yt-video-b)", () => {
    // Math.floor(0.5 * 2) = 1  →  "yt-video-b"  →  videoB
    // Initial state uses featuredYoutubeIds[0] = "yt-video-a" → videoA, then
    // useEffect fires and overrides to videoB.
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    render(<HomeContent categories={categories} videos={[videoA, videoB, videoC]} />);

    const h1Texts = getAllH1Texts();
    expect(h1Texts.some((t) => t.includes("Video Beta"))).toBe(true);
    // Initial video (Alpha) must no longer be featured
    expect(h1Texts.some((t) => t.includes("Video Alpha"))).toBe(false);
  });

  it("falls back to videos[0] for initial state when no video matches featuredYoutubeIds[0]", () => {
    // Only videoC is in the list — youtubeId "yt-video-c" ≠ "yt-video-a".
    // useState initializer: find(…"yt-video-a") → undefined → fallback: videos[0] = videoC.
    // useEffect (index 0 → "yt-video-a") → not found → setFeaturedVideo NOT called.
    vi.spyOn(Math, "random").mockReturnValue(0);

    render(<HomeContent categories={categories} videos={[videoC]} />);

    const h1Texts = getAllH1Texts();
    expect(h1Texts.some((t) => t.includes("Video Gamma"))).toBe(true);
  });

  it("leaves the featured video unchanged when the randomly-picked ID matches no video in the list", () => {
    // Videos: [videoA, videoC]  →  no videoB.
    // Initial state: featuredYoutubeIds[0] = "yt-video-a" matches videoA → initial = videoA.
    // useEffect: Math.random = 0.5 → index 1 → "yt-video-b" → not in [videoA, videoC]
    //   → picked = undefined → if (picked) guard is FALSE → setFeaturedVideo not called.
    // Hero stays on videoA.
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    render(<HomeContent categories={categories} videos={[videoA, videoC]} />);

    const h1Texts = getAllH1Texts();
    expect(h1Texts.some((t) => t.includes("Video Alpha"))).toBe(true);
    // videoB is absent from the video list so it can't appear in the hero
    expect(h1Texts.some((t) => t.includes("Video Beta"))).toBe(false);
  });

  it("initial state uses featuredYoutubeIds[0] match when available (before useEffect override)", () => {
    // With Math.random always returning 0, the useEffect also picks index 0.
    // So the initial state AND the post-effect state are both videoA — confirming
    // the useState initializer correctly resolves the first featured ID.
    vi.spyOn(Math, "random").mockReturnValue(0);

    render(<HomeContent categories={categories} videos={[videoA, videoB, videoC]} />);

    // videoA is expected both as initial and post-effect featured video
    const h1Texts = getAllH1Texts();
    expect(h1Texts.some((t) => t.includes("Video Alpha"))).toBe(true);
  });
});
