/**
 * Header — search results cap + textarea shortcut guard.
 *
 * Isolated from Header.search.test.tsx because it needs a different videos mock:
 * 10 videos all matching a common query to exercise the 8-result display cap.
 *
 * Coverage:
 *  - displayedResults = searchResults.slice(0, 8) cap at 8 items
 *  - "X of Y results" count header when Y > 8
 *  - 9th and 10th results excluded from the DOM
 *  - "/" shortcut guard for HTMLTextAreaElement (the HTMLInputElement guard is
 *    already covered in Header.search.test.tsx; this file covers the symmetric
 *    textarea branch of the same condition)
 *
 * Key patterns (mirror Header.search.test.tsx):
 *  - beforeAll pre-warms the mocked @/data/videos module so dynamic imports
 *    inside Header resolve instantly.
 *  - openSearch() uses double `await act(async () => {})` — first flush lets
 *    the click state + effects settle (starts lazy import); second flush
 *    processes the import .then(setSearchVideos) re-render.
 *  - The search input has role="combobox" (explicit attr in Header.tsx) which
 *    overrides the implicit "searchbox" role from type="search".
 */
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import Header from "./Header";
import { SearchProvider } from "./SearchContext";

// ── Mock: 10 videos whose titles all contain "captest" ────────────────────────
// Titles are zero-padded ("CapTest Video 01" … "CapTest Video 10") so that
// "Video 1" cannot accidentally partial-match "Video 10" in string checks.
vi.mock("@/data/videos", async (importActual) => {
  const actual = await importActual<typeof import("@/data/videos")>();
  const mockVideos = Array.from({ length: 10 }, (_, i) => ({
    id: `cap-vid-${i + 1}`,
    title: `CapTest Video ${String(i + 1).padStart(2, "0")}`,
    description: `captestquery item ${i + 1}`,
    youtubeId: `cap${String(i + 1).padStart(8, "0")}`, // 11 chars
    thumbnail: `/cap${i + 1}.jpg`,
    category: "getting-started",
    duration: "5:00",
    publishedAt: "2025-01-01T00:00:00Z",
  }));
  return { ...actual, videos: mockVideos };
});

// Pre-warm the @/data/videos module mock so that subsequent dynamic imports
// (import("@/data/videos") inside Header's useEffect) resolve instantly.
beforeAll(async () => {
  await import("@/data/videos");
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function renderHeader() {
  return render(
    <SearchProvider>
      <Header />
    </SearchProvider>
  );
}

/** Open the search bar and flush the lazy-loaded @/data/videos Promise.
 *
 * Double flush mirrors Header.search.test.tsx pattern:
 *  1st flush: click state update + effects (starts lazy import of @/data/videos)
 *  2nd flush: import() .then(setSearchVideos) → React re-render
 */
async function openSearch() {
  fireEvent.click(screen.getByRole("button", { name: "Search videos" }));
  await act(async () => {});
  await act(async () => {});
}

/** Return the search input (assumes search bar is open).
 *
 * The input has role="combobox" (set explicitly in Header.tsx), which overrides
 * the implicit "searchbox" from type="search". Use getByRole("combobox").
 */
function searchInput() {
  return screen.getByRole("combobox", { name: "Search videos" });
}

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── 8-result cap ──────────────────────────────────────────────────────────────
describe("Header — search results cap (displayedResults.slice(0, 8))", () => {
  it("shows '8 of 10 results' count when all 10 mock videos match the query", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "captest" } });
    expect(screen.getByText("8 of 10 results")).toBeInTheDocument();
  });

  it("renders exactly 8 option items in the results dropdown when 10 match", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "captest" } });
    // Results are <li role="option"> elements inside the <ul role="listbox">.
    // role="option" overrides the implicit listitem role, so use getAllByRole("option").
    const items = screen.getAllByRole("option");
    expect(items).toHaveLength(8);
  });

  it("first 8 video titles appear in the dropdown", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "captest" } });
    for (let i = 1; i <= 8; i++) {
      const title = `CapTest Video ${String(i).padStart(2, "0")}`;
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("9th and 10th video titles are absent from the DOM (capped at 8)", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "captest" } });
    expect(screen.queryByText("CapTest Video 09")).toBeNull();
    expect(screen.queryByText("CapTest Video 10")).toBeNull();
  });

  it("result links point to the correct /watch/<id> routes", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "captest" } });
    // All 8 displayed results should link to their respective video IDs
    for (let i = 1; i <= 8; i++) {
      const title = `CapTest Video ${String(i).padStart(2, "0")}`;
      const link = screen.getByText(title).closest("a");
      expect(link).toHaveAttribute("href", `/watch/cap-vid-${i}`);
    }
  });

  it("shows 'No results' count header for a query that matches nothing", async () => {
    renderHeader();
    await openSearch();
    fireEvent.change(searchInput(), { target: { value: "zzz-no-match-xyz" } });
    // The count header shows "No results" when searchResults.length === 0
    expect(screen.getByText("No results")).toBeInTheDocument();
  });
});

// ── "/" shortcut guard — HTMLTextAreaElement ──────────────────────────────────
describe("Header — '/' shortcut guard for textarea target", () => {
  it("pressing '/' when a <textarea> is focused does NOT open the search bar", () => {
    // The Header's keydown handler guards against opening search when the event
    // target is an HTMLInputElement OR HTMLTextAreaElement. The HTMLInputElement
    // branch is tested in Header.search.test.tsx; this covers the textarea branch.
    renderHeader();
    const fakeTextarea = document.createElement("textarea");
    document.body.appendChild(fakeTextarea);

    act(() => {
      fireEvent.keyDown(fakeTextarea, { key: "/" });
    });

    // Search bar should remain closed (no combobox role in the document)
    expect(screen.queryByRole("combobox")).toBeNull();
    document.body.removeChild(fakeTextarea);
  });

  it("pressing '/' outside any input/textarea DOES open the search bar", async () => {
    // Baseline: the "/" shortcut works when target is a non-input element
    renderHeader();

    act(() => {
      // Fire on document.body — not an input or textarea, so search opens
      fireEvent.keyDown(document.body, { key: "/" });
    });
    // Flush state update + lazy import effect
    await act(async () => {});
    await act(async () => {});

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
