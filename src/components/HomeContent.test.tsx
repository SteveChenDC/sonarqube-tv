import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
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


async function openFilters() {
  await act(async () => {
    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
  });
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

  it("filters videos by short duration (under 4 min)", async () => {
    const { container } = render(
      <HomeContent
        categories={categories}
        videos={videos}
      />
    );

    await act(async () => {}); // flush React.lazy FilterBar before interacting
    await openFilters();
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));

    const cardTitles = new Set(Array.from(container.querySelectorAll("h3")).map((h) => h.textContent));
    expect(cardTitles.has("Short Tutorial")).toBe(true);
    expect(cardTitles.has("Medium Tutorial")).toBe(false);
    expect(cardTitles.has("Long Webinar")).toBe(false);
  });

  it("filters videos by medium duration (4–20 min)", async () => {
    const { container } = render(
      <HomeContent
        categories={categories}
        videos={videos}
      />
    );

    await openFilters();
    fireEvent.click(screen.getByText("4–20 min"));
    fireEvent.click(screen.getByText("Apply"));

    const cardTitles = new Set(Array.from(container.querySelectorAll("h3")).map((h) => h.textContent));
    expect(cardTitles.has("Short Tutorial")).toBe(false);
    expect(cardTitles.has("Medium Tutorial")).toBe(true);
    expect(cardTitles.has("Long Webinar")).toBe(false);
  });

  it("filters videos by long duration (over 20 min)", async () => {
    const { container } = render(
      <HomeContent
        categories={categories}
        videos={videos}
      />
    );

    await openFilters();
    fireEvent.click(screen.getByText("Over 20 min"));
    fireEvent.click(screen.getByText("Apply"));

    const cardTitles = new Set(Array.from(container.querySelectorAll("h3")).map((h) => h.textContent));
    expect(cardTitles.has("Short Tutorial")).toBe(false);
    expect(cardTitles.has("Medium Tutorial")).toBe(false);
    expect(cardTitles.has("Long Webinar")).toBe(true);
  });

  it("sorts videos oldest first", async () => {
    const { container } = render(
      <HomeContent
        categories={categories}
        videos={videos}

      />
    );

    await openFilters();
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

  it("shows empty state when all videos are filtered out", async () => {
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

    await openFilters();
    fireEvent.click(screen.getByText("Today"));
    fireEvent.click(screen.getByText("Apply"));

    expect(screen.getByText("No videos match your filters")).toBeTruthy();
  });

  it("resets filters via empty-state Clear all filters button", async () => {
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

    await openFilters();
    fireEvent.click(screen.getByText("Today"));
    fireEvent.click(screen.getByText("Apply"));

    expect(screen.getByText("No videos match your filters")).toBeTruthy();
    const resetButton = screen.getByText("Clear all filters");
    expect(resetButton).toBeTruthy();

    fireEvent.click(resetButton);

    // After reset, the video should be visible again and the empty state gone
    expect(screen.getAllByText("Ancient Video").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("No videos match your filters")).toBeNull();
  });

  it("hides category rows with no matching videos when filters are active", async () => {
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
    await openFilters();
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));

    // Tutorials row should still show; Webinars row should be hidden
    expect(screen.getByText("Tutorials")).toBeTruthy();
    expect(screen.queryByText("Webinars")).toBeNull();
    expect(screen.queryByText("Long Webinar")).toBeNull();
  });

  it("treats exactly 20 minutes as medium duration", async () => {
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

    await openFilters();
    fireEvent.click(screen.getByText("4–20 min"));
    fireEvent.click(screen.getByText("Apply"));

    expect(screen.getAllByText("Exactly Twenty").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Twenty One Min")).toBeNull();
  });

  it("resets filters and shows all videos again", async () => {
    render(
      <HomeContent
        categories={categories}
        videos={videos}

      />
    );

    await openFilters();
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));
    expect(screen.queryByText("Medium Tutorial")).toBeNull();

    await openFilters();
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

// ---------------------------------------------------------------------------
// Floating filter button (visibility controlled by IntersectionObserver)
// ---------------------------------------------------------------------------

describe("HomeContent — floating filter button", () => {
  type IntersectionObserverCb = (entries: IntersectionObserverEntry[]) => void;
  let heroObserverCb: IntersectionObserverCb | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let savedIntersectionObserver: any;

  beforeEach(() => {
    cleanup();
    localStorage.clear();
    heroObserverCb = null;

    // Save the original, then override via direct assignment.
    // Object.defineProperty cannot redefine a non-configurable property even
    // when writable:true; direct assignment is the only safe path here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    savedIntersectionObserver = (globalThis as any).IntersectionObserver;

    class ControllableIntersectionObserver {
      constructor(cb: IntersectionObserverCb) {
        // Always overwrite — React fires child effects before parent effects, so
        // VideoRow's IntersectionObservers are created first. HomeContent's hero
        // observer is created LAST (parent effect runs after children), so the
        // final assignment is the one we want to trigger manually in tests.
        heroObserverCb = cb;
      }
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).IntersectionObserver = ControllableIntersectionObserver;
  });

  afterEach(() => {
    // Restore so other test files get the setup.tsx global mock back
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).IntersectionObserver = savedIntersectionObserver;
  });

  function triggerHeroOutOfView() {
    act(() => {
      heroObserverCb?.([{ isIntersecting: false } as IntersectionObserverEntry]);
    });
  }

  function triggerHeroInView() {
    act(() => {
      heroObserverCb?.([{ isIntersecting: true } as IntersectionObserverEntry]);
    });
  }

  it("floating filter button is initially hidden (opacity-0, pointer-events-none)", () => {
    render(<HomeContent categories={categories} videos={videos} />);
    const btn = screen.getByRole("button", { name: "Open filters" });
    expect(btn.className).toContain("opacity-0");
    expect(btn.className).toContain("pointer-events-none");
  });

  it("floating filter button becomes visible when hero scrolls out of view", () => {
    render(<HomeContent categories={categories} videos={videos} />);
    triggerHeroOutOfView();
    const btn = screen.getByRole("button", { name: "Open filters" });
    expect(btn.className).toContain("opacity-100");
    expect(btn.className).not.toContain("pointer-events-none");
  });

  it("floating filter button hides again when hero re-enters the viewport", () => {
    render(<HomeContent categories={categories} videos={videos} />);
    triggerHeroOutOfView();
    triggerHeroInView();
    const btn = screen.getByRole("button", { name: "Open filters" });
    expect(btn.className).toContain("opacity-0");
    expect(btn.className).toContain("pointer-events-none");
  });

  it("clicking the floating filter button opens the filter panel", () => {
    render(<HomeContent categories={categories} videos={videos} />);
    triggerHeroOutOfView();
    const floatingBtn = screen.getByRole("button", { name: "Open filters" });
    fireEvent.click(floatingBtn);
    // Filter panel should now be open — check for filter-specific content
    expect(screen.getByText("Upload date")).toBeTruthy();
    expect(screen.getByText("Duration")).toBeTruthy();
  });

  it("floating filter button shows active filter count badge when filters are applied", () => {
    render(<HomeContent categories={categories} videos={videos} />);
    triggerHeroOutOfView();

    // Apply a filter via the hero-inline Filters button
    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));

    // The floating button should now contain the count "1"
    const floatingBtn = screen.getByRole("button", { name: "Open filters" });
    expect(floatingBtn.textContent).toContain("1");
  });

  it("floating filter button badge count reflects multiple active filters", () => {
    render(<HomeContent categories={categories} videos={videos} />);
    triggerHeroOutOfView();

    // Apply two filters: duration + sort
    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Oldest"));
    fireEvent.click(screen.getByText("Apply"));

    const floatingBtn = screen.getByRole("button", { name: "Open filters" });
    expect(floatingBtn.textContent).toContain("2");
  });
});

