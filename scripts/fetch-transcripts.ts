import { YoutubeTranscript } from "youtube-transcript";
import * as fs from "fs";
import * as path from "path";

const TRANSCRIPTS_DIR = path.join(__dirname, "../src/data/transcripts");
const VIDEOS_PATH = path.join(__dirname, "../src/data/videos.ts");
const DELAY_MS = 500;
const MAX_RETRIES = 3;

interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

interface TranscriptFile {
  videoId: string;
  youtubeId: string;
  segments: TranscriptSegment[];
  fullText: string;
  fetchedAt: string;
}

function extractVideos(): { id: string; youtubeId: string; title: string }[] {
  const content = fs.readFileSync(VIDEOS_PATH, "utf8");
  const results: { id: string; youtubeId: string; title: string }[] = [];
  const regex = /id: "([^"]+)",\s*\n\s*title: "([^"]+)",[\s\S]*?youtubeId: "([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    results.push({ id: match[1], youtubeId: match[3], title: match[2] });
  }
  return results;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(youtubeId: string, retries = MAX_RETRIES): Promise<TranscriptSegment[]> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await YoutubeTranscript.fetchTranscript(youtubeId, { lang: "en" });
      return result.map((s) => ({ text: s.text, offset: s.offset, duration: s.duration }));
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(1000 * attempt);
    }
  }
  throw new Error("Unreachable");
}

async function main() {
  fs.mkdirSync(TRANSCRIPTS_DIR, { recursive: true });

  const videos = extractVideos();
  console.log(`Found ${videos.length} videos`);

  const manifest: Record<string, { status: "ok" | "failed"; error?: string }> = {};
  let success = 0;
  let failed = 0;

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const outPath = path.join(TRANSCRIPTS_DIR, `${video.id}.json`);

    // Skip if already fetched
    if (fs.existsSync(outPath)) {
      console.log(`[${i + 1}/${videos.length}] ${video.id} SKIP (exists)`);
      manifest[video.id] = { status: "ok" };
      success++;
      continue;
    }

    try {
      const segments = await fetchWithRetry(video.youtubeId);
      const fullText = segments.map((s) => s.text).join(" ");

      const data: TranscriptFile = {
        videoId: video.id,
        youtubeId: video.youtubeId,
        segments,
        fullText,
        fetchedAt: new Date().toISOString(),
      };

      fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
      manifest[video.id] = { status: "ok" };
      success++;
      console.log(`[${i + 1}/${videos.length}] ${video.id} OK (${segments.length} segments)`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      manifest[video.id] = { status: "failed", error: msg };
      failed++;
      console.log(`[${i + 1}/${videos.length}] ${video.id} FAILED: ${msg}`);
    }

    await sleep(DELAY_MS);
  }

  fs.writeFileSync(
    path.join(TRANSCRIPTS_DIR, "_manifest.json"),
    JSON.stringify({ total: videos.length, success, failed, details: manifest }, null, 2)
  );

  console.log(`\nDone: ${success} success, ${failed} failed`);
}

main().catch(console.error);
