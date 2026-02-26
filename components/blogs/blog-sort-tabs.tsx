'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { SortOption } from '@/lib/blogs-filter-utils'

interface BlogSortTabsProps {
  value: SortOption
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'trending', label: 'Trending' },
  { value: 'most-read', label: 'Most Read' },
]

export const BlogSortTabs = ({ value }: BlogSortTabsProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSortChange = (sortBy: SortOption) => {
    const params = new URLSearchParams(searchParams.toString())

    if (sortBy !== 'latest') {
      params.set('sortBy', sortBy)
    } else {
      params.delete('sortBy') // Default is latest, so remove param
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="border-b border-border">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={`
              px-4 py-2.5
              text-sm font-medium
              whitespace-nowrap
              transition-all duration-200
              border-b-2
              ${
                value === option.value
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default BlogSortTabs
