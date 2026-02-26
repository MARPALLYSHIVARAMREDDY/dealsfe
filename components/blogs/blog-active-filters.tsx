'use client'

import { useRouter, usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface BlogActiveFiltersProps {
  search?: string
  category?: string
}

export const BlogActiveFilters = ({ search, category }: BlogActiveFiltersProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const hasActiveFilters = Boolean(search || (category && category !== 'All'))

  const clearSearch = () => {
    const params = new URLSearchParams(window.location.search)
    params.delete('search')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const clearCategory = () => {
    const params = new URLSearchParams(window.location.search)
    params.delete('category')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const clearAll = () => {
    router.push(pathname, { scroll: false })
  }

  if (!hasActiveFilters) return null

  return (
    <div className="flex items-center gap-2 flex-wrap pt-3">
      <span className="text-sm text-muted-foreground">Active filters:</span>

      {search && (
        <Badge variant="secondary" className="gap-1.5">
          Search: "{search}"
          <button
            onClick={clearSearch}
            className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {category && category !== 'All' && (
        <Badge variant="secondary" className="gap-1.5">
          {category}
          <button
            onClick={clearCategory}
            className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
            aria-label={`Clear ${category} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs">
        Clear all
      </Button>
    </div>
  )
}

export default BlogActiveFilters
