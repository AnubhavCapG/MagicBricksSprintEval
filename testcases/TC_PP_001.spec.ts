import { test, expect } from "@playwright/test";
import { PostPropertyPage } from "../pages/PostPropertyPage";

test("TC_PP_001 - Verify user can access Post Property form", async ({
  page,
}) => {
  const postPropertyPage = new PostPropertyPage(page);

  // Navigate to the Post Property page
  await postPropertyPage.openPostProperty();

  // Verify the Post Property page is displayed
  await expect(postPropertyPage.pageHeading).toBeVisible();
});
