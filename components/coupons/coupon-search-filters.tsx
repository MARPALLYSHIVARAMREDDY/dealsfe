'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface CouponSearchFiltersProps {
  initialSearch?: string
  initialCategory?: string
  categories: string[]
}

export default function CouponSearchFilters({
  initialSearch = '',
  initialCategory = 'All',
  categories,
}: CouponSearchFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  // Debounced search update (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL({ search: searchQuery, category: selectedCategory })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const updateURL = useCallback(
    (updates: { search?: string; category?: string }) => {
      const params = new URLSearchParams(searchParams.toString())

      if (updates.search !== undefined) {
        if (updates.search) {
          params.set('search', updates.search)
        } else {
          params.delete('search')
        }
      }

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
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search coupons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Chips - Horizontal Scroll on Mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
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
