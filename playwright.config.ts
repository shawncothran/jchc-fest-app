import { defineConfig, devices } from "@playwright/test";

/**
 * E2E Tests: Test full user workflows end-to-end
 *
 * E2E tests simulate real user behavior in a browser.
 * They test complete workflows: navigation, form submission, user interactions.
 * They're the slowest but most realistic - they catch integration bugs.
 *
 * Three testing layers:
 * 1. Unit Tests (Vitest): Fast, isolated function testing
 * 2. Integration Tests (Vitest + React Testing Library): Component interactions
 * 3. E2E Tests (Playwright): Full browser workflows
 */

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
