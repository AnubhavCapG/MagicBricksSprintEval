import { test, expect } from "@playwright/test";
import { PostPropertyPage } from "../pages/PostPropertyPage";
import propertyDetails from "../test-data/propertyDetails.json";

test("TC_PP_005 - Verify that property details can be entered", async ({
  page,
}) => {
  const postPropertyPage = new PostPropertyPage(page);

  await postPropertyPage.openPostProperty();
  //await postPropertyPage.selectOwner();
  await postPropertyPage.selectSell();

  await postPropertyPage.selectPropertyType(propertyDetails.propertyType);

  await postPropertyPage.enterPropertyDetails(propertyDetails);

  // Verify that the selected values were retained.
  await expect(postPropertyPage.propertyType).toHaveValue("10002"); //Flat/Apartment

  await expect(postPropertyPage.totalFlats).toHaveValue("13030"); //<50

  await expect(postPropertyPage.bedrooms).toHaveValue("11701"); //2

  await expect(postPropertyPage.balconies).toHaveValue("14200"); //1

  await expect(postPropertyPage.totalFloors).toHaveValue("12059"); //10

  await expect(postPropertyPage.furnishedStatus).toHaveValue("11902"); //Semi-Furnished

  await expect(postPropertyPage.bathrooms).toHaveValue("12001"); //2

  await expect(postPropertyPage.floorsAllowed).toHaveValue("12059"); //10

  // TODO: Add the Floor No. locator to PostPropertyPage, then fill in its option value.
  await postPropertyPage.floorNo.selectOption({ value: "11205" });
  await expect(postPropertyPage.floorNo).toHaveValue("11205");
});
