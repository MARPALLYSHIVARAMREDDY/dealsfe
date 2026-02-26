/**
 * Calculate the number of days until a coupon expires
 * @param expiresAt - The expiration date
 * @returns Number of days (negative if expired)
 */
export function calculateDaysUntilExpiry(expiresAt: Date): number {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const diffMs = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Check if a coupon has expired
 * @param expiresAt - The expiration date
 * @returns True if expired, false otherwise
 */
export function isExpired(expiresAt: Date): boolean {
  const now = new Date()
  return new Date(expiresAt).getTime() < now.getTime()
}

/**
 * Check if a coupon is expiring soon
 * @param expiresAt - The expiration date
 * @param threshold - Number of days threshold (default: 3)
 * @returns True if expiring within threshold days
 */
export function isExpiringSoon(expiresAt: Date, threshold: number = 3): boolean {
  if (isExpired(expiresAt)) return false
  const daysUntilExpiry = calculateDaysUntilExpiry(expiresAt)
  return daysUntilExpiry >= 0 && daysUntilExpiry <= threshold
}

/**
 * Format expiry date into human-readable string
 * @param expiresAt - The expiration date
 * @returns Formatted string like "Expires in 2 days" or "Expired 3 days ago"
 */
export function formatExpiryDate(expiresAt: Date): string {
  const daysUntilExpiry = calculateDaysUntilExpiry(expiresAt)

  if (daysUntilExpiry < 0) {
    const daysAgo = Math.abs(daysUntilExpiry)
    if (daysAgo === 0) return 'Expired today'
    if (daysAgo === 1) return 'Expired yesterday'
    return `Expired ${daysAgo} days ago`
  }

  if (daysUntilExpiry === 0) return 'Expires today'
  if (daysUntilExpiry === 1) return 'Expires tomorrow'
  if (daysUntilExpiry <= 7) return `Expires in ${daysUntilExpiry} days`
  if (daysUntilExpiry <= 30) {
    const weeks = Math.floor(daysUntilExpiry / 7)
    return weeks === 1 ? 'Expires in 1 week' : `Expires in ${weeks} weeks`
  }

  const months = Math.floor(daysUntilExpiry / 30)
  return months === 1 ? 'Expires in 1 month' : `Expires in ${months} months`
}

/**
 * Format discount value with type
 * @param discount - The discount amount
 * @param type - 'percentage' or 'fixed'
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted string like "20% OFF" or "$20 OFF"
 */
export function formatDiscount(
  discount: number,
  type: 'percentage' | 'fixed',
  currency: string = '$'
): string {
  if (type === 'percentage') {
    return `${discount}% OFF`
  }
  return `${currency}${discount} OFF`
}

/**
 * Generate SEO-friendly slug from title and ID
 * @param title - The coupon title
 * @param id - The coupon ID
 * @returns URL-friendly slug
 */
export function generateCouponSlug(title: string, id: string): string {
  const slugFromTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60)

  return `${slugFromTitle}-${id}`
}
