'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

import type { FilterOption } from './types'
import { filterOptions, toggleSelection } from './utils'

export interface ListCheckboxFilterProps {
  options: FilterOption[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  searchable?: boolean
  placeholder?: string
  maxHeight?: string
  className?: string
  initialDisplayCount?: number
}

export function ListCheckboxFilter({
  options,
  selectedIds,
  onSelectionChange,
  searchable = true,
  placeholder = 'Search...',
  maxHeight = '300px',
  className,
  initialDisplayCount = 5,
}: ListCheckboxFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter options based on search query
  const filteredOptions = useMemo(
    () => filterOptions(options, searchQuery),
    [options, searchQuery]
  )

  // Determine which options to display
  const displayedOptions = useMemo(() => {
    // If searching, show all filtered results
    if (searchQuery.trim()) {
      return filteredOptions
    }
    // Otherwise, show only the first N items
    return filteredOptions.slice(0, initialDisplayCount)
  }, [filteredOptions, searchQuery, initialDisplayCount])

  // Handle checkbox toggle
  const handleToggle = (id: string) => {
    const newSelection = toggleSelection(selectedIds, id)
    onSelectionChange(newSelection)
  }

  return (
    <div className={cn('w-full', className)}>
      {searchable && (
        <div className="mb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
      )}

      <div className="pr-2">
        {displayedOptions.length > 0 ? (
          <div className="space-y-2">
            {displayedOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center gap-2 py-1.5 hover:bg-muted/50 rounded-md transition-colors"
              >
                <Checkbox
                  id={`filter-${option.id}`}
                  checked={selectedIds.includes(option.id)}
                  onCheckedChange={() => handleToggle(option.id)}
                  className="flex-shrink-0"
                />
                <label
                  htmlFor={`filter-${option.id}`}
                  className="flex-1 cursor-pointer text-sm select-none"
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No results found
          </div>
        )}
      </div>
    </div>
  )
}
