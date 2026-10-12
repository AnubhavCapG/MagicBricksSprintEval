import { test, expect } from "@playwright/test";
import { PostPropertyPage } from "../pages/PostPropertyPage";
import areaAvailabilityData from "../test-data/areaAvailabilityData.json";

test("TC_PP_009 - Verify area and property availability can be entered", async ({
  page,
}) => {
  const postPropertyPage = new PostPropertyPage(page);

  await postPropertyPage.openPostProperty();
  await postPropertyPage.selectSell();
  await postPropertyPage.selectPropertyType("10002");

  // Replace these selectors and values with the actual form details.
  const carpetArea = page.locator(areaAvailabilityData.carpetAreaSelector);
  const superArea = page.locator(areaAvailabilityData.superAreaSelector);
  const underConstruction = page.locator(
    areaAvailabilityData.availabilitySelector,
  );
  const readyToMove = page.locator(areaAvailabilityData.availabilitySelector);

  await carpetArea.fill(areaAvailabilityData.carpetAreaValue);
  await superArea.fill(areaAvailabilityData.superAreaValue);

  await underConstruction.check();
  await expect(underConstruction).toBeChecked();

  await readyToMove.check();
  await expect(readyToMove).toBeChecked();
});
