import { Suspense } from 'react'

import {
  getCategories,
  getBrands,
  getStores,
} from '@/data/catalogues/catalogues-server-only'
import { getTags } from '@/data/breadcrumb/breadcrumb-server-only'

import type { MultiSelectFiltersServerProps } from './types'
import { MultiSelectFiltersClient } from './multi-select-filters-client'
import { parseSearchParams } from './utils'

/**
 * Server component wrapper for MultiSelectFilters
 * Fetches all filter data in parallel and passes to client component
 */
export async function MultiSelectFiltersServer({
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
    <MultiSelectFiltersClient
      categories={categories}
      brands={brands}
      stores={stores}
      tags={tags}
      initialSelectedFilters={initialSelectedFilters}
    />
  )
}

/**
 * Loading fallback component
 */
function FiltersSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 w-32 bg-muted rounded-md" />
    </div>
  )
}

/**
 * Server component with Suspense wrapper
 * Use this if you want loading states
 */
export async function MultiSelectFiltersServerWithSuspense({
  searchParams,
  locale,
}: MultiSelectFiltersServerProps) {
  return (
    <Suspense fallback={<FiltersSkeleton />}>
      <MultiSelectFiltersServer searchParams={searchParams} locale={locale} />
    </Suspense>
  )
}
