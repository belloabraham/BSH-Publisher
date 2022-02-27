import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

export function isValidPhone(
  phoneNumber: string,
  countryCode: string,
  diallingCode: string
): boolean {
  try {
     const number = parsePhoneNumber(diallingCode + phoneNumber);
     let nationalFormatNumb = number?.formatNational();

     if (nationalFormatNumb) {
        return isValidPhoneNumber(
         nationalFormatNumb,
         countryCode.toUpperCase() as CountryCode
       );
    }
    return false
  } catch (error) {
    return false
  }
}
