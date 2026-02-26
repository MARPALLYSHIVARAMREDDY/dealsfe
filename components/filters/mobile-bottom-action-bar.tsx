'use client'

import * as React from 'react'
import { useState, useTransition, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Filter, ArrowUpDown, Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

import type { CategoryNode, FilterOption, TagEntity, SelectedFilters } from './types'
import { FilterContent } from './filter-content'
import {
  getTotalSelectedCount,
  createEmptyFilters,
} from './utils'
import {
  getCategorySlugsById,
  getBrandSlugsById,
  getStoreSlugsById,
  getTagSlugsById,
} from '@/lib/filter-mappers'

const sortOptions = [
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'date_new', label: 'Newest First' },
  { value: 'date_old', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
]

interface MobileBottomActionBarProps {
  categories: CategoryNode[]
  brands: FilterOption[]
  stores: FilterOption[]
  tags: TagEntity[]
  initialSelectedFilters: SelectedFilters
}

/**
 * Mobile Bottom Action Bar
 * Fixed bottom bar with Filters and Sort By buttons
 * Each button opens a respective bottom drawer
 * Only visible on mobile (hidden on desktop with md:hidden)
 */
export function MobileBottomActionBar({
  categories,
  brands,
  stores,
  tags,
  initialSelectedFilters,
}: MobileBottomActionBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Drawer states
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false)

  // Local state for temporary filter selections (before Apply)
  const [localFilters, setLocalFilters] = useState<SelectedFilters>(
    initialSelectedFilters
  )

  // Calculate active filter count
  const activeCount = useMemo(
    () => getTotalSelectedCount(localFilters),
    [localFilters]
  )

  // Get current sort value from URL or use default
  const currentSort = searchParams.get('sortBy') || 'date_new'

  // Handle Filter Apply - update URL and close drawer
  const handleApply = () => {
    // Convert IDs to slugs for SEO-friendly URLs (matching desktop behavior)
    const categorySlugs = getCategorySlugsById(localFilters.categoryIds, categories)
    const brandSlugs = getBrandSlugsById(localFilters.brandIds, brands)
    const storeSlugs = getStoreSlugsById(localFilters.storeIds, stores)
    const tagSlugs = getTagSlugsById(localFilters.tagIds, tags)

    // Build URL params with comma-separated slugs
    const params = new URLSearchParams()

    if (categorySlugs.length > 0) {
      params.set('category', categorySlugs.join(','))
    }
    if (brandSlugs.length > 0) {
      params.set('brand', brandSlugs.join(','))
    }
    if (storeSlugs.length > 0) {
      params.set('store', storeSlugs.join(','))
    }
    if (tagSlugs.length > 0) {
      params.set('tag', tagSlugs.join(','))
    }

    // Add scalar filter params
    if (localFilters.minDiscount !== undefined) {
      params.append('minDiscount', localFilters.minDiscount.toString())
    }
    if (localFilters.maxDiscount !== undefined) {
      params.append('maxDiscount', localFilters.maxDiscount.toString())
    }
    if (localFilters.sortBy) {
      params.append('sortBy', localFilters.sortBy)
    }

    // Build final URL
    const query = params.toString()
    const url = query ? `${pathname}?${query}` : pathname

    // Navigate to new URL
    startTransition(() => {
      router.push(url)
    })

    // Close the filter drawer
    setIsFilterDrawerOpen(false)
  }

  // Handle Filter Clear - reset all filters
  const handleClear = () => {
    const emptyFilters = createEmptyFilters()
    setLocalFilters(emptyFilters)
  }

  // Handle Sort Change - update URL and close drawer
  const handleSortChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set('sortBy', value)
    const query = current.toString() ? `?${current.toString()}` : ''

    startTransition(() => {
      router.push(`${pathname}${query}`)
    })

    // Close the sort drawer
    setIsSortDrawerOpen(false)
  }

  // Sync local filters when URL params change
  React.useEffect(() => {
    setLocalFilters(initialSelectedFilters)
  }, [initialSelectedFilters])

  return (
    <>
      {/* Fixed Bottom Bar - Only on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden border-t bg-background shadow-lg">
        <div className="grid grid-cols-2 gap-2 p-3 pb-safe">
          {/* Filters Button */}
          <Button
            variant="outline"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeCount > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>

          {/* Sort By Button */}
          <Button
            variant="outline"
            onClick={() => setIsSortDrawerOpen(true)}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort By
          </Button>
        </div>
      </div>

      {/* Filter Drawer */}
      <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
        <DrawerContent className="max-h-[85vh] overflow-hidden flex flex-col p-0">
          <DrawerHeader className="border-b px-4 py-4 flex-shrink-0">
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <FilterContent
            categories={categories}
            brands={brands}
            stores={stores}
            tags={tags}
            localFilters={localFilters}
            onLocalFiltersChange={setLocalFilters}
            onApply={handleApply}
            onClear={handleClear}
            isPending={isPending}
          />
        </DrawerContent>
      </Drawer>

      {/* Sort Drawer */}
      <Drawer open={isSortDrawerOpen} onOpenChange={setIsSortDrawerOpen}>
        <DrawerContent>
          <DrawerTitle className="text-center py-4">
            Sort By
          </DrawerTitle>
          <div className="px-4 pb-8 space-y-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                  currentSort === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                <span>{option.label}</span>
                {currentSort === option.value && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
