'use client'

import { useState, useTransition } from 'react'
import AllDealsRender from '@/components/alldeals/alldealsrender'
import { filterAllDealsAction } from '@/lib/actions/alldeals-actions'
import {
  Deal,
  AllDealsFilterState,
  AllDealsClientWrapperProps,
} from '@/types/alldeals.types'
import { AllDealsFilterValues } from '@/utils/alldealsconfig'
import { FilterTabType } from '@/utils/alldealsconfig'
import { type LocaleCode } from '@/lib/locale-utils'

/**
 * Client wrapper for HOME PAGE
 * Uses Server Actions for filtering (NO URL params)
 *
 * This component manages filter state locally and calls Server Actions
 * to fetch filtered data, keeping the URL clean on the home page.
 */
const AllDealsClientWrapper = ({
  initialDeals,
  initialFilters,
  isLoading = false,
  error = null,
  pageType = 'home',
  locale = 'us', // Default locale
}: AllDealsClientWrapperProps & { locale?: LocaleCode }) => {
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [filters, setFilters] = useState<AllDealsFilterState>(initialFilters)
  const [isPending, startTransition] = useTransition()
  const [filterError, setFilterError] = useState<string | null>(error)

  // Call Server Action to filter deals
  const applyFilters = async (newFilters: Partial<AllDealsFilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)

    startTransition(async () => {
      const result = await filterAllDealsAction(locale, updatedFilters)

      if (result.success) {
        setDeals(result.data)
        setFilterError(null)
      } else {
        setFilterError(result.error)
      }
    })
  }

  const handleTabChange = (tab: FilterTabType) => {
    applyFilters({ tab })
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setFilters({ ...filters, viewMode: mode })
    // View mode is client-side only, no need to re-fetch
  }

  const handleSheetFiltersChange = (sheetFilters: AllDealsFilterValues) => {
    applyFilters({
      category: sheetFilters.category,
      subcategory: sheetFilters.subcategory,
      store: sheetFilters.store,
      brand: sheetFilters.brand,
      discount: sheetFilters.discount,
      sortBy: sheetFilters.sortBy,
    })
  }

  const handleClearFilters = () => {
    applyFilters({
      tab: 'all',
      category: null,
      subcategory: null,
      store: null,
      brand: null,
      discount: null,
      sortBy: 'newest',
    })
  }

  // Convert to AllDealsRender format
  const sheetFilters: AllDealsFilterValues = {
    sortBy: filters.sortBy || 'newest',
    category: filters.category || null,
    subcategory: filters.subcategory || null,
    store: filters.store || null,
    brand: filters.brand || null,
    discount: filters.discount || null,
  }

  return (
    <AllDealsRender
      allDeals={deals}
      loading={isPending || isLoading}
      error={filterError}
      activeFilter={(filters.tab as FilterTabType) || 'all'}
      onActiveFilterChange={handleTabChange}
      sheetFilters={sheetFilters}
      onSheetFiltersChange={handleSheetFiltersChange}
      viewMode={filters.viewMode || 'grid'}
      onViewModeChange={handleViewModeChange}
      onClearFilters={handleClearFilters}
      pageType={pageType}
    />
  )
}

export default AllDealsClientWrapper
