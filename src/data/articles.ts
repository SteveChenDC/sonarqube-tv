import type { Article, Transcript } from "@/types";

export function getArticleByVideoId(videoId: string): Article | null {
  try {
    return require(`./articles/${videoId}.json`) as Article;
  } catch {
    return null;
  }
}

export function getTranscriptByVideoId(videoId: string): Transcript | null {
  try {
    return require(`./transcripts/${videoId}.json`) as Transcript;
  } catch {
    return null;
  }
}

export function hasArticle(videoId: string): boolean {
  return getArticleByVideoId(videoId) !== null;
}
