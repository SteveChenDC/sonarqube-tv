import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import CategoryContent from "./CategoryContent";
import { makeVideo } from "@/__tests__/factories";

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

const videos = [
  makeVideo({
    id: "vid-a",
    title: "Alpha Video",
    duration: "2:30",
    publishedAt: "2024-01-01T00:00:00Z",
  }),
  makeVideo({
    id: "vid-b",
    title: "Beta Video",
    duration: "15:00",
    publishedAt: "2025-06-01T00:00:00Z",
  }),
  makeVideo({
    id: "vid-c",
    title: "Gamma Video",
    duration: "1:05:00",
    publishedAt: "2025-12-01T00:00:00Z",
  }),
];

describe("CategoryContent", () => {
  it("renders sort buttons", () => {
    render(<CategoryContent videos={videos} description="Test category" />);
    expect(screen.getByRole("button", { name: "Newest" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Oldest" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shortest" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Longest" })).toBeInTheDocument();
  });

  it("shows all videos by default", () => {
    render(<CategoryContent videos={videos} description="" />);
    expect(screen.getByText("Alpha Video")).toBeInTheDocument();
    expect(screen.getByText("Beta Video")).toBeInTheDocument();
    expect(screen.getByText("Gamma Video")).toBeInTheDocument();
  });

  it("defaults to Newest sort (aria-pressed=true)", () => {
    render(<CategoryContent videos={videos} description="" />);
    const newestBtn = screen.getByRole("button", { name: "Newest" });
    expect(newestBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("shows description when provided", () => {
    render(<CategoryContent videos={videos} description="My category description" />);
    expect(screen.getByText("My category description")).toBeInTheDocument();
  });

  it("renders nothing when videos array is empty", () => {
    const { container } = render(<CategoryContent videos={[]} description="Empty" />);
    expect(container.firstChild).toBeNull();
  });

  it("changes active sort button when clicked", () => {
    render(<CategoryContent videos={videos} description="" />);
    const oldestBtn = screen.getByRole("button", { name: "Oldest" });
    fireEvent.click(oldestBtn);
    expect(oldestBtn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Newest" })).toHaveAttribute("aria-pressed", "false");
  });

  it("sorts by shortest duration first", () => {
    render(<CategoryContent videos={videos} description="" />);
    fireEvent.click(screen.getByRole("button", { name: "Shortest" }));
    const links = screen.getAllByRole("link");
    const titles = links.map((l) => l.querySelector("h3")?.textContent);
    // 2:30 < 15:00 < 1:05:00
    expect(titles[0]).toContain("Alpha");
    expect(titles[1]).toContain("Beta");
    expect(titles[2]).toContain("Gamma");
  });

  it("sorts by longest duration first", () => {
    render(<CategoryContent videos={videos} description="" />);
    fireEvent.click(screen.getByRole("button", { name: "Longest" }));
    const links = screen.getAllByRole("link");
    const titles = links.map((l) => l.querySelector("h3")?.textContent);
    // 1:05:00 > 15:00 > 2:30
    expect(titles[0]).toContain("Gamma");
    expect(titles[1]).toContain("Beta");
    expect(titles[2]).toContain("Alpha");
  });
});
