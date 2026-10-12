import { test } from "@playwright/test";

test("save authenticated session", async ({ page }) => {
  console.log("AUTH SETUP STARTED");

  await page.goto("https://www.google.com");

  await page.waitForTimeout(10000);
});
