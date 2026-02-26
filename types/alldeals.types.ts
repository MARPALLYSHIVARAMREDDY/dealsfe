import { FilterTabType } from '@/utils/alldealsconfig'

// ============================================
// Core Data Models
// ============================================

/**
 * Deal/Product item
 * Matches the structure from allproducts.json after transformation
 */
export interface Deal {
  id: string
  title: string
  description?: string
  category: string
  subcategory?: string
  store: string
  brand?: string
  imageUrl: string
  originalPrice: number
  salePrice: number
  discountPercent: number
  affiliateUrl?: string
  badges?: string[]
  badgeColor?: string
  badgeTextColor?: string
  isTrending?: boolean
  isHot?: boolean
  postedAt?: string
  couponCode?: string
  highlights?: string[]
  image?: string // Alias for imageUrl (from transform)
}

// ============================================
// Filter State
// ============================================

/**
 * All deals filter state
 * Used for both URL params and Server Action params
 */
export interface AllDealsFilterState {
  tab?: FilterTabType
  category?: string | null
  subcategory?: string | null
  store?: string | null
  brand?: string | null
  discount?: string | null
  sortBy?: string
  viewMode?: 'grid' | 'list'
}

// ============================================
// Service Response
// ============================================

/**
 * Consistent service response format
 */
export interface ServiceResponse<T> {
  success: boolean
  data: T
  error: string | null
  metadata?: {
    totalCount: number
    filteredCount: number
    page?: number // Current page number
    totalPages?: number // Total number of pages
    hasMore?: boolean // Whether there are more pages to load
  }
}

// ============================================
// Component Props
// ============================================

/**
 * Props for AllDealsContainer (home page)
 * No searchParams - fetches initial data only
 */
export interface AllDealsContainerProps {
  // No props for home page version
}

/**
 * Props for AllDealsPageContent (dedicated /alldeals page)
 * Receives searchParams from Next.js
 */
export interface AllDealsPageContentProps {
  searchParams: Record<string, string | string[] | undefined>
}

/**
 * Props for AllDealsClientWrapper (home page version)
 * Uses Server Actions for filtering
 */
export interface AllDealsClientWrapperProps {
  initialDeals: Deal[]
  initialFilters: AllDealsFilterState
  isLoading?: boolean
  error?: string | null
  pageType: 'home' | 'listing'
}

/**
 * Props for AllDealsClientWrapperWithParams (dedicated page version)
 * Uses URL params for filtering
 */
export interface AllDealsClientWrapperWithParamsProps {
  initialDeals: Deal[]
  initialFilters: AllDealsFilterState
  isLoading?: boolean
  error?: string | null
  pageType: 'home' | 'listing'
}

// ============================================
// Callback Types
// ============================================

export type OnFilterChangeCallback = (filters: AllDealsFilterState) => void
export type OnTabChangeCallback = (tab: FilterTabType) => void
export type OnViewModeChangeCallback = (mode: 'grid' | 'list') => void
export type OnClearFiltersCallback = () => void
