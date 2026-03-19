import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: {
    // NEXT_TURBOPACK_CACHE_DIR isolates the Turbopack SST cache from the project
    // .next directory, preventing a race condition in Next.js 16 Turbopack where
    // the cache is garbage-collected ~5 s after first compile, causing all
    // subsequent requests to 500 until the GC cycle completes.
    command: "NEXT_TURBOPACK_CACHE_DIR=/tmp/sqtv-turbo-cache npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
