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
});
