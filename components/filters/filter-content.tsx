'use client'

import { cn } from '@/lib/utils'

import type { MultiSelectFiltersClientProps, SelectedFilters } from './types'
import { CategoryTreeFilter } from './category-tree-filter'
import { ListCheckboxFilter } from './list-checkbox-filter'
import { DiscountRangeFilter } from './discount-range-filter'
import { getTotalSelectedCount } from './utils'

/**
 * Shared filter content component
 * Used in both desktop sidebar and mobile drawer
 */
export interface FilterContentProps {
  categories: MultiSelectFiltersClientProps['categories']
  brands: MultiSelectFiltersClientProps['brands']
  stores: MultiSelectFiltersClientProps['stores']
  tags: MultiSelectFiltersClientProps['tags']
  localFilters: SelectedFilters
  onLocalFiltersChange: (filters: SelectedFilters) => void
  onApply: () => void
  onClear: () => void
  isPending: boolean
  showActions?: boolean // Optional: hide apply/clear buttons in sidebar
}

export function FilterContent({
  categories,
  brands,
  stores,
  tags,
  localFilters,
  onLocalFiltersChange,
  onApply,
  onClear,
  isPending,
  showActions = true,
}: FilterContentProps) {
  const activeCount = getTotalSelectedCount(localFilters)

  // Handle category selection change
  const handleCategoryChange = (categoryIds: string[]) => {
    onLocalFiltersChange({ ...localFilters, categoryIds })
  }

  // Handle brand selection change
  const handleBrandChange = (brandIds: string[]) => {
    onLocalFiltersChange({ ...localFilters, brandIds })
  }

  // Handle store selection change
  const handleStoreChange = (storeIds: string[]) => {
    onLocalFiltersChange({ ...localFilters, storeIds })
  }

  // Handle tag selection change
  const handleTagChange = (tagIds: string[]) => {
    onLocalFiltersChange({ ...localFilters, tagIds })
  }

  // Handle discount range change
  const handleDiscountChange = (min: number | undefined, max: number | undefined) => {
    onLocalFiltersChange({ ...localFilters, minDiscount: min, maxDiscount: max })
  }

  return (
    <div className="flex flex-col">
      {/* Action Links - At Top */}
      {showActions && (
        <div className="sticky top-0 z-10 flex-shrink-0 flex justify-between items-center px-4 py-3 bg-background border-b">
          <button
            onClick={onClear}
            disabled={isPending || activeCount === 0}
            className={cn(
              "text-sm font-medium transition-colors",
              isPending || activeCount === 0
                ? "text-muted-foreground cursor-not-allowed"
                : "text-destructive hover:text-destructive/80 cursor-pointer"
            )}
          >
            Clear
          </button>
          <button
            onClick={onApply}
            disabled={isPending}
            className={cn(
              "text-sm font-medium transition-colors",
              isPending
                ? "text-muted-foreground cursor-not-allowed"
                : "text-primary hover:text-primary/80 cursor-pointer"
            )}
          >
            {isPending
              ? 'Applying...'
              : `Apply ${activeCount > 0 ? `(${activeCount})` : ''}`}
          </button>
        </div>
      )}

      {/* Filter Sections - Scrollable Content */}
      <div className="p-4 pt-2 pb-8">
        <div className="space-y-6">
          {/* Categories Section */}
          <div className="space-y-3 ">
            <h3 className="text-sm font-semibold">
              Categories ({localFilters.categoryIds.length} / {categories.length})
            </h3>
            <CategoryTreeFilter
              categories={categories}
              selectedIds={localFilters.categoryIds}
              onSelectionChange={handleCategoryChange}
              searchable
              maxHeight="300px"
            />
          </div>

          {/* Brands Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              Brands ({localFilters.brandIds.length} / {brands.length})
            </h3>
            <ListCheckboxFilter
              options={brands}
              selectedIds={localFilters.brandIds}
              onSelectionChange={handleBrandChange}
              searchable
              placeholder="Search brands..."
            />
          </div>

          {/* Stores Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              Stores ({localFilters.storeIds.length} / {stores.length})
            </h3>
            <ListCheckboxFilter
              options={stores}
              selectedIds={localFilters.storeIds}
              onSelectionChange={handleStoreChange}
              searchable
              placeholder="Search stores..."
            />
          </div>

          {/* Tags Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              Tags ({localFilters.tagIds.length} / {tags.length})
            </h3>
            <ListCheckboxFilter
              options={tags}
              selectedIds={localFilters.tagIds}
              onSelectionChange={handleTagChange}
              searchable
              placeholder="Search tags..."
            />
          </div>

          {/* Discount Range Section */}
          <div className="space-y-3">
            <DiscountRangeFilter
              minDiscount={localFilters.minDiscount}
              maxDiscount={localFilters.maxDiscount}
              onChange={handleDiscountChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
