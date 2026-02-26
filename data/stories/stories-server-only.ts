import 'server-only'
import { cacheTag,cacheLife } from 'next/cache'
import { CACHE_KEYS } from '@/app/cache-keys'
import { getCountryCodeFromLocale, type LocaleCode } from '@/lib/locale-utils'
import type { ApiStory, StoriesApiResponse } from '@/types/stories.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Fetch stories for a specific locale
 * Uses Next.js 15 'use cache' directive with cache tags
 *
 * @param locale - Locale code (e.g., 'us', 'in', 'gb', 'au')
 * @returns Array of API stories (not yet transformed)
 */
export async function getStoriesFromApi(locale: LocaleCode): Promise<ApiStory[]> {

  'use cache'
  cacheTag(CACHE_KEYS.STORIES_MASTER + locale)
  cacheLife({
    stale: 60,
    revalidate: 70,
  })

  try {
    const countryCode = getCountryCodeFromLocale(locale)
    const url = `${API_BASE_URL}/api/v1/stories?country=${countryCode}`

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch stories: ${res.status} ${res.statusText}`)
    }

    const json: StoriesApiResponse = await res.json()

    // Validate response structure
    if (!json.data || !Array.isArray(json.data.stories)) {
      throw new Error('Invalid stories API response structure')
    }

    return json.data.stories
  } catch (error) {
    console.error('Error fetching stories:', error)
    // Return empty array on error - graceful degradation
    return []
  }
}
