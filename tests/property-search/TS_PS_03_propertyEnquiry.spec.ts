import { expect, test } from '@playwright/test';
import type { EnquiryDetails } from '../../pages/EnquiryForm';
import { HomePage } from '../../pages/HomePage';
import type { PropertyDetailsPage } from '../../pages/PropertyDetailsPage';
import {
  enquiryData,
  enquiryMessages,
  enquirySubmission,
  searchData,
} from '../../test-data/propertySearchData';

/**
 * TS_PS_03 (REQ_PS_003): the user can open and submit a property enquiry with
 * valid details, and invalid or incomplete enquiries are handled correctly.
 */
test.describe('TS_PS_03 - Property enquiry', () => {
  let details: PropertyDetailsPage;

  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    const results = await home.searchLocality(searchData.locality);
    details = await results.openProperty(0);
  });

  test('ENQ-01: the Contact Seller / Enquiry option is available', async () => {
    await expect(details.contactButton).toBeVisible();
    await expect(details.contactButton).toHaveText(/Contact (Agent|Owner|Builder)/i);
  });

  test('ENQ-02: the enquiry form opens', async () => {
    const form = await details.openEnquiryForm();

    await expect(form.nameInput).toBeVisible();
    await expect(form.emailInput).toBeVisible();
    await expect(form.mobileInput).toBeVisible();
    await expect(form.submitButton).toBeVisible();
  });

  test('ENQ-05: the form accepts valid optional information (country code)', async () => {
    const form = await details.openEnquiryForm();

    await form.fill(enquiryData.wellFormed);

    await expect(form.isdSelect.locator('option:checked')).toHaveText(enquiryData.wellFormed.isd);
    await expect(form.validFields).toHaveCount(3);
    await expect(form.errors).toHaveCount(0);
  });

  test('ENQ-06: submitting with blank mandatory fields is blocked', async () => {
    const form = await details.openEnquiryForm();

    await form.submit();

    await expect(form.errors).toContainText([
      enquiryMessages.nameRequired,
      enquiryMessages.emailRequired,
      enquiryMessages.mobileRequired,
    ]);
    await expect(form.nextStep).toHaveCount(0);
  });

  test('ENQ-07: invalid contact details are rejected', async () => {
    const form = await details.openEnquiryForm();

    await form.fill(enquiryData.invalid);
    await form.submit();

    await expect(form.errors).toContainText([
      enquiryMessages.invalidName,
      enquiryMessages.invalidEmail,
      enquiryMessages.invalidMobile,
    ]);
    await expect(form.nextStep).toHaveCount(0);
  });

  test.describe('real submission', () => {
    test.skip(
      !enquirySubmission,
      'Sends a real enquiry. Set MB_ENQUIRY_NAME, MB_ENQUIRY_EMAIL and MB_ENQUIRY_MOBILE to your own details to run it.',
    );
    const submission = enquirySubmission as EnquiryDetails;

    async function submitEnquiry() {
      const form = await details.openEnquiryForm();
      await form.fill(submission);
      await form.submit();
      return form;
    }

    test('ENQ-03: an enquiry with valid mandatory details is submitted', async () => {
      const form = await submitEnquiry();

      await expect(form.nextStep.first()).toBeVisible();
      await expect(form.submitButton).toBeHidden();
    });

    test('ENQ-04: a successful enquiry shows a confirmation', async () => {
      const form = await submitEnquiry();

      await expect(form.nextStep.first()).toContainText(/verify|thank/i);
    });

    test('ENQ-08: a repeated enquiry for the same property is handled', async () => {
      const first = await submitEnquiry();
      await expect(first.nextStep.first()).toBeVisible();
      await first.close();

      const second = await details.openEnquiryForm();
      await expect(second.submitButton.or(second.nextStep).first()).toBeVisible();
      if (await second.submitButton.isVisible()) {
        await second.fill(submission);
        await second.submit();
      }

      await expect(second.nextStep.or(second.root.getByText(/limit reached/i)).first()).toBeVisible();
    });
  });
});
