import Anthropic from "@anthropic-ai/sdk";
import * as fs from "node:fs";
import * as path from "node:path";

const TRANSCRIPTS_DIR = path.join(__dirname, "../src/data/transcripts");
const ARTICLES_DIR = path.join(__dirname, "../src/data/articles");
const VIDEOS_PATH = path.join(__dirname, "../src/data/videos.ts");
const BATCH_SIZE = 5;
const BATCH_DELAY_MS = 1000;

interface Article {
  videoId: string;
  title: string;
  markdown: string;
  keyTakeaways: string[];
  generatedAt: string;
  wordCount: number;
}

function extractVideoTitles(): Record<string, { title: string; category: string }> {
  const content = fs.readFileSync(VIDEOS_PATH, "utf8");
  const map: Record<string, { title: string; category: string }> = {};
  const regex = /id: "([^"]+)",\s*\n\s*title: "([^"]+)",[\s\S]*?category: "([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    map[match[1]] = { title: match[2], category: match[3] };
  }
  return map;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateArticle(
  client: Anthropic,
  videoId: string,
  title: string,
  category: string,
  transcript: string
): Promise<Article> {
  const truncated = transcript.slice(0, 8000); // Keep under token limits

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Summarize this YouTube video transcript into a well-structured article.

Title: ${title}
Category: ${category}

Transcript:
${truncated}

Rules:
- Write 3-6 paragraphs as a coherent article
- Use ## markdown headings for sections
- End with a "## Key Takeaways" section as a bullet list (3-5 items)
- Keep technical accuracy — this is about SonarQube/code quality/security
- Do not hallucinate features not mentioned in the transcript
- Write in third person
- Return ONLY the markdown content, no preamble`,
      },
    ],
  });

  const markdown =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Extract key takeaways from the markdown
  const takeawaySection = markdown.split(/##\s*Key\s*Takeaway/i)[1] || "";
  const takeaways = takeawaySection
    .split("\n")
    .filter((l) => l.trim().startsWith("-") || l.trim().startsWith("*"))
    .map((l) => l.replace(/^[\s\-*]+/, "").trim())
    .filter(Boolean);

  return {
    videoId,
    title,
    markdown,
    keyTakeaways: takeaways,
    generatedAt: new Date().toISOString(),
    wordCount: markdown.split(/\s+/).length,
  };
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Set ANTHROPIC_API_KEY environment variable");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });

  const videoMeta = extractVideoTitles();

  // Get all transcript files
  const transcriptFiles = fs
    .readdirSync(TRANSCRIPTS_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

  console.log(`Found ${transcriptFiles.length} transcripts`);

  const manifest: Record<string, { status: "ok" | "failed"; error?: string }> = {};
  let success = 0;
  let failed = 0;

  for (let i = 0; i < transcriptFiles.length; i += BATCH_SIZE) {
    const batch = transcriptFiles.slice(i, i + BATCH_SIZE);

    const promises = batch.map(async (file) => {
      const videoId = file.replace(".json", "");
      const articlePath = path.join(ARTICLES_DIR, `${videoId}.json`);

      // Skip if already generated
      if (fs.existsSync(articlePath)) {
        console.log(`[${videoId}] SKIP (exists)`);
        manifest[videoId] = { status: "ok" };
        success++;
        return;
      }

      const meta = videoMeta[videoId];
      if (!meta) {
        console.log(`[${videoId}] SKIP (no video metadata)`);
        manifest[videoId] = { status: "failed", error: "no metadata" };
        failed++;
        return;
      }

      try {
        const transcript = JSON.parse(
          fs.readFileSync(path.join(TRANSCRIPTS_DIR, file), "utf8")
        );

        if (!transcript.fullText || transcript.fullText.length < 50) {
          console.log(`[${videoId}] SKIP (transcript too short)`);
          manifest[videoId] = { status: "failed", error: "transcript too short" };
          failed++;
          return;
        }

        const article = await generateArticle(
          client,
          videoId,
          meta.title,
          meta.category,
          transcript.fullText
        );

        fs.writeFileSync(articlePath, JSON.stringify(article, null, 2));
        manifest[videoId] = { status: "ok" };
        success++;
        console.log(`[${videoId}] OK (${article.wordCount} words)`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        manifest[videoId] = { status: "failed", error: msg };
        failed++;
        console.log(`[${videoId}] FAILED: ${msg}`);
      }
    });

    await Promise.all(promises);

    if (i + BATCH_SIZE < transcriptFiles.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  fs.writeFileSync(
    path.join(ARTICLES_DIR, "_manifest.json"),
    JSON.stringify({ total: transcriptFiles.length, success, failed, details: manifest }, null, 2)
  );

  console.log(`\nDone: ${success} success, ${failed} failed`);
}

await main().catch(console.error);
