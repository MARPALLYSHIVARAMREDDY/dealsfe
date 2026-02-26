import 'server-only'
import { cacheTag } from 'next/cache'
import { CACHE_KEYS } from '@/app/cache-keys'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface SaleEntity {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

export interface TagEntity {
  id: string
  name: string
  slug: string
  country: string
  isActive: boolean
}

export async function getSales(countryCode: string) {
  'use cache'
  cacheTag(CACHE_KEYS.SALES_MASTER || 'sales')

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/sales?country=${countryCode}`)

    if (!res.ok) {
      console.error('Failed to fetch sales:', res.statusText)
      return []
    }

    const json = await res.json()
    return json.data?.sales || []
  } catch (error) {
    console.error('Error fetching sales:', error)
    return []
  }
}

export async function getTags(countryCode: string) {
  'use cache'
  cacheTag(CACHE_KEYS.TAGS_MASTER || 'tags')

  // Hardcoded for now - replace with API call later
  // Based on user-provided response from /api/v1/catelog/tags
  return [
    {
      id: '53dc68c2-dbb1-471c-b37f-4a1cdd680c95',
      name: 'Today Deals',
      slug: 'today_deals',
      country: 'USA',
      isActive: true,
    },
    {
      id: '00204002-7c48-4609-8134-fbcd1fdf7456',
      name: 'Top Deals',
      slug: 'top_deals',
      country: 'USA',
      isActive: false,
    },
    {
      id: '1831c3d7-1d4a-438b-afbe-567e4acb6492',
      name: 'Hot Deals',
      slug: 'hot_deals',
      country: 'USA',
      isActive: true,
    },
    {
      id: 'b5d26083-bc2c-49b1-98d8-986999a77482',
      name: 'Trending',
      slug: 'trending',
      country: 'USA',
      isActive: true,
    },
  ]
}
