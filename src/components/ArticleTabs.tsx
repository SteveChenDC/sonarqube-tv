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
      nodes.push(<code key={k++} className="rounded bg-n8 px-1 py-0.5 text-xs text-n2">{match[4]}</code>);
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
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={key++} className="h-3" />);
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="mb-2 mt-5 font-heading text-base font-semibold text-n1 first:mt-0">
          {parseInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="mb-3 mt-6 font-heading text-lg font-semibold text-n1 first:mt-0">
          {parseInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="mb-4 mt-6 font-heading text-xl font-bold text-n1 first:mt-0">
          {parseInline(trimmed.slice(2))}
        </h1>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <li key={key++} className="ml-4 list-disc text-sm leading-relaxed text-n3">
          {parseInline(trimmed.slice(2))}
        </li>
      );
    } else {
      elements.push(
        <p key={key++} className="text-sm leading-relaxed text-n3">
          {parseInline(trimmed)}
        </p>
      );
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

  const chapters = useMemo(() => {
    if (!article || !transcript) return [];
    return extractChapters(article.markdown, transcript.segments);
  }, [article, transcript]);

  if (!article && !transcript) return null;

  const tabs: { key: "article" | "transcript"; label: React.ReactNode }[] = [
    ...(article ? [{ key: "article" as const, label: <span className="inline-flex items-center gap-1.5"><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>AI Summary</span> }] : []),
    ...(transcript ? [{ key: "transcript" as const, label: "Transcript" }] : []),
  ];

  return (
    <div className="rounded-xl border border-n8 bg-n8/15 overflow-hidden">
      <div className="flex border-b border-n8">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3 font-heading text-sm font-medium transition-colors ${
              tab === t.key
                ? "border-b-2 border-qube-blue text-n1"
                : "text-n6 hover:text-n3"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-6">
        {tab === "article" && article && (
          <div>{renderMarkdown(article.markdown)}</div>
        )}
        {tab === "transcript" && transcript && (
          <TranscriptView segments={transcript.segments} chapters={chapters} />
        )}
      </div>
    </div>
  );
}
