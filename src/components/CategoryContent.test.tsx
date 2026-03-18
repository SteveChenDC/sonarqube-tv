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
    render(<CategoryContent videos={videos} />);
    expect(screen.getByRole("button", { name: "Newest" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Oldest" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shortest" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Longest" })).toBeInTheDocument();
  });

  it("shows all videos by default", () => {
    render(<CategoryContent videos={videos} />);
    expect(screen.getByText("Alpha Video")).toBeInTheDocument();
    expect(screen.getByText("Beta Video")).toBeInTheDocument();
    expect(screen.getByText("Gamma Video")).toBeInTheDocument();
  });

  it("defaults to Newest sort (aria-pressed=true)", () => {
    render(<CategoryContent videos={videos} />);
    const newestBtn = screen.getByRole("button", { name: "Newest" });
    expect(newestBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("renders nothing when videos array is empty", () => {
    const { container } = render(<CategoryContent videos={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("changes active sort button when clicked", () => {
    render(<CategoryContent videos={videos} />);
    const oldestBtn = screen.getByRole("button", { name: "Oldest" });
    fireEvent.click(oldestBtn);
    expect(oldestBtn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Newest" })).toHaveAttribute("aria-pressed", "false");
  });

  it("sorts by shortest duration first", () => {
    render(<CategoryContent videos={videos} />);
    fireEvent.click(screen.getByRole("button", { name: "Shortest" }));
    const links = screen.getAllByRole("link");
    const titles = links.map((l) => l.querySelector("h3")?.textContent);
    // 2:30 < 15:00 < 1:05:00
    expect(titles[0]).toContain("Alpha");
    expect(titles[1]).toContain("Beta");
    expect(titles[2]).toContain("Gamma");
  });

  it("sorts by longest duration first", () => {
    render(<CategoryContent videos={videos} />);
    fireEvent.click(screen.getByRole("button", { name: "Longest" }));
    const links = screen.getAllByRole("link");
    const titles = links.map((l) => l.querySelector("h3")?.textContent);
    // 1:05:00 > 15:00 > 2:30
    expect(titles[0]).toContain("Gamma");
    expect(titles[1]).toContain("Beta");
    expect(titles[2]).toContain("Alpha");
  });

  it("sorts by newest publishedAt first (default order)", () => {
    render(<CategoryContent videos={videos} />);
    // Newest is the default — no click needed
    const links = screen.getAllByRole("link");
    const titles = links.map((l) => l.querySelector("h3")?.textContent);
    // Gamma (Dec 2025) > Beta (Jun 2025) > Alpha (Jan 2024)
    expect(titles[0]).toContain("Gamma");
    expect(titles[1]).toContain("Beta");
    expect(titles[2]).toContain("Alpha");
  });

  it("sorts by oldest publishedAt first when Oldest is clicked", () => {
    render(<CategoryContent videos={videos} />);
    fireEvent.click(screen.getByRole("button", { name: "Oldest" }));
    const links = screen.getAllByRole("link");
    const titles = links.map((l) => l.querySelector("h3")?.textContent);
    // Alpha (Jan 2024) < Beta (Jun 2025) < Gamma (Dec 2025)
    expect(titles[0]).toContain("Alpha");
    expect(titles[1]).toContain("Beta");
    expect(titles[2]).toContain("Gamma");
  });

  it("restores newest-first order when switching back from Oldest to Newest", () => {
    render(<CategoryContent videos={videos} />);
    fireEvent.click(screen.getByRole("button", { name: "Oldest" }));
    fireEvent.click(screen.getByRole("button", { name: "Newest" }));
    const links = screen.getAllByRole("link");
    const titles = links.map((l) => l.querySelector("h3")?.textContent);
    expect(titles[0]).toContain("Gamma");
    expect(titles[1]).toContain("Beta");
    expect(titles[2]).toContain("Alpha");
  });

  it("sets aria-pressed=false on all other buttons when one is active", () => {
    render(<CategoryContent videos={videos} />);
    fireEvent.click(screen.getByRole("button", { name: "Shortest" }));
    expect(screen.getByRole("button", { name: "Shortest" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Newest" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Oldest" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Longest" })).toHaveAttribute("aria-pressed", "false");
  });

  it("accepts the deprecated description prop without error", () => {
    // description is @deprecated but still in the API; must not throw
    expect(() =>
      render(<CategoryContent videos={videos} description="Some category description" />)
    ).not.toThrow();
    // Videos still render normally
    expect(screen.getByText("Alpha Video")).toBeInTheDocument();
  });

  it("renders correctly with a single video (sort buttons still appear)", () => {
    const singleVideo = [makeVideo({ id: "solo", title: "Solo Video", duration: "5:00", publishedAt: "2025-01-01T00:00:00Z" })];
    render(<CategoryContent videos={singleVideo} />);
    // Sort buttons render regardless of video count
    expect(screen.getByRole("button", { name: "Newest" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Oldest" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shortest" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Longest" })).toBeInTheDocument();
    // The single video renders
    expect(screen.getByText("Solo Video")).toBeInTheDocument();
  });

  it("all 4 sort buttons on a single video produce the same order (no comparison needed)", () => {
    const singleVideo = [makeVideo({ id: "solo", title: "Solo Video", duration: "5:00", publishedAt: "2025-01-01T00:00:00Z" })];
    render(<CategoryContent videos={singleVideo} />);
    for (const sortLabel of ["Newest", "Oldest", "Shortest", "Longest"]) {
      fireEvent.click(screen.getByRole("button", { name: sortLabel }));
      // With a single video, all sort orders render that video without error
      expect(screen.getByText("Solo Video")).toBeInTheDocument();
    }
  });

  it("parseDurationToSeconds no-colon fallback: duration '1' (60s) sorts before '2:30' (150s)", () => {
    // "1" has no colon → split(":") gives ["1"] → parts[1] is undefined
    // parseDurationToSeconds: (parts[0] ?? 0)*60 + (parts[1] ?? 0) = 1*60 + 0 = 60 seconds
    // "2:30" → parts = [2, 30] → 2*60 + 30 = 150 seconds
    // Shortest sort: 60s < 150s → "One Minute Video" appears before "Two Thirty Video"
    const noColonVideo = makeVideo({
      id: "vid-d",
      title: "One Minute Video",
      duration: "1",
      publishedAt: "2025-01-01T00:00:00Z",
    });
    const regularVideo = makeVideo({
      id: "vid-e",
      title: "Two Thirty Video",
      duration: "2:30",
      publishedAt: "2025-01-01T00:00:00Z",
    });

    render(<CategoryContent videos={[regularVideo, noColonVideo]} />);
    fireEvent.click(screen.getByRole("button", { name: "Shortest" }));

    const links = screen.getAllByRole("link");
    const titles = links.map((l) => l.querySelector("h3")?.textContent);
    // 60s < 150s → noColonVideo (1 min) first
    expect(titles[0]).toContain("One Minute Video");
    expect(titles[1]).toContain("Two Thirty Video");
  });
});
