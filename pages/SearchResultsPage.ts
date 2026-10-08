import type { Locator, Page } from '@playwright/test';
import { waitForHydration } from '../utils/hydration';
import { PropertyDetailsPage } from './PropertyDetailsPage';

/**
 * Search results page (SRP), e.g.
 * /property-for-sale/residential-real-estate?Locality=Whitefield&cityName=Bangalore
 *
 * Each listing is a card with a title, a price and contact buttons. Clicking a
 * card title opens that property's details page in a new browser tab.
 */
export class SearchResultsPage {
  readonly heading: Locator;
  readonly cards: Locator;

  constructor(readonly page: Page) {
    this.heading = page.locator('h1.mb-srp__title--text1');
    this.cards = page.locator('.mb-srp__card');
  }

  async waitUntilReady(): Promise<void> {
    await waitForHydration(this.page, '#propertysrp');
  }

  cardTitle(index: number): Locator {
    return this.cards.nth(index).locator('.mb-srp__card--title');
  }

  cardPrice(index: number): Locator {
    return this.cards.nth(index).locator('.mb-srp__card__price--amount');
  }

  cardContactButton(index: number): Locator {
    return this.cards.nth(index).locator('.mb-srp__action--btn').first();
  }

  async openProperty(index: number): Promise<PropertyDetailsPage> {
    const [detailsTab] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.cardTitle(index).click(),
    ]);
    const details = new PropertyDetailsPage(detailsTab);
    await details.waitUntilReady();
    return details;
  }
}
