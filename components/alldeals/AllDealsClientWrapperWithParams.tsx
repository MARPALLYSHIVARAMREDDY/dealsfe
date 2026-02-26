'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import AllDealsRender from '@/components/alldeals/alldealsrender'
import { Deal, AllDealsFilterState, AllDealsClientWrapperWithParamsProps } from '@/types/alldeals.types'
import { AllDealsFilterValues, FilterTabType } from '@/utils/alldealsconfig'

/**
 * Client wrapper for /ALLDEALS PAGE
 * Uses URL params for filtering (shareable URLs)
 *
 * This component updates URL search parameters when filters change,
 * triggering server-side re-fetches with the new filter state.
 * This makes the filtered states shareable and SEO-friendly.
 */
const AllDealsClientWrapperWithParams = ({
  initialDeals,
  initialFilters,
  isLoading = false,
  error = null,
  pageType = 'listing',
}: AllDealsClientWrapperWithParamsProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Update URL to trigger server re-fetch
  const updateFilters = (newFilters: Partial<AllDealsFilterState>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))

    // Update search params with new filter values
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== null) {
        current.set(key, String(value))
      } else {
        current.delete(key)
      }
    })

    const query = current.toString() ? `?${current.toString()}` : ''

    // Use startTransition for smooth UI updates
    startTransition(() => {
      router.push(`${pathname}${query}`)
    })
  }

  const handleTabChange = (tab: FilterTabType) => {
    updateFilters({ tab })
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    updateFilters({ viewMode: mode })
  }

  const handleSheetFiltersChange = (sheetFilters: AllDealsFilterValues) => {
    updateFilters({
      category: sheetFilters.category,
      subcategory: sheetFilters.subcategory,
      store: sheetFilters.store,
      brand: sheetFilters.brand,
      discount: sheetFilters.discount,
      sortBy: sheetFilters.sortBy,
    })
  }

  const handleClearFilters = () => {
    // Navigate to base path without params
    router.push(pathname)
  }

  // Convert to AllDealsRender format
  const sheetFilters: AllDealsFilterValues = {
    sortBy: initialFilters.sortBy || 'newest',
    category: initialFilters.category || null,
    subcategory: initialFilters.subcategory || null,
    store: initialFilters.store || null,
    brand: initialFilters.brand || null,
    discount: initialFilters.discount || null,
  }

  return (
    <AllDealsRender
      allDeals={initialDeals}
      loading={isPending || isLoading}
      error={error}
      activeFilter={(initialFilters.tab as FilterTabType) || 'all'}
      onActiveFilterChange={handleTabChange}
      sheetFilters={sheetFilters}
      onSheetFiltersChange={handleSheetFiltersChange}
      viewMode={initialFilters.viewMode || 'grid'}
      onViewModeChange={handleViewModeChange}
      onClearFilters={handleClearFilters}
      pageType={pageType}
    />
  )
}

export default AllDealsClientWrapperWithParams
