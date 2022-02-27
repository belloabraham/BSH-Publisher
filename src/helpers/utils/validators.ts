import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

export function isValidPhone(
  phoneNumber: string,
  countryCode: string,
  diallingCode: string
): boolean {
  var cc = countryCode?.toUpperCase();
  const phoneNumberObj = parsePhoneNumber(diallingCode + phoneNumber);
  return phoneNumberObj.isValid()
}
