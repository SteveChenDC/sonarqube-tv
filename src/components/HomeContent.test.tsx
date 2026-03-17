import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import { useEffect } from "react";
import HomeContent from "./HomeContent";
import { SearchProvider, useSearch } from "./SearchContext";
import type { Category } from "@/types";
import { makeVideo } from "@/__tests__/factories";

const categories: Category[] = [
  { slug: "tutorials", title: "Tutorials", description: "Tutorial videos" },
  { slug: "webinars", title: "Webinars", description: "Webinar recordings" },
];

const videos = [
  makeVideo({
    id: "short-vid",
    title: "Short Tutorial",
    duration: "2:30",
    category: "tutorials",
    publishedAt: "2025-12-01T00:00:00Z",
  }),
  makeVideo({
    id: "medium-vid",
    title: "Medium Tutorial",
    duration: "15:00",
    category: "tutorials",
    publishedAt: "2025-06-01T00:00:00Z",
  }),
  makeVideo({
    id: "long-vid",
    title: "Long Webinar",
    duration: "1:05:00",
    category: "webinars",
    publishedAt: "2024-01-01T00:00:00Z",
  }),
];


function openFilters() {
  fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
}

describe("HomeContent", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("renders all category rows with their videos", () => {
    render(
      <HomeContent
        categories={categories}
        videos={videos}
      />
    );
    expect(screen.getByText("Tutorials")).toBeTruthy();
    expect(screen.getByText("Webinars")).toBeTruthy();
    expect(screen.getAllByText("Short Tutorial").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Medium Tutorial").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Long Webinar").length).toBeGreaterThanOrEqual(1);
  });

  it("filters videos by short duration (under 4 min)", () => {
    const { container } = render(
      <HomeContent
        categories={categories}
        videos={videos}
      />
    );

    openFilters();
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));

    const cardTitles = new Set(Array.from(container.querySelectorAll("h3")).map((h) => h.textContent));
    expect(cardTitles.has("Short Tutorial")).toBe(true);
    expect(cardTitles.has("Medium Tutorial")).toBe(false);
    expect(cardTitles.has("Long Webinar")).toBe(false);
  });

  it("filters videos by medium duration (4–20 min)", () => {
    const { container } = render(
      <HomeContent
        categories={categories}
        videos={videos}
      />
    );

    openFilters();
    fireEvent.click(screen.getByText("4–20 min"));
    fireEvent.click(screen.getByText("Apply"));

    const cardTitles = new Set(Array.from(container.querySelectorAll("h3")).map((h) => h.textContent));
    expect(cardTitles.has("Short Tutorial")).toBe(false);
    expect(cardTitles.has("Medium Tutorial")).toBe(true);
    expect(cardTitles.has("Long Webinar")).toBe(false);
  });

  it("filters videos by long duration (over 20 min)", () => {
    const { container } = render(
      <HomeContent
        categories={categories}
        videos={videos}
      />
    );

    openFilters();
    fireEvent.click(screen.getByText("Over 20 min"));
    fireEvent.click(screen.getByText("Apply"));

    const cardTitles = new Set(Array.from(container.querySelectorAll("h3")).map((h) => h.textContent));
    expect(cardTitles.has("Short Tutorial")).toBe(false);
    expect(cardTitles.has("Medium Tutorial")).toBe(false);
    expect(cardTitles.has("Long Webinar")).toBe(true);
  });

  it("sorts videos oldest first", () => {
    const { container } = render(
      <HomeContent
        categories={categories}
        videos={videos}

      />
    );

    openFilters();
    fireEvent.click(screen.getByText("Oldest"));
    fireEvent.click(screen.getByText("Apply"));

    // "Oldest" top row should appear instead of "Latest"
    const rowHeadings = Array.from(container.querySelectorAll("h2"));
    const rowTitles = rowHeadings.map((h) => h.textContent);
    expect(rowTitles.some((t) => t?.startsWith("Oldest"))).toBe(true);
    expect(rowTitles.some((t) => t?.startsWith("Latest"))).toBe(false);

    const headings = Array.from(container.querySelectorAll("h3"));
    const firstTutorial = headings
      .map((h) => h.textContent)
      .find((t) => t === "Short Tutorial" || t === "Medium Tutorial");
    // medium-vid (2025-06) should come before short-vid (2025-12) in oldest-first
    expect(firstTutorial).toBe("Medium Tutorial");
  });

  it("sorts videos newest first by default", () => {
    const { container } = render(
      <HomeContent
        categories={categories}
        videos={videos}

      />
    );

    const headings = Array.from(container.querySelectorAll("h3"));
    const tutorialTitles = headings
      .map((h) => h.textContent)
      .filter((t) => t === "Short Tutorial" || t === "Medium Tutorial");
    // short-vid (2025-12) should come before medium-vid (2025-06) in newest-first
    expect(tutorialTitles).toEqual(["Short Tutorial", "Medium Tutorial"]);
  });

  it("shows empty state when all videos are filtered out", () => {
    const oldVideos = [
      makeVideo({
        id: "old",
        title: "Ancient Video",
        publishedAt: "2020-01-01T00:00:00Z",
        category: "tutorials",
      }),
    ];

    render(
      <HomeContent
        categories={categories}
        videos={oldVideos}

      />
    );

    openFilters();
    fireEvent.click(screen.getByText("Today"));
    fireEvent.click(screen.getByText("Apply"));

    expect(screen.getByText("No videos match your filters")).toBeTruthy();
  });

  it("resets filters via empty-state Reset filters button", () => {
    const oldVideos = [
      makeVideo({
        id: "old",
        title: "Ancient Video",
        publishedAt: "2020-01-01T00:00:00Z",
        category: "tutorials",
      }),
    ];

    render(
      <HomeContent
        categories={categories}
        videos={oldVideos}

      />
    );

    openFilters();
    fireEvent.click(screen.getByText("Today"));
    fireEvent.click(screen.getByText("Apply"));

    expect(screen.getByText("No videos match your filters")).toBeTruthy();
    const resetButton = screen.getByText("Reset filters");
    expect(resetButton).toBeTruthy();

    fireEvent.click(resetButton);

    // After reset, the video should be visible again and the empty state gone
    expect(screen.getAllByText("Ancient Video").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("No videos match your filters")).toBeNull();
  });

  it("hides category rows with no matching videos when filters are active", () => {
    render(
      <HomeContent
        categories={categories}
        videos={videos}

      />
    );

    // Both category rows should be visible initially
    expect(screen.getByText("Tutorials")).toBeTruthy();
    expect(screen.getByText("Webinars")).toBeTruthy();

    // Apply "Under 4 min" filter — only short-vid (tutorials) matches
    openFilters();
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));

    // Tutorials row should still show; Webinars row should be hidden
    expect(screen.getByText("Tutorials")).toBeTruthy();
    expect(screen.queryByText("Webinars")).toBeNull();
    expect(screen.queryByText("Long Webinar")).toBeNull();
  });

  it("treats exactly 20 minutes as medium duration", () => {
    const boundaryVideos = [
      makeVideo({
        id: "exact-20",
        title: "Exactly Twenty",
        duration: "20:00",
        category: "tutorials",
      }),
      makeVideo({
        id: "over-20",
        title: "Twenty One Min",
        duration: "21:00",
        category: "tutorials",
      }),
    ];

    render(
      <HomeContent
        categories={categories}
        videos={boundaryVideos}

      />
    );

    openFilters();
    fireEvent.click(screen.getByText("4–20 min"));
    fireEvent.click(screen.getByText("Apply"));

    expect(screen.getAllByText("Exactly Twenty").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Twenty One Min")).toBeNull();
  });

  it("resets filters and shows all videos again", () => {
    render(
      <HomeContent
        categories={categories}
        videos={videos}

      />
    );

    openFilters();
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));
    expect(screen.queryByText("Medium Tutorial")).toBeNull();

    openFilters();
    fireEvent.click(screen.getByText("Reset all"));

    expect(screen.getAllByText("Medium Tutorial").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Long Webinar").length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Helpers for search integration tests
// ---------------------------------------------------------------------------

/** Sets the SearchContext query then renders nothing — must be inside SearchProvider */
function SearchQuerySetter({ query }: { query: string }) {
  const { setQuery } = useSearch();
  useEffect(() => {
    if (query) setQuery(query);
  }, [query, setQuery]);
  return null;
}

function renderWithSearch(searchQuery: string) {
  return render(
    <SearchProvider>
      <SearchQuerySetter query={searchQuery} />
      <HomeContent categories={categories} videos={videos} />
    </SearchProvider>
  );
}

// ---------------------------------------------------------------------------
// Search integration tests
// ---------------------------------------------------------------------------

describe("HomeContent — search integration", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("categories div is visible when search query is empty", () => {
    const { container } = renderWithSearch("");
    const categoriesDiv = container.querySelector("#categories");
    expect(categoriesDiv).toBeTruthy();
    expect(categoriesDiv?.className).not.toContain("hidden");
  });

  it("categories div gets 'hidden' class when search query is non-empty", async () => {
    const { container } = renderWithSearch("sonar");
    // Wait for the effect to run and re-render
    await act(async () => {});
    const categoriesDiv = container.querySelector("#categories");
    expect(categoriesDiv?.className).toContain("hidden");
  });

  it("category rows are not interactable when hidden via search", async () => {
    renderWithSearch("sonar");
    await act(async () => {});
    // The categories div is hidden — Tutorials/Webinars headings may still be
    // in the DOM but inside the hidden container
    const categoriesDiv = document.querySelector("#categories");
    expect(categoriesDiv?.className).toContain("hidden");
  });
});

// ---------------------------------------------------------------------------
// Continue Watching row tests
// ---------------------------------------------------------------------------

const STORAGE_KEY = "sonarqube-tv-watch-progress";

describe("HomeContent — Continue Watching", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("shows Continue Watching row when a video has partial progress", async () => {
    const cwVideo = makeVideo({
      id: "cw-vid",
      title: "Partial Video",
      category: "tutorials",
      publishedAt: "2025-01-01T00:00:00Z",
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "cw-vid": 50 }));

    const { container } = render(
      <HomeContent categories={categories} videos={[cwVideo, ...videos]} />
    );
    await act(async () => {});

    // sectionLabels mode: "Continue Watching" label should appear
    const h2s = Array.from(container.querySelectorAll("h2")).map((h) => h.textContent);
    const labels = Array.from(container.querySelectorAll("[data-section-label]")).map((el) => el.textContent);
    // Either a heading or a section label should contain "Continue Watching"
    const allText = [...h2s, ...labels].join(" ");
    expect(allText).toContain("Continue Watching");
  });

  it("does NOT show Continue Watching for videos at exactly 0%", async () => {
    const completeVideo = makeVideo({
      id: "zero-vid",
      title: "Not Started Video",
      category: "tutorials",
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "zero-vid": 0 }));

    const { container } = render(
      <HomeContent categories={categories} videos={[completeVideo, ...videos]} />
    );
    await act(async () => {});

    const allH2Text = Array.from(container.querySelectorAll("h2")).map((h) => h.textContent).join(" ");
    expect(allH2Text).not.toContain("Continue Watching");
  });

  it("does NOT show Continue Watching for videos at exactly 100%", async () => {
    const completeVideo = makeVideo({
      id: "done-vid",
      title: "Done Video",
      category: "tutorials",
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "done-vid": 100 }));

    const { container } = render(
      <HomeContent categories={categories} videos={[completeVideo, ...videos]} />
    );
    await act(async () => {});

    const allH2Text = Array.from(container.querySelectorAll("h2")).map((h) => h.textContent).join(" ");
    expect(allH2Text).not.toContain("Continue Watching");
  });

  it("orders Continue Watching videos by highest progress first", async () => {
    const vid1 = makeVideo({ id: "cw-1", title: "CW Video One", category: "tutorials" });
    const vid2 = makeVideo({ id: "cw-2", title: "CW Video Two", category: "tutorials" });

    // vid2 has higher progress than vid1
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "cw-1": 20, "cw-2": 80 }));

    const { container } = render(
      <HomeContent categories={[{ slug: "tutorials", title: "Tutorials", description: "" }]} videos={[vid1, vid2]} />
    );
    await act(async () => {});

    const cards = Array.from(container.querySelectorAll("h3")).map((h) => h.textContent);
    const idx1 = cards.findIndex((t) => t === "CW Video One");
    const idx2 = cards.findIndex((t) => t === "CW Video Two");
    // vid2 (80%) should come before vid1 (20%)
    expect(idx2).toBeLessThan(idx1);
  });
});

