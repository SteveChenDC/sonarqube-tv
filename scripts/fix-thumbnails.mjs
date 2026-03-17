// Download best-available YouTube thumbnails locally for videos missing maxresdefault.
// Then print the sed commands to update videos.ts to point to local files.
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const OUT_DIR = join(import.meta.dirname, "..", "public", "thumbnails");
mkdirSync(OUT_DIR, { recursive: true });

// All videos with explicit low-res thumbnail overrides (sd/hqdefault)
// Plus v62 which has no maxresdefault at all
const FIX_LIST = [
  { id: "v62", youtubeId: "4_60LxvWow4" },
  { id: "v63", youtubeId: "RvJjXARvtxs" },
  { id: "v65", youtubeId: "ZoayHEiXrZY" },
  { id: "v66", youtubeId: "3eHXBgaDs60" },
  { id: "v70", youtubeId: "dsX7WOqBtIY" },
  { id: "v72", youtubeId: "fJ_wu5ruzBk" },
  { id: "v76", youtubeId: "47zj4x0hp0c" },
  { id: "v79", youtubeId: "RO5c-g6aOY4" },
  { id: "v81", youtubeId: "bJoXEkwlBLc" },
  { id: "v84", youtubeId: "pBEwoZNJOw4" },
  { id: "v85", youtubeId: "Ublfbijaqw4" },
  { id: "v89", youtubeId: "vGfM3FInXTQ" },
  { id: "v93", youtubeId: "6cdV-oN_Yao" },
  { id: "v123", youtubeId: "doEikRO9GF8" },
  { id: "v128", youtubeId: "bBHKuKr-E7Q" },
  { id: "v129", youtubeId: "ucs-XF5X3bE" },
  { id: "v147", youtubeId: "ACZqTrM5Frs" },
  { id: "v148", youtubeId: "2jYXRu9dOJM" },
  { id: "v153", youtubeId: "D-ycv935v64" },
  { id: "v153b", youtubeId: "cPxwIpV6VBI" },
  { id: "v210", youtubeId: "nn3OyFsEPQE" },
];

const RESOLUTIONS = ["maxresdefault", "sddefault", "hqdefault", "mqdefault"];

async function downloadBest(entry) {
  for (const res of RESOLUTIONS) {
    const url = `https://img.youtube.com/vi/${entry.youtubeId}/${res}.jpg`;
    try {
      const resp = await fetch(url);
      if (resp.status === 200) {
        const buf = Buffer.from(await resp.arrayBuffer());

        // Upscale to 1280x720 if needed for consistency
        const outPath = join(OUT_DIR, `${entry.youtubeId}.jpg`);
        await sharp(buf)
          .resize(1280, 720, { fit: "cover" })
          .jpeg({ quality: 85 })
          .toFile(outPath);

        console.log(`  ${entry.id} (${entry.youtubeId}): ${res} → saved & upscaled to 1280x720`);
        return { ...entry, localPath: `/thumbnails/${entry.youtubeId}.jpg`, sourceRes: res };
      }
    } catch (e) {
      // try next
    }
  }
  console.log(`  ${entry.id} (${entry.youtubeId}): NO THUMBNAIL FOUND!`);
  return null;
}

async function main() {
  console.log(`Downloading thumbnails for ${FIX_LIST.length} videos...\n`);

  const results = [];
  for (const entry of FIX_LIST) {
    const r = await downloadBest(entry);
    if (r) results.push(r);
  }

  console.log(`\n✓ Downloaded ${results.length} thumbnails to public/thumbnails/`);
  console.log(`\nUpdate videos.ts thumbnail fields to:`);
  for (const r of results) {
    console.log(`  ${r.id}: thumbnail: "${r.localPath}"`);
  }
}

main();
