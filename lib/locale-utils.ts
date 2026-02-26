/**
 * Locale utilities for internationalization (i18n)
 * Provides constants, types, and helper functions for locale management
 */

export interface CurrencyConfig {
  symbol: string;      // ₹, $, £, A$
  code: string;        // INR, USD, GBP, AUD
  locale: string;      // en-IN, en-US, en-GB, en-AU for Intl formatting
}

export const SUPPORTED_LOCALES = {
  'us': {
    code: 'us',
    countryCode: 'USA',
    name: 'United States',
    flag: '🇺🇸',
    currency: {
      symbol: '$',
      code: 'USD',
      locale: 'en-US'
    }
  },
  'in': {
    code: 'in',
    countryCode: 'IND',
    name: 'India',
    flag: '🇮🇳',
    currency: {
      symbol: '₹',
      code: 'INR',
      locale: 'en-IN'
    }
  },
  // 'gb': {
  //   code: 'gb',
  //   countryCode: 'gb',
  //   name: 'United Kingdom',
  //   flag: '🇬🇧',
  //   currency: {
  //     symbol: '£',
  //     code: 'GBP',
  //     locale: 'en-GB'
  //   }
  // },
  // 'au': {
  //   code: 'au',
  //   countryCode: 'au',
  //   name: 'Australia',
  //   flag: '🇦🇺',
  //   currency: {
  //     symbol: 'A$',
  //     code: 'AUD',
  //     locale: 'en-AU'
  //   }
  // },
} as const;

export type LocaleCode = keyof typeof SUPPORTED_LOCALES;

export const DEFAULT_LOCALE: LocaleCode = 'us';

/**
 * Get locale code from country code
 * @param countryCode - Two-letter country code (e.g., 'us', 'in')
 * @returns Locale code (e.g., 'en-us', 'en-in')
 *
 * @example
 * getLocaleFromCountryCode('us') // Returns 'en-us'
 * getLocaleFromCountryCode('in') // Returns 'en-in'
 */
export function getLocaleFromCountryCode(countryCode: string): LocaleCode {
  const entry = Object.values(SUPPORTED_LOCALES).find(
    (locale) => locale.countryCode === countryCode.toLowerCase()
  );
  return entry?.code || DEFAULT_LOCALE;
}

/**
 * Type guard to check if a string is a valid locale code
 * @param locale - String to check
 * @returns True if locale is valid, false otherwise
 *
 * @example
 * isValidLocale('en-us') // Returns true
 * isValidLocale('es-es') // Returns false
 */
export function isValidLocale(locale: string): locale is LocaleCode {
  return locale in SUPPORTED_LOCALES;
}

/**
 * Get country code from locale code
 * @param locale - Locale code (e.g., 'en-us', 'en-in')
 * @returns Two-letter country code (e.g., 'us', 'in')
 *
 * @example
 * getCountryCodeFromLocale('en-us') // Returns 'us'
 * getCountryCodeFromLocale('en-in') // Returns 'in'
 */
export function getCountryCodeFromLocale(locale: string): string {
  if (isValidLocale(locale)) {
    return SUPPORTED_LOCALES[locale].countryCode;
  }
  return SUPPORTED_LOCALES[DEFAULT_LOCALE].countryCode;
}

/**
 * Extract language code from locale
 * @param locale - Locale code (e.g., 'en-us', 'en-in')
 * @returns Language code (e.g., 'en')
 *
 * @example
 * getLanguageFromLocale('en-us') // Returns 'en'
 * getLanguageFromLocale('en-in') // Returns 'en'
 */
export function getLanguageFromLocale(locale: string): string {
  return locale;
}

/**
 * Get currency symbol from locale
 * @param locale - Locale code (e.g., 'us', 'in', 'gb', 'au')
 * @returns Currency symbol (e.g., '$', '₹', '£', 'A$')
 *
 * @example
 * getCurrencySymbol('us') // Returns '$'
 * getCurrencySymbol('in') // Returns '₹'
 * getCurrencySymbol('gb') // Returns '£'
 * getCurrencySymbol('au') // Returns 'A$'
 */
export function getCurrencySymbol(locale: LocaleCode): string {
  return SUPPORTED_LOCALES[locale]?.currency?.symbol || '$';
}

/**
 * Get currency code from locale
 * @param locale - Locale code (e.g., 'us', 'in', 'gb', 'au')
 * @returns Currency code (e.g., 'USD', 'INR', 'GBP', 'AUD')
 *
 * @example
 * getCurrencyCode('us') // Returns 'USD'
 * getCurrencyCode('in') // Returns 'INR'
 */
export function getCurrencyCode(locale: LocaleCode): string {
  return SUPPORTED_LOCALES[locale]?.currency?.code || 'USD';
}

/**
 * Get currency locale for Intl.NumberFormat
 * @param locale - Locale code (e.g., 'us', 'in', 'gb', 'au')
 * @returns Currency locale (e.g., 'en-US', 'en-IN', 'en-GB', 'en-AU')
 *
 * @example
 * getCurrencyLocale('us') // Returns 'en-US'
 * getCurrencyLocale('in') // Returns 'en-IN'
 */
export function getCurrencyLocale(locale: LocaleCode): string {
  return SUPPORTED_LOCALES[locale]?.currency?.locale || 'en-US';
}
