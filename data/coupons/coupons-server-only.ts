import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import { CACHE_KEYS } from '@/app/cache-keys'
import type { Coupon } from '@/types/coupons.types'
import type {
  ApiCoupon,
  CouponsApiResponse,
  CouponsFilterParams,
} from '@/types/coupons-api.types'
import type { LocaleCode } from '@/lib/locale-utils'
import { getCountryCodeFromLocale } from '@/lib/locale-utils'
import { MOCK_COUPONS_DATA } from '@/data/mock/coupons-mock-data'
import {
  calculateDaysUntilExpiry,
  isExpired,
  isExpiringSoon,
  formatExpiryDate,
} from '@/lib/coupon-utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

/**
 * Fetch coupons from API
 * Uses Next.js 15 cache directives for optimal performance
 */
export async function getCouponsFromApi(
  locale: LocaleCode,
  params?: CouponsFilterParams
): Promise<ApiCoupon[]> {
  'use cache'
  cacheTag(CACHE_KEYS.COUPONS_MASTER + locale)
  cacheLife({
    stale: 60, // 60 seconds stale
    revalidate: 70, // revalidate after 70 seconds
  })

  try {
    const countryCode = getCountryCodeFromLocale(locale)
    const queryParams = new URLSearchParams()
    queryParams.append('country', countryCode)

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.category) queryParams.append('category', params.category)
    if (params?.store) queryParams.append('store', params.store)
    if (params?.minDiscount) queryParams.append('minDiscount', params.minDiscount.toString())
    if (params?.maxDiscount) queryParams.append('maxDiscount', params.maxDiscount.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.tags && params.tags.length > 0) {
      params.tags.forEach((tag) => queryParams.append('tags', tag))
    }

    const url = `${API_BASE_URL}/api/v1/coupons?${queryParams.toString()}`
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch coupons: ${res.status}`)
    }

    const json: CouponsApiResponse = await res.json()

    if (!json.data || !Array.isArray(json.data)) {
      throw new Error('Invalid coupons API response structure')
    }

    return json.data
  } catch (error) {
    console.error('Error fetching coupons from API:', error)
    return [] // Graceful degradation
  }
}

/**
 * Transform API coupon to internal Coupon type
 */
function transformApiCoupon(apiCoupon: ApiCoupon): Coupon {
  const expiresAt = new Date(apiCoupon.expiresAt)

  return {
    id: apiCoupon.id,
    slug: apiCoupon.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: apiCoupon.title,
    description: apiCoupon.description,
    code: apiCoupon.code,
    link: apiCoupon.link,
    category: apiCoupon.category,
    store: apiCoupon.store,
    storeId: apiCoupon.storeId,
    tags: apiCoupon.seoLabels,
    discount: apiCoupon.discount,
    discountType: apiCoupon.discountType,
    expiresAt,
    publishedDate: apiCoupon.publishedAt,
    formattedExpiry: formatExpiryDate(expiresAt),
    daysUntilExpiry: calculateDaysUntilExpiry(expiresAt),
    isExpired: isExpired(expiresAt),
    isExpiringSoon: isExpiringSoon(expiresAt),
    uses: apiCoupon.uses,
    views: apiCoupon.views,
    featured: apiCoupon.featured,
    verified: apiCoupon.verified,
    storeImage: apiCoupon.storeImage,
    bannerImage: apiCoupon.bannerImage,
    termsAndConditions: apiCoupon.termsAndConditions,
    minimumPurchase: apiCoupon.minimumPurchase,
  }
}

/**
 * Get coupons for landing page
 * Tries API first, falls back to mock data on failure
 */
export async function getCouponsForLanding(locale: LocaleCode): Promise<Coupon[]> {
  'use cache'
  cacheTag(CACHE_KEYS.COUPONS_MASTER + locale)
  cacheLife({
    stale: 60,
    revalidate: 70,
  })

  try {
    // Try API first with a reasonable limit
    const apiCoupons = await getCouponsFromApi(locale, { limit: 100 })

    if (apiCoupons && apiCoupons.length > 0) {
      // Transform API response to Coupon type
      return apiCoupons.map(transformApiCoupon)
    }

    // Fallback to mock data if API returns empty
    console.log(`Using mock data for coupons (locale: ${locale})`)
    return MOCK_COUPONS_DATA[locale] || MOCK_COUPONS_DATA.us
  } catch (error) {
    console.error('Error fetching coupons for landing:', error)
    // Graceful fallback to mock data
    return MOCK_COUPONS_DATA[locale] || MOCK_COUPONS_DATA.us
  }
}
