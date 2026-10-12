import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./testcases",

  // Maximum time for each test case: 80 seconds
  timeout: 80 * 1000,

  // Maximum time for each expect assertion: 30 seconds
  expect: {
    timeout: 30 * 1000,
  },

  fullyParallel: false,

  reporter: [["list"], ["html"]],

  use: {
    baseURL: "https://post.magicbricks.com",

    // Use saved login session by default
    storageState: "playwright/.auth/user.json",

    headless: false,

    // Maximum time for an individual action, such as click or fill
    actionTimeout: 40 * 1000,

    // Maximum time for page.goto()
    navigationTimeout: 40 * 1000,

    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    {
      name: "Microsoft Edge",
      use: {
        ...devices["Desktop Edge"], channel: "msedge"
      },
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },
  ],
});
