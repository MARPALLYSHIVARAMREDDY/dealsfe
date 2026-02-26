import 'server-only'
import { cacheTag } from 'next/cache'
import { CACHE_KEYS } from '@/app/cache-keys'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getCategories() {
  'use cache'
  cacheTag(CACHE_KEYS.CATEGORIES_MASTER)

  const res = await fetch(`${API_BASE_URL}/api/v1/catelog/categories`)
  // console.log('Categories response:', res)

  if (!res.ok) throw new Error('Failed to fetch categories')

  const json = await res.json()
  // console.log('Categories response:', json)

  return json.data
}

export async function getBrands() {
  'use cache'
  cacheTag(CACHE_KEYS.BRANDS_MASTER)

  const res = await fetch(`${API_BASE_URL}/api/v1/catelog/brands`)
  // console.log('Categories response:', res)

  if (!res.ok) throw new Error('Failed to fetch brands')

  const json = await res.json()
  // console.log('Brands response:', json)

  return json.data
}

export async function getStores() {
  'use cache'
  cacheTag(CACHE_KEYS.STORES_MASTER)

  const res = await fetch(`${API_BASE_URL}/api/v1/catelog/stores`)
  // console.log('Categories response:', res)

  if (!res.ok) throw new Error('Failed to fetch stores')

  const json = await res.json()
  // console.log('Stores response:', json)

  return json.data
}
