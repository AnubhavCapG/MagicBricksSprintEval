import { test, expect } from "@playwright/test";
import { PostPropertyPage } from "../pages/PostPropertyPage";
import locationSuggestionData from "../test-data/locationSuggestionData.json";

test("TC_PP_007 - Verify location autocomplete/suggestions functionality", async ({
  page,
}) => {
  const postPropertyPage = new PostPropertyPage(page);

  await postPropertyPage.openPostProperty();
  //await postPropertyPage.selectOwner();
  await postPropertyPage.selectSell();
  await postPropertyPage.selectPropertyType("10002");

  await postPropertyPage.city.fill("");
  await postPropertyPage.city.pressSequentially(locationSuggestionData.city, {
    delay: 100,
  });

  const citySuggestions = page.locator("#citySuggest");
  await expect(citySuggestions).toBeVisible();
  await expect(citySuggestions).toContainText(
    locationSuggestionData.expectedCitySuggestion,
  );
  await citySuggestions
    .getByText(locationSuggestionData.expectedCitySuggestion, { exact: true })
    .click();

  await postPropertyPage.project.pressSequentially(
    locationSuggestionData.project,
    { delay: 100 },
  );

  const projectSuggestions = page.locator("#projectSocietyForMASuggest");
  await expect(projectSuggestions).toBeVisible();
  await expect(projectSuggestions).toContainText(
    locationSuggestionData.expectedProjectSuggestion,
  );
  await postPropertyPage.project.press("ArrowDown");
  await postPropertyPage.project.press("Enter");

  await postPropertyPage.area.fill(locationSuggestionData.area);

  await expect(postPropertyPage.city).toHaveValue(
    locationSuggestionData.expectedCitySuggestion,
  );
  await expect(postPropertyPage.project).toHaveValue(
    locationSuggestionData.expectedProjectSuggestion,
  );
  await expect(postPropertyPage.area).toHaveValue(locationSuggestionData.area);
});
