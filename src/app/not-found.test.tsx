import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("NotFound page", () => {
  it("renders the page heading 'Page not found'", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeTruthy();
  });

  it("displays the 404 text visually", () => {
    render(<NotFound />);
    const fourOhFours = screen.getAllByText("404");
    expect(fourOhFours.length).toBeGreaterThanOrEqual(1);
  });

  it("renders a 'Back to Home' link pointing to '/'", () => {
    render(<NotFound />);
    const homeLink = screen.getByRole("link", { name: /back to home/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders a 'Browse tutorials' link pointing to /category/getting-started", () => {
    render(<NotFound />);
    const browseLink = screen.getByRole("link", { name: /browse tutorials/i });
    expect(browseLink).toHaveAttribute("href", "/category/getting-started");
  });

  it("shows a helpful body copy message", () => {
    render(<NotFound />);
    expect(
      screen.getByText(/looks like this video went offline/i)
    ).toBeTruthy();
  });

  it("renders the Sonar brand tag line", () => {
    render(<NotFound />);
    expect(screen.getByText(/sonar\.tv/i)).toBeTruthy();
  });
});
