#!/usr/bin/env node
/**
 * Visual QA — takes screenshots of key pages for Ralph to analyze.
 * Usage: node scripts/visual-qa.mjs [--port 3000]
 * Outputs screenshots to ralph-logs/screenshots/
 */

import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SCREENSHOT_DIR = resolve(ROOT, "ralph-logs/screenshots");

const PORT = process.argv.includes("--port")
  ? process.argv[process.argv.indexOf("--port") + 1]
  : "3000";

const BASE = `http://localhost:${PORT}`;

const PAGES = [
  { name: "home", path: "/", scrollDown: true },
  { name: "home-bottom", path: "/", scrollToBottom: true },
  { name: "watch", path: "/watch/v1" },
  { name: "category", path: "/category/getting-started" },
];

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 375, height: 812 },
];

async function run() {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      // Force dark mode (default theme)
      colorScheme: "dark",
    });

    for (const page of PAGES) {
      const tab = await context.newPage();
      const url = `${BASE}${page.path}`;

      try {
        await tab.goto(url, { waitUntil: "networkidle", timeout: 15000 });

        if (page.scrollDown) {
          // Scroll partway to show video rows
          await tab.evaluate(() => window.scrollBy(0, 800));
          await tab.waitForTimeout(500);
        }

        if (page.scrollToBottom) {
          await tab.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await tab.waitForTimeout(500);
        }

        const filename = `${vp.name}-${page.name}.png`;
        await tab.screenshot({
          path: resolve(SCREENSHOT_DIR, filename),
          fullPage: false,
        });
        console.log(`✓ ${filename}`);
      } catch (err) {
        console.error(`✗ ${vp.name}-${page.name}: ${err.message}`);
      }

      await tab.close();
    }

    await context.close();
  }

  await browser.close();
  console.log(`\nScreenshots saved to ralph-logs/screenshots/`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
