'use client'

import * as React from 'react'
import { useState, useMemo, useCallback } from 'react'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

import type { CategoryNode, CategoryTreeFilterProps } from './types'
import { filterTree, toggleSelection } from './utils'

/**
 * Internal TreeNode component (recursive)
 */
interface TreeNodeProps {
  node: CategoryNode
  level: number
  isSelected: boolean
  isExpanded: boolean
  onToggle: (id: string) => void
  onExpandToggle: (id: string) => void
  searchQuery: string
}

const TreeNode = React.memo(
  ({
    node,
    level,
    isSelected,
    isExpanded,
    onToggle,
    onExpandToggle,
    searchQuery,
  }: TreeNodeProps) => {
    const children = node.subcategories || node.children || []
    const hasChildren = children.length > 0
    const matchesSearch = node._matchesSearch || false

    return (
      <div>
        <div
          className="flex items-center gap-2 py-2 hover:bg-muted/50 rounded-md transition-colors"
          style={{ paddingLeft: `${level * 20}px` }}
        >
          {/* Expand/Collapse button */}
          {hasChildren ? (
            <button
              type="button"
              onClick={() => onExpandToggle(node.id)}
              className="flex-shrink-0 p-0.5 hover:bg-accent rounded"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <div className="w-5" /> // Spacer for alignment
          )}

          {/* Checkbox */}
          <Checkbox
            id={`category-${node.id}`}
            checked={isSelected}
            onCheckedChange={() => onToggle(node.id)}
            className="flex-shrink-0"
          />

          {/* Label */}
          <label
            htmlFor={`category-${node.id}`}
            className={cn(
              'flex-1 cursor-pointer text-sm select-none',
              matchesSearch && searchQuery && 'font-semibold text-primary'
            )}
          >
            {node.name}
          </label>
        </div>

        {/* Recursively render children if expanded */}
        {isExpanded && hasChildren && (
          <div>
            {children.map((child) => (
              <TreeNodeWrapper
                key={child.id}
                node={child}
                level={level + 1}
                onToggle={onToggle}
                onExpandToggle={onExpandToggle}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)

TreeNode.displayName = 'TreeNode'

/**
 * Wrapper component to connect TreeNode to parent state
 */
interface TreeNodeWrapperProps {
  node: CategoryNode
  level: number
  onToggle: (id: string) => void
  onExpandToggle: (id: string) => void
  searchQuery: string
}

function TreeNodeWrapper({
  node,
  level,
  onToggle,
  onExpandToggle,
  searchQuery,
}: TreeNodeWrapperProps) {
  // Get states from parent context
  const { selectedIds, expandedIds } = useCategoryTreeContext()

  return (
    <TreeNode
      node={node}
      level={level}
      isSelected={selectedIds.includes(node.id)}
      isExpanded={expandedIds.has(node.id)}
      onToggle={onToggle}
      onExpandToggle={onExpandToggle}
      searchQuery={searchQuery}
    />
  )
}

/**
 * Context for sharing state across tree nodes
 */
interface CategoryTreeContextValue {
  selectedIds: string[]
  expandedIds: Set<string>
}

const CategoryTreeContext = React.createContext<
  CategoryTreeContextValue | undefined
>(undefined)

function useCategoryTreeContext() {
  const context = React.useContext(CategoryTreeContext)
  if (!context) {
    throw new Error(
      'useCategoryTreeContext must be used within CategoryTreeFilter'
    )
  }
  return context
}

/**
 * Main CategoryTreeFilter component
 */
export function CategoryTreeFilter({
  categories,
  selectedIds,
  onSelectionChange,
  searchable = true,
  defaultExpanded = false,
  maxHeight = '400px',
  className,
}: CategoryTreeFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(defaultExpanded ? getAllCategoryIds(categories) : [])
  )

  // Filter tree based on search query
  const filteredCategories = useMemo(
    () => filterTree(categories, searchQuery),
    [categories, searchQuery]
  )

  // Auto-expand nodes when searching
  React.useEffect(() => {
    if (searchQuery.trim()) {
      // Expand all nodes when searching to show matches
      const allIds = getAllCategoryIds(filteredCategories)
      setExpandedIds(new Set(allIds))
    }
  }, [searchQuery, filteredCategories])

  // Handle checkbox toggle
  const handleToggle = useCallback(
    (id: string) => {
      const newSelection = toggleSelection(selectedIds, id)
      onSelectionChange(newSelection)
    },
    [selectedIds, onSelectionChange]
  )

  // Handle expand/collapse toggle
  const handleExpandToggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const contextValue: CategoryTreeContextValue = {
    selectedIds,
    expandedIds,
  }

  return (
    <div className={cn('w-full', className)}>
      {searchable && (
        <div className="mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      )}

      <CategoryTreeContext.Provider value={contextValue}>
        <div className="pr-2">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <TreeNodeWrapper
                key={category.id}
                node={category}
                level={0}
                onToggle={handleToggle}
                onExpandToggle={handleExpandToggle}
                searchQuery={searchQuery}
              />
            ))
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No categories found
            </div>
          )}
        </div>
      </CategoryTreeContext.Provider>
    </div>
  )
}

/**
 * Helper: Get all category IDs from tree (for expand all)
 */
function getAllCategoryIds(nodes: CategoryNode[]): string[] {
  const ids: string[] = []

  function traverse(node: CategoryNode) {
    ids.push(node.id)
    const children = node.subcategories || node.children || []
    children.forEach(traverse)
  }

  nodes.forEach(traverse)
  return ids
}
