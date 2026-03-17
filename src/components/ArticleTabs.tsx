"use client";

import { useState, useMemo } from "react";
import type { Article, Transcript } from "@/types";
import TranscriptView from "./TranscriptView";
import { extractChapters } from "@/lib/extractChapters";

/** Parse inline markdown (**bold**, *italic*, `code`) into React nodes. */
function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Match **bold**, *italic*, or `code`
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let k = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      nodes.push(<strong key={k++} className="font-semibold text-n1">{match[2]}</strong>);
    } else if (match[3]) {
      nodes.push(<em key={k++}>{match[3]}</em>);
    } else if (match[4]) {
      nodes.push(<code key={k++} className="rounded border border-n7/40 bg-n8/70 px-1.5 py-0.5 font-mono text-xs text-qube-blue">{match[4]}</code>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

function renderMarkdown(md: string) {
  const lines = md.split("\n");

  // First pass: parse each line into typed tokens
  type Token =
    | { type: "blank" }
    | { type: "h1" | "h2" | "h3"; content: string }
    | { type: "li"; content: string }
    | { type: "p"; content: string };

  const tokens: Token[] = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return { type: "blank" };
    if (trimmed.startsWith("### ")) return { type: "h3", content: trimmed.slice(4) };
    if (trimmed.startsWith("## ")) return { type: "h2", content: trimmed.slice(3) };
    if (trimmed.startsWith("# ")) return { type: "h1", content: trimmed.slice(2) };
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) return { type: "li", content: trimmed.slice(2) };
    return { type: "p", content: trimmed };
  });

  // Detect if the article opens with an h1 — if so, skip it.
  // The video title is already shown prominently above the tab panel,
  // so repeating it as a markdown heading creates a double-header.
  const firstContentIndex = tokens.findIndex((t) => t.type !== "blank");
  const startsWithH1 = firstContentIndex >= 0 && tokens[firstContentIndex].type === "h1";

  // Second pass: group consecutive list items into <ul> blocks
  const elements: React.ReactNode[] = [];
  let key = 0;
  let i = 0;
  // Track whether we've rendered the first paragraph yet (for lead styling)
  let firstParaSeen = false;

  while (i < tokens.length) {
    const tok = tokens[i];

    if (tok.type === "blank") {
      // skip blank lines — spacing comes from element margins
      i++;
    } else if (tok.type === "li") {
      // Collect all consecutive list items
      const items: React.ReactNode[] = [];
      while (i < tokens.length && tokens[i].type === "li") {
        const liTok = tokens[i] as { type: "li"; content: string };
        items.push(
          <li key={key++} className="pl-1 leading-7 text-[15px] text-n3">
            {parseInline(liTok.content)}
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={key++} className="my-4 ml-4 list-disc space-y-1.5 marker:text-qube-blue">
          {items}
        </ul>
      );
    } else if (tok.type === "h3") {
      elements.push(
        <h3 key={key++} className="mb-2 mt-6 font-heading text-base font-semibold text-n1 first:mt-0">
          {parseInline(tok.content)}
        </h3>
      );
      i++;
    } else if (tok.type === "h2") {
      elements.push(
        <h2 key={key++} className="mb-3 mt-8 border-l-2 border-qube-blue/60 pl-3 font-heading text-lg font-semibold text-n1 first:mt-0">
          {parseInline(tok.content)}
        </h2>
      );
      i++;
    } else if (tok.type === "h1") {
      // Skip the opening h1 — it duplicates the video title shown above.
      // Non-opening h1s (rare) render normally.
      if (startsWithH1 && i === firstContentIndex) {
        i++;
      } else {
        elements.push(
          <h1 key={key++} className="mb-4 mt-6 pb-3 font-heading text-xl font-bold text-n1 first:mt-0 border-b border-n8/60">
            {parseInline(tok.content)}
          </h1>
        );
        i++;
      }
    } else {
      // paragraph — first paragraph gets "lead" treatment
      const isLead = !firstParaSeen;
      firstParaSeen = true;
      elements.push(
        <p
          key={key++}
          className={
            isLead
              ? "mb-5 mt-0 text-[16px] leading-[1.75] text-n2 first:mt-0"
              : "mb-4 mt-0 text-[15px] leading-7 text-n3 first:mt-0"
          }
        >
          {parseInline((tok as { type: "p"; content: string }).content)}
        </p>
      );
      i++;
    }
  }

  return elements;
}

export default function ArticleTabs({
  article,
  transcript,
}: Readonly<{
  article: Article | null;
  transcript: Transcript | null;
}>) {
  const [tab, setTab] = useState<"article" | "transcript">(transcript ? "transcript" : "article");
  const [collapsed, setCollapsed] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"right" | "left" | null>(null);

  const chapters = useMemo(() => {
    if (!article || !transcript) return [];
    return extractChapters(article.markdown, transcript.segments);
  }, [article, transcript]);

  if (!article && !transcript) return null;

  const tabs: { key: "article" | "transcript"; label: React.ReactNode }[] = [
    ...(article ? [{ key: "article" as const, label: <span className="inline-flex items-center gap-1.5"><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>Summary</span> }] : []),
    ...(transcript ? [{ key: "transcript" as const, label: "Transcript" }] : []),
  ];

  return (
    <div className="rounded-xl border border-n8 bg-n8/15 overflow-hidden">
      <div className="flex items-center border-b border-n8">
        <div className="relative flex flex-1">
          {/* Sliding active indicator */}
          {tabs.length > 1 && (
            <span
              className="pointer-events-none absolute bottom-0 h-0.5 bg-qube-blue transition-[left] duration-200 ease-out"
              style={{
                width: `${100 / tabs.length}%`,
                left: `${(tabs.findIndex((t) => t.key === tab) / tabs.length) * 100}%`,
              }}
            />
          )}
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                if (tab === t.key) {
                  setCollapsed((c) => !c);
                } else {
                  const currentIndex = tabs.findIndex((x) => x.key === tab);
                  const nextIndex = tabs.findIndex((x) => x.key === t.key);
                  setSlideDirection(nextIndex > currentIndex ? "right" : "left");
                  setTab(t.key);
                  setCollapsed(false);
                }
              }}
              className={`flex items-center gap-1.5 px-5 py-3 font-heading text-sm font-medium transition-colors ${
                tab === t.key
                  ? `text-n1 ${tabs.length === 1 ? "border-b-2 border-qube-blue" : ""}`
                  : "text-n6 hover:text-n3"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand panel" : "Collapse panel"}
          className="mr-3 flex h-7 w-7 items-center justify-center rounded-md text-n5 transition-colors hover:bg-n8 hover:text-n3"
        >
          <svg className={`h-4 w-4 transition-transform duration-200 ${collapsed ? "" : "rotate-180"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: collapsed ? "0fr" : "1fr" }}
        aria-hidden={collapsed}
      >
        <div className="overflow-hidden">
          <div className="p-5 sm:p-6">
            <div
              key={tab}
              className={
                slideDirection === "right"
                  ? "animate-tab-slide-right"
                  : slideDirection === "left"
                  ? "animate-tab-slide-left"
                  : "animate-tab-in"
              }
            >
              {tab === "article" && article && (
                <div>{renderMarkdown(article.markdown)}</div>
              )}
              {tab === "transcript" && transcript && (
                <TranscriptView segments={transcript.segments} chapters={chapters} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
