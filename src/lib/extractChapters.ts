import type { TranscriptSegment, TranscriptChapter } from "@/types";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "has", "have", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "can", "this", "that", "these", "those",
  "it", "its", "they", "their", "them", "we", "our", "you", "your",
  "he", "she", "his", "her", "how", "what", "when", "where", "which",
  "who", "why", "not", "no", "so", "if", "then", "than", "more", "most",
  "also", "just", "about", "into", "through", "during", "before", "after",
  "above", "below", "between", "each", "every", "all", "both", "few",
  "some", "any", "other", "new", "first", "last", "long", "great",
  "little", "own", "old", "right", "big", "high", "different", "small",
  "large", "next", "early", "young", "important", "public", "bad",
  "same", "able", "as", "up", "out", "over", "such", "like",
]);

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replaceAll(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

interface ArticleSection {
  title: string;
  keywords: string[];
}

function extractSections(markdown: string): ArticleSection[] {
  const sections: ArticleSection[] = [];
  const lines = markdown.split("\n");
  let currentTitle = "";
  let currentBody = "";

  for (const line of lines) {
    const trimmed = line.trim();
    // Match ## headings but skip "Key Takeaways"
    if (trimmed.startsWith("## ") && !/key\s*takeaway/i.test(trimmed)) {
      if (currentTitle && currentBody) {
        sections.push({ title: currentTitle, keywords: extractKeywords(currentBody) });
      }
      currentTitle = trimmed.slice(3);
      currentBody = "";
    } else if (trimmed.startsWith("# ") && !trimmed.startsWith("## ")) {
      // Skip top-level title heading
      continue;
    } else if (currentTitle) {
      currentBody += " " + trimmed;
    }
  }

  if (currentTitle && currentBody) {
    sections.push({ title: currentTitle, keywords: extractKeywords(currentBody) });
  }

  return sections;
}

const WINDOW = 15; // segments to compare at once

/** Score how many keywords appear in a window of segments starting at `from`. */
function scoreWindow(
  segments: TranscriptSegment[],
  from: number,
  keywordSet: Set<string>
): number {
  const windowEnd = Math.min(from + WINDOW, segments.length);
  let score = 0;
  for (let j = from; j < windowEnd; j++) {
    const words = segments[j].text.toLowerCase().split(/\s+/);
    for (const w of words) {
      if (keywordSet.has(w.replaceAll(/[^a-z0-9]/g, ""))) score++;
    }
  }
  return score;
}

/** Find the segment index (starting from `searchFrom`) with the best keyword overlap. */
function findBestMatch(
  segments: TranscriptSegment[],
  keywordSet: Set<string>,
  searchFrom: number
): { bestIndex: number; bestScore: number } {
  let bestIndex = searchFrom;
  let bestScore = -1;

  for (let i = searchFrom; i < segments.length; i++) {
    const score = scoreWindow(segments, i, keywordSet);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  return { bestIndex, bestScore };
}

/**
 * Match article sections to transcript segments by keyword overlap.
 * Scans transcript in order and assigns each section to the segment window
 * with the highest keyword density, ensuring chapters stay in order.
 */
export function extractChapters(
  markdown: string,
  segments: TranscriptSegment[]
): TranscriptChapter[] {
  const sections = extractSections(markdown);
  if (sections.length === 0 || segments.length === 0) return [];

  const chapters: TranscriptChapter[] = [];
  let searchFrom = 0;

  for (const section of sections) {
    if (section.keywords.length === 0) continue;

    const keywordSet = new Set(section.keywords);
    const { bestIndex, bestScore } = findBestMatch(segments, keywordSet, searchFrom);

    if (bestScore > 0) {
      chapters.push({ title: section.title, startIndex: bestIndex });
      searchFrom = bestIndex + 1;
    }
  }

  return chapters;
}
