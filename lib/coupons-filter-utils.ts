import type { Coupon } from '@/types/coupons.types'

export type SortOption = 'trending' | 'highest-discount' | 'expiring-soon' | 'newest'

/**
 * Filter coupons by search query
 * Searches in: title, description, store, category, tags
 */
export function filterCouponsBySearch(coupons: Coupon[], query: string): Coupon[] {
  if (!query || query.trim() === '') return coupons

  const searchLower = query.toLowerCase().trim()

  return coupons.filter((coupon) => {
    const titleMatch = coupon.title.toLowerCase().includes(searchLower)
    const descriptionMatch = coupon.description?.toLowerCase().includes(searchLower)
    const storeMatch = coupon.store.toLowerCase().includes(searchLower)
    const categoryMatch = coupon.category?.toLowerCase().includes(searchLower)
    const tagsMatch = coupon.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
    const codeMatch = coupon.code.toLowerCase().includes(searchLower)

    return titleMatch || descriptionMatch || storeMatch || categoryMatch || tagsMatch || codeMatch
  })
}

/**
 * Filter coupons by category
 */
export function filterCouponsByCategory(coupons: Coupon[], category: string): Coupon[] {
  if (!category || category.trim() === '' || category.toLowerCase() === 'all') {
    return coupons
  }

  return coupons.filter(
    (coupon) => coupon.category?.toLowerCase() === category.toLowerCase()
  )
}

/**
 * Filter coupons by store
 */
export function filterCouponsByStore(coupons: Coupon[], store: string): Coupon[] {
  if (!store || store.trim() === '' || store.toLowerCase() === 'all') {
    return coupons
  }

  return coupons.filter(
    (coupon) => coupon.store.toLowerCase() === store.toLowerCase()
  )
}

/**
 * Filter coupons by tags (matches ANY of the selected tags)
 */
export function filterCouponsByTags(coupons: Coupon[], tags: string[]): Coupon[] {
  if (!tags || tags.length === 0) return coupons

  const tagsLower = tags.map((tag) => tag.toLowerCase())

  return coupons.filter((coupon) =>
    coupon.tags?.some((tag) => tagsLower.includes(tag.toLowerCase()))
  )
}

/**
 * Filter coupons by discount range
 */
export function filterCouponsByDiscountRange(
  coupons: Coupon[],
  minDiscount?: number,
  maxDiscount?: number
): Coupon[] {
  if (minDiscount === undefined && maxDiscount === undefined) return coupons

  return coupons.filter((coupon) => {
    const discount = coupon.discount

    if (minDiscount !== undefined && discount < minDiscount) return false
    if (maxDiscount !== undefined && discount > maxDiscount) return false

    return true
  })
}

/**
 * Filter out expired coupons (by default)
 */
export function filterExpiredCoupons(
  coupons: Coupon[],
  includeExpired: boolean = false
): Coupon[] {
  if (includeExpired) return coupons
  return coupons.filter((coupon) => !coupon.isExpired)
}

/**
 * Calculate trending score for a coupon
 * Formula: (uses * 2) + views + (likes * 3)
 */
export function calculateTrendingScore(coupon: Coupon): number {
  const uses = coupon.uses || 0
  const views = coupon.views || 0
  const likes = coupon.likes || 0

  return (uses * 2) + views + (likes * 3)
}

/**
 * Sort coupons by specified option
 */
export function sortCoupons(coupons: Coupon[], sortBy: SortOption): Coupon[] {
  const couponsCopy = [...coupons]

  switch (sortBy) {
    case 'trending':
      return couponsCopy.sort((a, b) => {
        const scoreA = calculateTrendingScore(a)
        const scoreB = calculateTrendingScore(b)
        return scoreB - scoreA // Highest trending score first
      })

    case 'highest-discount':
      return couponsCopy.sort((a, b) => b.discount - a.discount)

    case 'expiring-soon':
      return couponsCopy.sort((a, b) => {
        // Filter out expired first, then sort by days until expiry
        if (a.isExpired && !b.isExpired) return 1
        if (!a.isExpired && b.isExpired) return -1

        const daysA = a.daysUntilExpiry || 999
        const daysB = b.daysUntilExpiry || 999
        return daysA - daysB // Soonest expiry first
      })

    case 'newest':
      return couponsCopy.sort((a, b) => {
        const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0
        const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0
        return dateB - dateA // Newest first
      })

    default:
      return couponsCopy
  }
}

/**
 * Apply all filters and sorting to coupons
 */
export function applyFiltersAndSort(
  coupons: Coupon[],
  filters: {
    search?: string
    category?: string
    store?: string
    tags?: string[]
    minDiscount?: number
    maxDiscount?: number
  },
  sortBy: SortOption = 'trending'
): Coupon[] {
  let result = [...coupons]

  // Filter out expired coupons first
  result = filterExpiredCoupons(result, false)

  // Apply category filter
  if (filters.category) {
    result = filterCouponsByCategory(result, filters.category)
  }

  // Apply store filter
  if (filters.store) {
    result = filterCouponsByStore(result, filters.store)
  }

  // Apply tags filter
  if (filters.tags && filters.tags.length > 0) {
    result = filterCouponsByTags(result, filters.tags)
  }

  // Apply discount range filter
  if (filters.minDiscount !== undefined || filters.maxDiscount !== undefined) {
    result = filterCouponsByDiscountRange(result, filters.minDiscount, filters.maxDiscount)
  }

  // Apply search filter (last, as it's broadest)
  if (filters.search) {
    result = filterCouponsBySearch(result, filters.search)
  }

  // Apply sorting
  result = sortCoupons(result, sortBy)

  return result
}

/**
 * Get all unique categories from coupons
 */
export function getAllCategories(coupons: Coupon[]): string[] {
  const categories = coupons
    .map((coupon) => coupon.category)
    .filter((category): category is string => !!category)

  return ['All', ...Array.from(new Set(categories)).sort()]
}

/**
 * Get all unique stores from coupons
 */
export function getAllStores(coupons: Coupon[]): string[] {
  const stores = coupons.map((coupon) => coupon.store)

  return ['All', ...Array.from(new Set(stores)).sort()]
}

/**
 * Get all unique tags from coupons
 */
export function getAllTags(coupons: Coupon[]): string[] {
  const allTags = coupons
    .flatMap((coupon) => coupon.tags || [])
    .filter((tag): tag is string => !!tag)

  return Array.from(new Set(allTags)).sort()
}

/**
 * Get trending coupons (sorted by trending score)
 */
export function getTrendingCoupons(coupons: Coupon[], limit: number = 10): Coupon[] {
  const activeCoupons = filterExpiredCoupons(coupons, false)

  const sorted = activeCoupons.sort((a, b) => {
    const scoreA = calculateTrendingScore(a)
    const scoreB = calculateTrendingScore(b)
    return scoreB - scoreA
  })

  return sorted.slice(0, limit)
}

/**
 * Get coupons expiring soon (within 7 days)
 */
export function getExpiringCoupons(coupons: Coupon[], limit: number = 8): Coupon[] {
  const activeCoupons = filterExpiredCoupons(coupons, false)

  // Filter coupons expiring within 7 days
  const expiringSoon = activeCoupons.filter((coupon) => {
    const daysUntilExpiry = coupon.daysUntilExpiry || 999
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 7
  })

  // Sort by expiry date (soonest first)
  const sorted = expiringSoon.sort((a, b) => {
    const daysA = a.daysUntilExpiry || 999
    const daysB = b.daysUntilExpiry || 999
    return daysA - daysB
  })

  return sorted.slice(0, limit)
}
