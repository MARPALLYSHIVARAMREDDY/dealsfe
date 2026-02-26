import { Suspense } from 'react'

import {
  getCategories,
  getBrands,
  getStores,
} from '@/data/catalogues/catalogues-server-only'
import { getTags } from '@/data/breadcrumb/breadcrumb-server-only'
import {
  getCategoryIdsBySlug,
  getBrandIdsBySlug,
  getStoreIdsBySlug,
  getTagIdsBySlug,
} from '@/lib/filter-mappers'

import type { MultiSelectFiltersServerProps } from './types'
import { MultiSelectFiltersSidebar } from './multi-select-filters-sidebar'
import { parseSearchParams } from './utils'

/**
 * Server component wrapper for MultiSelectFiltersSidebar
 * Fetches all filter data in parallel and passes to client component
 */
export async function MultiSelectFiltersSidebarServer({
  searchParams,
  locale = 'USA',
  hideMobileButton = false,
}: MultiSelectFiltersServerProps & {
  hideMobileButton?: boolean
}) {
  // Fetch all filter data in parallel for optimal performance
  const [categories, brands, stores, tags] = await Promise.all([
    getCategories(),
    getBrands(),
    getStores(),
    getTags(locale),
  ])

  // Parse URL search params to get slugs
  const parsedParams = parseSearchParams(searchParams)

  // Convert slugs to IDs for component state
  // The URL contains slugs (SEO-friendly), but component uses IDs internally
  const categoryIds = getCategoryIdsBySlug(parsedParams.categoryIds, categories)
  const brandIds = getBrandIdsBySlug(parsedParams.brandIds, brands)
  const storeIds = getStoreIdsBySlug(parsedParams.storeIds, stores)
  const tagIds = getTagIdsBySlug(parsedParams.tagIds, tags)

  const initialSelectedFilters = {
    categoryIds,
    brandIds,
    storeIds,
    tagIds,
    minDiscount: parsedParams.minDiscount,
    maxDiscount: parsedParams.maxDiscount,
    sortBy: parsedParams.sortBy,
  }

  return (
    <MultiSelectFiltersSidebar
      categories={categories}
      brands={brands}
      stores={stores}
      tags={tags}
      initialSelectedFilters={initialSelectedFilters}
      hideMobileButton={hideMobileButton}
    />
  )
}

/**
 * Loading fallback component
 */
function FiltersSkeleton() {
  return (
    <>
      {/* Desktop skeleton */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
        <div className="sticky top-20 border-r border-border bg-background p-4">
          <div className="h-6 w-24 bg-muted rounded animate-pulse mb-4" />
          <div className="space-y-4">
            <div className="h-40 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Mobile skeleton */}
      <div className="lg:hidden">
        <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
      </div>
    </>
  )
}

/**
 * Server component with Suspense wrapper
 * Use this if you want loading states
 */
export async function MultiSelectFiltersSidebarServerWithSuspense({
  searchParams,
  locale,
  hideMobileButton = false,
}: MultiSelectFiltersServerProps & {
  hideMobileButton?: boolean
}) {
  return (
    <Suspense fallback={<FiltersSkeleton />}>
      <MultiSelectFiltersSidebarServer
        searchParams={searchParams}
        locale={locale}
        hideMobileButton={hideMobileButton}
      />
    </Suspense>
  )
}
