/**
 * API Type Definitions for Deals Endpoint
 * Endpoint: /api/v1/deals
 */

// ============================================
// Nested Entity Types
// ============================================

export interface ApiStore {
  id: string
  name: string
  slug: string
  logoUrl: string | null
}

export interface ApiBrand {
  id: string
  name: string
  slug: string
  logoUrl: string | null
}

export interface ApiTag {
  id: string
  name: string
}

export interface ApiCoupon {
  id: string
  title: string
  code: string
}

// ============================================
// Deal Entity
// ============================================

export interface ApiDeal {
  id: string
  title: string
  slug: string
  dealUrl: string
  affiliateUrl: string
  regularPrice: string
  dealPrice: string
  percentageOff: string | null
  images: string[]
  viewCount: number
  store: ApiStore
  brand: ApiBrand
  tags: ApiTag[]
  coupons: ApiCoupon[]
}

// ============================================
// Pagination Metadata
// ============================================

export interface DealsMeta {
  page: number
  limit: number
  totalCount: number
  totalPages: number
}

// ============================================
// API Response
// ============================================

export interface DealsApiResponse {
  status: number
  message: string
  data: {
    deals: ApiDeal[]
  }
  meta: DealsMeta
}

// ============================================
// Query Parameters
// ============================================

export interface DealsFilterParams {
  page?: number
  limit?: number
  country?: string

  // Multi-select filters (use slugs)
  tagSlugs?: string[]
  categorySlugs?: string[]
  storeSlugs?: string[]
  brandSlugs?: string[]

  // Additional filters
  sortBy?: string  // 'newest' | 'price-low' | 'price-high' | 'discount'
  minDiscount?: number
  maxDiscount?: number
  minPrice?: number
  maxPrice?: number
}
