'use client'

import * as React from 'react'
import { useMemo } from 'react'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { SelectedFilters, CategoryNode, FilterOption, TagEntity } from './types'
import { flattenCategoryTree, hasActiveFilters } from './utils'

export interface ActiveFiltersBarProps {
  selectedFilters: SelectedFilters
  categories: CategoryNode[]
  brands: FilterOption[]
  stores: FilterOption[]
  tags: TagEntity[]
  onRemove?: (type: keyof SelectedFilters, id: string) => void
  onClearAll?: () => void
  className?: string
}

/**
 * Active Filters Bar
 * Displays selected filters as badges above the products list
 * Shows on both desktop and mobile
 */
export function ActiveFiltersBar({
  selectedFilters,
  categories,
  brands,
  stores,
  tags,
  onRemove,
  onClearAll,
  className,
}: ActiveFiltersBarProps) {
  // Create lookup maps for quick ID -> name resolution
  const categoryMap = useMemo(
    () => flattenCategoryTree(categories),
    [categories]
  )

  const brandMap = useMemo(
    () => new Map(brands.map((b) => [b.id, b])),
    [brands]
  )

  const storeMap = useMemo(
    () => new Map(stores.map((s) => [s.id, s])),
    [stores]
  )

  const tagMap = useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags])

  const hasFilters = hasActiveFilters(selectedFilters)

  if (!hasFilters) {
    return null
  }

  return (
    <div className={cn('mb-4', className)}>
      <div className="flex items-center gap-2 flex-wrap py-3 px-4 bg-muted/30 rounded-lg">
        <span className="text-sm font-medium text-muted-foreground">
          Active filters:
        </span>

        {/* Category Badges */}
        {selectedFilters.categoryIds.map((id) => {
          const category = categoryMap.get(id)
          if (!category) return null

          return (
            <FilterBadge
              key={`category-${id}`}
              label={category.name}
              onRemove={onRemove ? () => onRemove('categoryIds', id) : undefined}
            />
          )
        })}

        {/* Brand Badges */}
        {selectedFilters.brandIds.map((id) => {
          const brand = brandMap.get(id)
          if (!brand) return null

          return (
            <FilterBadge
              key={`brand-${id}`}
              label={brand.name}
              onRemove={onRemove ? () => onRemove('brandIds', id) : undefined}
            />
          )
        })}

        {/* Store Badges */}
        {selectedFilters.storeIds.map((id) => {
          const store = storeMap.get(id)
          if (!store) return null

          return (
            <FilterBadge
              key={`store-${id}`}
              label={store.name}
              onRemove={onRemove ? () => onRemove('storeIds', id) : undefined}
            />
          )
        })}

        {/* Tag Badges */}
        {selectedFilters.tagIds.map((id) => {
          const tag = tagMap.get(id)
          if (!tag) return null

          return (
            <FilterBadge
              key={`tag-${id}`}
              label={tag.name}
              onRemove={onRemove ? () => onRemove('tagIds', id) : undefined}
            />
          )
        })}

        {/* Clear All Button */}
        {onClearAll && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClearAll}
            className="h-7 text-xs ml-auto"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Individual filter badge with remove button
 */
interface FilterBadgeProps {
  label: string
  onRemove?: () => void
}

function FilterBadge({ label, onRemove }: FilterBadgeProps) {
  return (
    <Badge variant="secondary" className="gap-1.5 pr-1 pl-2.5 py-1 text-xs">
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full hover:bg-accent p-0.5 transition-colors"
          aria-label={`Remove ${label} filter`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  )
}
