/**
 * Best Discounts Configuration
 * Defines discount percentage tiers and UI settings for the Best Discounts section
 */

// Discount percentage tiers
export const BEST_DISCOUNTS_TIERS = [40, 50, 60, 70];

// Best Discounts Section UI Configuration
export const BEST_DISCOUNTS_CONFIG = {
  heading: 'Best Discounts',
  subheading: 'Powered by Smart Deal Scanner',
};

/**
 * Helper function to check if discount tier is valid
 * @param discount - Discount percentage to check
 * @returns True if discount is a valid tier, false otherwise
 */
export function isValidDiscountTier(discount: number): boolean {
  return BEST_DISCOUNTS_TIERS.includes(discount);
}

/**
 * Get discount tier index (for layout purposes)
 * @param discount - Discount percentage
 * @returns Index of discount tier, or -1 if not found
 */
export function getDiscountTierIndex(discount: number): number {
  return BEST_DISCOUNTS_TIERS.indexOf(discount);
}
