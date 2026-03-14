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
