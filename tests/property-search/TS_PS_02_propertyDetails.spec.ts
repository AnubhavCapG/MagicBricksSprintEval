import { expect, test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { PropertyDetailsPage } from '../../pages/PropertyDetailsPage';
import { searchData } from '../../test-data/propertySearchData';
import { normalisePrice } from '../../utils/price';

/**
 * TS_PS_02 (REQ_PS_002): the selected property's details are displayed
 * correctly: information, price, location, configuration, images, amenities
 * and seller information.
 */
test.describe('TS_PS_02 - Property details', () => {
  test.describe('valid listing', () => {
    let details: PropertyDetailsPage;
    let selectedCardPrice: string;

    test.beforeEach(async ({ page }) => {
      const home = new HomePage(page);
      await home.open();
      const results = await home.searchLocality(searchData.locality);
      selectedCardPrice = await results.cardPrice(0).innerText();
      details = await results.openProperty(0);
    });

    test("PD-01: the selected property's details page opens", async () => {
      await expect(details.page).toHaveURL(/\/propertyDetails\//);
      await expect(details.title).toBeVisible();
      expect(normalisePrice(await details.price.innerText())).toBe(normalisePrice(selectedCardPrice));
    });

    test('PD-02: the property title is displayed', async () => {
      await expect(details.title).toBeVisible();
      await expect(details.title).toHaveText(/for (sale|rent)/i);
    });

    test('PD-03: the price is displayed with its value and unit', async () => {
      await expect(details.price).toHaveText(/^\s*₹\s*[\d.,]+\s*(Cr|Lac|Lakh|K)?\s*$/i);
    });

    test('PD-04: the property location is displayed', async () => {
      await expect(details.location).toBeVisible();
      await expect(details.location).toContainText(searchData.city);
    });

    test('PD-05: BHK, area and property type are displayed', async () => {
      await expect(details.title).toHaveText(/\d\s*BHK/i);
      await expect(details.title).toHaveText(/flat|apartment|villa|house|penthouse|floor|studio/i);
      await expect(details.configSummary.first()).toBeVisible();
      await expect(details.configValue(/Area/)).toContainText(/\d+\s*sq/i);
    });

    test('PD-06: property photos load and open in the gallery', async () => {
      const firstPhoto = details.photos.first();
      await expect(firstPhoto).toBeVisible();
      await expect
        .poll(() => firstPhoto.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
        .toBe(true);

      await details.openGallery();

      await expect(details.galleryPopup).toBeVisible();
      await expect(details.galleryPopup).toContainText(/photos/i);
    });

    test('PD-07: amenities and property features are displayed', async () => {
      await expect(details.amenities.first()).toBeVisible();
      await expect(details.moreDetailsItems.first()).toBeVisible();
    });

    test('PD-08: seller information and the contact option are available', async () => {
      await expect(details.sellerHeading).toHaveText(/Contact (Agent|Owner|Builder)/i);
      await expect(details.sellerMobile).toHaveText(/\+\d+-\d+X+/);
      await expect(details.contactButton).toHaveText(/Contact/i);
    });

    test('PD-09: expandable sections reveal more information', async () => {
      await details.readMoreLink.first().click();
      await expect(details.fullDescription).toBeVisible();

      if (await details.viewAllDetailsLink.isVisible()) {
        const rowsBefore = await details.moreDetailsItems.count();
        await details.viewAllDetailsLink.click();
        await expect.poll(() => details.moreDetailsItems.count()).toBeGreaterThan(rowsBefore);
      }
    });
  });

  test('PD-10: an invalid listing URL shows a not-found page, not property details', async ({ page }) => {
    const details = new PropertyDetailsPage(page);

    const response = await details.open(searchData.invalidPropertyPath);

    expect(response?.status()).toBe(404);
    await expect(details.notFoundMessage).toBeVisible();
    await expect(details.title).toHaveCount(0);
    await expect(details.price).toHaveCount(0);
    await expect(details.contactButton).toHaveCount(0);
  });
});
