"use client";

import { useState, useMemo } from "react";
import type { Article, Transcript } from "@/types";
import TranscriptView from "./TranscriptView";
import { extractChapters } from "@/lib/extractChapters";

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
          {trimmed.slice(4)}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="mb-3 mt-6 font-heading text-lg font-semibold text-n1 first:mt-0">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="mb-4 mt-6 font-heading text-xl font-bold text-n1 first:mt-0">
          {trimmed.slice(2)}
        </h1>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <li key={key++} className="ml-4 list-disc text-sm leading-relaxed text-n3">
          {trimmed.slice(2)}
        </li>
      );
    } else {
      elements.push(
        <p key={key++} className="text-sm leading-relaxed text-n3">
          {trimmed}
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
  const [tab, setTab] = useState<"article" | "transcript">(article ? "article" : "transcript");

  const chapters = useMemo(() => {
    if (!article || !transcript) return [];
    return extractChapters(article.markdown, transcript.segments);
  }, [article, transcript]);

  if (!article && !transcript) return null;

  const tabs = [
    ...(article ? [{ key: "article" as const, label: "Article" }] : []),
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
