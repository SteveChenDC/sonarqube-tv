import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders the SonarQube.tv brand logo linking to home", () => {
    render(<Header />);
    const homeLink = screen.getByRole("link", { name: /sonar/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders Categories dropdown button", () => {
    render(<Header />);
    const categoriesBtn = screen.getByRole("button", { name: /categories/i });
    expect(categoriesBtn).toBeTruthy();
  });

  it("renders brand text with correct segments", () => {
    render(<Header />);
    expect(screen.getByText("Sonar")).toBeTruthy();
    expect(screen.getByText(".tv")).toBeTruthy();
  });

  it("renders the whale mark SVG", () => {
    const { container } = render(<Header />);
    const svg = container.querySelector("svg[aria-hidden='true']");
    expect(svg).toBeTruthy();
  });

  it("has a fixed header with proper z-index class", () => {
    const { container } = render(<Header />);
    const header = container.querySelector("header");
    expect(header?.className).toContain("fixed");
    expect(header?.className).toContain("z-50");
  });

  // ── Nav label visibility (commit 2651571) ────────────────────────────────────

  it("'Courses' nav label is always visible — not hidden on mobile screens", () => {
    // Regression guard for commit 2651571 — nav labels had 'hidden sm:inline'
    // which hid them on mobile. Removing that class makes the labels visible at
    // all viewport widths so users on small screens can read 'Courses' text.
    const { container } = render(<Header />);
    const coursesBtn = screen.getByRole("button", { name: /courses/i });
    // The label span is the first <span> inside the button (not the SVG chevron)
    const labelSpan = coursesBtn.querySelector("span");
    expect(labelSpan?.textContent).toBe("Courses");
    // Must NOT have 'hidden' class — that class would hide it on mobile
    expect(labelSpan?.className ?? "").not.toContain("hidden");
  });

  it("'Categories' nav label is always visible — not hidden on mobile screens", () => {
    // Regression guard for commit 2651571 — same fix applied to the Categories button.
    const { container } = render(<Header />);
    const categoriesBtn = screen.getByRole("button", { name: /categories/i });
    const labelSpan = categoriesBtn.querySelector("span");
    expect(labelSpan?.textContent).toBe("Categories");
    expect(labelSpan?.className ?? "").not.toContain("hidden");
  });
});
