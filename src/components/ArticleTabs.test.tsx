import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ArticleTabs from "./ArticleTabs";
import type { Article, Transcript } from "@/types";

afterEach(cleanup);

// Mock TranscriptView to keep tests focused on ArticleTabs logic
vi.mock("./TranscriptView", () => ({
  default: ({ segments }: { segments: unknown[] }) => (
    <div data-testid="transcript-view">
      TranscriptView ({segments.length} segments)
    </div>
  ),
}));

// Mock extractChapters — not under test here
vi.mock("@/lib/extractChapters", () => ({
  extractChapters: vi.fn(() => []),
}));

function makeArticle(overrides: Partial<Article> = {}): Article {
  return {
    videoId: "vid-1",
    title: "Test Article",
    markdown: "Opening paragraph.\n\nSecond paragraph.",
    keyTakeaways: [],
    generatedAt: "2025-01-01T00:00:00Z",
    wordCount: 100,
    ...overrides,
  };
}

function makeTranscript(overrides: Partial<Transcript> = {}): Transcript {
  return {
    videoId: "vid-1",
    youtubeId: "yt-abc",
    segments: [
      { text: "Hello world", offset: 0, duration: 3000 },
      { text: "Second segment", offset: 3000, duration: 4000 },
    ],
    fullText: "Hello world Second segment",
    fetchedAt: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("ArticleTabs — null guard", () => {
  it("renders nothing when both article and transcript are null", () => {
    const { container } = render(
      <ArticleTabs article={null} transcript={null} />
    );
    expect(container.innerHTML).toBe("");
  });
});

describe("ArticleTabs — tab visibility", () => {
  it("renders only the Summary tab when only an article is provided", () => {
    render(<ArticleTabs article={makeArticle()} transcript={null} />);
    expect(screen.getByText(/Summary/)).toBeInTheDocument();
    expect(screen.queryByText("Transcript")).not.toBeInTheDocument();
  });

  it("renders only the Transcript tab when only a transcript is provided", () => {
    render(<ArticleTabs article={null} transcript={makeTranscript()} />);
    expect(screen.getByText("Transcript")).toBeInTheDocument();
    expect(screen.queryByText(/Summary/)).not.toBeInTheDocument();
  });

  it("renders both tabs when both article and transcript are provided", () => {
    render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    expect(screen.getByText(/Summary/)).toBeInTheDocument();
    expect(screen.getByText("Transcript")).toBeInTheDocument();
  });
});

describe("ArticleTabs — default active tab", () => {
  it("defaults to transcript tab when both are provided", () => {
    render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // TranscriptView should be visible by default
    expect(screen.getByTestId("transcript-view")).toBeInTheDocument();
    // Article content should NOT be rendered
    expect(screen.queryByText("Opening paragraph.")).not.toBeInTheDocument();
  });

  it("defaults to article tab when only article is provided", () => {
    render(<ArticleTabs article={makeArticle()} transcript={null} />);
    expect(screen.getByText("Opening paragraph.")).toBeInTheDocument();
    expect(screen.queryByTestId("transcript-view")).not.toBeInTheDocument();
  });
});

describe("ArticleTabs — tab switching", () => {
  it("switches to article tab when Summary is clicked", () => {
    render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Start on transcript
    expect(screen.getByTestId("transcript-view")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Summary/));

    expect(screen.getByText("Opening paragraph.")).toBeInTheDocument();
    expect(screen.queryByTestId("transcript-view")).not.toBeInTheDocument();
  });

  it("switches back to transcript tab when Transcript is clicked", () => {
    render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Switch to article
    fireEvent.click(screen.getByText(/Summary/));
    expect(screen.getByText("Opening paragraph.")).toBeInTheDocument();

    // Switch back
    fireEvent.click(screen.getByText("Transcript"));
    expect(screen.getByTestId("transcript-view")).toBeInTheDocument();
    expect(screen.queryByText("Opening paragraph.")).not.toBeInTheDocument();
  });
});

describe("ArticleTabs — collapse/expand", () => {
  it("collapse button has correct aria-label when expanded", () => {
    render(<ArticleTabs article={makeArticle()} transcript={null} />);
    expect(
      screen.getByRole("button", { name: "Collapse panel" })
    ).toBeInTheDocument();
  });

  it("collapse button label changes to Expand panel after collapsing", () => {
    render(<ArticleTabs article={makeArticle()} transcript={null} />);
    fireEvent.click(screen.getByRole("button", { name: "Collapse panel" }));
    expect(
      screen.getByRole("button", { name: "Expand panel" })
    ).toBeInTheDocument();
  });

  it("clicking the active tab collapses the panel", () => {
    render(<ArticleTabs article={makeArticle()} transcript={null} />);
    // Already on article tab; click it again
    fireEvent.click(screen.getByText(/Summary/));
    // Now collapsed — expand label should appear
    expect(
      screen.getByRole("button", { name: "Expand panel" })
    ).toBeInTheDocument();
  });

  it("clicking the active tab again expands the panel", () => {
    render(<ArticleTabs article={makeArticle()} transcript={null} />);
    // Collapse
    fireEvent.click(screen.getByText(/Summary/));
    // Expand by clicking again
    fireEvent.click(screen.getByText(/Summary/));
    expect(
      screen.getByRole("button", { name: "Collapse panel" })
    ).toBeInTheDocument();
  });

  it("switching to a different tab re-expands a collapsed panel", () => {
    render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Collapse via collapse button
    fireEvent.click(screen.getByRole("button", { name: "Collapse panel" }));
    expect(
      screen.getByRole("button", { name: "Expand panel" })
    ).toBeInTheDocument();

    // Switch tab — should re-expand
    fireEvent.click(screen.getByText(/Summary/));
    expect(
      screen.getByRole("button", { name: "Collapse panel" })
    ).toBeInTheDocument();
  });
});

describe("ArticleTabs — sliding indicator", () => {
  it("renders no sliding indicator when only one tab is shown", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={null} />
    );
    // The sliding indicator span is only rendered when tabs.length > 1
    const indicator = container.querySelector("span.pointer-events-none.absolute");
    expect(indicator).not.toBeInTheDocument();
  });

  it("renders the sliding indicator when both tabs are shown", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    const indicator = container.querySelector("span.pointer-events-none.absolute");
    expect(indicator).toBeInTheDocument();
  });

  it("positions the sliding indicator at left=0% when Summary tab is active", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Start on transcript; switch to Summary (index 0)
    fireEvent.click(screen.getByText(/Summary/));
    const indicator = container.querySelector<HTMLElement>("span.pointer-events-none.absolute");
    // With 2 tabs, Summary is at index 0 → left = (0/2)*100 = 0%
    expect(indicator?.style.left).toBe("0%");
    expect(indicator?.style.width).toBe("50%");
  });

  it("positions the sliding indicator at left=50% when Transcript tab is active", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Default is transcript (index 1)
    const indicator = container.querySelector<HTMLElement>("span.pointer-events-none.absolute");
    // With 2 tabs, Transcript is at index 1 → left = (1/2)*100 = 50%
    expect(indicator?.style.left).toBe("50%");
    expect(indicator?.style.width).toBe("50%");
  });
});

