import { expect, test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { searchData } from '../../test-data/propertySearchData';

/**
 * TS_PS_01 (REQ_PS_001): the user can search for a property with valid and
 * invalid input, and can go from the search results to a property's details page.
 */
test.describe('TS_PS_01 - Property search', () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.open();
  });

  test('PS-01: home page shows the property search widget', async () => {
    await expect(home.buyTab).toHaveClass(/active/);
    await expect(home.locationInput).toBeVisible();
    await expect(home.propertyTypeDropdown).toBeVisible();
    await expect(home.budgetDropdown).toBeVisible();
    await expect(home.searchButton).toBeVisible();
  });

  test('PS-02: typing a valid locality lists matching suggestions', async () => {
    await home.typeLocation(searchData.locality);

    await expect(home.suggestions.first()).toContainText(searchData.locality, { ignoreCase: true });
  });

  test('PS-03: searching a valid locality shows results for that locality', async ({ page }) => {
    await home.typeLocation(searchData.locality);
    await home.selectFirstSuggestion();
    await expect(home.selectedLocations.filter({ hasText: searchData.locality })).toBeVisible();

    const results = await home.search();

    await expect(page).toHaveURL(new RegExp(`Locality=${searchData.locality}`));
    await expect(results.heading).toContainText(searchData.locality);
    await expect(results.cards.first()).toBeVisible();
  });

  test('PS-04: result cards show title, price and contact option', async () => {
    const results = await home.searchLocality(searchData.locality);

    for (let i = 0; i < 3; i++) {
      await expect(results.cardTitle(i)).toBeVisible();
      await expect(results.cardPrice(i)).toHaveText(/₹\s*\d/);
      await expect(results.cardContactButton(i)).toHaveText(/Contact/i);
    }
  });

  const invalidSearches = [
    { id: 'PS-05', label: 'an unknown locality', input: searchData.unknownLocality },
    { id: 'PS-06', label: 'special characters', input: searchData.specialCharacters },
  ];
  for (const { id, label, input } of invalidSearches) {
    test(`${id}: searching ${label} gives no suggestions and no results for it`, async ({ page }) => {
      await home.typeLocation(input);
      await expect(home.suggestions).toHaveCount(0);

      const results = await home.search();

      await expect(page).not.toHaveURL(/Locality=/);
      await expect(results.heading).toBeVisible();
      await expect(results.heading).not.toContainText(input);
    });
  }

  test('PS-07: selecting a search result opens its details page', async () => {
    const results = await home.searchLocality(searchData.locality);

    const details = await results.openProperty(0);

    await expect(details.page).toHaveURL(/\/propertyDetails\//);
    await expect(details.title).toBeVisible();
  });
});
