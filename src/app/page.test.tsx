import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("@/components/HomeContent", () => ({
  default: ({
    categories,
    videos,
  }: {
    categories: { slug: string }[];
    videos: { id: string }[];
  }) => (
    <div
      data-testid="home-content"
      data-category-count={categories.length}
      data-video-count={videos.length}
    />
  ),
}));

import Home from "./page";

describe("Home page", () => {
  it("renders HomeContent", () => {
    render(<Home />);
    expect(screen.getByTestId("home-content")).toBeInTheDocument();
  });

  it("passes a non-empty categories list to HomeContent", () => {
    render(<Home />);
    const el = screen.getByTestId("home-content");
    const count = Number(el.dataset.categoryCount);
    expect(count).toBeGreaterThan(0);
  });

  it("passes a non-empty videos list to HomeContent", () => {
    render(<Home />);
    const el = screen.getByTestId("home-content");
    const count = Number(el.dataset.videoCount);
    expect(count).toBeGreaterThan(0);
  });
});
