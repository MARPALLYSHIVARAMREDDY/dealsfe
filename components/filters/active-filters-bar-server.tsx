import {
  getCategories,
  getBrands,
  getStores,
} from '@/data/catalogues/catalogues-server-only'
import { getTags } from '@/data/breadcrumb/breadcrumb-server-only'

import type { MultiSelectFiltersServerProps } from './types'
import { ActiveFiltersBar } from './active-filters-bar'
import { parseSearchParams } from './utils'

/**
 * Server component wrapper for ActiveFiltersBar
 * Fetches filter data for name lookups
 */
export async function ActiveFiltersBarServer({
  searchParams,
  locale = 'USA',
}: MultiSelectFiltersServerProps) {
  // Parse selected filters from URL
  const selectedFilters = parseSearchParams(searchParams)

  // Fetch filter data for name lookups
  const [categories, brands, stores, tags] = await Promise.all([
    getCategories(),
    getBrands(),
    getStores(),
    getTags(locale),
  ])

  return (
    <ActiveFiltersBar
      selectedFilters={selectedFilters}
      categories={categories}
      brands={brands}
      stores={stores}
      tags={tags}
    />
  )
}