// ---------------------------------------------------------------------------
// onRemove wiring tests
// ---------------------------------------------------------------------------

describe("HomeContent — onRemove wiring", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("removes a video from Continue Watching when the remove button is clicked", async () => {
    const cwVideo = makeVideo({
      id: "removable",
      title: "Removable Video",
      category: "tutorials",
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ removable: 55 }));

    render(
      <HomeContent
        categories={[{ slug: "tutorials", title: "Tutorials", description: "" }]}
        videos={[cwVideo]}
      />
    );
    await act(async () => {});

    const removeBtn = screen.getByRole("button", { name: /Remove Removable Video/i });
    expect(removeBtn).toBeTruthy();

    fireEvent.click(removeBtn);
    await act(async () => {});

    // The card should be gone from the Continue Watching row
    expect(screen.queryByRole("button", { name: /Remove Removable Video/i })).toBeNull();
  });

  it("clears the video's progress from localStorage when removed", async () => {
    const cwVideo = makeVideo({
      id: "removable2",
      title: "Remove Progress Video",
      category: "tutorials",
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ removable2: 42 }));

    render(
      <HomeContent
        categories={[{ slug: "tutorials", title: "Tutorials", description: "" }]}
        videos={[cwVideo]}
      />
    );
    await act(async () => {});

    const removeBtn = screen.getByRole("button", { name: /Remove Remove Progress Video/i });
    fireEvent.click(removeBtn);
    await act(async () => {});

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    expect(stored["removable2"]).toBeUndefined();
  });
});
