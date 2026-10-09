import { expect, type Locator, type Page } from '@playwright/test';
import { SearchResultsPage } from './SearchResultsPage';

/**
 * MagicBricks home page (https://www.magicbricks.com/).
 *
 * Wraps the hero search widget: the Buy tab, the location box with its
 * auto-suggestions, the property-type and budget dropdowns and the Search button.
 */
export class HomePage {
  readonly buyTab: Locator;
  readonly locationBox: Locator;
  readonly locationInput: Locator;
  readonly selectedLocations: Locator;
  readonly suggestions: Locator;
  readonly propertyTypeDropdown: Locator;
  readonly budgetDropdown: Locator;
  readonly searchButton: Locator;

  constructor(readonly page: Page) {
    this.buyTab = page.locator('#tabBUY');
    this.locationBox = page.locator('#keyword_autoSuggestSelectedDiv');
    this.locationInput = page.locator('#keyword');
    this.selectedLocations = page.locator('.mb-search__tag-t');
    this.suggestions = page.locator('.mb-search__auto-suggest__item').filter({ visible: true });
    this.propertyTypeDropdown = page.locator('#propType_buy');
    this.budgetDropdown = page.locator('.mb-search__budget');
    this.searchButton = page.locator('.mb-search__btn');
  }

  /**
   * Opens the home page and waits until the search widget has started up.
   * During start-up the widget clears the location box twice.
   */
  async open(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page, 'MagicBricks bot protection blocked this browser').not.toHaveTitle(/Access Denied/);
    await expect(this.locationBox).toHaveClass(/mb-search__compact-view/);
  }

  /**
   * Types into the location box one key at a time, because the site looks up
   * suggestions on keyup. Then waits for the lookup fired by the last key, so
   * the suggestion list reflects the full text.
   */
  async typeLocation(text: string): Promise<void> {
    await this.locationInput.click();
    await this.locationInput.pressSequentially(text.slice(0, -1), { delay: 100 });
    const lookup = this.page.waitForResponse(/homepageAutoSuggest/);
    await this.locationInput.press(text.slice(-1));
    await lookup;
  }

  async selectFirstSuggestion(): Promise<void> {
    await this.suggestions.first().click();
  }

  async search(): Promise<SearchResultsPage> {
    await this.searchButton.click();
    await this.page.waitForURL(/residential-real-estate/);
    const results = new SearchResultsPage(this.page);
    await results.waitUntilReady();
    return results;
  }

  async searchLocality(locality: string): Promise<SearchResultsPage> {
    await this.typeLocation(locality);
    await this.selectFirstSuggestion();
    return this.search();
  }
}
