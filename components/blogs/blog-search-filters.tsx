'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface BlogSearchFiltersProps {
  initialSearch?: string
  initialCategory?: string
  categories: string[]
}

export const BlogSearchFilters = ({
  initialSearch = '',
  initialCategory = 'All',
  categories,
}: BlogSearchFiltersProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL({ search: searchQuery, category: selectedCategory })
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateURL = useCallback(
    (updates: { search?: string; category?: string }) => {
      const params = new URLSearchParams(searchParams.toString())

      // Update search param
      if (updates.search !== undefined) {
        if (updates.search) {
          params.set('search', updates.search)
        } else {
          params.delete('search')
        }
      }

      // Update category param
      const category = updates.category || selectedCategory
      if (category && category !== 'All') {
        params.set('category', category)
      } else {
        params.delete('category')
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams, selectedCategory]
  )

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    updateURL({ search: searchQuery, category })
  }

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`
              px-4 py-2 rounded-full
              text-sm font-medium
              whitespace-nowrap
              transition-all duration-200
              ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default BlogSearchFilters
