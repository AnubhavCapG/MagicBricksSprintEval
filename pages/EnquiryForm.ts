import type { Locator, Page } from '@playwright/test';

export interface EnquiryDetails {
  name: string;
  email: string;
  mobile: string;
  isd?: string;
}

/**
 * The "Contact Agent / Owner / Builder" enquiry modal on the property details page.
 *
 * Fields are validated on blur and on submit. A valid submit replaces the form
 * with the next step: mobile OTP verification, missed-call verification, or a
 * thank-you panel for users who are already verified.
 */
export class EnquiryForm {
  readonly root: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly isdSelect: Locator;
  readonly mobileInput: Locator;
  readonly submitButton: Locator;
  readonly closeButton: Locator;
  readonly errors: Locator;
  readonly validFields: Locator;
  readonly nextStep: Locator;

  constructor(readonly page: Page) {
    this.root = page.locator('#contact-form');
    this.nameInput = this.root.locator('#userName');
    this.emailInput = this.root.locator('#userEmail');
    this.isdSelect = this.root.locator('#selectIsd');
    this.mobileInput = this.root.locator('#userMobile');
    this.submitButton = this.root.getByRole('button', { name: 'Get Contact Details' });
    this.closeButton = this.root.locator('.contact-form__close');
    this.errors = this.root.locator('.contact-form__error');
    this.validFields = this.root.locator('.contact-form__fieldset.has-success');
    this.nextStep = this.root
      .locator('#contact-slide-otp, .contact-form__missed-call, .contact-form__thanks')
      .filter({ visible: true });
  }

  async fill({ name, email, mobile, isd }: EnquiryDetails): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    if (isd) await this.isdSelect.selectOption({ label: isd });
    await this.mobileInput.fill(mobile);
    await this.mobileInput.blur();
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
