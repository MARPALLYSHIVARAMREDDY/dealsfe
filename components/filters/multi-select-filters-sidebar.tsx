'use client'

import * as React from 'react'
import { useState, useTransition, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Filter } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import type { MultiSelectFiltersClientProps, SelectedFilters } from './types'
import { FilterContent } from './filter-content'
import {
  buildFilterUrl,
  getTotalSelectedCount,
  createEmptyFilters,
} from './utils'
import {
  getCategorySlugsById,
  getBrandSlugsById,
  getStoreSlugsById,
  getTagSlugsById,
} from '@/lib/filter-mappers'

/**
 * Multi-Select Filters Sidebar
 * Desktop: Persistent left sidebar (always visible)
 * Mobile: Drawer with button (opens from bottom)
 */
export function MultiSelectFiltersSidebar({
  categories,
  brands,
  stores,
  tags,
  initialSelectedFilters,
  onFiltersChange,
  onApply: onApplyProp,
  onClear: onClearProp,
  className,
  hideMobileButton = false,
}: Omit<MultiSelectFiltersClientProps, 'onFiltersChange' | 'onApply' | 'onClear'> & {
  onFiltersChange?: (filters: SelectedFilters) => void
  onApply?: (filters: SelectedFilters) => void
  onClear?: () => void
  hideMobileButton?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  // Local state for temporary filter selections (before Apply)
  const [localFilters, setLocalFilters] = useState<SelectedFilters>(
    initialSelectedFilters
  )

  // Track if mobile drawer is open
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Calculate active filter count
  const activeCount = useMemo(
    () => getTotalSelectedCount(localFilters),
    [localFilters]
  )

  // Handle Apply - update URL and notify parent
  const handleApply = () => {
    // Convert IDs to slugs for URL (SEO-friendly)
    const categorySlugs = getCategorySlugsById(localFilters.categoryIds, categories)
    const brandSlugs = getBrandSlugsById(localFilters.brandIds, brands)
    const storeSlugs = getStoreSlugsById(localFilters.storeIds, stores)
    const tagSlugs = getTagSlugsById(localFilters.tagIds, tags)

    // Build URL params with slugs (comma-separated format)
    const params = new URLSearchParams()

    // Use comma-separated values instead of repeated parameters
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

    if (localFilters.minDiscount !== undefined) {
      params.append('minDiscount', localFilters.minDiscount.toString())
    }

    if (localFilters.maxDiscount !== undefined) {
      params.append('maxDiscount', localFilters.maxDiscount.toString())
    }

    if (localFilters.sortBy) {
      params.append('sortBy', localFilters.sortBy)
    }

    const query = params.toString()
    const url = query ? `${pathname}?${query}` : pathname

    startTransition(() => {
      router.push(url)
    })

    onApplyProp?.(localFilters)
    onFiltersChange?.(localFilters)

    // Close the drawer on mobile
    setIsDrawerOpen(false)
  }

  // Handle Clear - reset all filters
  const handleClear = () => {
    const emptyFilters = createEmptyFilters()
    setLocalFilters(emptyFilters)
    onClearProp?.()
  }

  // Sync local filters when initial filters change (e.g., from URL)
  React.useEffect(() => {
    setLocalFilters(initialSelectedFilters)
  }, [initialSelectedFilters])

  return (
    <>
      {/* Desktop: Persistent Sidebar */}
      <aside
        className={cn(
          'hidden lg:block w-64 xl:w-72 shrink-0 pt-10',
          className
        )}
      >
        <div className="bg-background">
          
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
        </div>
      </aside>

      {/* Mobile: Drawer with Button */}
      {!hideMobileButton && (
        <div className="lg:hidden">
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="default" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeCount > 0 && (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {activeCount}
                  </span>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh] p-0">
              <DrawerHeader className="border-b px-4 py-4">
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
        </div>
      )}
    </>
  )
}
