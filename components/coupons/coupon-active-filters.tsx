'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CouponActiveFiltersProps {
  search?: string
  category?: string
  store?: string
  tags?: string[]
  minDiscount?: number
  maxDiscount?: number
}

export default function CouponActiveFilters({
  search,
  category,
  store,
  tags,
  minDiscount,
  maxDiscount,
}: CouponActiveFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const hasActiveFilters =
    (search && search !== '') ||
    (category && category !== 'All') ||
    (store && store !== 'All') ||
    (tags && tags.length > 0) ||
    minDiscount !== undefined ||
    maxDiscount !== undefined

  if (!hasActiveFilters) return null

  const clearFilter = (filterKey: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(filterKey)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const clearAllFilters = () => {
    // Keep only the sortBy param
    const params = new URLSearchParams()
    const sortBy = searchParams.get('sortBy')
    if (sortBy) params.set('sortBy', sortBy)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-sm text-muted-foreground font-medium">
        Active Filters:
      </span>

      {search && (
        <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
          <span>Search: {search}</span>
          <button
            onClick={() => clearFilter('search')}
            className="hover:bg-primary/20 rounded p-0.5 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {category && category !== 'All' && (
        <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
          <span>Category: {category}</span>
          <button
            onClick={() => clearFilter('category')}
            className="hover:bg-primary/20 rounded p-0.5 transition-colors"
            aria-label="Clear category"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {store && store !== 'All' && (
        <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
          <span>Store: {store}</span>
          <button
            onClick={() => clearFilter('store')}
            className="hover:bg-primary/20 rounded p-0.5 transition-colors"
            aria-label="Clear store"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {tags && tags.length > 0 && tags.map((tag) => (
        <div key={tag} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
          <span>Tag: {tag}</span>
          <button
            onClick={() => clearFilter('tags')}
            className="hover:bg-primary/20 rounded p-0.5 transition-colors"
            aria-label={`Clear tag ${tag}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      {(minDiscount !== undefined || maxDiscount !== undefined) && (
        <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
          <span>
            Discount: {minDiscount || 0}% - {maxDiscount || 100}%
          </span>
          <button
            onClick={() => {
              clearFilter('minDiscount')
              clearFilter('maxDiscount')
            }}
            className="hover:bg-primary/20 rounded p-0.5 transition-colors"
            aria-label="Clear discount range"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={clearAllFilters}
        className="text-xs h-auto py-1"
      >
        Clear All
      </Button>
    </div>
  )
}
