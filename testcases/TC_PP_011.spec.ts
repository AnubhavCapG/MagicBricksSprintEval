import { test, expect } from "@playwright/test";
import { PostPropertyPage } from "../pages/PostPropertyPage";
import invalidData from "../test-data/invalidData.json";

test("TC_PP_011 - Verify validation for missing property details", async ({
  page,
}) => {
  const postPropertyPage = new PostPropertyPage(page);

  await postPropertyPage.openPostProperty();
  await postPropertyPage.selectSell();
  await postPropertyPage.selectPropertyType(invalidData.propertyType);

  await postPropertyPage.city.fill("");
  await postPropertyPage.city.pressSequentially(invalidData.city, {
    delay: 100,
  });
  await page
    .locator("#citySuggest")
    .getByText(invalidData.expectedCitySuggestion, { exact: true })
    .click();

  const projectField = postPropertyPage.project;
  const bedroomsField = postPropertyPage.bedrooms;
  const floorNumberField = postPropertyPage.floorNo;
  const totalFloorsField = postPropertyPage.totalFloors;
  const priceField = page.locator("#totalPrice");
  const propertyAreaField = page.locator("#carpetArea");
  const readyToMoveOption = page.locator("#possessionStatus2");

  await expect(postPropertyPage.city).toHaveValue(
    invalidData.expectedCitySuggestion,
  );
  await expect(projectField).toBeEmpty();
  await bedroomsField.selectOption(invalidData.unselectedOptionValue);
  await floorNumberField.selectOption(invalidData.unselectedOptionValue);
  await totalFloorsField.selectOption(invalidData.unselectedOptionValue);
  await expect(bedroomsField).toHaveValue(invalidData.unselectedOptionValue);
  await expect(floorNumberField).toHaveValue(
    invalidData.unselectedOptionValue,
  );
  await expect(totalFloorsField).toHaveValue(
    invalidData.unselectedOptionValue,
  );
  await expect(propertyAreaField).toBeEmpty();
  await expect(priceField).toBeEmpty();

  await postPropertyPage.furnishedStatus.selectOption({
    value: invalidData.furnishedStatus,
  });
  await expect(postPropertyPage.furnishedStatus).toHaveValue(
    invalidData.furnishedStatus,
  );

  await readyToMoveOption.check();
  await expect(readyToMoveOption).toBeChecked();

  await page
    .getByRole("link", { name: "Continue to Post", exact: true })
    .click();

  await expect(page.locator("#projectSocietyForMAError")).toHaveText(
    invalidData.projectError,
  );
  await expect(page.locator("#bedroomsError")).toHaveText(
    invalidData.bedroomsError,
  );
  await expect(page.locator("#floorNumberError")).toHaveText(
    invalidData.floorNumberError,
  );
  await expect(page.locator("#totalFloorNumberError")).toHaveText(
    invalidData.totalFloorNumberError,
  );
});
