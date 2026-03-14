import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("Header", () => {
  it("renders the Sonar brand logo linking to home", () => {
    render(<Header />);
    const homeLink = screen.getByRole("link", { name: /sonar logo/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders Categories navigation link pointing to /#categories", () => {
    render(<Header />);
    const categoriesLink = screen.getByRole("link", { name: /categories/i });
    expect(categoriesLink).toHaveAttribute("href", "/#categories");
  });

  it("renders the Sonar SVG logo", () => {
    const { container } = render(<Header />);
    const svg = container.querySelector("svg[aria-label='Sonar logo']");
    expect(svg).toBeTruthy();
  });

  it("has a fixed header with proper z-index class", () => {
    const { container } = render(<Header />);
    const header = container.querySelector("header");
    expect(header?.className).toContain("fixed");
    expect(header?.className).toContain("z-50");
  });
});
