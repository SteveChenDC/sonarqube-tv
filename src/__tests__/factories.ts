import type { Video } from "@/types";

export function makeVideo(overrides: Partial<Video> & { id: string }): Video {
  return {
    title: `Video ${overrides.id}`,
    description: "desc",
    youtubeId: `yt-${overrides.id}`,
    thumbnail: `/thumb-${overrides.id}.jpg`,
    category: "tutorials",
    duration: "10:00",
    publishedAt: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}
