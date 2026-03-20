"use client";

import { useState, useMemo, useRef } from "react";
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

type Token =
  | { type: "blank" }
  | { type: "h1" | "h2" | "h3"; content: string }
  | { type: "li"; content: string }
  | { type: "oli"; content: string; num: number }
  | { type: "blockquote"; content: string }
  | { type: "p"; content: string };

function tokenizeLine(line: string): Token {
  const trimmed = line.trim();
  if (!trimmed) return { type: "blank" };
  if (trimmed.startsWith("### ")) return { type: "h3", content: trimmed.slice(4) };
  if (trimmed.startsWith("## ")) return { type: "h2", content: trimmed.slice(3) };
  if (trimmed.startsWith("# ")) return { type: "h1", content: trimmed.slice(2) };
  if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) return { type: "li", content: trimmed.slice(2) };
  if (trimmed.startsWith("> ")) return { type: "blockquote", content: trimmed.slice(2) };
  const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
  if (olMatch) return { type: "oli", content: olMatch[2], num: parseInt(olMatch[1], 10) };
  return { type: "p", content: trimmed };
}

function collectListItems(tokens: Token[], start: number, type: "li" | "oli", key: { v: number }) {
  const items: React.ReactNode[] = [];
  let i = start;
  while (i < tokens.length && tokens[i].type === type) {
    const tok = tokens[i] as { content: string };
    items.push(
      <li key={key.v++} className="pl-1 leading-7 text-[15px] text-n3">
        {parseInline(tok.content)}
      </li>
    );
    i++;
  }
  return { items, nextIndex: i };
}

function collectBlockquoteLines(tokens: Token[], start: number, key: { v: number }) {
  const lines: React.ReactNode[] = [];
  let i = start;
  while (i < tokens.length && tokens[i].type === "blockquote") {
    const tok = tokens[i] as { content: string };
    lines.push(
      <span key={key.v++} className="block">
        {parseInline(tok.content)}
      </span>
    );
    i++;
  }
  return { lines, nextIndex: i };
}

function renderToken(
  tok: Token,
  key: { v: number },
  firstParaSeen: { v: boolean },
  skipH1: boolean,
): React.ReactNode | null {
  switch (tok.type) {
    case "h3":
      return (
        <h3 key={key.v++} className="mb-2 mt-5 flex items-center gap-2 font-heading text-[15px] font-semibold text-n1 first:mt-0">
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-qube-blue/70" aria-hidden="true" />
          {parseInline(tok.content)}
        </h3>
      );
    case "h2":
      return (
        <h2 key={key.v++} className="mb-3 mt-8 border-l-2 border-qube-blue/60 pl-3 font-heading text-lg font-semibold text-n1 first:mt-0">
          {parseInline(tok.content)}
        </h2>
      );
    case "h1":
      if (skipH1) return null;
      return (
        <h1 key={key.v++} className="mb-4 mt-6 pb-3 font-heading text-xl font-bold text-n1 first:mt-0 border-b border-n8/60">
          {parseInline(tok.content)}
        </h1>
      );
    default: {
      const isLead = !firstParaSeen.v;
      firstParaSeen.v = true;
      return (
        <p
          key={key.v++}
          className={
            isLead
              ? "mb-5 mt-0 text-[16px] leading-[1.75] text-n2 first:mt-0"
              : "mb-4 mt-0 text-[15px] leading-7 text-n3 first:mt-0"
          }
        >
          {parseInline((tok as { type: "p"; content: string }).content)}
        </p>
      );
    }
  }
}

