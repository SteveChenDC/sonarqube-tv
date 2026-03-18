/**
 * Header — search and categories dropdown tests.
 *
 * Split from Header.test.tsx because this file uses vi.mock("@/data/videos")
 * to control search results. Mixing a vi.mock("@/data/videos") call into a file
 * that already imports the module without a mock would cause interference.
 *
 * Each test wraps <Header /> in <SearchProvider> so that search state updates
 * actually propagate — the default context no-op setQuery silently swallows
 * typed input, preventing results from appearing.
 *
 * Global mocks (next/link, next/image, matchMedia, IntersectionObserver) are
 * already configured in src/__tests__/setup.tsx.
 *
 * NOTE: Header.tsx lazy-loads @/data/videos via dynamic import the first time
 * search is opened. openSearch() uses `await act(async () => ...)` to flush the
 * mocked import promise before any assertion on results.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, act, waitFor } from "@testing-library/react";
import Header from "./Header";
import { SearchProvider } from "./SearchContext";

// ── Mock @/data/videos — two small, controlled test videos ───────────────────
// Both descriptions contain the word "tutorial" so searching "tutorial" matches
// both and allows testing the plural "results" badge.
vi.mock("@/data/videos", async (importActual) => {
  const actual = await importActual<typeof import("@/data/videos")>();
  return {
    ...actual,
    videos: [
      {
        id: "hdr-vid-1",
        title: "SonarQube Introduction",
        description: "A beginner tutorial for SonarQube",
        youtubeId: "hdr-yt-1",
        thumbnail: "/t1.jpg",
        category: "getting-started",
        duration: "10:00",
        publishedAt: "2025-01-01T00:00:00Z",
      },
      {
        id: "hdr-vid-2",
        title: "Advanced Analysis",
        description: "Deep dive tutorial into code analysis",
        youtubeId: "hdr-yt-2",
        thumbnail: "/t2.jpg",
        category: "getting-started",
        duration: "15:00",
        publishedAt: "2025-02-01T00:00:00Z",
      },
    ],
  };
});

// ── Helpers ──────────────────────────────────────────────────────────────────
function renderHeader() {
  return render(
    <SearchProvider>
      <Header />
    </SearchProvider>
  );
}

/** Open the search bar and flush the lazy-loaded @/data/videos Promise.
 *
 * The Header lazy-imports @/data/videos the first time search opens.
 * Two act() flushes are needed: the first lets the click state updates and
 * the import() call settle; the second processes the resulting setState from
 * the .then() callback so searchVideos is populated before returning.
 */
async function openSearch() {
  fireEvent.click(screen.getByRole("button", { name: "Search videos" }));
  // First flush: click state update + effects (starts lazy import of @/data/videos)
  await act(async () => {});
  // Second flush: import() .then(setSearchVideos) → React re-render
  await act(async () => {});
}

/** Return the search input (assumes search bar is open). */
function searchInput() {
  return screen.getByRole("searchbox", { name: "Search videos" });
}

