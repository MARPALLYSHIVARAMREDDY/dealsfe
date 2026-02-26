export interface Coupon {
  // Core identifiers
  id: string
  slug?: string

  // Coupon details
  title: string
  description?: string
  code: string // The actual coupon code (e.g., "SAVE20")
  link: string // Affiliate/redirect link

  // Categorization
  category?: string
  store: string // Brand/Store name (e.g., "Amazon", "Nike")
  storeId?: string
  tags?: string[]

  // Discount information
  discount: number // Percentage or fixed amount
  discountType: 'percentage' | 'fixed' // e.g., "20%" vs "$20 off"
  originalPrice?: number
  discountedPrice?: number

  // Validity
  expiresAt: Date
  publishedDate?: string
  formattedExpiry?: string
  daysUntilExpiry?: number
  isExpired?: boolean
  isExpiringSoon?: boolean // Within 3 days

  // Engagement metrics
  uses?: number // How many times used
  views?: number
  likes?: number
  trending?: boolean
  featured?: boolean
  verified?: boolean // Admin verified

  // Images
  storeImage?: string | null
  bannerImage?: string | null

  // Metadata
  termsAndConditions?: string
  minimumPurchase?: number
  shareUrl?: string
  couponUrl?: string
}