// ---------------------------------------------------------------------------
// footerInView — hides floating filter button + ScrollToTop when footer enters view
// ---------------------------------------------------------------------------

describe("HomeContent — footerInView hides floating button and ScrollToTop", () => {
  type IOCb = (entries: IntersectionObserverEntry[]) => void;

  interface TrackedObserver {
    cb: IOCb;
    el: Element | null;
    disconnectFn: ReturnType<typeof vi.fn>;
  }

  let observed: TrackedObserver[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let savedIO: any;
  let footerEl: HTMLElement;

  beforeEach(() => {
    cleanup();
    localStorage.clear();
    observed = [];
    savedIO = (globalThis as any).IntersectionObserver;

    // Add a real <footer> so HomeContent's footer observer is created
    footerEl = document.createElement("footer");
    document.body.appendChild(footerEl);

    class TrackingIO {
      private _record: TrackedObserver;
      constructor(cb: IOCb) {
        this._record = { cb, el: null, disconnectFn: vi.fn() };
        observed.push(this._record);
      }
      observe(el: Element) {
        this._record.el = el;
      }
      disconnect() {
        this._record.disconnectFn();
      }
      unobserve(_el: Element) {}
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).IntersectionObserver = TrackingIO;
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).IntersectionObserver = savedIO;
    footerEl.remove();
  });

  function getFooterObserver(): TrackedObserver | undefined {
    // The footer observer always observes the <footer> element we injected
    return observed.find((o) => o.el === footerEl);
  }

  function getHeroObserver(): TrackedObserver | undefined {
    // React fires child effects before parent effects, so execution order is:
    //   VideoRow effects → HomeContent hero effect → HomeContent footer effect
    // With the footer in the DOM, the footer observer is last; hero is second-to-last.
    const footerIdx = observed.indexOf(getFooterObserver()!);
    return footerIdx > 0 ? observed[footerIdx - 1] : undefined;
  }

  function triggerHeroOut() {
    act(() => {
      getHeroObserver()?.cb([{ isIntersecting: false } as IntersectionObserverEntry]);
    });
  }

  function triggerFooterIn() {
    act(() => {
      getFooterObserver()?.cb([{ isIntersecting: true } as IntersectionObserverEntry]);
    });
  }

  function triggerFooterOut() {
    act(() => {
      getFooterObserver()?.cb([{ isIntersecting: false } as IntersectionObserverEntry]);
    });
  }

  it("footer observer is created and observes the <footer> element", () => {
    render(<HomeContent categories={categories} videos={videos} />);
    expect(getFooterObserver()).toBeDefined();
    expect(getFooterObserver()?.el?.tagName).toBe("FOOTER");
  });

  it("floating button hides when footer enters view even if hero is out of view", () => {
    render(<HomeContent categories={categories} videos={videos} />);

    // Hero scrolls out → button should appear
    triggerHeroOut();
    const btn = screen.getByRole("button", { name: "Open filters" });
    expect(btn.className).toContain("opacity-100");

    // Footer scrolls in → button hides again
    triggerFooterIn();
    expect(btn.className).toContain("opacity-0");
    expect(btn.className).toContain("pointer-events-none");
  });

  it("floating button reappears when footer leaves view again (hero still out of view)", () => {
    render(<HomeContent categories={categories} videos={videos} />);

    triggerHeroOut();
    triggerFooterIn();

    // Footer scrolls out again
    triggerFooterOut();
    const btn = screen.getByRole("button", { name: "Open filters" });
    expect(btn.className).toContain("opacity-100");
    expect(btn.className).not.toContain("pointer-events-none");
  });

  it("ScrollToTop is hidden when footer enters view", () => {
    render(<HomeContent categories={categories} videos={videos} />);

    triggerFooterIn();

    // ScrollToTop should receive hidden={true}; it renders a button with opacity-0
    const scrollBtn = screen.getByRole("button", { name: "Scroll to top" });
    expect(scrollBtn.className).toContain("opacity-0");
    expect(scrollBtn.className).toContain("pointer-events-none");
  });

  it("ScrollToTop is not force-hidden when footer is out of view", () => {
    render(<HomeContent categories={categories} videos={videos} />);

    // Footer out of view → hidden={false}; ScrollToTop visibility depends on scrollY only
    triggerFooterOut();

    // With scrollY=0 it stays invisible (not scrolled), but the hidden prop isn't suppressing it
    // Simulate scrolling so we can verify hidden=false allows it to appear
    Object.defineProperty(globalThis, "scrollY", { value: 700, writable: true });
    fireEvent.scroll(globalThis);

    const scrollBtn = screen.getByRole("button", { name: "Scroll to top" });
    expect(scrollBtn.className).toContain("opacity-100");

    // Restore
    Object.defineProperty(globalThis, "scrollY", { value: 0, writable: true });
  });

  it("footer observer is disconnected on unmount", () => {
    const { unmount } = render(<HomeContent categories={categories} videos={videos} />);
    const footerObs = getFooterObserver();
    expect(footerObs).toBeDefined();

    unmount();
    expect(footerObs?.disconnectFn).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Upload date filter integration tests
// ---------------------------------------------------------------------------

describe("HomeContent — upload date filters", () => {
  const CAT: Category[] = [
    { slug: "tutorials", title: "Tutorials", description: "Tutorial videos" },
  ];

  beforeEach(() => {
    cleanup();
    localStorage.clear();
    // Fix "now" to 2026-03-17T12:00:00Z for deterministic date math
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-17T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function renderWithVideos(testVideos: ReturnType<typeof makeVideo>[]) {
    const { container } = render(
      <HomeContent categories={CAT} videos={testVideos} />
    );
    return container;
  }

  function applyDateFilter(label: string, container: HTMLElement) {
    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
    fireEvent.click(screen.getByText(label));
    fireEvent.click(screen.getByText("Apply"));
    return container;
  }

  function visibleTitles(container: HTMLElement) {
    return new Set(
      Array.from(container.querySelectorAll("h3")).map((h) => h.textContent)
    );
  }

  it("'This week' shows a video published 3 days ago", () => {
    const recentVideo = makeVideo({
      id: "wk-recent",
      title: "Recent This Week",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const oldVideo = makeVideo({
      id: "wk-old",
      title: "Old This Week",
      category: "tutorials",
      publishedAt: "2024-01-01T00:00:00Z",
    });

    const container = renderWithVideos([recentVideo, oldVideo]);
    applyDateFilter("This week", container);

    const titles = visibleTitles(container);
    expect(titles.has("Recent This Week")).toBe(true);
    expect(titles.has("Old This Week")).toBe(false);
  });

  it("'This week' excludes a video published exactly 8 days ago", () => {
    const eightDaysAgo = makeVideo({
      id: "wk-8",
      title: "Eight Days Ago",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const container = renderWithVideos([eightDaysAgo]);
    applyDateFilter("This week", container);

    expect(screen.getByText("No videos match your filters")).toBeTruthy();
  });

  it("'This month' shows a video published 20 days ago", () => {
    const recent = makeVideo({
      id: "mo-recent",
      title: "Recent This Month",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const old = makeVideo({
      id: "mo-old",
      title: "Old This Month",
      category: "tutorials",
      publishedAt: "2023-01-01T00:00:00Z",
    });

    const container = renderWithVideos([recent, old]);
    applyDateFilter("This month", container);

    const titles = visibleTitles(container);
    expect(titles.has("Recent This Month")).toBe(true);
    expect(titles.has("Old This Month")).toBe(false);
  });

  it("'This month' excludes a video published 31 days ago", () => {
    const thirtyOneDaysAgo = makeVideo({
      id: "mo-31",
      title: "Thirty One Days Ago",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const container = renderWithVideos([thirtyOneDaysAgo]);
    applyDateFilter("This month", container);

    expect(screen.getByText("No videos match your filters")).toBeTruthy();
  });

  it("'This year' shows a video published 100 days ago", () => {
    const recent = makeVideo({
      id: "yr-recent",
      title: "Recent This Year",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const old = makeVideo({
      id: "yr-old",
      title: "Old This Year",
      category: "tutorials",
      publishedAt: "2020-01-01T00:00:00Z",
    });

    const container = renderWithVideos([recent, old]);
    applyDateFilter("This year", container);

    const titles = visibleTitles(container);
    expect(titles.has("Recent This Year")).toBe(true);
    expect(titles.has("Old This Year")).toBe(false);
  });

  it("'This year' excludes a video published exactly 366 days ago", () => {
    const tooOld = makeVideo({
      id: "yr-366",
      title: "Three Sixty Six Days Ago",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 366 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const container = renderWithVideos([tooOld]);
    applyDateFilter("This year", container);

    expect(screen.getByText("No videos match your filters")).toBeTruthy();
  });

  it("combined date + duration filter: 'This week' + 'Under 4 min' keeps only matching videos", () => {
    const recentShort = makeVideo({
      id: "combo-rs",
      title: "Recent Short",
      category: "tutorials",
      duration: "3:00",
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const recentLong = makeVideo({
      id: "combo-rl",
      title: "Recent Long",
      category: "tutorials",
      duration: "25:00",
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const oldShort = makeVideo({
      id: "combo-os",
      title: "Old Short",
      category: "tutorials",
      duration: "3:00",
      publishedAt: "2022-01-01T00:00:00Z",
    });

    render(<HomeContent categories={CAT} videos={[recentShort, recentLong, oldShort]} />);

    // Open filters and set both date and duration
    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
    fireEvent.click(screen.getByText("This week"));
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));

    const titles = new Set(
      Array.from(document.querySelectorAll("h3")).map((h) => h.textContent)
    );
    expect(titles.has("Recent Short")).toBe(true);
    expect(titles.has("Recent Long")).toBe(false);
    expect(titles.has("Old Short")).toBe(false);
  });

  it("'Any time' (default) shows all videos regardless of age", () => {
    const ancient = makeVideo({
      id: "ancient",
      title: "Ancient Video",
      category: "tutorials",
      publishedAt: "2000-01-01T00:00:00Z",
    });
    const fresh = makeVideo({
      id: "fresh",
      title: "Fresh Video",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    });

    const container = renderWithVideos([ancient, fresh]);

    // No filter applied — default is "anytime"
    const titles = visibleTitles(container);
    expect(titles.has("Ancient Video")).toBe(true);
    expect(titles.has("Fresh Video")).toBe(true);
  });

  it("'Today' shows a video published 6 hours ago", () => {
    const sixHoursAgo = makeVideo({
      id: "today-6h",
      title: "Six Hours Ago",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    });
    const oldVideo = makeVideo({
      id: "today-old",
      title: "Old Today Video",
      category: "tutorials",
      publishedAt: "2020-01-01T00:00:00Z",
    });

    const container = renderWithVideos([sixHoursAgo, oldVideo]);
    applyDateFilter("Today", container);

    const titles = visibleTitles(container);
    expect(titles.has("Six Hours Ago")).toBe(true);
    expect(titles.has("Old Today Video")).toBe(false);
  });

  it("'Today' excludes a video published exactly 25 hours ago", () => {
    const twentyFiveHoursAgo = makeVideo({
      id: "today-25h",
      title: "Twenty Five Hours Ago",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    });

    const container = renderWithVideos([twentyFiveHoursAgo]);
    applyDateFilter("Today", container);

    expect(screen.getByText("No videos match your filters")).toBeTruthy();
  });

  it("combined 'Today' + 'Under 4 min': keeps recent-short, drops recent-long and old-short", () => {
    const recentShort = makeVideo({
      id: "td-combo-rs",
      title: "Today Short Video",
      category: "tutorials",
      duration: "2:00",
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    });
    const recentLong = makeVideo({
      id: "td-combo-rl",
      title: "Today Long Video",
      category: "tutorials",
      duration: "30:00",
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    });
    const oldShort = makeVideo({
      id: "td-combo-os",
      title: "Old Short Video",
      category: "tutorials",
      duration: "2:00",
      publishedAt: "2022-01-01T00:00:00Z",
    });

    render(<HomeContent categories={CAT} videos={[recentShort, recentLong, oldShort]} />);

    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
    fireEvent.click(screen.getByText("Today"));
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));

    const titles = new Set(
      Array.from(document.querySelectorAll("h3")).map((h) => h.textContent)
    );
    expect(titles.has("Today Short Video")).toBe(true);
    expect(titles.has("Today Long Video")).toBe(false);
    expect(titles.has("Old Short Video")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Top row ("Latest" / "Oldest") behavior tests
// ---------------------------------------------------------------------------

describe("HomeContent — top row Latest/Oldest logic", () => {
  const CAT: Category[] = [
    { slug: "tutorials", title: "Tutorials", description: "Tutorial videos" },
  ];

  const STORAGE_KEY = "sonarqube-tv-watch-progress";

  beforeEach(() => {
    cleanup();
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-17T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows 'Latest' row heading when sortBy=newest and there are recent videos", async () => {
    const recentVideo = makeVideo({
      id: "latest-1",
      title: "Very Recent Video",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    });

    const { container } = render(
      <HomeContent categories={CAT} videos={[recentVideo]} />
    );
    await act(async () => {});

    const h2s = Array.from(container.querySelectorAll("h2")).map((h) => h.textContent ?? "");
    expect(h2s.some((t) => t.startsWith("Latest"))).toBe(true);
  });

  it("does not show top row when all videos are older than 30 days and sortBy=newest", async () => {
    const oldVideo = makeVideo({
      id: "old-1",
      title: "Old Video",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    });

    const { container } = render(
      <HomeContent categories={CAT} videos={[oldVideo]} />
    );
    await act(async () => {});

    const h2s = Array.from(container.querySelectorAll("h2")).map((h) => h.textContent ?? "");
    // No "Latest" row because no videos are within 30 days
    expect(h2s.some((t) => t.startsWith("Latest"))).toBe(false);
    // No "Oldest" row either because sortBy=newest
    expect(h2s.some((t) => t.startsWith("Oldest"))).toBe(false);
  });

  it("Latest row count badge reflects only recent videos (excludes videos older than 30 days)", async () => {
    const recentA = makeVideo({
      id: "recent-a",
      title: "Recent A",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    });
    const recentB = makeVideo({
      id: "recent-b",
      title: "Recent B",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    });
    const oldVideo = makeVideo({
      id: "old-x",
      title: "Old X",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    });

    const { container } = render(
      <HomeContent categories={CAT} videos={[recentA, recentB, oldVideo]} />
    );
    await act(async () => {});

    const latestH2 = Array.from(container.querySelectorAll("h2")).find((h) =>
      (h.textContent ?? "").startsWith("Latest")
    );
    // Count badge should show 2, not 3 — only the 2 recent videos qualify
    expect(latestH2).toBeDefined();
    expect(latestH2?.textContent).toContain("2");
  });

  it("video published exactly 30 days ago is excluded from Latest row (boundary)", async () => {
    // exactly 30 days ago is NOT < 30 days, so it should be excluded
    const thirtyDaysAgo = makeVideo({
      id: "boundary-30",
      title: "Thirty Days Ago",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const twentyNineDaysAgo = makeVideo({
      id: "boundary-29",
      title: "Twenty Nine Days Ago",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const { container } = render(
      <HomeContent categories={CAT} videos={[thirtyDaysAgo, twentyNineDaysAgo]} />
    );
    await act(async () => {});

    const latestH2 = Array.from(container.querySelectorAll("h2")).find((h) =>
      (h.textContent ?? "").startsWith("Latest")
    );
    // Only the 29-day-old video appears in Latest; 30-day is excluded
    expect(latestH2).toBeDefined();
    expect(latestH2?.textContent).toContain("1");
  });

  it("combined CW+Latest: both 'Continue Watching' and 'Latest' labels appear in the merged row", async () => {
    // cwVideo is in-progress AND recent — appears in CW section
    const cwVideo = makeVideo({
      id: "cw-merged",
      title: "In Progress Video",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    });
    // recentVideo is only recent (not in progress) — appears in Latest section
    const recentVideo = makeVideo({
      id: "recent-merged",
      title: "Recent Only Video",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "cw-merged": 55 }));

    const { container } = render(
      <HomeContent categories={CAT} videos={[cwVideo, recentVideo]} />
    );
    await act(async () => {});

    // In sectionLabels mode both labels render as h2 headings inside the scroll row
    const allH2Text = Array.from(container.querySelectorAll("h2")).map((h) => h.textContent ?? "");
    expect(allH2Text.some((t) => t.startsWith("Continue Watching"))).toBe(true);
    expect(allH2Text.some((t) => t.startsWith("Latest"))).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // CW+topRow deduplication
  // When a video is both in-progress (CW) AND recent (within 30 days), the
  // merged VideoRow should contain it exactly once — not duplicated.
  // Logic: topRowVideos.filter(v => !continueWatchingVideos.some(cw => cw.id === v.id))
  // ---------------------------------------------------------------------------

  it("CW+topRow dedup: in-progress recent video appears only once in the merged top row", async () => {
    // sharedVideo is in-progress (→ CW) AND recent (→ topRow) — overlap candidate
    const sharedVideo = makeVideo({
      id: "shared-dedup",
      title: "Shared Dedup Video",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    });
    // pureRecent is only recent (not in CW) — ensures topRow is non-empty
    const pureRecent = makeVideo({
      id: "pure-recent-dedup",
      title: "Pure Recent Dedup Video",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "shared-dedup": 45 }));

    const { container } = render(
      <HomeContent categories={CAT} videos={[sharedVideo, pureRecent]} />
    );
    await act(async () => {});

    // The top row is wrapped in the div with class "relative pt-10"
    // sharedVideo would be duplicated without the dedup filter
    const topRowSection = container.querySelector(".pt-10");
    expect(topRowSection).not.toBeNull();

    const topRowH3s = Array.from(topRowSection!.querySelectorAll("h3")).map(
      (h) => h.textContent ?? ""
    );
    const sharedCount = topRowH3s.filter((t) => t === "Shared Dedup Video").length;
    // Must appear exactly once — not twice (once from CW + once from topRow)
    expect(sharedCount).toBe(1);
  });

  it("CW+topRow dedup: non-CW recent video still appears in the merged top row after dedup", async () => {
    const cwVideo = makeVideo({
      id: "cw-only-dedup",
      title: "CW Only Video",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const recentOnlyVideo = makeVideo({
      id: "recent-only-dedup",
      title: "Recent Only Video",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // cwVideo is in progress; recentOnlyVideo is not
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "cw-only-dedup": 60 }));

    const { container } = render(
      <HomeContent categories={CAT} videos={[cwVideo, recentOnlyVideo]} />
    );
    await act(async () => {});

    const topRowSection = container.querySelector(".pt-10");
    expect(topRowSection).not.toBeNull();

    const topRowH3s = Array.from(topRowSection!.querySelectorAll("h3")).map(
      (h) => h.textContent ?? ""
    );
    // CW video appears once (from CW section)
    expect(topRowH3s.filter((t) => t === "CW Only Video").length).toBe(1);
    // Recent-only video appears once (from Latest section, not filtered out)
    expect(topRowH3s.filter((t) => t === "Recent Only Video").length).toBe(1);
  });

  it("CW+topRow dedup: when every topRow video is also in CW, merged row has no duplicates", async () => {
    // Both videos are in-progress AND recent
    const vid1 = makeVideo({
      id: "all-cw-1",
      title: "All CW Video One",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const vid2 = makeVideo({
      id: "all-cw-2",
      title: "All CW Video Two",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "all-cw-1": 40, "all-cw-2": 70 }));

    const { container } = render(
      <HomeContent categories={CAT} videos={[vid1, vid2]} />
    );
    await act(async () => {});

    const topRowSection = container.querySelector(".pt-10");
    expect(topRowSection).not.toBeNull();

    const topRowH3s = Array.from(topRowSection!.querySelectorAll("h3")).map(
      (h) => h.textContent ?? ""
    );
    // Each video appears exactly once — no duplicate from the topRow overlap
    expect(topRowH3s.filter((t) => t === "All CW Video One").length).toBe(1);
    expect(topRowH3s.filter((t) => t === "All CW Video Two").length).toBe(1);
    // Total unique card count in the merged row is exactly 2
    expect(topRowH3s.length).toBe(2);
  });

  it("Oldest sort: top row shows all filtered videos (not just recent ones)", async () => {
    const oldVideo = makeVideo({
      id: "oldest-old",
      title: "Old But Visible",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    });

    const { container } = render(
      <HomeContent categories={CAT} videos={[oldVideo]} />
    );
    await act(async () => {});

    // With default (newest) sortBy and a video older than 30 days, no top row
    const h2sBefore = Array.from(container.querySelectorAll("h2")).map((h) => h.textContent ?? "");
    expect(h2sBefore.some((t) => t.startsWith("Latest"))).toBe(false);

    // Switch to Oldest sort — the 30-day filter is bypassed
    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
    fireEvent.click(screen.getByText("Oldest"));
    fireEvent.click(screen.getByText("Apply"));
    await act(async () => {});

    const h2sAfter = Array.from(container.querySelectorAll("h2")).map((h) => h.textContent ?? "");
    expect(h2sAfter.some((t) => t.startsWith("Oldest"))).toBe(true);
    expect(h2sAfter.some((t) => t.startsWith("Latest"))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Search edge case — whitespace-only query
// ---------------------------------------------------------------------------

describe("HomeContent — search whitespace edge case", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("whitespace-only query does NOT hide the categories div (isSearching uses .trim())", async () => {
    // " " is truthy so setQuery is called, but " ".trim().length === 0 → isSearching = false
    const { container } = renderWithSearch("   ");
    await act(async () => {});
    const categoriesDiv = container.querySelector("#categories");
    expect(categoriesDiv).toBeTruthy();
    expect(categoriesDiv?.className).not.toContain("hidden");
  });
});

// ---------------------------------------------------------------------------
// MAX_CATEGORY_ROW = 15 truncation
// ---------------------------------------------------------------------------

describe("HomeContent — MAX_CATEGORY_ROW truncation", () => {
  const CAT: Category[] = [
    { slug: "tutorials", title: "Tutorials", description: "Tutorial videos" },
  ];

  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("renders exactly 15 video cards when a category has 16 videos", () => {
    // All videos more than 30 days old so the "Latest" top row stays empty
    const manyVideos = Array.from({ length: 16 }, (_, i) =>
      makeVideo({ id: `vid-${i}`, category: "tutorials", publishedAt: "2024-01-01T00:00:00Z" })
    );
    const { container } = render(<HomeContent categories={CAT} videos={manyVideos} />);
    // Only the category row renders (no top row — all videos are older than 30 days).
    // Scope to #categories to exclude Hero /watch/ links; count VideoCard links.
    const categoriesDiv = container.querySelector("#categories");
    const cards = categoriesDiv!.querySelectorAll('a[href^="/watch/"]');
    expect(cards.length).toBe(15);
  });

  it("shows 'View all' link when totalCount exceeds the rendered 15 cards", () => {
    const manyVideos = Array.from({ length: 16 }, (_, i) =>
      makeVideo({ id: `vid-${i}`, category: "tutorials", publishedAt: "2024-01-01T00:00:00Z" })
    );
    render(<HomeContent categories={CAT} videos={manyVideos} />);
    // VideoRow receives videos.slice(0,15) but totalCount=16 → shows "View all"
    // Note: HomeContent also renders a "View all" link for the Certification Courses section
    // so we need to find the specific one pointing to /category/tutorials
    const viewAllLinks = screen.getAllByText("View all");
    const categoryViewAll = viewAllLinks.map(el => el.closest("a")).find(a => a?.getAttribute("href") === "/category/tutorials");
    expect(categoryViewAll).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Per-category row visibility under active filters
// (tests the `if (categoryVideos.length === 0 && hasActiveFilters) return null` branch)
// ---------------------------------------------------------------------------

describe("HomeContent — per-category row visibility with active filters", () => {
  // Two categories: tutorials (short + medium videos), webinars (long video)
  const multiCatCategories: Category[] = [
    { slug: "tutorials", title: "Tutorials", description: "Tutorial videos" },
    { slug: "webinars", title: "Webinars", description: "Webinar recordings" },
  ];

  const multiCatVideos = [
    makeVideo({
      id: "short-t",
      title: "Short Tutorial",
      duration: "2:30",
      category: "tutorials",
      publishedAt: "2024-01-01T00:00:00Z",
    }),
    makeVideo({
      id: "medium-t",
      title: "Medium Tutorial",
      duration: "10:00",
      category: "tutorials",
      publishedAt: "2024-01-01T00:00:00Z",
    }),
    makeVideo({
      id: "long-w",
      title: "Long Webinar",
      duration: "1:05:00",
      category: "webinars",
      publishedAt: "2024-01-01T00:00:00Z",
    }),
  ];

  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("hides the Tutorials category row when 'Over 20 min' filter has no matching tutorials", async () => {
    const { container } = render(
      <HomeContent categories={multiCatCategories} videos={multiCatVideos} />
    );

    await openFilters();
    fireEvent.click(screen.getByText("Over 20 min"));
    fireEvent.click(screen.getByText("Apply"));

    // Tutorials h2 should NOT be present — category has no long videos
    const h2Texts = Array.from(container.querySelectorAll("h2")).map((h) => h.textContent);
    expect(h2Texts.some((t) => t?.includes("Tutorials"))).toBe(false);
  });

  it("keeps the Webinars category row visible when it has matching long videos", async () => {
    const { container } = render(
      <HomeContent categories={multiCatCategories} videos={multiCatVideos} />
    );

    await openFilters();
    fireEvent.click(screen.getByText("Over 20 min"));
    fireEvent.click(screen.getByText("Apply"));

    // Webinars row should still render
    const h2Texts = Array.from(container.querySelectorAll("h2")).map((h) => h.textContent);
    expect(h2Texts.some((t) => t?.includes("Webinars"))).toBe(true);
    // And the long webinar card should appear
    expect(screen.getByText("Long Webinar")).toBeTruthy();
  });

  it("does NOT show the global empty state when at least one category still has matching videos", async () => {
    render(
      <HomeContent categories={multiCatCategories} videos={multiCatVideos} />
    );

    await openFilters();
    fireEvent.click(screen.getByText("Over 20 min"));
    fireEvent.click(screen.getByText("Apply"));

    // Empty state should NOT appear — Webinars still has videos
    expect(screen.queryByText("No videos match your filters")).toBeNull();
  });

  it("hides the Webinars category row when 'Under 4 min' filter has no matching webinars", async () => {
    const { container } = render(
      <HomeContent categories={multiCatCategories} videos={multiCatVideos} />
    );

    await openFilters();
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));

    // Webinars h2 should NOT be present — no webinar videos are short
    const h2Texts = Array.from(container.querySelectorAll("h2")).map((h) => h.textContent);
    expect(h2Texts.some((t) => t?.includes("Webinars"))).toBe(false);
  });

  it("keeps Tutorials row visible when it has videos matching the short duration filter", async () => {
    render(
      <HomeContent categories={multiCatCategories} videos={multiCatVideos} />
    );

    await openFilters();
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));

    // Only Short Tutorial (2:30) survives; Tutorials row should still render
    expect(screen.getByText("Tutorials")).toBeTruthy();
    expect(screen.getAllByText("Short Tutorial").length).toBeGreaterThanOrEqual(1);
    // Medium Tutorial is filtered out
    expect(screen.queryByText("Medium Tutorial")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Exact boundary conditions for isWithinDateRange
// The function uses strict < comparisons, so a video published at exactly the
// cutoff (e.g. diffDays === 7 for "this-week") is EXCLUDED.
// ---------------------------------------------------------------------------

describe("HomeContent — date filter exact boundary conditions", () => {
  const CAT: Category[] = [
    { slug: "tutorials", title: "Tutorials", description: "Tutorial videos" },
  ];

  beforeEach(() => {
    cleanup();
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-17T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function renderWithVideos(testVideos: ReturnType<typeof makeVideo>[]) {
    const { container } = render(
      <HomeContent categories={CAT} videos={testVideos} />
    );
    return container;
  }

  function applyDateFilter(label: string, container: HTMLElement) {
    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
    fireEvent.click(screen.getByText(label));
    fireEvent.click(screen.getByText("Apply"));
    return container;
  }

  /**
   * "Today" uses diffDays < 1.
   * A video published exactly 24 hours ago has diffDays = 1.0 → 1 < 1 = false → EXCLUDED.
   */
  it("'Today' excludes a video published exactly 24 hours ago (diffDays = 1.0, condition is < 1)", () => {
    const exactlyTwentyFourHours = makeVideo({
      id: "exact-24h",
      title: "Exactly Twenty Four Hours Ago",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    });

    const container = renderWithVideos([exactlyTwentyFourHours]);
    applyDateFilter("Today", container);

    expect(screen.getByText("No videos match your filters")).toBeTruthy();
  });

  /**
   * "This week" uses diffDays < 7.
   * A video published exactly 7 days ago has diffDays = 7.0 → 7 < 7 = false → EXCLUDED.
   * (Existing test checks 8 days → excluded; this checks the exact cutoff.)
   */
  it("'This week' excludes a video published exactly 7 days ago (diffDays = 7.0, condition is < 7)", () => {
    const exactlySevenDays = makeVideo({
      id: "exact-7d",
      title: "Exactly Seven Days Ago",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const container = renderWithVideos([exactlySevenDays]);
    applyDateFilter("This week", container);

    expect(screen.getByText("No videos match your filters")).toBeTruthy();
  });

  /**
   * "This month" uses diffDays < 30.
   * A video published exactly 30 days ago has diffDays = 30.0 → 30 < 30 = false → EXCLUDED.
   * (Existing test checks 31 days → excluded; this checks the exact cutoff.)
   */
  it("'This month' excludes a video published exactly 30 days ago (diffDays = 30.0, condition is < 30)", () => {
    const exactlyThirtyDays = makeVideo({
      id: "exact-30d",
      title: "Exactly Thirty Days Ago",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const container = renderWithVideos([exactlyThirtyDays]);
    applyDateFilter("This month", container);

    expect(screen.getByText("No videos match your filters")).toBeTruthy();
  });

  /**
   * "This year" uses diffDays < 365.
   * A video published exactly 365 days ago has diffDays = 365.0 → 365 < 365 = false → EXCLUDED.
   * (Existing test checks 366 days → excluded; this checks the exact cutoff.)
   */
  it("'This year' excludes a video published exactly 365 days ago (diffDays = 365.0, condition is < 365)", () => {
    const exactlyThreeSixtyFiveDays = makeVideo({
      id: "exact-365d",
      title: "Exactly Three Sixty Five Days Ago",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const container = renderWithVideos([exactlyThreeSixtyFiveDays]);
    applyDateFilter("This year", container);

    expect(screen.getByText("No videos match your filters")).toBeTruthy();
  });

  /**
   * "This week" includes a video published 1 minute under 7 days ago.
   * diffDays ≈ 6.9993 → 6.9993 < 7 = true → INCLUDED.
   * Confirms the boundary is strict < (not ≤ 6).
   */
  it("'This week' includes a video published 1 minute under 7 days ago (diffDays just under 7.0)", () => {
    const justUnderSevenDays = makeVideo({
      id: "just-under-7d",
      title: "Just Under Seven Days",
      category: "tutorials",
      publishedAt: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000 - 60_000)).toISOString(),
    });

    const container = renderWithVideos([justUnderSevenDays]);
    applyDateFilter("This week", container);

    expect(screen.queryByText("No videos match your filters")).toBeNull();
    // Video title appears in multiple places (Hero + VideoRow) — use getAllByText
    expect(screen.getAllByText("Just Under Seven Days").length).toBeGreaterThanOrEqual(1);
  });

  /**
   * "This month" includes a video published 1 minute under 30 days ago.
   * diffDays ≈ 29.9993 → 29.9993 < 30 = true → INCLUDED.
   * Confirms the boundary is strict < (not ≤ 29).
   */
  it("'This month' includes a video published 1 minute under 30 days ago (diffDays just under 30.0)", () => {
    const justUnderThirtyDays = makeVideo({
      id: "just-under-30d",
      title: "Just Under Thirty Days",
      category: "tutorials",
      publishedAt: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000 - 60_000)).toISOString(),
    });

    const container = renderWithVideos([justUnderThirtyDays]);
    applyDateFilter("This month", container);

    expect(screen.queryByText("No videos match your filters")).toBeNull();
    // Video title appears in multiple places (Hero + VideoRow) — use getAllByText
    expect(screen.getAllByText("Just Under Thirty Days").length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Duration filter lower boundary (exactly 4 minutes)
// The matchesDuration helper uses: short = mins < 4, medium = mins >= 4 && mins <= 20
// These tests guard the lower bound of the medium range.
// ---------------------------------------------------------------------------

describe("HomeContent — duration filter lower boundary (exactly 4 min)", () => {
  const CAT: Category[] = [
    { slug: "tutorials", title: "Tutorials", description: "Tutorial videos" },
  ];

  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("'Under 4 min' excludes exactly 4:00 (4 >= 4 satisfies medium lower bound, not short)", async () => {
    const exact4 = makeVideo({
      id: "lb-exact-4",
      title: "Exactly Four Minutes",
      duration: "4:00",
      category: "tutorials",
      publishedAt: "2024-01-01T00:00:00Z",
    });

    render(<HomeContent categories={CAT} videos={[exact4]} />);

    await openFilters();
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));

    // 4:00 = 4 minutes; 4 < 4 is false → not short → filtered out
    expect(screen.getByText("No videos match your filters")).toBeTruthy();
  });

  it("'Under 4 min' includes exactly 3:59 (3.98 min < 4 → short)", async () => {
    const threeMin59 = makeVideo({
      id: "lb-3-59",
      title: "Three Fifty Nine",
      duration: "3:59",
      category: "tutorials",
      publishedAt: "2024-01-01T00:00:00Z",
    });

    render(<HomeContent categories={CAT} videos={[threeMin59]} />);

    await openFilters();
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));

    // 3:59 = 3 + 59/60 ≈ 3.983 min < 4 → short → should appear
    const h3s = Array.from(document.querySelectorAll("h3")).map((h) => h.textContent);
    expect(h3s.some((t) => t === "Three Fifty Nine")).toBe(true);
  });

  it("'4–20 min' includes exactly 4:00 (lower bound of medium: 4 >= 4)", async () => {
    const exact4 = makeVideo({
      id: "lb-exact-4-medium",
      title: "Exactly Four Medium",
      duration: "4:00",
      category: "tutorials",
      publishedAt: "2024-01-01T00:00:00Z",
    });

    render(<HomeContent categories={CAT} videos={[exact4]} />);

    await openFilters();
    fireEvent.click(screen.getByText("4–20 min"));
    fireEvent.click(screen.getByText("Apply"));

    // 4:00 = 4 minutes; 4 >= 4 && 4 <= 20 → medium → should appear
    const h3s = Array.from(document.querySelectorAll("h3")).map((h) => h.textContent);
    expect(h3s.some((t) => t === "Exactly Four Medium")).toBe(true);
  });

  it("'4–20 min' excludes exactly 3:59 (3.98 min < 4 → short, not medium)", async () => {
    const threeMin59 = makeVideo({
      id: "lb-3-59-medium",
      title: "Three Fifty Nine Medium",
      duration: "3:59",
      category: "tutorials",
      publishedAt: "2024-01-01T00:00:00Z",
    });

    render(<HomeContent categories={CAT} videos={[threeMin59]} />);

    await openFilters();
    fireEvent.click(screen.getByText("4–20 min"));
    fireEvent.click(screen.getByText("Apply"));

    // 3:59 is short (< 4), not medium → filtered out
    expect(screen.getByText("No videos match your filters")).toBeTruthy();
  });

  it("'Under 4 min' matches a no-colon duration (parseDurationMinutes zero-colon fallback returns 0)", async () => {
    // "45" has no colon → split(":") gives ["45"] → parts.length === 1
    // parseDurationMinutes: not length 3, not length 2 → falls through to return 0
    // 0 < 4 → classified as "short" → matches "Under 4 min" filter
    const noColonVideo = makeVideo({
      id: "lb-no-colon",
      title: "No Colon Duration Video",
      duration: "45",
      category: "tutorials",
      publishedAt: "2024-01-01T00:00:00Z",
    });

    render(<HomeContent categories={CAT} videos={[noColonVideo]} />);

    await openFilters();
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Apply"));

    // parseDurationMinutes("45") = 0 → 0 < 4 → matches "short" → video is visible
    const h3s = Array.from(document.querySelectorAll("h3")).map((h) => h.textContent);
    expect(h3s.some((t) => t === "No Colon Duration Video")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// MAX_TOP_ROW = 15 truncation
// The top row (Latest / Oldest) renders at most 15 videos (MAX_TOP_ROW constant)
// but the count badge shows the full untruncated total.
// ---------------------------------------------------------------------------

describe("HomeContent — MAX_TOP_ROW=15 truncation", () => {
  const CAT: Category[] = [
    { slug: "tutorials", title: "Tutorials", description: "Tutorial videos" },
  ];

  beforeEach(() => {
    cleanup();
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-17T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Latest row shows exactly 15 cards when 16 recent videos exist (MAX_TOP_ROW cap)", async () => {
    // All 16 videos are within 30 days → qualify for topRowVideos; sliced to 15 by MAX_TOP_ROW
    const recentVideos = Array.from({ length: 16 }, (_, i) =>
      makeVideo({
        id: `tr-latest-${i}`,
        title: `TR Latest ${i}`,
        category: "tutorials",
        publishedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
      })
    );

    const { container } = render(<HomeContent categories={CAT} videos={recentVideos} />);
    await act(async () => {});

    // The top row wrapper is the only div with class "pt-10" in HomeContent
    const topRowSection = container.querySelector(".pt-10");
    expect(topRowSection).not.toBeNull();

    // Each VideoCard renders an h3 for the title; only 15 should be in the top row
    const topRowCards = topRowSection!.querySelectorAll("h3");
    expect(topRowCards.length).toBe(15);
  });

  it("Latest row count badge shows 16 (full count) even though only 15 cards render", async () => {
    const recentVideos = Array.from({ length: 16 }, (_, i) =>
      makeVideo({
        id: `tr-badge-${i}`,
        title: `TR Badge ${i}`,
        category: "tutorials",
        publishedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
      })
    );

    const { container } = render(<HomeContent categories={CAT} videos={recentVideos} />);
    await act(async () => {});

    const h2s = Array.from(container.querySelectorAll("h2"));
    const latestH2 = h2s.find((h) => (h.textContent ?? "").startsWith("Latest"));
    expect(latestH2).toBeDefined();
    // Count badge (topRowTotalCount = 16) should exceed the rendered card count (15)
    expect(latestH2?.textContent).toContain("16");
  });

  it("Oldest sort: top row shows exactly 15 cards when 16 videos exist (MAX_TOP_ROW cap)", async () => {
    // All videos older than 30 days → no Latest top row in default newest mode
    const oldVideos = Array.from({ length: 16 }, (_, i) =>
      makeVideo({
        id: `tr-oldest-${i}`,
        title: `TR Oldest ${i}`,
        category: "tutorials",
        publishedAt: new Date(Date.now() - (60 + i) * 24 * 60 * 60 * 1000).toISOString(),
      })
    );

    const { container } = render(<HomeContent categories={CAT} videos={oldVideos} />);
    await act(async () => {});

    // Switch to Oldest sort → top row uses ALL filteredVideos.slice(0, MAX_TOP_ROW) = 15
    await openFilters();
    fireEvent.click(screen.getByText("Oldest"));
    fireEvent.click(screen.getByText("Apply"));
    await act(async () => {});

    const topRowSection = container.querySelector(".pt-10");
    expect(topRowSection).not.toBeNull();

    const topRowCards = topRowSection!.querySelectorAll("h3");
    expect(topRowCards.length).toBe(15);
  });

  it("Oldest sort: count badge shows 16 (full count) even though only 15 cards render", async () => {
    const oldVideos = Array.from({ length: 16 }, (_, i) =>
      makeVideo({
        id: `tr-oldest-badge-${i}`,
        title: `TR Old Badge ${i}`,
        category: "tutorials",
        publishedAt: new Date(Date.now() - (60 + i) * 24 * 60 * 60 * 1000).toISOString(),
      })
    );

    const { container } = render(<HomeContent categories={CAT} videos={oldVideos} />);
    await act(async () => {});

    await openFilters();
    fireEvent.click(screen.getByText("Oldest"));
    fireEvent.click(screen.getByText("Apply"));
    await act(async () => {});

    const h2s = Array.from(container.querySelectorAll("h2"));
    const oldestH2 = h2s.find((h) => (h.textContent ?? "").startsWith("Oldest"));
    expect(oldestH2).toBeDefined();
    // topRowTotalCount = filteredVideos.length = 16
    expect(oldestH2?.textContent).toContain("16");
  });
});

// ---------------------------------------------------------------------------
// activeFilterCount = 3 (all three filter groups active simultaneously)
// The floating filter button badge should display 3 when uploadDate, duration,
// AND sortBy are all set to non-default values.
// ---------------------------------------------------------------------------

describe("HomeContent — activeFilterCount = 3 (all filters active)", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("floating filter button badge shows 3 when all three filters are non-default", () => {
    render(<HomeContent categories={categories} videos={videos} />);

    // Apply all three filters at once (uploadDate + duration + sortBy)
    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
    fireEvent.click(screen.getByText("This week"));    // uploadDate → non-default
    fireEvent.click(screen.getByText("Under 4 min")); // duration → non-default
    fireEvent.click(screen.getByText("Oldest"));       // sortBy → non-default
    fireEvent.click(screen.getByText("Apply"));

    // The floating "Open filters" button is always in the DOM (just hidden via opacity).
    // Its text content includes the badge digit when activeFilterCount > 0.
    const floatingBtn = screen.getByRole("button", { name: "Open filters" });
    expect(floatingBtn.textContent).toContain("3");
  });

  it("hero-inline FilterTrigger badge also shows 3 when all filters are active", () => {
    render(<HomeContent categories={categories} videos={videos} />);

    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
    fireEvent.click(screen.getByText("This week"));
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Oldest"));
    fireEvent.click(screen.getByText("Apply"));

    // The hero-inline trigger is the first Filters button in the DOM.
    const heroBtns = screen.getAllByRole("button", { name: "Filters" });
    // At least one trigger shows the count badge
    const hasCount3 = heroBtns.some((btn) => btn.textContent?.includes("3"));
    expect(hasCount3).toBe(true);
  });

  it("reset from all-3-filters clears the badge back to no count", () => {
    render(<HomeContent categories={categories} videos={videos} />);

    // Apply all 3 filters
    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
    fireEvent.click(screen.getByText("This week"));
    fireEvent.click(screen.getByText("Under 4 min"));
    fireEvent.click(screen.getByText("Oldest"));
    fireEvent.click(screen.getByText("Apply"));

    // Confirm badge is 3
    const floatingBtn = screen.getByRole("button", { name: "Open filters" });
    expect(floatingBtn.textContent).toContain("3");

    // Now reset via the FilterBar's "Reset all" button
    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
    expect(screen.getByText("Reset all")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Reset all"));
    fireEvent.click(screen.getByText("Apply"));

    // Badge should be gone (no count after reset)
    const updatedBtn = screen.getByRole("button", { name: "Open filters" });
    expect(updatedBtn.textContent).not.toContain("3");
    expect(updatedBtn.textContent).not.toContain("1");
    expect(updatedBtn.textContent).not.toContain("2");
  });
});

// ---------------------------------------------------------------------------
// CW + Oldest sort — sectionLabels.secondLabel branch
// In HomeContent, when both CW and topRow videos exist the VideoRow receives
// sectionLabels. The secondLabel is "Oldest" when sortBy==="oldest" and
// "Latest" otherwise. This branch is exercised by the tests below.
// ---------------------------------------------------------------------------

describe("HomeContent — CW + Oldest sort: sectionLabels.secondLabel", () => {
  const CAT_SINGLE: Category[] = [
    { slug: "tutorials", title: "Tutorials", description: "Tutorial videos" },
  ];

  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("secondLabel is 'Oldest' when sortBy=oldest and both CW and topRow videos exist", async () => {
    // cwVideo: in-progress AND recent — goes into CW section
    const cwVideo = makeVideo({
      id: "cw-oldest-sl",
      title: "In Progress Oldest",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    });
    // recentVideo: not in progress — goes into topRow Oldest section
    const recentVideo = makeVideo({
      id: "recent-oldest-sl",
      title: "Recent Non-CW Oldest",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "cw-oldest-sl": 55 }));

    const { container } = render(
      <HomeContent categories={CAT_SINGLE} videos={[cwVideo, recentVideo]} />
    );
    await act(async () => {});

    // Switch to Oldest sort via the filter panel
    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
    fireEvent.click(screen.getByText("Oldest"));
    fireEvent.click(screen.getByText("Apply"));
    await act(async () => {});

    // sectionLabels.secondLabel should be "Oldest" not "Latest"
    const allH2Text = Array.from(container.querySelectorAll("h2")).map(
      (h) => h.textContent ?? ""
    );
    expect(allH2Text.some((t) => t.startsWith("Oldest"))).toBe(true);
    expect(allH2Text.some((t) => t.startsWith("Latest"))).toBe(false);
  });

  it("secondLabel is 'Latest' (not 'Oldest') when sortBy=newest — contrast test", async () => {
    const cwVideo = makeVideo({
      id: "cw-newest-sl",
      title: "In Progress Latest",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const recentVideo = makeVideo({
      id: "recent-newest-sl",
      title: "Recent Non-CW Latest",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "cw-newest-sl": 55 }));

    const { container } = render(
      <HomeContent categories={CAT_SINGLE} videos={[cwVideo, recentVideo]} />
    );
    await act(async () => {});

    // Default sortBy=newest — secondLabel should be "Latest"
    const allH2Text = Array.from(container.querySelectorAll("h2")).map(
      (h) => h.textContent ?? ""
    );
    expect(allH2Text.some((t) => t.startsWith("Latest"))).toBe(true);
    expect(allH2Text.some((t) => t.startsWith("Oldest"))).toBe(false);
  });

  it("firstLabel is always 'Continue Watching' regardless of sortBy", async () => {
    const cwVideo = makeVideo({
      id: "cw-first-sl",
      title: "CW First Label",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const otherVideo = makeVideo({
      id: "other-first-sl",
      title: "Other First Label",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "cw-first-sl": 40 }));

    const { container } = render(
      <HomeContent categories={CAT_SINGLE} videos={[cwVideo, otherVideo]} />
    );
    await act(async () => {});

    // Switch to Oldest — firstLabel must still be "Continue Watching"
    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
    fireEvent.click(screen.getByText("Oldest"));
    fireEvent.click(screen.getByText("Apply"));
    await act(async () => {});

    const allH2Text = Array.from(container.querySelectorAll("h2")).map(
      (h) => h.textContent ?? ""
    );
    expect(allH2Text.some((t) => t.startsWith("Continue Watching"))).toBe(true);
  });

  it("scroll region aria-label contains 'Continue Watching' even when sortBy=oldest", async () => {
    // When continueWatchingVideos.length > 0, HomeContent passes
    // title="Continue Watching" to VideoRow regardless of sortBy.
    // This is reflected in the scroll region's aria-label.
    const cwVideo = makeVideo({
      id: "cw-aria-sl",
      title: "CW Aria Label Test",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const otherVideo = makeVideo({
      id: "other-aria-sl",
      title: "Other Aria Label Test",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "cw-aria-sl": 60 }));

    const { container } = render(
      <HomeContent categories={CAT_SINGLE} videos={[cwVideo, otherVideo]} />
    );
    await act(async () => {});

    // Switch to Oldest
    fireEvent.click(screen.getAllByRole("button", { name: "Filters" })[0]);
    fireEvent.click(screen.getByText("Oldest"));
    fireEvent.click(screen.getByText("Apply"));
    await act(async () => {});

    // The top-row VideoRow has title="Continue Watching" (CW has priority over sortBy label).
    // VideoRow renders aria-label="{title} — use arrow keys to browse".
    const topRowSection = container.querySelector(".pt-10");
    const scrollRegion = topRowSection?.querySelector("[role='region']");
    expect(scrollRegion?.getAttribute("aria-label")).toContain("Continue Watching");
  });

  it("sectionLabels firstCount matches the number of CW videos", async () => {
    // Set up exactly 2 CW videos to verify firstCount=2 is rendered in the badge
    const cw1 = makeVideo({
      id: "cw-count-1",
      title: "CW Count One",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const cw2 = makeVideo({
      id: "cw-count-2",
      title: "CW Count Two",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    });
    // A third video that is only in topRow (not CW)
    const topOnlyVideo = makeVideo({
      id: "top-count-only",
      title: "Top Only Count",
      category: "tutorials",
      publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Both CW videos have partial progress
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ "cw-count-1": 30, "cw-count-2": 70 })
    );

    const { container } = render(
      <HomeContent categories={CAT_SINGLE} videos={[cw1, cw2, topOnlyVideo]} />
    );
    await act(async () => {});

    // The "Continue Watching" h2 badge should show "2" (firstCount=2)
    const topRowSection = container.querySelector(".pt-10");
    const cwH2 = Array.from(topRowSection?.querySelectorAll("h2") ?? []).find(
      (h) => (h.textContent ?? "").startsWith("Continue Watching")
    );
    expect(cwH2).toBeDefined();
    // The count badge <span> inside the h2 should contain "2"
    const countBadge = cwH2?.querySelector("span");
    expect(countBadge?.textContent).toBe("2");
  });
});
