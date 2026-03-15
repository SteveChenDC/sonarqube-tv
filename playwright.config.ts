import { defineConfig } from "@playwright/test";

export default defineConfig({
  testMatch: "**/*.anchor.test.tsx",
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: true,
  },
});
