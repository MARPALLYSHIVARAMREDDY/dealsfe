'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import { ChevronDown, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

import type { DropdownCheckboxFilterProps } from './types'
import { filterOptions, toggleSelection } from './utils'

export function DropdownCheckboxFilter({
  label,
  options,
  selectedIds,
  onSelectionChange,
  searchable = true,
  placeholder,
  icon,
  maxHeight = '300px',
  className,
}: DropdownCheckboxFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Filter options based on search query
  const filteredOptions = useMemo(
    () => filterOptions(options, searchQuery),
    [options, searchQuery]
  )

  // Handle checkbox toggle
  const handleToggle = (id: string) => {
    const newSelection = toggleSelection(selectedIds, id)
    onSelectionChange(newSelection)
  }

  // Clear search when dropdown closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setSearchQuery('')
    }
  }

  const selectedCount = selectedIds.length

  return (
    <div className={cn('w-full', className)}>
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            aria-label={`${label} filter`}
          >
            <span className="flex items-center gap-2">
              {icon}
              {label}
              {selectedCount > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {selectedCount}
                </span>
              )}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="start">
          {searchable && (
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={placeholder || `Search ${label.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                  autoFocus
                />
              </div>
            </div>
          )}
          <div
            className="overflow-y-auto"
            style={{ maxHeight }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.id}
                  checked={selectedIds.includes(option.id)}
                  onCheckedChange={() => handleToggle(option.id)}
                >
                  {option.name}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
