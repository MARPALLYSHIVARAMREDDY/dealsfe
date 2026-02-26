import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import { CACHE_KEYS } from '@/app/cache-keys'
import { getCountryCodeFromLocale, type LocaleCode } from '@/lib/locale-utils'
import type { ApiBlog, BlogsApiResponse } from '@/types/blogs-api.types'
import { MOCK_BLOGS_DATA } from '@/data/mock/blogs-mock-data'
import type { Blog } from '@/types/blogs.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Fetch blogs for a specific locale
 * Uses Next.js 15 'use cache' directive with cache tags
 *
 * @param locale - Locale code (e.g., 'us', 'in', 'gb', 'au')
 * @param params - Optional filter parameters
 * @returns Array of API blogs (not yet transformed)
 */
export async function getBlogsFromApi(
  locale: LocaleCode,
  params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
  }
): Promise<ApiBlog[]> {
  'use cache'
  cacheTag(CACHE_KEYS.BLOGS_MASTER + locale)
  cacheLife({
    stale: 60,
    revalidate: 70,
  })

  try {
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

    if (params?.category) {
      queryParams.append('category', params.category)
    }

    if (params?.search) {
      queryParams.append('search', params.search)
    }

    const url = `${API_BASE_URL}/api/v1/blogs?${queryParams.toString()}`

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.status} ${res.statusText}`)
    }

    const json: BlogsApiResponse = await res.json()

    // Validate response structure
    if (!json.data || !Array.isArray(json.data)) {
      throw new Error('Invalid blogs API response structure')
    }

    return json.data
  } catch (error) {
    console.error('Error fetching blogs:', error)
    // Return empty array on error - graceful degradation
    return []
  }
}

/**
 * Fetch blogs for landing page with mock data fallback
 * Tries API first, falls back to mock data if API fails or returns empty
 *
 * @param locale - Locale code (e.g., 'us', 'in', 'gb', 'au')
 * @returns Array of Blog objects (transformed and ready for rendering)
 */
export async function getBlogsForLanding(locale: LocaleCode): Promise<Blog[]> {
  'use cache'
  cacheTag(CACHE_KEYS.BLOGS_MASTER + locale)
  cacheLife({
    stale: 60,
    revalidate: 70,
  })

  try {
    // Try to fetch from API first
    const apiBlogs = await getBlogsFromApi(locale, { limit: 50 })

    // If API returns blogs, transform and return them
    if (apiBlogs && apiBlogs.length > 0) {
      // Transform API blogs to Blog type
      return apiBlogs.map(apiBlog => ({
        id: apiBlog.id,
        slug: apiBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: apiBlog.title,
        excerpt: apiBlog.content.substring(0, 150) + '...',
        content: apiBlog.content,
        author: { name: apiBlog.author, avatar: null },
        category: apiBlog.category,
        tags: apiBlog.seoLabels,
        coverImage: apiBlog.image,
        image: apiBlog.image,
        publishedAt: new Date(apiBlog.publishedAt),
        publishedDate: apiBlog.publishedAt,
        formattedDate: new Date(apiBlog.publishedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        timeAgo: getTimeAgo(new Date(apiBlog.publishedAt)),
        readTime: calculateReadTime(apiBlog.content),
        likes: Math.floor(Math.random() * 500),
        views: Math.floor(Math.random() * 10000),
      }))
    }

    // Fallback to mock data if API returns empty or fails
    return MOCK_BLOGS_DATA[locale] || MOCK_BLOGS_DATA.us
  } catch (error) {
    console.error('Error fetching blogs for landing:', error)
    // Fallback to mock data on error
    return MOCK_BLOGS_DATA[locale] || MOCK_BLOGS_DATA.us
  }
}

/**
 * Calculate approximate read time based on word count
 */
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

/**
 * Calculate time ago from date
 */
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffWeeks === 1) return '1 week ago'
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
