'use client'

import * as React from 'react'
import { useMemo } from 'react'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { FilterBadgeListProps, CategoryNode, FilterOption } from './types'
import { flattenCategoryTree, hasActiveFilters } from './utils'

export function FilterBadgeList({
  selectedFilters,
  categories,
  brands,
  stores,
  tags,
  onRemove,
  onClearAll,
  className,
}: FilterBadgeListProps) {
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
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">
          Active Filters
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-auto py-1 px-2 text-xs"
        >
          Clear All
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Category Badges */}
        {selectedFilters.categoryIds.map((id) => {
          const category = categoryMap.get(id)
          if (!category) return null

          return (
            <FilterBadge
              key={`category-${id}`}
              label={category.name}
              onRemove={() => onRemove('categoryIds', id)}
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
              onRemove={() => onRemove('brandIds', id)}
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
              onRemove={() => onRemove('storeIds', id)}
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
              onRemove={() => onRemove('tagIds', id)}
            />
          )
        })}
      </div>
    </div>
  )
}

/**
 * Individual filter badge with remove button
 */
interface FilterBadgeProps {
  label: string
  onRemove: () => void
}

function FilterBadge({ label, onRemove }: FilterBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className="gap-1.5 pr-1 pl-2.5 py-1 text-xs"
    >
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full hover:bg-accent p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
}
