/**
 * HomeContent — Certification Courses row visibility
 *
 * Tests the useSyncExternalStore-based coursesRowHidden state introduced in
 * commit 7366221. The key behavioral guarantee: when localStorage already has
 * "sonarqube-tv-hide-courses" = "1" BEFORE the component mounts, the section
 * must be absent from the first render (synchronous read — no flash / CLS).
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import { useEffect } from "react";
import HomeContent from "./HomeContent";
import { SearchProvider, useSearch } from "./SearchContext";
import type { Category } from "@/types";
import { makeVideo } from "@/__tests__/factories";

const HIDE_KEY = "sonarqube-tv-hide-courses";

const categories: Category[] = [
  { slug: "tutorials", title: "Tutorials", description: "Tutorial videos" },
];

const videos = [
  makeVideo({
    id: "v1",
    title: "Test Video",
    category: "tutorials",
    publishedAt: "2025-01-01T00:00:00Z",
  }),
];

/** Helper: injects a search query then renders nothing — must be inside SearchProvider */
function SearchQuerySetter({ query }: { query: string }) {
  const { setQuery } = useSearch();
  useEffect(() => {
    if (query) setQuery(query);
  }, [query, setQuery]);
  return null;
}

// The primary marker for the section being visible is the hide button with its
// aria-label. Present → section rendered. Absent → section hidden.
const HIDE_BTN_LABEL = "Hide certification courses row";

describe("HomeContent — Certification Courses row (useSyncExternalStore)", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("shows the Certification Courses section when localStorage has no hide key", () => {
    render(<HomeContent categories={categories} videos={videos} />);
    expect(screen.getByRole("button", { name: HIDE_BTN_LABEL })).toBeTruthy();
  });

  it("hides the section immediately when hide key is set in localStorage BEFORE render (synchronous useSyncExternalStore read — no CLS flash)", () => {
    // Set the key before rendering — useSyncExternalStore reads this
    // synchronously during the first render, so the section is never painted.
    localStorage.setItem(HIDE_KEY, "1");

    render(<HomeContent categories={categories} videos={videos} />);

    // No act() / flush needed — useSyncExternalStore is synchronous
    expect(screen.queryByRole("button", { name: HIDE_BTN_LABEL })).toBeNull();

    // Double-check via DOM: no h2 containing "Certification Courses"
    const coursesHeading = Array.from(document.querySelectorAll("h2")).find((el) =>
      el.textContent?.includes("Certification Courses")
    );
    expect(coursesHeading).toBeUndefined();
  });

  it("clicking the hide button hides the Certification Courses section", () => {
    render(<HomeContent categories={categories} videos={videos} />);

    const hideBtn = screen.getByRole("button", { name: HIDE_BTN_LABEL });
    expect(hideBtn).toBeTruthy(); // section visible before click

    fireEvent.click(hideBtn);

    // After forceHideUpdate() triggers re-render, useSyncExternalStore re-reads
    // localStorage → true → section is removed from DOM
    expect(screen.queryByRole("button", { name: HIDE_BTN_LABEL })).toBeNull();
  });

  it("clicking the hide button persists the hide key to localStorage", () => {
    render(<HomeContent categories={categories} videos={videos} />);
    expect(localStorage.getItem(HIDE_KEY)).toBeNull(); // not set before click

    const hideBtn = screen.getByRole("button", { name: HIDE_BTN_LABEL });
    fireEvent.click(hideBtn);

    expect(localStorage.getItem(HIDE_KEY)).toBe("1");
  });

  it("section is hidden during active search even when localStorage has no hide key", async () => {
    render(
      <SearchProvider>
        <SearchQuerySetter query="sonar" />
        <HomeContent categories={categories} videos={videos} />
      </SearchProvider>
    );
    await act(async () => {}); // flush search state propagation

    // !isSearching is false → condition `!isSearching && !coursesRowHidden` fails
    expect(screen.queryByRole("button", { name: HIDE_BTN_LABEL })).toBeNull();
  });

  it("section becomes visible again when search is cleared (isSearching goes back to false)", async () => {
    function DynamicQuerySetter({ query }: { query: string }) {
      const { setQuery, clearQuery } = useSearch();
      useEffect(() => {
        if (query) setQuery(query);
        else clearQuery();
      }, [query, setQuery, clearQuery]);
      return null;
    }

    const { rerender } = render(
      <SearchProvider>
        <DynamicQuerySetter query="sonar" />
        <HomeContent categories={categories} videos={videos} />
      </SearchProvider>
    );
    await act(async () => {}); // activate search
    expect(screen.queryByRole("button", { name: HIDE_BTN_LABEL })).toBeNull();

    // Clear the search query
    rerender(
      <SearchProvider>
        <DynamicQuerySetter query="" />
        <HomeContent categories={categories} videos={videos} />
      </SearchProvider>
    );
    await act(async () => {});

    // Section should reappear since localStorage still has no hide key
    expect(screen.getByRole("button", { name: HIDE_BTN_LABEL })).toBeTruthy();
  });

  it("'View all' courses link points to /courses when section is visible", () => {
    render(<HomeContent categories={categories} videos={videos} />);
    // The svg inside the link has aria-hidden so accessible name is just "View all"
    const viewAllLinks = screen.getAllByRole("link", { name: /View all/ });
    const coursesLink = viewAllLinks.find(
      (l) => l.getAttribute("href") === "/courses"
    );
    expect(coursesLink).toBeTruthy();
  });

  it("'View all /courses' link is absent when section is hidden", () => {
    localStorage.setItem(HIDE_KEY, "1");
    render(<HomeContent categories={categories} videos={videos} />);

    const viewAllLinks = screen.queryAllByRole("link", { name: /View all/ });
    const coursesLink = viewAllLinks.find(
      (l) => l.getAttribute("href") === "/courses"
    );
    expect(coursesLink).toBeUndefined();
  });
});
