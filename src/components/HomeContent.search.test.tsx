/**
 * Tests verifying that the top row (Latest / Continue Watching) lives
 * OUTSIDE the `#categories` div and therefore remains visible while the
 * global search query is active.
 *
 * HomeContent renders:
 *   <div>               ← root
 *     <Hero />
 *     <FilterBar />
 *     <div.pt-10>       ← TOP ROW — not inside #categories
 *       <VideoRow />
 *     </div>
 *     <div#categories className={isSearching ? "hidden" : ""}>
 *       {category rows}
 *     </div>
 *   </div>
 *
 * When `isSearching` is true the `#categories` div receives the "hidden"
 * class, but the top row must remain accessible.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import { useEffect } from "react";
import HomeContent from "./HomeContent";
import { SearchProvider, useSearch } from "./SearchContext";
import type { Category } from "@/types";
import { makeVideo } from "@/__tests__/factories";

const STORAGE_KEY = "sonarqube-tv-watch-progress";

const CAT: Category[] = [
  { slug: "tutorials", title: "Tutorials", description: "Tutorial videos" },
];

/** Injects a search query into the shared SearchContext. Must be rendered
 *  inside a SearchProvider. */
function SearchQuerySetter({ query }: { query: string }) {
  const { setQuery } = useSearch();
  useEffect(() => {
    if (query) setQuery(query);
  }, [query, setQuery]);
  return null;
}

function renderWithSearch(
  searchQuery: string,
  videos: ReturnType<typeof makeVideo>[],
  categories = CAT
) {
  return render(
    <SearchProvider>
      <SearchQuerySetter query={searchQuery} />
      <HomeContent categories={categories} videos={videos} />
    </SearchProvider>
  );
}

describe("HomeContent — top row persists outside #categories during search", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    // Fix "now" so relative publishedAt calculations are deterministic.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-17T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("top row wrapper (.pt-10) is present when a recent video exists and search is active", async () => {
    // Video within 30 days → qualifies for topRowVideos (Latest row)
    const recentVideo = makeVideo({
      id: "search-top-recent",
      title: "Recent While Searching",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const { container } = renderWithSearch("sonar", [recentVideo]);
    await act(async () => {});

    // The top-row wrapper is rendered ABOVE #categories — it must NOT be hidden.
    const topRow = container.querySelector(".pt-10");
    expect(topRow).not.toBeNull();

    // Confirm search is actually active — #categories must be hidden.
    const categoriesDiv = container.querySelector("#categories");
    expect(categoriesDiv?.className).toContain("hidden");
  });

  it("'Latest' h2 heading inside the top row is accessible while search is active", async () => {
    const recentVideo = makeVideo({
      id: "search-latest-h2",
      title: "Latest While Searching",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const { container } = renderWithSearch("sonar", [recentVideo]);
    await act(async () => {});

    // The "Latest" h2 lives in the top row, above the hidden #categories div.
    const h2s = Array.from(container.querySelectorAll("h2")).map(
      (h) => h.textContent ?? ""
    );
    expect(h2s.some((t) => t.startsWith("Latest"))).toBe(true);

    // #categories must be hidden to confirm search is active.
    const categoriesDiv = container.querySelector("#categories");
    expect(categoriesDiv?.className).toContain("hidden");
  });

  it("Continue Watching row remains accessible when CW videos exist and search is active", async () => {
    const cwVideo = makeVideo({
      id: "search-cw",
      title: "CW While Searching",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Pre-seed partial watch progress so video enters the CW row.
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "search-cw": 55 }));

    const { container } = renderWithSearch("sonar", [cwVideo]);
    await act(async () => {});

    // The top-row wrapper must still be in the DOM.
    const topRow = container.querySelector(".pt-10");
    expect(topRow).not.toBeNull();

    // "Continue Watching" h2 must be present (it is the title prop on the VideoRow).
    const h2s = Array.from(container.querySelectorAll("h2")).map(
      (h) => h.textContent ?? ""
    );
    expect(h2s.some((t) => t.startsWith("Continue Watching"))).toBe(true);

    // #categories is hidden — search is active.
    const categoriesDiv = container.querySelector("#categories");
    expect(categoriesDiv?.className).toContain("hidden");
  });

  it("top row is absent during search when there are no recent videos and no CW progress", async () => {
    // Video older than 30 days → does NOT qualify for topRowVideos (sortBy=newest).
    const oldVideo = makeVideo({
      id: "search-no-top",
      title: "Old While Searching",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    });
    // No localStorage entries → continueWatchingVideos is empty.

    const { container } = renderWithSearch("sonar", [oldVideo]);
    await act(async () => {});

    // Both topRowVideos and continueWatchingVideos are empty
    // → the conditional wrapper `{... && <div className="relative pt-10">}` must NOT render.
    const topRow = container.querySelector(".pt-10");
    expect(topRow).toBeNull();

    // #categories is still hidden because search is active.
    const categoriesDiv = container.querySelector("#categories");
    expect(categoriesDiv?.className).toContain("hidden");
  });

  it("CW and Latest sections both appear in the top row while categories are hidden", async () => {
    // Set up two videos: one in CW (with progress), one as a recent non-CW video.
    const cwVideo = makeVideo({
      id: "search-cw-both",
      title: "CW Both Sections",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const recentVideo = makeVideo({
      id: "search-recent-both",
      title: "Recent Both Sections",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "search-cw-both": 30 }));

    const { container } = renderWithSearch("sonar", [cwVideo, recentVideo]);
    await act(async () => {});

    // Both CW and topRow videos exist → sectionLabels mode activates:
    //   firstLabel="Continue Watching", secondLabel="Latest"
    // Both h2s live inside the top row, not inside #categories.
    const h2s = Array.from(container.querySelectorAll("h2")).map(
      (h) => h.textContent ?? ""
    );
    expect(h2s.some((t) => t.startsWith("Continue Watching"))).toBe(true);
    expect(h2s.some((t) => t.startsWith("Latest"))).toBe(true);

    // #categories is hidden (search active).
    const categoriesDiv = container.querySelector("#categories");
    expect(categoriesDiv?.className).toContain("hidden");
  });
});
