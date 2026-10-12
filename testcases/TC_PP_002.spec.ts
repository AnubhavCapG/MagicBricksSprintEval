import { test, expect } from "@playwright/test";
import { PostPropertyPage } from "../pages/PostPropertyPage";

//user is loggedout
test.use({
  storageState: {
    cookies: [],
    origins: [],
  },
});

test("TC_PP_002 - Verify user can select appropriate user type", async ({
  page,
}) => {
  const postPropertyPage = new PostPropertyPage(page);

  // Open Post Property page without authentication
  await page.goto("https://post.magicbricks.com");

  // Verify the user type options are available
  await expect(postPropertyPage.ownerOption).toBeVisible();

  await expect(postPropertyPage.agentOption).toBeVisible();

  await expect(postPropertyPage.builderOption).toBeVisible();

  // Select Owner
  await postPropertyPage.selectOwner();

  // Verify Owner is selected
  await expect(postPropertyPage.ownerOption).toBeChecked();
});