describe("ArticleTabs — tab animation classes", () => {
  it("content div starts with animate-tab-in class on initial render", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={null} />
    );
    // The content wrapper div (keyed by tab) should have animate-tab-in
    const contentDiv = container.querySelector(".animate-tab-in");
    expect(contentDiv).toBeInTheDocument();
  });

  it("adds animate-tab-slide-right when switching to a later tab (Summary → Transcript)", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Start on Transcript, switch to Summary first to start at index 0
    fireEvent.click(screen.getByText(/Summary/));
    // Now switch to Transcript (index 1 > index 0 = "right")
    fireEvent.click(screen.getByText("Transcript"));
    const contentDiv = container.querySelector(".animate-tab-slide-right");
    expect(contentDiv).toBeInTheDocument();
  });

  it("adds animate-tab-slide-left when switching to an earlier tab (Transcript → Summary)", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Default is Transcript (index 1); switch to Summary (index 0 < index 1 = "left")
    fireEvent.click(screen.getByText(/Summary/));
    const contentDiv = container.querySelector(".animate-tab-slide-left");
    expect(contentDiv).toBeInTheDocument();
  });
});

describe("ArticleTabs — single-tab border styling", () => {
  it("applies border-b-2 border-qube-blue to active tab button when only one tab exists", () => {
    render(<ArticleTabs article={makeArticle()} transcript={null} />);
    // Only Summary tab — should have border-b-2 class
    const summaryBtn = screen.getByRole("button", { name: /Summary/ });
    expect(summaryBtn.className).toContain("border-b-2");
    expect(summaryBtn.className).toContain("border-qube-blue");
  });

  it("does NOT apply border-b-2 to active tab button when two tabs exist (sliding indicator used instead)", () => {
    render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Switch to Summary so it's the active tab
    fireEvent.click(screen.getByText(/Summary/));
    const summaryBtn = screen.getByRole("button", { name: /Summary/ });
    // With 2 tabs, no border-b-2 — the sliding indicator handles active state
    expect(summaryBtn.className).not.toContain("border-b-2");
  });
});