// Pre-warm the @/data/videos module mock so that subsequent dynamic imports
// (import("@/data/videos") inside Header's useEffect) resolve instantly.
beforeAll(async () => {
  await import("@/data/videos");
});

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─────────────────────────────────────────────────────────────────────────────
// Search — open / close
// ─────────────────────────────────────────────────────────────────────────────
describe("Header — search open/close", () => {
  it("renders a 'Search videos' button in the initial state", () => {
    renderHeader();
    expect(screen.getByRole("button", { name: "Search videos" })).toBeInTheDocument();
  });

  it("clicking the search button reveals the text input", async () => {
    renderHeader();
    await openSearch();
    expect(searchInput()).toBeInTheDocument();
  });

  it("Escape key closes the search input and restores the search button", async () => {
    renderHeader();
    await openSearch();
    expect(searchInput()).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });

    expect(screen.queryByRole("searchbox")).toBeNull();
    expect(screen.getByRole("button", { name: "Search videos" })).toBeInTheDocument();
  });

  it("Escape key clears the query when closing search", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "SonarQube" } });
    // Verify the query was set in the input (does not require search results to load)
    expect(searchInput()).toHaveValue("SonarQube");

    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });

    // Search closes and input is gone — query was cleared by Escape
    expect(screen.queryByRole("searchbox")).toBeNull();
    expect(screen.queryByText("SonarQube Introduction")).toBeNull();
  });

  it("pressing '/' when search is closed opens the search input", () => {
    renderHeader();
    // Confirm we start with the search button (closed state)
    expect(screen.getByRole("button", { name: "Search videos" })).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document, { key: "/" });
    });

    expect(searchInput()).toBeInTheDocument();
  });

  it("pressing '/' when search is already open does NOT close or re-open it (guard: !searchOpen)", async () => {
    renderHeader();
    // Open search via button click
    await openSearch();
    expect(searchInput()).toBeInTheDocument();

    // Type a query so results appear — ensures state is stable
    fireEvent.change(searchInput(), { target: { value: "SonarQube" } });
    expect(screen.getByText("SonarQube Introduction")).toBeInTheDocument();

    // Press "/" again — should have no effect since searchOpen=true
    act(() => {
      fireEvent.keyDown(document, { key: "/" });
    });

    // Search input still open; results still visible
    expect(searchInput()).toBeInTheDocument();
    expect(screen.getByText("SonarQube Introduction")).toBeInTheDocument();
  });

  it("pressing '/' when the target is an input does NOT open search", () => {
    renderHeader();
    // Fire keydown with an input element as the event target
    const fakeInput = document.createElement("input");
    document.body.appendChild(fakeInput);

    act(() => {
      fireEvent.keyDown(fakeInput, { key: "/" });
    });

    // Search should remain closed
    expect(screen.queryByRole("searchbox")).toBeNull();
    document.body.removeChild(fakeInput);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Search — results
// ─────────────────────────────────────────────────────────────────────────────
describe("Header — search results", () => {
  it("typing a matching query reveals the results dropdown with matching title", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "SonarQube" } });
    expect(screen.getByText("SonarQube Introduction")).toBeInTheDocument();
  });

  it("shows 'No results for' message when query has no results", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "zzz-no-match-xyz" } });
    expect(screen.getByText(/No results for/)).toBeInTheDocument();
  });

  it("shows singular 'result' for a single match", async () => {
    renderHeader();
    await openSearch();
    // "SonarQube" only appears in the first video's title/description
    fireEvent.change(searchInput(), { target: { value: "SonarQube" } });
    expect(screen.getByText("1 of 1 result")).toBeInTheDocument();
  });

  it("shows plural 'results' when multiple videos match", async () => {
    renderHeader();
    await openSearch();
    // "tutorial" is in BOTH video descriptions — so both match
    fireEvent.change(searchInput(), { target: { value: "tutorial" } });
    expect(screen.getByText("2 of 2 results")).toBeInTheDocument();
  });

  it("results dropdown does not appear when search is closed (no query shown)", () => {
    renderHeader();
    // No click on search — results must not be visible
    expect(screen.queryByText("SonarQube Introduction")).toBeNull();
  });

  it("result items include the video title and duration", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "SonarQube" } });
    expect(screen.getByText("SonarQube Introduction")).toBeInTheDocument();
    // Duration should also appear in the result item
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });

  it("result items link to the correct /watch route", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "SonarQube" } });
    // The result list item wraps the title in an <a>
    const link = screen.getByText("SonarQube Introduction").closest("a");
    expect(link?.getAttribute("href")).toBe("/watch/hdr-vid-1");
  });

  it("matches a video whose description contains the query even when the title does not", async () => {
    renderHeader();
    await openSearch();
    // "Deep dive" appears in video 2's description ("Deep dive tutorial into code analysis")
    // but NOT in its title ("Advanced Analysis") — tests the description branch of the filter
    fireEvent.change(searchInput(), { target: { value: "Deep dive" } });
    expect(screen.getByText("Advanced Analysis")).toBeInTheDocument();
    expect(screen.queryByText("SonarQube Introduction")).toBeNull();
  });

  it("result items include a category badge with the category name", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "SonarQube" } });
    // Both test videos belong to "getting-started" which maps to "Getting Started"
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
  });

  it("clicking a result link clears the query and closes search", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "SonarQube" } });
    expect(screen.getByText("SonarQube Introduction")).toBeInTheDocument();

    const resultLink = screen.getByText("SonarQube Introduction").closest("a")!;
    fireEvent.click(resultLink);

    // onClick calls onSearchChange("") and setSearchOpen(false)
    // → no input, no results
    expect(screen.queryByRole("searchbox")).toBeNull();
    expect(screen.queryByText("SonarQube Introduction")).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Search — blur and click-outside behaviours
