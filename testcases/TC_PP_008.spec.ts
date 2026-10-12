import { test, expect } from "@playwright/test";
import { PostPropertyPage } from "../pages/PostPropertyPage";
import priceData from "../test-data/priceData.json";

test("TC_PP_008 - Verify valid property price can be entered", async ({
  page,
}) => {
  const postPropertyPage = new PostPropertyPage(page);

  await postPropertyPage.openPostProperty();
  //await postPropertyPage.selectOwner();
  await postPropertyPage.selectSell();
  await postPropertyPage.selectPropertyType("10002");

  // Complete any mandatory fields required to reach the price field.

  const priceField = page.locator("#totalPrice");

  // Enter a valid property price.
  await priceField.fill(priceData.validPrice);

  // Verify that the field retains the entered value.
  await expect(priceField).toHaveValue(priceData.expectedPrice);
});