describe("ArticleTabs — aria-hidden panel state", () => {
  it("sets aria-hidden=false when panel is expanded (default)", () => {
    render(<ArticleTabs article={makeArticle()} transcript={null} />);
    const panel = document.querySelector("[aria-hidden]");
    expect(panel).toHaveAttribute("aria-hidden", "false");
  });

  it("sets aria-hidden=true when panel is collapsed via collapse button", () => {
    render(<ArticleTabs article={makeArticle()} transcript={null} />);
    fireEvent.click(screen.getByRole("button", { name: "Collapse panel" }));
    const panel = document.querySelector("[aria-hidden]");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("restores aria-hidden=false when panel is re-expanded", () => {
    render(<ArticleTabs article={makeArticle()} transcript={null} />);
    fireEvent.click(screen.getByRole("button", { name: "Collapse panel" }));
    fireEvent.click(screen.getByRole("button", { name: "Expand panel" }));
    const panel = document.querySelector("[aria-hidden]");
    expect(panel).toHaveAttribute("aria-hidden", "false");
  });
});

describe("ArticleTabs — markdown rendering", () => {
  it("renders plain paragraphs", () => {
    const article = makeArticle({
      markdown: "First paragraph.\n\nSecond paragraph.",
    });
    render(<ArticleTabs article={article} transcript={null} />);
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
  });

  it("renders h2 headings", () => {
    const article = makeArticle({ markdown: "## Section Title\n\nBody text." });
    render(<ArticleTabs article={article} transcript={null} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Section Title" })
    ).toBeInTheDocument();
  });

  it("renders h3 headings", () => {
    const article = makeArticle({
      markdown: "### Sub Section\n\nSome content.",
    });
    render(<ArticleTabs article={article} transcript={null} />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Sub Section" })
    ).toBeInTheDocument();
  });

  it("renders unordered list items", () => {
    const article = makeArticle({
      markdown: "- Item one\n- Item two\n- Item three",
    });
    render(<ArticleTabs article={article} transcript={null} />);
    expect(screen.getByText("Item one")).toBeInTheDocument();
    expect(screen.getByText("Item two")).toBeInTheDocument();
    expect(screen.getByText("Item three")).toBeInTheDocument();
    // All three should be inside a <ul>
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(list.querySelectorAll("li")).toHaveLength(3);
  });

  it("renders * list items the same as - list items", () => {
    const article = makeArticle({ markdown: "* Alpha\n* Beta" });
    render(<ArticleTabs article={article} transcript={null} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("renders bold inline text as <strong>", () => {
    const article = makeArticle({ markdown: "This is **bold** text." });
    render(<ArticleTabs article={article} transcript={null} />);
    const strong = document.querySelector("strong");
    expect(strong?.textContent).toBe("bold");
  });

  it("renders italic inline text as <em>", () => {
    const article = makeArticle({ markdown: "This is *italic* text." });
    render(<ArticleTabs article={article} transcript={null} />);
    const em = document.querySelector("em");
    expect(em?.textContent).toBe("italic");
  });

  it("renders inline code as <code>", () => {
    const article = makeArticle({ markdown: "Use `npm test` to run tests." });
    render(<ArticleTabs article={article} transcript={null} />);
    const code = document.querySelector("code");
    expect(code?.textContent).toBe("npm test");
  });

  it("skips an opening h1 to avoid duplicating the video title", () => {
    const article = makeArticle({
      markdown: "# Video Title\n\nIntroduction paragraph.",
    });
    render(<ArticleTabs article={article} transcript={null} />);
    // h1 should NOT be rendered (it's the opening heading)
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    // But the paragraph below it should still appear
    expect(screen.getByText("Introduction paragraph.")).toBeInTheDocument();
  });

  it("renders a non-opening h1 normally", () => {
    const article = makeArticle({
      markdown: "Intro paragraph.\n\n# A Heading\n\nMore text.",
    });
    render(<ArticleTabs article={article} transcript={null} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "A Heading" })
    ).toBeInTheDocument();
  });

  it("applies lead paragraph styling to the first paragraph", () => {
    const article = makeArticle({
      markdown: "Lead para.\n\nRegular para.",
    });
    const { container } = render(
      <ArticleTabs article={article} transcript={null} />
    );
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs[0].className).toContain("text-[16px]"); // lead style
    expect(paragraphs[1].className).toContain("text-[15px]"); // regular style
  });
});