function renderMarkdown(md: string) {
  const tokens: Token[] = md.split("\n").map(tokenizeLine);

  const firstContentIndex = tokens.findIndex((t) => t.type !== "blank");
  const startsWithH1 = firstContentIndex >= 0 && tokens[firstContentIndex].type === "h1";

  const elements: React.ReactNode[] = [];
  const key = { v: 0 };
  const firstParaSeen = { v: false };
  let i = 0;

  while (i < tokens.length) {
    const tok = tokens[i];

    if (tok.type === "blank") {
      i++;
      continue;
    }

    if (tok.type === "li") {
      const { items, nextIndex } = collectListItems(tokens, i, "li", key);
      elements.push(
        <ul key={key.v++} className="my-4 ml-4 list-disc space-y-2 marker:text-qube-blue">{items}</ul>
      );
      i = nextIndex;
    } else if (tok.type === "oli") {
      const { items, nextIndex } = collectListItems(tokens, i, "oli", key);
      elements.push(
        <ol key={key.v++} className="my-4 ml-4 list-decimal space-y-2 marker:font-heading marker:text-xs marker:font-semibold marker:text-qube-blue">{items}</ol>
      );
      i = nextIndex;
    } else if (tok.type === "blockquote") {
      const { lines, nextIndex } = collectBlockquoteLines(tokens, i, key);
      elements.push(
        <blockquote key={key.v++} className="my-4 rounded-r-md border-l-2 border-qube-blue/50 bg-qube-blue/5 pl-4 py-2 text-[14px] italic leading-relaxed text-n4">{lines}</blockquote>
      );
      i = nextIndex;
    } else {
      const skipH1 = startsWithH1 && i === firstContentIndex;
      const node = renderToken(tok, key, firstParaSeen, skipH1);
      if (node) elements.push(node);
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
  const [activeTab, setActiveTab] = useState<"summary" | "transcript">(
    article ? "summary" : "transcript"
  );
  // Track whether the user has ever switched tabs — suppress the slide animation on first render
  const hasSwitchedRef = useRef(false);

  const chapters = useMemo(() => {
    if (!article || !transcript) return [];
    return extractChapters(article.markdown, transcript.segments);
  }, [article, transcript]);

  if (!article && !transcript) return null;

  const hasBoth = !!article && !!transcript;

  // Only one panel available — render it full-width
  if (!hasBoth) {
    return (
      <div className="rounded-xl border border-n8 bg-n8/15 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-n8 px-5 py-3">
          {article ? (
            <h3 className="font-heading text-sm font-semibold text-n1 flex items-center gap-2">
              <SummaryIcon active />
              AI Summary
            </h3>
          ) : (
            <h3 className="font-heading text-sm font-semibold text-n1 flex items-center gap-2">
              <TranscriptIcon active />
              Transcript
            </h3>
          )}
        </div>
        <div className="p-5 sm:p-6">
          {article && <div className="max-w-prose">{renderMarkdown(article.markdown)}</div>}
          {transcript && <TranscriptView segments={transcript.segments} chapters={chapters} />}
        </div>
      </div>
    );
  }

  // Both available — side-by-side on desktop, tabs on mobile
  return (
    <div className="overflow-hidden rounded-xl border border-n8 bg-n8/15">
      {/* Header row — 50/50 centered tab buttons with sliding indicator */}
      <div className="relative grid grid-cols-2 border-b border-n8">
        <button
          onClick={() => {
            hasSwitchedRef.current = true;
            setActiveTab("summary");
          }}
          className={`flex items-center justify-center gap-2 py-3 border-r border-n8 font-heading text-sm font-semibold transition-colors duration-200 ${
            activeTab === "summary"
              ? "text-n1 bg-n8/20"
              : "text-n5 hover:text-n3 hover:bg-n8/10"
          }`}
          aria-selected={activeTab === "summary"}
          role="tab"
        >
          <SummaryIcon active={activeTab === "summary"} />
          AI Summary
        </button>
        <button
          onClick={() => {
            hasSwitchedRef.current = true;
            setActiveTab("transcript");
          }}
          className={`flex items-center justify-center gap-2 py-3 font-heading text-sm font-semibold transition-colors duration-200 ${
            activeTab === "transcript"
              ? "text-n1 bg-n8/20"
              : "text-n5 hover:text-n3 hover:bg-n8/10"
          }`}
          aria-selected={activeTab === "transcript"}
          role="tab"
        >
          <TranscriptIcon active={activeTab === "transcript"} />
          Transcript
        </button>
        {/* Sliding active indicator bar — translates from left to right half */}
        <span
          className={`pointer-events-none absolute bottom-0 h-0.5 w-1/2 bg-qube-blue transition-transform duration-300 ease-out ${
            activeTab === "transcript" ? "translate-x-full" : "translate-x-0"
          }`}
          aria-hidden="true"
        />
      </div>

      {/* Content — show one panel at a time, full width */}
      <div className="overflow-hidden">
        <div
          key={activeTab}
          className={`p-5 sm:p-6 ${
            hasSwitchedRef.current
              ? activeTab === "summary"
                ? "animate-tab-slide-left"
                : "animate-tab-slide-right"
              : ""
          }`}
        >
          {activeTab === "summary" && article && (
            <div className="max-w-prose">{renderMarkdown(article.markdown)}</div>
          )}
          {activeTab === "transcript" && transcript && (
            <TranscriptView segments={transcript.segments} chapters={chapters} />
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryIcon({ active }: { active?: boolean }) {
  return (
    <svg className={`h-4 w-4 transition-colors duration-200 ${active ? "text-qube-blue" : "text-n6"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      <path d="M20 3v4"/>
      <path d="M22 5h-4"/>
    </svg>
  );
}

function TranscriptIcon({ active }: { active?: boolean }) {
  return (
    <svg className={`h-4 w-4 transition-colors duration-200 ${active ? "text-qube-blue" : "text-n6"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <line x1="8" y1="9" x2="16" y2="9"/>
      <line x1="8" y1="13" x2="14" y2="13"/>
    </svg>
  );
}
