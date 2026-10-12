import { test, expect } from "@playwright/test";
import { PostPropertyPage } from "../pages/PostPropertyPage";

test("TC_PP_010 - Verify city name and property type are required", async ({
  page,
}) => {
  const postPropertyPage = new PostPropertyPage(page);

  await postPropertyPage.openPostProperty();
  await page.getByRole("link", { name: "Continue to Post", exact: true }).click();

  await expect(page.locator("#propertyTypeError")).toHaveText(
    "Please select the property type",
  );
  await expect(page.locator("#quickCityError")).toHaveText("Please enter a city");
});