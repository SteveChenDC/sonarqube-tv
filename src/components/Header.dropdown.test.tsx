import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";
import { SearchProvider } from "./SearchContext";

// Mutable pathname that tests can change to simulate navigation
let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

function renderHeader() {
  return render(
    <SearchProvider>
      <Header />
    </SearchProvider>
  );
}

beforeEach(() => {
  mockPathname = "/";
  localStorage.clear();
});

describe("Header — dropdown dismissal on route change", () => {
  it("closes Categories dropdown when pathname changes", () => {
    const { rerender } = renderHeader();

    // Open the Categories dropdown
    fireEvent.click(screen.getByRole("button", { name: /categories/i }));
    expect(screen.getByText("Browse by Category")).toBeInTheDocument();

    // Simulate route change
    mockPathname = "/watch/v1";
    rerender(
      <SearchProvider>
        <Header />
      </SearchProvider>
    );

    // Dropdown content should no longer be visible (opacity-0 + pointer-events-none)
    const dropdown = screen.queryByText("Browse by Category");
    if (dropdown) {
      const panel = dropdown.closest('[class*="opacity-0"]');
      expect(panel).toBeTruthy();
    }
  });

  it("closes Courses dropdown when pathname changes", () => {
    const { rerender } = renderHeader();

    // Open the Courses dropdown
    fireEvent.click(screen.getByRole("button", { name: /courses/i }));
    expect(screen.getByText("Certification Courses")).toBeInTheDocument();

    // Simulate route change
    mockPathname = "/courses/sonarqube-certified-developer";
    rerender(
      <SearchProvider>
        <Header />
      </SearchProvider>
    );

    const dropdown = screen.queryByText("Certification Courses");
    if (dropdown) {
      const panel = dropdown.closest('[class*="opacity-0"]');
      expect(panel).toBeTruthy();
    }
  });
});

describe("Header — dropdown dismissal on link click", () => {
  it("closes Categories dropdown when a category link is clicked", () => {
    renderHeader();

    fireEvent.click(screen.getByRole("button", { name: /categories/i }));
    expect(screen.getByText("Browse by Category")).toBeInTheDocument();

    // Click a category link inside the dropdown
    const categoryLink = screen.getByRole("link", { name: /getting started/i });
    fireEvent.click(categoryLink);

    // Dropdown should be closing (invisible or unmounted)
    const dropdown = screen.queryByText("Browse by Category");
    if (dropdown) {
      const panel = dropdown.closest('[class*="opacity-0"]');
      expect(panel).toBeTruthy();
    }
  });

  it("closes Courses dropdown when View all link is clicked", () => {
    renderHeader();

    fireEvent.click(screen.getByRole("button", { name: /courses/i }));
    expect(screen.getByText("Certification Courses")).toBeInTheDocument();

    // Click "View all" link
    const viewAll = screen.getByRole("link", { name: /view all/i });
    fireEvent.click(viewAll);

    const dropdown = screen.queryByText("Certification Courses");
    if (dropdown) {
      const panel = dropdown.closest('[class*="opacity-0"]');
      expect(panel).toBeTruthy();
    }
  });

  it("opening Categories closes Courses and vice versa", () => {
    renderHeader();

    // Open Courses
    fireEvent.click(screen.getByRole("button", { name: /courses/i }));
    expect(screen.getByText("Certification Courses")).toBeInTheDocument();

    // Open Categories — should close Courses
    fireEvent.click(screen.getByRole("button", { name: /categories/i }));
    expect(screen.getByText("Browse by Category")).toBeInTheDocument();

    // Courses panel should be closing
    const coursesHeading = screen.queryByText("Certification Courses");
    if (coursesHeading) {
      const panel = coursesHeading.closest('[class*="opacity-0"]');
      expect(panel).toBeTruthy();
    }
  });

  it("Escape key closes open dropdown", () => {
    renderHeader();

    fireEvent.click(screen.getByRole("button", { name: /categories/i }));
    expect(screen.getByText("Browse by Category")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    const dropdown = screen.queryByText("Browse by Category");
    if (dropdown) {
      const panel = dropdown.closest('[class*="opacity-0"]');
      expect(panel).toBeTruthy();
    }
  });
});
