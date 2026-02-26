// Main components
export { MultiSelectFiltersClient } from './multi-select-filters-client'
export {
  MultiSelectFiltersServer,
  MultiSelectFiltersServerWithSuspense,
} from './multi-select-filters-server'

// Sidebar layout components
export { MultiSelectFiltersSidebar } from './multi-select-filters-sidebar'
export {
  MultiSelectFiltersSidebarServer,
  MultiSelectFiltersSidebarServerWithSuspense,
} from './multi-select-filters-sidebar-server'

// Active filters bar
export { ActiveFiltersBar } from './active-filters-bar'
export { ActiveFiltersBarServer } from './active-filters-bar-server'

// Mobile bottom action bar
export { MobileBottomActionBar } from './mobile-bottom-action-bar'
export { MobileBottomActionBarServer } from './mobile-bottom-action-bar-server'

// Shared filter content
export { FilterContent } from './filter-content'
export type { FilterContentProps } from './filter-content'

// Individual filter components (for advanced usage)
export { CategoryTreeFilter } from './category-tree-filter'
export { DropdownCheckboxFilter } from './dropdown-checkbox-filter'
export { DiscountRangeFilter } from './discount-range-filter'
export { FilterBadgeList } from './filter-badge-list'

// Types
export type {
  CategoryNode,
  FilterOption,
  TagEntity,
  SelectedFilters,
  FilterSearchParams,
  MultiSelectFiltersServerProps,
  MultiSelectFiltersClientProps,
  CategoryTreeFilterProps,
  DropdownCheckboxFilterProps,
  FilterBadgeListProps,
  FilterType,
} from './types'

// Utilities
export {
  toggleSelection,
  parseSearchParams,
  buildFilterUrl,
  flattenCategoryTree,
  findCategoryById,
  filterTree,
  filterOptions,
  getTotalSelectedCount,
  hasActiveFilters,
  createEmptyFilters,
} from './utils'
