// Audit all video thumbnails — find which ones return non-200 or are low-res
import { readFileSync } from "fs";

// Parse video data from source
const src = readFileSync("src/data/videos.ts", "utf-8");

// Extract all youtubeIds and their thumbnail overrides
const entries = [];
const regex = /id:\s*"(v\d+)"[\s\S]*?youtubeId:\s*"([^"]+)"[\s\S]*?(?:thumbnail:\s*"([^"]+)"[\s\S]*?)?category:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(src)) !== null) {
  entries.push({
    id: match[1],
    youtubeId: match[2],
    explicitThumb: match[3] || null,
    category: match[4],
  });
}

console.log(`Found ${entries.length} videos\n`);

// Check each thumbnail URL
const RESOLUTIONS = ["maxresdefault", "sddefault", "hqdefault"];

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return res.status;
  } catch {
    return 0;
  }
}

async function main() {
  const broken = [];
  const noMaxres = [];

  // Process in batches of 20
  for (let i = 0; i < entries.length; i += 20) {
    const batch = entries.slice(i, i + 20);
    const results = await Promise.all(
      batch.map(async (entry) => {
        const thumbUrl = entry.explicitThumb || `https://img.youtube.com/vi/${entry.youtubeId}/maxresdefault.jpg`;
        const status = await checkUrl(thumbUrl);

        if (status !== 200) {
          // Try fallbacks
          let bestRes = null;
          let bestUrl = null;
          for (const res of RESOLUTIONS) {
            const url = `https://img.youtube.com/vi/${entry.youtubeId}/${res}.jpg`;
            const s = await checkUrl(url);
            if (s === 200) {
              bestRes = res;
              bestUrl = url;
              break;
            }
          }
          return { ...entry, thumbUrl, status, bestRes, bestUrl };
        }

        // Check if maxresdefault returns a placeholder (120x90 gray image = no real thumbnail)
        // maxresdefault returning 200 but being a default placeholder
        if (!entry.explicitThumb) {
          // Also verify sddefault exists for comparison
          const sdStatus = await checkUrl(`https://img.youtube.com/vi/${entry.youtubeId}/sddefault.jpg`);
          if (sdStatus !== 200) {
            return { ...entry, thumbUrl, status: 200, note: "maxres OK but no sddefault", bestRes: "maxresdefault", bestUrl: thumbUrl };
          }
        }

        return null; // OK
      })
    );

    for (const r of results) {
      if (r) {
        if (r.status !== 200) broken.push(r);
        else if (r.note) noMaxres.push(r);
      }
    }

    process.stdout.write(`  Checked ${Math.min(i + 20, entries.length)}/${entries.length}\r`);
  }

  console.log("\n");

  if (broken.length > 0) {
    console.log(`=== ${broken.length} BROKEN THUMBNAILS ===`);
    for (const b of broken) {
      console.log(`  ${b.id} (${b.youtubeId}): ${b.thumbUrl} → ${b.status} | best fallback: ${b.bestRes || "NONE"}`);
    }
  }

  if (noMaxres.length > 0) {
    console.log(`\n=== ${noMaxres.length} UNUSUAL (maxres OK but no sddefault) ===`);
    for (const n of noMaxres) {
      console.log(`  ${n.id} (${n.youtubeId}): ${n.note}`);
    }
  }

  // Summary: all videos that need local thumbnails
  const needsLocal = broken.filter(b => !b.bestRes || b.bestRes !== "maxresdefault");
  if (needsLocal.length > 0) {
    console.log(`\n=== ${needsLocal.length} NEED LOCAL THUMBNAILS (no maxresdefault) ===`);
    for (const n of needsLocal) {
      console.log(`  ${n.id} (${n.youtubeId}): best available = ${n.bestRes || "NONE"} → ${n.bestUrl || "N/A"}`);
    }
  }

  console.log(`\n✓ ${entries.length - broken.length} thumbnails OK`);
  console.log(`✗ ${broken.length} thumbnails broken/missing maxresdefault`);
}

main();
