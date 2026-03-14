import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("Header", () => {
  it("renders the SonarQube.tv brand logo linking to home", () => {
    render(<Header />);
    const homeLink = screen.getByRole("link", { name: /sonarqube/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders Categories navigation link pointing to /#categories", () => {
    render(<Header />);
    const categoriesLink = screen.getByRole("link", { name: /categories/i });
    expect(categoriesLink).toHaveAttribute("href", "/#categories");
  });

  it("renders brand text with correct segments", () => {
    render(<Header />);
    expect(screen.getByText("Sonar")).toBeTruthy();
    expect(screen.getByText("Qube")).toBeTruthy();
    expect(screen.getByText(".tv")).toBeTruthy();
  });

  it("has a fixed header with proper z-index class", () => {
    const { container } = render(<Header />);
    const header = container.querySelector("header");
    expect(header?.className).toContain("fixed");
    expect(header?.className).toContain("z-50");
  });
});
