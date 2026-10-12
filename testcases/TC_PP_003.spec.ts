import { test, expect } from "@playwright/test";
import { PostPropertyPage } from "../pages/PostPropertyPage";

test("TC_PP_003 - Verify user can select property listing type", async ({
  page,
}) => {
  const postPropertyPage = new PostPropertyPage(page);

  // Open the authenticated Post Property page
  await postPropertyPage.openPostProperty();

  // Verify Sell
  await postPropertyPage.selectSell();
  await expect(postPropertyPage.sellOption).toBeChecked();

  // Verify Rent/Lease
  await postPropertyPage.selectRent();
  await expect(postPropertyPage.rentOption).toBeChecked();

  // Verify PG/Hostel
  await postPropertyPage.selectPG();
  await expect(postPropertyPage.pgOption).toBeChecked();
});
