'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const sortOptions = [
  { value: 'price_low_to_high', label: 'Price: Low to High' },
  { value: 'price_high_to_low', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'highest_discount', label: 'By Discount' },
  { value: 'most_popular', label: 'Most Popular' },
]


interface SortByProps {
  className?: string
  defaultValue?: string
  hideMobileButton?: boolean
}

export default function SortBy({
  className,
  defaultValue = 'date_new',
  hideMobileButton = false
}: SortByProps) {
  // URL parameter handling
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Mobile drawer state
  const [isOpen, setIsOpen] = useState(false)

  // Get current sort value from URL or use default
  const currentSort = searchParams.get('sortBy') || defaultValue

  // Update URL with new sort value
  const handleSortChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set('sortBy', value)
    const query = current.toString() ? `?${current.toString()}` : ''

    startTransition(() => {
      router.push(`${pathname}${query}`)
    })

    // Close mobile drawer after selection
    setIsOpen(false)
  }

  return (
    <>
      {/* Desktop Select - hidden on mobile */}
      <div className="hidden md:block">
        <Select
          value={currentSort}
          onValueChange={handleSortChange}
          disabled={isPending}
        >
          <SelectTrigger className={cn("w-[200px]", className)}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Button + Drawer - hidden on desktop */}
      {!hideMobileButton && (
        <div className="md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(true)}
            disabled={isPending}
            className={className}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>

          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent>
              <DrawerTitle className="text-center py-4">
                Sort By
              </DrawerTitle>
              <div className="px-4 pb-8 space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                      currentSort === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <span>{option.label}</span>
                    {currentSort === option.value && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </>
  )
}
