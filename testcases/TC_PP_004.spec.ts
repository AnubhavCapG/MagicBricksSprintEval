import { test, expect } from "@playwright/test";
import { PostPropertyPage } from "../pages/PostPropertyPage";

test("TC_PP_004 - Verify user can select property type", async ({ page }) => {
  const postPropertyPage = new PostPropertyPage(page);

  // Open Post Property page
  await postPropertyPage.openPostProperty();

  // Select Owner
  //await postPropertyPage.selectOwner();

  // Select Sell
  await postPropertyPage.selectSell();

  // Select Flat/Apartment
  await postPropertyPage.selectPropertyType("10002");

  // Verify selected property type
  await expect(postPropertyPage.propertyType).toHaveValue("10002");
});
