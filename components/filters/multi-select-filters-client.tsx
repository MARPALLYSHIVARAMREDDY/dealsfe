'use client'

import * as React from 'react'
import { useState, useTransition, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Filter } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
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

/**
 * Main MultiSelectFilters component with responsive behavior
 */
export function MultiSelectFiltersClient({
  categories,
  brands,
  stores,
  tags,
  initialSelectedFilters,
  onFiltersChange,
  onApply: onApplyProp,
  onClear: onClearProp,
  className,
}: MultiSelectFiltersClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  // Local state for temporary filter selections (before Apply)
  const [localFilters, setLocalFilters] = useState<SelectedFilters>(
    initialSelectedFilters
  )

  // Track if sheet/drawer is open
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Calculate active filter count
  const activeCount = useMemo(
    () => getTotalSelectedCount(localFilters),
    [localFilters]
  )

  // Handle Apply - update URL and notify parent
  const handleApply = () => {
    const url = buildFilterUrl(pathname, localFilters)
    startTransition(() => {
      router.push(url)
    })

    onApplyProp?.(localFilters)
    onFiltersChange?.(localFilters)

    // Close the sheet/drawer
    setIsSheetOpen(false)
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
    <div className={cn('', className)}>
      {/* Desktop - Sheet (Right Sidebar) */}
      <div className="hidden lg:block">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="default">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeCount > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[450px] p-0">
            <SheetHeader className="border-b px-4 py-4">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
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
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile - Drawer (Bottom) */}
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
    </div>
  )
}
