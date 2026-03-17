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
  it("defaults to summary tab when both are provided", () => {
    render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Article content should be visible by default
    expect(screen.getByText("Opening paragraph.")).toBeInTheDocument();
    // TranscriptView should NOT be rendered
    expect(screen.queryByTestId("transcript-view")).not.toBeInTheDocument();
  });

  it("defaults to article tab when only article is provided", () => {
    render(<ArticleTabs article={makeArticle()} transcript={null} />);
    expect(screen.getByText("Opening paragraph.")).toBeInTheDocument();
    expect(screen.queryByTestId("transcript-view")).not.toBeInTheDocument();
  });
});

describe("ArticleTabs — tab switching", () => {
  it("switches to transcript tab when Transcript is clicked", () => {
    render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Start on summary
    expect(screen.getByText("Opening paragraph.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /Transcript/ }));

    expect(screen.getByTestId("transcript-view")).toBeInTheDocument();
    expect(screen.queryByText("Opening paragraph.")).not.toBeInTheDocument();
  });

  it("switches back to summary tab when Summary is clicked", () => {
    render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Switch to transcript first
    fireEvent.click(screen.getByRole("tab", { name: /Transcript/ }));
    expect(screen.getByTestId("transcript-view")).toBeInTheDocument();

    // Switch back to summary
    fireEvent.click(screen.getByRole("tab", { name: /Summary/ }));
    expect(screen.getByText("Opening paragraph.")).toBeInTheDocument();
    expect(screen.queryByTestId("transcript-view")).not.toBeInTheDocument();
  });
});

// collapse/expand feature was removed from ArticleTabs

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

  it("positions the sliding indicator for Summary tab (no translate)", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Default is summary — indicator at translate-x-0 (no translation = left half)
    const indicator = container.querySelector<HTMLElement>("span.pointer-events-none.absolute");
    expect(indicator).toBeInTheDocument();
    expect(indicator?.className).toContain("translate-x-0");
    expect(indicator?.className).not.toContain("translate-x-full");
  });

  it("positions the sliding indicator for Transcript tab (translate-x-full)", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Switch to Transcript
    fireEvent.click(screen.getByRole("tab", { name: /Transcript/ }));
    const indicator = container.querySelector<HTMLElement>("span.pointer-events-none.absolute");
    expect(indicator).toBeInTheDocument();
    expect(indicator?.className).toContain("translate-x-full");
  });
});

describe("ArticleTabs — tab animation classes", () => {
  it("content div has no animation class on initial render", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={null} />
    );
    // On initial render, hasSwitchedRef.current = false, so no animation class
    const contentDiv = container.querySelector("div.p-5");
    expect(contentDiv).toBeInTheDocument();
    expect(contentDiv?.className).not.toContain("animate-tab-in");
    expect(contentDiv?.className).not.toContain("animate-tab-slide");
  });

  it("adds animate-tab-slide-right when switching to a later tab (Summary → Transcript)", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Default is summary (index 0); switch to Transcript (index 1 > index 0 = "right")
    fireEvent.click(screen.getByRole("tab", { name: /Transcript/ }));
    const contentDiv = container.querySelector(".animate-tab-slide-right");
    expect(contentDiv).toBeInTheDocument();
  });

  it("adds animate-tab-slide-left when switching from Transcript to Summary", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Switch to Transcript first
    fireEvent.click(screen.getByRole("tab", { name: /Transcript/ }));
    // Switch back to Summary (earlier tab = slide-left)
    fireEvent.click(screen.getByRole("tab", { name: /Summary/ }));
    const contentDiv = container.querySelector(".animate-tab-slide-left");
    expect(contentDiv).toBeInTheDocument();
  });
});

describe("ArticleTabs — single-tab layout", () => {
  it("renders a header with h3 when only one tab (article-only)", () => {
    render(<ArticleTabs article={makeArticle()} transcript={null} />);
    // Single-tab layout: renders <h3> with "AI Summary" text, no tab buttons
    expect(screen.getByRole("heading", { level: 3, name: /AI Summary/i })).toBeInTheDocument();
    // No tab role buttons
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  it("renders a header with h3 when only one tab (transcript-only)", () => {
    render(<ArticleTabs article={null} transcript={makeTranscript()} />);
    expect(screen.getByRole("heading", { level: 3, name: /Transcript/i })).toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  it("does NOT apply border-b-2 to active tab button when two tabs exist (sliding indicator used instead)", () => {
    render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Summary is the active tab by default
    const summaryBtn = screen.getByRole("tab", { name: /Summary/ });
    // With 2 tabs, no border-b-2 — the sliding indicator handles active state
    expect(summaryBtn.className).not.toContain("border-b-2");
  });
});

// aria-hidden panel state feature was removed from ArticleTabs

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
