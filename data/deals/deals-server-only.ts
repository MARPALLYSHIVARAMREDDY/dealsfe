import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import { CACHE_KEYS } from '@/app/cache-keys'
import { getCountryCodeFromLocale, type LocaleCode } from '@/lib/locale-utils'
import type { Deal } from '@/types/alldeals.types'
import type { DealsApiResponse, DealsFilterParams, DealsMeta } from '@/types/deals-api.types'
import { transformApiDealToDeal } from '@/lib/transform'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Fetch deals from the API
 * Server-only function with caching
 */
export async function getDeals(
  locale: LocaleCode,
  params?: DealsFilterParams
): Promise<{ deals: Deal[]; meta: DealsMeta }> {
  // 'use cache'

  // // Create cache key with locale and params
  // const cacheKey = CACHE_KEYS.DEALS_MASTER + locale + (params ? JSON.stringify(params) : '')
  // cacheTag(cacheKey)

  // Cache configuration: stale for 60s, revalidate every 120s
  // cacheLife({
  //   stale: 60,
  //   revalidate: 120,
  // })
  console.log({params})
  try {
    // Convert locale to country code
    const countryCode = getCountryCodeFromLocale(locale)

    // Build query parameters
    const queryParams = new URLSearchParams()
    queryParams.append('country', countryCode)

    if (params?.page) {
      queryParams.append('page', params.page.toString())
    }

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString())
    }

    // Multi-select filters with slugs
    if (params?.tagSlugs && params.tagSlugs.length > 0) {
      queryParams.set('tagSlugs', params.tagSlugs.join(','))
    }

    if (params?.categorySlugs && params.categorySlugs.length > 0) {
      queryParams.set('categorySlugs', params.categorySlugs.join(','))
    }

    if (params?.storeSlugs && params.storeSlugs.length > 0) {
      queryParams.set('storeSlugs', params.storeSlugs.join(','))
    }

    if (params?.brandSlugs && params.brandSlugs.length > 0) {
      queryParams.set('brandSlugs', params.brandSlugs.join(','))
    }

    // Additional scalar filters
    if (params?.sortBy) {
      queryParams.append('sortBy', params.sortBy)
    }

    if (params?.minDiscount !== undefined) {
      queryParams.append('minDiscount', params.minDiscount.toString())
    }

    if (params?.maxDiscount !== undefined) {
      queryParams.append('maxDiscount', params.maxDiscount.toString())
    }

    if (params?.minPrice !== undefined) {
      queryParams.append('minPrice', params.minPrice.toString())
    }

    if (params?.maxPrice !== undefined) {
      queryParams.append('maxPrice', params.maxPrice.toString())
    }

    // Construct full URL
    const url = `${API_BASE_URL}/api/v1/deals?${queryParams.toString()}`

    // Fetch from API
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Check response status
    if (!res.ok) {
      throw new Error(`Failed to fetch deals: ${res.status} ${res.statusText}`)
    }

    // Parse response
    const json: DealsApiResponse = await res.json()

    // Validate response structure
    if (!json.data || !Array.isArray(json.data.deals)) {
      throw new Error('Invalid deals API response structure')
    }

    // Transform API deals to frontend Deal format
    const transformedDeals = json.data.deals.map((apiDeal) =>
      transformApiDealToDeal(apiDeal)
    )

    // Return deals and metadata
    return {
      deals: transformedDeals,
      meta: json.meta || {
        page: params?.page || 1,
        limit: params?.limit || 20,
        totalCount: transformedDeals.length,
        totalPages: 1,
      },
    }
  } catch (error) {
    console.error('Error fetching deals:', error)

    // Return empty array on error - graceful degradation
    return {
      deals: [],
      meta: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        totalCount: 0,
        totalPages: 0,
      },
    }
  }
}
