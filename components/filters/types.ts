// ============================================
// Data Models
// ============================================

/**
 * Hierarchical category node
 * Supports recursive nesting (parent → children → grandchildren)
 */
export interface CategoryNode {
  id: string
  name: string
  description?: string
  slug?: string
  subcategories?: CategoryNode[] // Recursive structure
  children?: CategoryNode[] // Alternative naming from API
  // For internal use
  _matchesSearch?: boolean // Search highlighting flag
  _expanded?: boolean // Expanded state tracking
}

/**
 * Flat filter option (for brands, stores, tags)
 */
export interface FilterOption {
  id: string
  name: string
  slug?: string
  country?: string
  isActive?: boolean
  [key: string]: any // Allow additional API fields
}

/**
 * Tag entity (from breadcrumb-server-only.ts)
 */
export interface TagEntity {
  id: string
  name: string
  slug: string
  country: string
  isActive: boolean
}

// ============================================
// Filter State
// ============================================

/**
 * Selected filters state
 * All arrays support multiple selections
 */
export interface SelectedFilters {
  categoryIds: string[]
  brandIds: string[]
  storeIds: string[]
  tagIds: string[]

  // Additional filters
  minDiscount?: number
  maxDiscount?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}

/**
 * URL-friendly filter params
 */
export interface FilterSearchParams {
  category?: string | string[]
  brand?: string | string[]
  store?: string | string[]
  tag?: string | string[]
}

// ============================================
// Component Props
// ============================================

/**
 * Main filters component props (server wrapper)
 */
export interface MultiSelectFiltersServerProps {
  searchParams: Record<string, string | string[] | undefined>
  locale?: string
}

/**
 * Main filters component props (client)
 */
export interface MultiSelectFiltersClientProps {
  categories: CategoryNode[]
  brands: FilterOption[]
  stores: FilterOption[]
  tags: TagEntity[]
  initialSelectedFilters: SelectedFilters
  onFiltersChange?: (filters: SelectedFilters) => void
  onApply?: (filters: SelectedFilters) => void
  onClear?: () => void
  className?: string
}

/**
 * Category tree filter props
 */
export interface CategoryTreeFilterProps {
  categories: CategoryNode[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  searchable?: boolean
  defaultExpanded?: boolean
  maxHeight?: string
  className?: string
}

/**
 * Dropdown checkbox filter props
 */
export interface DropdownCheckboxFilterProps {
  label: string
  options: FilterOption[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  searchable?: boolean
  placeholder?: string
  icon?: React.ReactNode
  maxHeight?: string
  className?: string
}

/**
 * Tree node props (internal, recursive)
 */
export interface TreeNodeProps {
  node: CategoryNode
  level: number
  isSelected: boolean
  isExpanded: boolean
  onToggle: (id: string) => void
  onExpandToggle: (id: string) => void
  searchQuery: string
  matchesSearch: boolean
}

/**
 * Filter badge list props
 */
export interface FilterBadgeListProps {
  selectedFilters: SelectedFilters
  categories: CategoryNode[]
  brands: FilterOption[]
  stores: FilterOption[]
  tags: TagEntity[]
  onRemove: (type: keyof SelectedFilters, id: string) => void
  onClearAll: () => void
  className?: string
}

// ============================================
// Utility Types
// ============================================

export type FilterType = 'category' | 'brand' | 'store' | 'tag'

export interface FilterChangeEvent {
  type: FilterType
  id: string
  action: 'add' | 'remove'
}