// ─────────────────────────────────────────────────────────────────────────────
describe("Header — search blur / click-outside", () => {
  it("blurring the input when query is empty closes the search bar", async () => {
    renderHeader();
    await openSearch();
    // Input is open but query is still empty — blur should close
    expect(searchInput()).toBeInTheDocument();
    fireEvent.blur(searchInput());
    expect(screen.queryByRole("searchbox")).toBeNull();
    expect(screen.getByRole("button", { name: "Search videos" })).toBeInTheDocument();
  });

  it("blurring the input when query is non-empty does NOT close search", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "SonarQube" } });
    fireEvent.blur(searchInput());
    // Query is non-empty → handleSearchBlur guards against close
    expect(searchInput()).toBeInTheDocument();
  });

  it("clicking outside the results area while results are visible clears the query", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "SonarQube" } });
    expect(screen.getByText("SonarQube Introduction")).toBeInTheDocument();

    // mousedown on document body (outside input and results ref)
    act(() => {
      fireEvent.mouseDown(document.body);
    });

    // The showResults mousedown handler calls onSearchChange("") → results vanish
    expect(screen.queryByText("SonarQube Introduction")).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Search — clear button
// ─────────────────────────────────────────────────────────────────────────────
describe("Header — clear search button", () => {
  it("clear button is absent when query is empty", async () => {
    renderHeader();
    await openSearch();
    expect(screen.queryByLabelText("Clear search")).toBeNull();
  });

  it("clear button appears when query is non-empty", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "foo" } });
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("clicking clear button removes the query and hides results", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "SonarQube" } });
    expect(screen.getByText("SonarQube Introduction")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Clear search"));

    // Results dropdown should disappear (no query → showResults = false)
    expect(screen.queryByText("SonarQube Introduction")).toBeNull();
    // Clear button itself should also disappear
    expect(screen.queryByLabelText("Clear search")).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Categories dropdown
// ─────────────────────────────────────────────────────────────────────────────
describe("Header — categories dropdown", () => {
  it("clicking 'Categories' button opens the dropdown", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: /categories/i }));
    // "Browse by Category" heading is inside the dropdown
    expect(screen.getByText("Browse by Category")).toBeInTheDocument();
  });

  it("opened dropdown lists category links from the real data", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: /categories/i }));
    // "Getting Started" is one of the real categories
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
  });

  it("dropdown includes an 'All Categories' link", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: /categories/i }));
    const allLink = screen.getByRole("link", { name: /all categories/i });
    expect(allLink).toBeInTheDocument();
    expect(allLink.getAttribute("href")).toBe("/#categories");
  });

  it("Escape key sets dropdown to invisible (opacity-0 class)", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: /categories/i }));
    expect(screen.getByText("Browse by Category")).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });

    // dropdownMounted stays true during exit animation — heading still in DOM
    const heading = screen.getByText("Browse by Category");
    expect(heading).toBeInTheDocument();
    // The animated wrapper should have opacity-0 (dropdownVisible=false)
    const animatedWrapper = heading.closest("div[class*='transition-all']") as HTMLElement;
    expect(animatedWrapper?.className).toContain("opacity-0");
  });

  it("clicking outside the menu closes the dropdown (sets invisible)", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: /categories/i }));
    expect(screen.getByText("Browse by Category")).toBeInTheDocument();

    act(() => {
      fireEvent.mouseDown(document.body);
    });

    const heading = screen.getByText("Browse by Category");
    const animatedWrapper = heading.closest("div[class*='transition-all']") as HTMLElement;
    expect(animatedWrapper?.className).toContain("opacity-0");
  });

  it("dropdown unmounts from DOM after transitionend fires on close", () => {
    renderHeader();
    const btn = screen.getByRole("button", { name: /categories/i });

    // Open dropdown
    fireEvent.click(btn);
    expect(screen.getByText("Browse by Category")).toBeInTheDocument();

    // Close dropdown — dropdownMounted stays true during exit animation
    fireEvent.click(btn);
    expect(screen.getByText("Browse by Category")).toBeInTheDocument();

    // Find the animated wrapper div and fire transitionend
    const heading = screen.getByText("Browse by Category");
    const animatedWrapper = heading.closest("div[class*='scale']") as HTMLElement;
    act(() => {
      fireEvent.transitionEnd(animatedWrapper);
    });

    // Now dropdownMounted=false — heading should be gone
    expect(screen.queryByText("Browse by Category")).toBeNull();
  });

  it("chevron icon rotates when dropdown is open", () => {
    renderHeader();
    const btn = screen.getByRole("button", { name: /categories/i });

    // Before opening — chevron should NOT have rotate-180
    // Use getAttribute("class") because SVG className is an SVGAnimatedString, not a string
    const chevron = btn.querySelector("svg");
    expect(chevron?.getAttribute("class")).not.toContain("rotate-180");

    fireEvent.click(btn);
    // After opening — chevron should have rotate-180
    expect(chevron?.getAttribute("class")).toContain("rotate-180");
  });
});
