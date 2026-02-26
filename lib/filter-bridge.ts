/**
 * Bridge between new multi-select filters and existing filtering logic
 *
 * This module handles the integration between:
 * 1. New multi-select filter system (uses IDs from API)
 * 2. Existing filter system (uses names/slugs)
 */

import type { Deal } from '@/types/alldeals.types'
import type { SelectedFilters } from '@/components/filters'
import type { CategoryNode, FilterOption, TagEntity } from '@/components/filters'

/**
 * Apply multi-select filters to deals
 *
 * This function filters deals based on the new multi-select filter selections.
 * It matches against deal properties (category, store, brand) using name lookups.
 */
export function applyMultiSelectFilters(
  deals: Deal[],
  selectedFilters: SelectedFilters,
  filterData: {
    categories: CategoryNode[]
    brands: FilterOption[]
    stores: FilterOption[]
    tags: TagEntity[]
  }
): Deal[] {
  let filteredDeals = [...deals]

  // Helper: Create ID-to-name mappings
  const categoryMap = createCategoryMap(filterData.categories)
  const brandMap = new Map(filterData.brands.map(b => [b.id, b.name]))
  const storeMap = new Map(filterData.stores.map(s => [s.id, s.name]))

  // Filter by categories (if any selected)
  if (selectedFilters.categoryIds.length > 0) {
    const selectedCategoryNames = selectedFilters.categoryIds
      .map(id => categoryMap.get(id))
      .filter((name): name is string => name !== undefined)
      .map(name => name.toLowerCase())

    filteredDeals = filteredDeals.filter(deal => {
      const dealCategory = deal.category?.toLowerCase()
      const dealSubcategory = deal.subcategory?.toLowerCase()

      // Match if deal's category or subcategory is in selected categories
      return selectedCategoryNames.some(catName =>
        catName === dealCategory || catName === dealSubcategory
      )
    })
  }

  // Filter by brands (if any selected)
  if (selectedFilters.brandIds.length > 0) {
    const selectedBrandNames = selectedFilters.brandIds
      .map(id => brandMap.get(id))
      .filter((name): name is string => name !== undefined)
      .map(name => name.toLowerCase())

    filteredDeals = filteredDeals.filter(deal => {
      const dealBrand = deal.brand?.toLowerCase()
      return dealBrand && selectedBrandNames.includes(dealBrand)
    })
  }

  // Filter by stores (if any selected)
  if (selectedFilters.storeIds.length > 0) {
    const selectedStoreNames = selectedFilters.storeIds
      .map(id => storeMap.get(id))
      .filter((name): name is string => name !== undefined)
      .map(name => name.toLowerCase())

    filteredDeals = filteredDeals.filter(deal => {
      const dealStore = deal.store?.toLowerCase()
      return dealStore && selectedStoreNames.includes(dealStore)
    })
  }

  // Filter by tags (if any selected)
  // Note: Tags might need special handling depending on how they're stored in deals
  if (selectedFilters.tagIds.length > 0) {
    // TODO: Implement tag filtering based on how tags are stored in Deal type
    // For now, this is a placeholder
    console.log('Tag filtering not yet implemented:', selectedFilters.tagIds)
  }

  return filteredDeals
}

/**
 * Create a flat map of category IDs to names (including subcategories)
 */
function createCategoryMap(categories: CategoryNode[]): Map<string, string> {
  const map = new Map<string, string>()

  function traverse(node: CategoryNode) {
    map.set(node.id, node.name)
    const children = node.subcategories || node.children || []
    children.forEach(traverse)
  }

  categories.forEach(traverse)
  return map
}

/**
 * Check if any multi-select filters are active
 */
export function hasMultiSelectFilters(filters: SelectedFilters): boolean {
  return (
    filters.categoryIds.length > 0 ||
    filters.brandIds.length > 0 ||
    filters.storeIds.length > 0 ||
    filters.tagIds.length > 0
  )
}

/**
 * Convert multi-select filters to display-friendly labels
 */
export function getActiveFilterLabels(
  selectedFilters: SelectedFilters,
  filterData: {
    categories: CategoryNode[]
    brands: FilterOption[]
    stores: FilterOption[]
    tags: TagEntity[]
  }
): { type: string; labels: string[] }[] {
  const result: { type: string; labels: string[] }[] = []

  const categoryMap = createCategoryMap(filterData.categories)
  const brandMap = new Map(filterData.brands.map(b => [b.id, b.name]))
  const storeMap = new Map(filterData.stores.map(s => [s.id, s.name]))
  const tagMap = new Map(filterData.tags.map(t => [t.id, t.name]))

  if (selectedFilters.categoryIds.length > 0) {
    result.push({
      type: 'Categories',
      labels: selectedFilters.categoryIds
        .map(id => categoryMap.get(id))
        .filter((name): name is string => name !== undefined)
    })
  }

  if (selectedFilters.brandIds.length > 0) {
    result.push({
      type: 'Brands',
      labels: selectedFilters.brandIds
        .map(id => brandMap.get(id))
        .filter((name): name is string => name !== undefined)
    })
  }

  if (selectedFilters.storeIds.length > 0) {
    result.push({
      type: 'Stores',
      labels: selectedFilters.storeIds
        .map(id => storeMap.get(id))
        .filter((name): name is string => name !== undefined)
    })
  }

  if (selectedFilters.tagIds.length > 0) {
    result.push({
      type: 'Tags',
      labels: selectedFilters.tagIds
        .map(id => tagMap.get(id))
        .filter((name): name is string => name !== undefined)
    })
  }

  return result
}
