import {
  getCategories,
  getBrands,
  getStores,
} from '@/data/catalogues/catalogues-server-only'
import { getTags } from '@/data/breadcrumb/breadcrumb-server-only'

import type { MultiSelectFiltersServerProps } from './types'
import { MobileBottomActionBar } from './mobile-bottom-action-bar'
import { parseSearchParams } from './utils'

/**
 * Server component wrapper for MobileBottomActionBar
 * Fetches all filter data in parallel and passes to client component
 * This renders a fixed bottom bar on mobile with Filters and Sort By buttons
 */
export async function MobileBottomActionBarServer({
  searchParams,
  locale = 'USA',
}: MultiSelectFiltersServerProps) {
  // Fetch all filter data in parallel for optimal performance
  const [categories, brands, stores, tags] = await Promise.all([
    getCategories(),
    getBrands(),
    getStores(),
    getTags(locale),
  ])

  // Parse URL search params to selected filters
  const initialSelectedFilters = parseSearchParams(searchParams)

  return (
    <MobileBottomActionBar
      categories={categories}
      brands={brands}
      stores={stores}
      tags={tags}
      initialSelectedFilters={initialSelectedFilters}
    />
  )
}
