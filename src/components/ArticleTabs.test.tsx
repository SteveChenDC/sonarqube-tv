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
    // Start on summary (default)
    expect(screen.queryByTestId("transcript-view")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Transcript"));

    expect(screen.getByTestId("transcript-view")).toBeInTheDocument();
    expect(screen.queryByText("Opening paragraph.")).not.toBeInTheDocument();
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

describe("ArticleTabs — single vs dual tab rendering", () => {
  it("renders an h3 header (not tab buttons) when only one panel is available", () => {
    render(<ArticleTabs article={makeArticle()} transcript={null} />);
    // Single-tab layout uses an h3, not tab buttons
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "AI Summary" })
    ).toBeInTheDocument();
  });

  it("renders tab buttons when both panels are available", () => {
    render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    expect(screen.getByRole("tab", { name: /Summary/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Transcript" })).toBeInTheDocument();
  });

  it("sets aria-selected=true on the active tab", () => {
    render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Default is summary
    expect(screen.getByRole("tab", { name: /Summary/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "Transcript" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
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

  it("positions the sliding indicator at translate-x-0 when Summary tab is active", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Default is summary
    const indicator = container.querySelector<HTMLElement>(
      "span.pointer-events-none.absolute"
    );
    expect(indicator?.className).toContain("translate-x-0");
  });

  it("positions the sliding indicator at translate-x-full when Transcript tab is active", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Switch to transcript
    fireEvent.click(screen.getByRole("tab", { name: "Transcript" }));
    const indicator = container.querySelector<HTMLElement>(
      "span.pointer-events-none.absolute"
    );
    expect(indicator?.className).toContain("translate-x-full");
  });
});

describe("ArticleTabs — tab animation classes", () => {
  it("content div has no animation class on initial render", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={null} />
    );
    // On first render, no animation class is applied — only padding classes
    const animatedDiv = container.querySelector("[class*='animate-']");
    expect(animatedDiv).not.toBeInTheDocument();
  });

  it("adds animate-tab-slide-right when switching to a later tab (Summary → Transcript)", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Start on Summary (default); switch to Transcript (later tab = slide right)
    fireEvent.click(screen.getByRole("tab", { name: "Transcript" }));
    const contentDiv = container.querySelector(".animate-tab-slide-right");
    expect(contentDiv).toBeInTheDocument();
  });

  it("adds animate-tab-slide-left when switching to an earlier tab (Transcript → Summary)", () => {
    const { container } = render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Default is Summary; switch to Transcript first, then back to Summary (earlier = slide left)
    fireEvent.click(screen.getByRole("tab", { name: "Transcript" }));
    fireEvent.click(screen.getByRole("tab", { name: /Summary/ }));
    const contentDiv = container.querySelector(".animate-tab-slide-left");
    expect(contentDiv).toBeInTheDocument();
  });
});

describe("ArticleTabs — single-tab border styling", () => {
  it("renders the single-tab header without border-b-2 active styling", () => {
    render(<ArticleTabs article={makeArticle()} transcript={null} />);
    // Single-tab layout uses an h3 header — no tab buttons, no border-b-2
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    // h3 header is present
    const heading = screen.getByRole("heading", { level: 3, name: "AI Summary" });
    expect(heading).toBeInTheDocument();
    expect(heading.className).not.toContain("border-b-2");
  });

  it("does NOT apply border-b-2 to active tab button when two tabs exist (sliding indicator used instead)", () => {
    render(
      <ArticleTabs article={makeArticle()} transcript={makeTranscript()} />
    );
    // Tab buttons use role="tab"; switch to Summary so it's the active tab
    fireEvent.click(screen.getByRole("tab", { name: /Summary/ }));
    const summaryTab = screen.getByRole("tab", { name: /Summary/ });
    // With 2 tabs, no border-b-2 — the sliding indicator handles active state
    expect(summaryTab.className).not.toContain("border-b-2");
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

  it("renders multiple consecutive blank lines without extra content", () => {
    // Multiple blank lines should be treated the same as a single separator
    const article = makeArticle({
      markdown: "Para one.\n\n\n\nPara two.",
    });
    render(<ArticleTabs article={article} transcript={null} />);
    expect(screen.getByText("Para one.")).toBeInTheDocument();
    expect(screen.getByText("Para two.")).toBeInTheDocument();
    // No phantom elements — just the two expected paragraphs
    const paragraphs = document.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
  });

  it("renders a paragraph that is entirely bold", () => {
    const article = makeArticle({ markdown: "**Entire line is bold**" });
    render(<ArticleTabs article={article} transcript={null} />);
    const strong = document.querySelector("strong");
    expect(strong?.textContent).toBe("Entire line is bold");
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

  it("renders multiple inline formats in a single paragraph", () => {
    // parseInline must match multiple regex groups in one pass
    const article = makeArticle({
      markdown: "Use **bold** and *italic* and `code` together.",
    });
    render(<ArticleTabs article={article} transcript={null} />);
    expect(document.querySelector("strong")?.textContent).toBe("bold");
    expect(document.querySelector("em")?.textContent).toBe("italic");
    expect(document.querySelector("code")?.textContent).toBe("code");
  });

  it("renders inline bold inside an h2 heading", () => {
    const article = makeArticle({
      markdown: "## Heading with **bold** text",
    });
    render(<ArticleTabs article={article} transcript={null} />);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toBeInTheDocument();
    expect(h2.querySelector("strong")?.textContent).toBe("bold");
  });

  it("renders inline code inside an h3 heading", () => {
    const article = makeArticle({
      markdown: "### Run `npm test` daily",
    });
    render(<ArticleTabs article={article} transcript={null} />);
    // Single-tab mode renders an "AI Summary" h3 header plus the markdown h3
    // Use getAllByRole and find the one that contains a <code> element
    const headings = screen.getAllByRole("heading", { level: 3 });
    const markdownH3 = headings.find((h) => h.querySelector("code"));
    expect(markdownH3).toBeTruthy();
    expect(markdownH3!.querySelector("code")?.textContent).toBe("npm test");
  });

  it("renders inline code inside a list item", () => {
    const article = makeArticle({
      markdown: "- Run `npm test` to check",
    });
    render(<ArticleTabs article={article} transcript={null} />);
    const li = document.querySelector("li");
    expect(li?.querySelector("code")?.textContent).toBe("npm test");
  });

  it("renders inline bold and italic inside the same list item", () => {
    const article = makeArticle({
      markdown: "- **Bold** and *italic* item",
    });
    render(<ArticleTabs article={article} transcript={null} />);
    const li = document.querySelector("li");
    expect(li?.querySelector("strong")?.textContent).toBe("Bold");
    expect(li?.querySelector("em")?.textContent).toBe("italic");
  });

  it("renders plain text that has no inline formatting unchanged", () => {
    // parseInline returns [text] when no regex matches — the fallback branch
    const article = makeArticle({
      markdown: "Plain text with no formatting markers.",
    });
    render(<ArticleTabs article={article} transcript={null} />);
    expect(
      screen.getByText("Plain text with no formatting markers.")
    ).toBeInTheDocument();
    expect(document.querySelector("strong")).toBeNull();
    expect(document.querySelector("em")).toBeNull();
    expect(document.querySelector("code")).toBeNull();
  });
});
