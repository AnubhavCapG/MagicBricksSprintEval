import { test, expect } from "@playwright/test";
import { PostPropertyPage } from "../pages/PostPropertyPage";
import propertyDetails from "../test-data/propertyDetails.json";
import locationSuggestionData from "../test-data/locationSuggestionData.json";

test("TC_PP_006 - Verify that a valid city and locality can be selected", async ({
  page,
}) => {
  const postPropertyPage = new PostPropertyPage(page);

  await postPropertyPage.openPostProperty();
  //await postPropertyPage.selectOwner();
  await postPropertyPage.selectSell();

  await postPropertyPage.selectPropertyType(propertyDetails.propertyType);

  await postPropertyPage.selectLocation(locationSuggestionData);

  // Verify the selected city and locality.
  // These assertions assume the controls retain their text as values.
  await expect(postPropertyPage.city).toHaveValue(locationSuggestionData.city);

  await expect(postPropertyPage.project).toHaveValue(
    locationSuggestionData.project,
  );

  await expect(postPropertyPage.area).toHaveValue(locationSuggestionData.area);
});
