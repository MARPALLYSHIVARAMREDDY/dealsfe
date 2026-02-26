import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupByLetter<T extends { name: string }>(items: T[]): Record<string, T[]> {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
  const grouped: Record<string, T[]> = {};
  sorted.forEach((item) => {
    const letter = item.name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(item);
  });
  return grouped;
}

/**
 * Maps react-phone-input-2 country codes to libphonenumber-js format
 * @param countryCode - Country code from react-phone-input-2 (e.g., "us", "gb", "in")
 * @returns ISO alpha-2 country code (e.g., "US", "GB", "IN")
 */
function mapCountryCode(countryCode: string): CountryCode | undefined {
  if (!countryCode) return undefined;
  // react-phone-input-2 uses lowercase ISO alpha-2 codes
  // libphonenumber-js expects uppercase
  return countryCode.toUpperCase() as CountryCode;
}

/**
 * Validates mobile phone number based on country-specific format using libphonenumber-js
 * @param value - The phone number value (can include country code with + prefix)
 * @param country - Country object from react-phone-input-2 with { countryCode, dialCode, format }
 * @returns true if valid, error message string if invalid
 */
export function validatePhoneNumber(value: string, country: any): boolean | string {
  // Handle empty value

  if (!value || !country) {
    return 'Phone number is required';
  }

  // Extract country code for validation
  const countryCode = mapCountryCode(country.countryCode);
  if (!countryCode) {
    // No fallback - require valid country code for validation
    return 'Unable to determine country. Please ensure a country is selected.';
  }

  try {
    // Ensure value has + prefix for E.164 format
    const formattedValue = value.startsWith('+') ? value : `+${value}`;

    // Quick validation using isValidPhoneNumber
    // This checks if the number is valid for any type (mobile, fixed-line, etc.)
    const isValid = isValidPhoneNumber(formattedValue, countryCode);

    if (!isValid) {
      // Try to parse to get more detailed error information
      try {
        const phoneNumber = parsePhoneNumber(formattedValue, countryCode);

        // If we can parse it but it's not valid, check why
        if (!phoneNumber.isValid()) {
          // Number parsed but doesn't meet country requirements
          return 'Phone number is invalid';
        }
      } catch (parseError) {
        // Parsing failed - number is incomplete or malformed
        return 'Phone number is invalid';
      }

      // Generic invalid message if we can't determine specific reason
      return 'Phone number is invalid';
    }

    

    // Number is valid and is a mobile number
    return true;

  } catch (error) {
    // Catch-all for any unexpected errors
    console.error('Phone validation error:', error);
    return 'Phone number is invalid';
  }
}
