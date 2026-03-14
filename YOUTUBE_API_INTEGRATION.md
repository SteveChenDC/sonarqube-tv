# YouTube Data API Integration Guide

This project currently uses hardcoded video data in `src/data/videos.ts`. Follow this guide to replace it with live data from the YouTube Data API.

## 1. Get a YouTube Data API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Restrict the key to YouTube Data API v3 only
6. Add the key to your `.env.local`:

```env
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=UCiRoMbxMHMuwk7fZJhQ5_MQ
```

## 2. API Endpoints to Use

### Fetch channel playlists
```
GET https://www.googleapis.com/youtube/v3/playlists
  ?channelId={CHANNEL_ID}
  &part=snippet,contentDetails
  &maxResults=50
  &key={API_KEY}
```

### Fetch videos from a playlist
```
GET https://www.googleapis.com/youtube/v3/playlistItems
  ?playlistId={PLAYLIST_ID}
  &part=snippet,contentDetails
  &maxResults=50
  &key={API_KEY}
```

### Search channel videos
```
GET https://www.googleapis.com/youtube/v3/search
  ?channelId={CHANNEL_ID}
  &part=snippet
  &type=video
  &maxResults=25
  &q={search_query}
  &key={API_KEY}
```

### Get video details (duration, stats)
```
GET https://www.googleapis.com/youtube/v3/videos
  ?id={VIDEO_ID_1},{VIDEO_ID_2}
  &part=snippet,contentDetails,statistics
  &key={API_KEY}
```

## 3. Replacing Hardcoded Data

Create a new file `src/lib/youtube.ts`:

```typescript
const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export async function fetchChannelVideos(channelId: string) {
  const res = await fetch(
    `${BASE_URL}/search?channelId=${channelId}&part=snippet&type=video&maxResults=50&key=${API_KEY}`,
    { next: { revalidate: 3600 } } // ISR: revalidate every hour
  );
  return res.json();
}

export async function fetchVideoDetails(videoIds: string[]) {
  const res = await fetch(
    `${BASE_URL}/videos?id=${videoIds.join(",")}&part=snippet,contentDetails,statistics&key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  return res.json();
}
```

## 4. Caching Strategy

- **ISR (Incremental Static Regeneration)**: Use `next: { revalidate: 3600 }` in fetch calls to cache for 1 hour
- **Build-time**: Use `generateStaticParams` for video/category pages
- **On-demand**: Use Next.js `revalidatePath` or `revalidateTag` for webhook-triggered updates

## 5. Rate Limits

- YouTube Data API quota: **10,000 units/day** (free tier)
- `search.list` costs **100 units** per call
- `videos.list` costs **1 unit** per call
- `playlistItems.list` costs **1 unit** per call

**Recommendations:**
- Prefer `playlistItems.list` over `search.list` where possible
- Cache aggressively with ISR
- Consider fetching at build time for static content
- Use a database or Redis to cache API responses for production
