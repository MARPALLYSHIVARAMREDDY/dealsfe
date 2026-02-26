import 'server-only'
import { cacheTag,cacheLife } from 'next/cache'
import { CACHE_KEYS } from '@/app/cache-keys'
import { getCountryCodeFromLocale, type LocaleCode } from '@/lib/locale-utils'
import type { Banner, BannerApiResponse } from '@/types/banner.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Fetch banners for a specific locale
 * Uses Next.js 15 'use cache' directive with cache tags
 *
 * @param locale - Locale code (e.g., 'us', 'in', 'gb', 'au')
 * @returns Array of banners`
 */
export async function getBanners(locale: LocaleCode): Promise<Banner[]> {

  try {
    const countryCode = getCountryCodeFromLocale(locale)
    const url = `${API_BASE_URL}/api/v1/banners?country=${countryCode}`

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch banners: ${res.status} ${res.statusText}`)
    }

    const json: BannerApiResponse = await res.json()

    // Validate response structure
    if (!json.data || !Array.isArray(json.data.banners)) {
      throw new Error('Invalid banner API response structure')
    }

    return json.data.banners
  } catch (error) {
    console.error('Error fetching banners:', error)
    // Return empty array on error - graceful degradation
    return []
  }
}
