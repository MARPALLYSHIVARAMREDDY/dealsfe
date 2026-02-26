/**
 * Country detection utilities for phone input
 * Provides automatic country detection based on browser locale and timezone
 */

/**
 * Auto-detects user's country based on browser locale
 * Falls back to timezone detection, then defaults to 'us'
 *
 * @returns Two-letter lowercase country code (e.g., 'us', 'in', 'gb')
 *
 * @example
 * const country = detectUserCountry(); // Returns 'us', 'in', etc.
 */
export function detectUserCountry(): string {
  try {
    // Primary detection: Browser locale (most reliable)
    // Format: "en-US", "en-GB", "hi-IN", etc.
    const locale = navigator.language || (navigator as any).userLanguage;

    if (locale && locale.includes('-')) {
      const countryCode = locale.split('-')[1].toLowerCase();

      // Validate it's a 2-letter country code
      if (countryCode && countryCode.length === 2) {
        return countryCode;
      }
    }

    // Secondary detection: Timezone mapping
    // Useful when locale doesn't have country information
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Common timezone to country mapping
      const commonTimezones: Record<string, string> = {
        'America/New_York': 'us',
        'America/Los_Angeles': 'us',
        'America/Chicago': 'us',
        'America/Denver': 'us',
        'America/Phoenix': 'us',
        'Asia/Kolkata': 'in',
        'Asia/Calcutta': 'in',
        'Asia/Mumbai': 'in',
        'Asia/Delhi': 'in',
        'Europe/London': 'gb',
        'Europe/Paris': 'fr',
        'Europe/Berlin': 'de',
        'Europe/Madrid': 'es',
        'Europe/Rome': 'it',
        'Asia/Tokyo': 'jp',
        'Asia/Shanghai': 'cn',
        'Asia/Singapore': 'sg',
        'Australia/Sydney': 'au',
        'Australia/Melbourne': 'au',
        'Pacific/Auckland': 'nz',
      };

      if (timezone && commonTimezones[timezone]) {
        return commonTimezones[timezone];
      }
    }

    // Tertiary fallback: Safe default
    return 'us';
  } catch (error) {
    console.warn('Country detection failed, using default:', error);
    return 'us';
  }
}
