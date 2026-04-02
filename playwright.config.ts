import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30 * 1000,
  use: {
    baseURL: "http://localhost:8080",
    headless: true,
  },
  webServer: {
    command: "pnpm dev",
    port: 8080,
    reuseExistingServer: true,
  },
});
