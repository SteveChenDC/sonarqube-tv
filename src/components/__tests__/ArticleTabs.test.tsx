import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ArticleTabs from "../ArticleTabs";
import type { Article, Transcript } from "@/types";

vi.mock("../TranscriptView", () => ({
  default: () => <div data-testid="transcript-view">Transcript content</div>,
}));

vi.mock("@/lib/extractChapters", () => ({
  extractChapters: () => [],
}));

const article: Article = {
  videoId: "1",
  markdown: "## Heading\n\nSome content here.",
};

const transcript: Transcript = {
  videoId: "1",
  segments: [{ start: 0, end: 5, text: "Hello world" }],
};

describe("ArticleTabs", () => {
  it("renders nothing when no article or transcript", () => {
    const { container } = render(
      <ArticleTabs article={null} transcript={null} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders article content in Summary tab", () => {
    render(<ArticleTabs article={article} transcript={null} />);
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("Some content here.")).toBeInTheDocument();
  });

  it("renders transcript tab when transcript provided", () => {
    render(<ArticleTabs article={null} transcript={transcript} />);
    expect(screen.getByText("Transcript")).toBeInTheDocument();
    expect(screen.getByTestId("transcript-view")).toBeInTheDocument();
  });

  it("switches between tabs", () => {
    render(<ArticleTabs article={article} transcript={transcript} />);
    // Default is transcript when both provided
    expect(screen.getByTestId("transcript-view")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Summary"));
    expect(screen.getByText("Heading")).toBeInTheDocument();
  });

  it("collapses panel when collapse button is clicked", () => {
    render(<ArticleTabs article={article} transcript={null} />);
    expect(screen.getByText("Some content here.")).toBeInTheDocument();

    const collapseBtn = screen.getByRole("button", { name: /collapse panel/i });
    fireEvent.click(collapseBtn);

    // Content stays in DOM but panel is hidden via CSS animation; aria-hidden signals collapsed state
    const panel = document.querySelector("[aria-hidden]");
    expect(panel).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: /expand panel/i })).toBeInTheDocument();
  });

  it("expands panel when expand button is clicked after collapse", () => {
    render(<ArticleTabs article={article} transcript={null} />);

    const collapseBtn = screen.getByRole("button", { name: /collapse panel/i });
    fireEvent.click(collapseBtn);

    const panel = document.querySelector("[aria-hidden]");
    expect(panel).toHaveAttribute("aria-hidden", "true");

    const expandBtn = screen.getByRole("button", { name: /expand panel/i });
    fireEvent.click(expandBtn);
    expect(panel).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByRole("button", { name: /collapse panel/i })).toBeInTheDocument();
  });

  it("collapses when clicking active tab, expands on second click", () => {
    render(<ArticleTabs article={article} transcript={null} />);
    const summaryTab = screen.getByText("Summary");

    const panel = document.querySelector("[aria-hidden]");

    // Click active tab to collapse
    fireEvent.click(summaryTab);
    expect(panel).toHaveAttribute("aria-hidden", "true");

    // Click again to expand
    fireEvent.click(summaryTab);
    expect(panel).toHaveAttribute("aria-hidden", "false");
  });
});
