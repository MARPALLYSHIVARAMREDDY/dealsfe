/**
 * Hot Deals Configuration
 * Defines price tiers and UI settings for the Hot Deals section
 */

// Fixed price tiers (same across all locales)
export const HOT_DEALS_PRICE_TIERS = [99, 199, 299, 399, 499, 599, 799, 999];

// Hot Deals Section UI Configuration
export const HOT_DEALS_CONFIG = {
  heading: 'Hot Deals',
  subheading: 'Powered by Smart Deal Scanner',
};

/**
 * Helper function to check if price tier is valid
 * @param price - Price value to check
 * @returns True if price is a valid tier, false otherwise
 */
export function isValidPriceTier(price: number): boolean {
  return HOT_DEALS_PRICE_TIERS.includes(price);
}

/**
 * Get price tier index (for layout purposes)
 * @param price - Price value
 * @returns Index of price tier, or -1 if not found
 */
export function getPriceTierIndex(price: number): number {
  return HOT_DEALS_PRICE_TIERS.indexOf(price);
}
