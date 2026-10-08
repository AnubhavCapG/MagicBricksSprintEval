import type { Locator, Page } from '@playwright/test';
import { waitForHydration } from '../utils/hydration';
import { EnquiryForm } from './EnquiryForm';

/**
 * Property details page (LDP), e.g. /propertyDetails/3-BHK-1910-Sq-ft-...&id=...
 *
 * The site uses two layouts: one for regular listings and one for "premium"
 * project listings. The photo and amenity locators match both.
 */
export class PropertyDetailsPage {
  readonly title: Locator;
  readonly price: Locator;
  readonly location: Locator;
  readonly configSummary: Locator;
  readonly configItems: Locator;
  readonly photos: Locator;
  readonly galleryPopup: Locator;
  readonly amenities: Locator;
  readonly moreDetailsItems: Locator;
  readonly readMoreLink: Locator;
  readonly fullDescription: Locator;
  readonly viewAllDetailsLink: Locator;
  readonly sellerBox: Locator;
  readonly sellerHeading: Locator;
  readonly sellerMobile: Locator;
  readonly contactButton: Locator;
  readonly notFoundMessage: Locator;

  constructor(readonly page: Page) {
    this.title = page.locator('h1.mb-ldp__dtls__title--text1');
    this.price = page.locator('.mb-ldp__dtls__price').first();
    this.location = page.locator('.mb-ldp__dtls__title--link').first();
    this.configSummary = page.locator('.mb-ldp__dtls__body__summary--item');
    this.configItems = page.locator('.mb-ldp__dtls__body__list--item');
    this.photos = page.locator('.mb-ldp__dtls__photo img, .mb-ldp__premium-dtls__photo img');
    this.galleryPopup = page.locator('.glry-pop');
    this.amenities = page
      .locator('.mb-ldp__amenities__list--item, .mb-ldp__lux-amenities__list .amenities__item')
      .filter({ visible: true });
    const moreDetails = page.locator('#more-details');
    this.moreDetailsItems = moreDetails.locator('.mb-ldp__more-dtl__list--item').filter({ visible: true });
    this.readMoreLink = moreDetails.locator('.mb-ldp__more-dtl__description--readmore').filter({ visible: true });
    this.fullDescription = moreDetails.locator('.mb-ldp__more-dtl__description--content.full');
    this.viewAllDetailsLink = moreDetails.locator('.mb-ldp__more-dtl--viewall');
    this.sellerBox = page.locator('#contactRightInfo');
    this.sellerHeading = this.sellerBox.locator('.mb-ldp__contact-info__title--text1');
    this.sellerMobile = this.sellerBox.locator('.mb-ldp__contact-info--mobile');
    this.contactButton = page.locator('#details .mb-ldp__action--btn.btn-red').first();
    this.notFoundMessage = page.getByText('Oops... something is missing');
  }

  async waitUntilReady(): Promise<void> {
    await waitForHydration(this.page, '#propertyDetail');
  }

  async open(path: string) {
    return this.page.goto(path);
  }

  configValue(label: RegExp): Locator {
    return this.configItems
      .filter({ has: this.page.locator('.mb-ldp__dtls__body__list--label', { hasText: label }) })
      .locator('.mb-ldp__dtls__body__list--value')
      .first();
  }

  async openGallery(): Promise<void> {
    await this.photos.first().click();
  }

  async openEnquiryForm(): Promise<EnquiryForm> {
    await this.contactButton.click();
    return new EnquiryForm(this.page);
  }
}
