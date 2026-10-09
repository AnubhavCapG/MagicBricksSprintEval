import type { EnquiryDetails } from '../pages/EnquiryForm';

/**
 * These tests run against the live site. MagicBricks limits location suggestions
 * to the city it detects from your IP address (Bangalore when these tests were
 * written). If you run them from another city, set `locality` and `city` to a
 * locality in that city.
 */
export const searchData = {
  locality: 'Whitefield',
  city: 'Bangalore',
  unknownLocality: 'qwxzvbnmkjh',
  specialCharacters: '@#$%^&*',
  invalidPropertyPath: '/propertyDetails/invalid-property-listing',
};

export const enquiryData = {
  wellFormed: { name: 'QA Tester', email: 'qa.tester@example.com', mobile: '9876543210', isd: 'USA +1' },
  invalid: { name: '12@#', email: 'not-an-email', mobile: '12345' },
};

export const enquiryMessages = {
  nameRequired: "Name field can't be left blank",
  emailRequired: "Email ID field can't be left blank",
  mobileRequired: 'Please enter a 10-digit Mobile number',
  invalidName: 'Invalid name entered',
  invalidEmail: 'Please enter Valid Email Id',
  invalidMobile: 'Enter a valid number starting with 6,7,8,9 only',
};

const { MB_ENQUIRY_NAME, MB_ENQUIRY_EMAIL, MB_ENQUIRY_MOBILE } = process.env;

/**
 * A real submission sends a lead to a real agent and an OTP SMS to the mobile
 * number. Use your own details, set in MB_ENQUIRY_NAME, MB_ENQUIRY_EMAIL and
 * MB_ENQUIRY_MOBILE. While any of these is unset, the value is undefined and
 * those tests are skipped.
 */
export const enquirySubmission: EnquiryDetails | undefined =
  MB_ENQUIRY_NAME && MB_ENQUIRY_EMAIL && MB_ENQUIRY_MOBILE
    ? { name: MB_ENQUIRY_NAME, email: MB_ENQUIRY_EMAIL, mobile: MB_ENQUIRY_MOBILE }
    : undefined;
