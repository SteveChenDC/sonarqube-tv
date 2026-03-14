export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnail: string;
  category: string;
  duration: string;
  publishedAt: string;
}

export interface Category {
  slug: string;
  title: string;
  description: string;
}

export interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

export interface Transcript {
  videoId: string;
  youtubeId: string;
  segments: TranscriptSegment[];
  fullText: string;
  fetchedAt: string;
}

export interface Article {
  videoId: string;
  title: string;
  markdown: string;
  keyTakeaways: string[];
  generatedAt: string;
  wordCount: number;
}

export interface TranscriptChapter {
  title: string;
  startIndex: number;
}
