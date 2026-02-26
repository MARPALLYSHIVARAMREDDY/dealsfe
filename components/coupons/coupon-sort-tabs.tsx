'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { TrendingUp, ArrowDownNarrowWide, Clock, Sparkles } from 'lucide-react'
import type { SortOption } from '@/lib/coupons-filter-utils'

interface CouponSortTabsProps {
  value?: SortOption
}

export default function CouponSortTabs({
  value = 'trending',
}: CouponSortTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSortChange = (sortBy: SortOption) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', sortBy)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const tabs: Array<{ value: SortOption; label: string; icon: React.ReactNode }> = [
    { value: 'trending', label: 'Trending', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'highest-discount', label: 'Highest Discount', icon: <ArrowDownNarrowWide className="h-4 w-4" /> },
    { value: 'expiring-soon', label: 'Expiring Soon', icon: <Clock className="h-4 w-4" /> },
    { value: 'newest', label: 'Newest', icon: <Sparkles className="h-4 w-4" /> },
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleSortChange(tab.value)}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2
            ${
              value === tab.value
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }
          `}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
