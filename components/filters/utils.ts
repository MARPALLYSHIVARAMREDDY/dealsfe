import type {
  CategoryNode,
  FilterOption,
  SelectedFilters,
  FilterSearchParams,
} from './types'

/**
 * Toggle selection - add if not present, remove if present
 */
export function toggleSelection(ids: string[], id: string): string[] {
  return ids.includes(id)
    ? ids.filter((x) => x !== id) // Remove if present
    : [...ids, id] // Add if not present
}

/**
 * Parse URL search params to SelectedFilters
 */
export function parseSearchParams(
  params: Record<string, string | string[] | undefined>
): SelectedFilters {
  const toArray = (val: string | string[] | undefined): string[] => {
    if (!val) return []

    // Handle comma-separated string: "top,toys" → ["top", "toys"]
    return (val as string).split(',').filter(Boolean)
  }

  return {
    categoryIds: toArray(params.category),
    brandIds: toArray(params.brand),
    storeIds: toArray(params.store),
    tagIds: toArray(params.tag),
    minDiscount: params.minDiscount ? Number(params.minDiscount) : undefined,
    maxDiscount: params.maxDiscount ? Number(params.maxDiscount) : undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    sortBy: params.sortBy as string | undefined,
  }
}

/**
 * Build filter URL from SelectedFilters
 */
export function buildFilterUrl(
  pathname: string,
  filters: SelectedFilters
): string {
  const params = new URLSearchParams()

  // Use comma-separated values instead of repeated parameters
  if (filters.categoryIds.length > 0) {
    params.set('category', filters.categoryIds.join(','))
  }
  if (filters.brandIds.length > 0) {
    params.set('brand', filters.brandIds.join(','))
  }
  if (filters.storeIds.length > 0) {
    params.set('store', filters.storeIds.join(','))
  }
  if (filters.tagIds.length > 0) {
    params.set('tag', filters.tagIds.join(','))
  }

  if (filters.minDiscount !== undefined) {
    params.append('minDiscount', filters.minDiscount.toString())
  }

  if (filters.maxDiscount !== undefined) {
    params.append('maxDiscount', filters.maxDiscount.toString())
  }

  if (filters.minPrice !== undefined) {
    params.append('minPrice', filters.minPrice.toString())
  }

  if (filters.maxPrice !== undefined) {
    params.append('maxPrice', filters.maxPrice.toString())
  }

  if (filters.sortBy) {
    params.append('sortBy', filters.sortBy)
  }

  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

/**
 * Flatten category tree to a Map for quick ID lookup
 */
export function flattenCategoryTree(
  nodes: CategoryNode[]
): Map<string, CategoryNode> {
  const map = new Map<string, CategoryNode>()

  function traverse(node: CategoryNode) {
    map.set(node.id, node)
    const children = node.subcategories || node.children || []
    children.forEach(traverse)
  }

  nodes.forEach(traverse)
  return map
}

/**
 * Find category by ID in tree
 */
export function findCategoryById(
  nodes: CategoryNode[],
  id: string
): CategoryNode | null {
  for (const node of nodes) {
    if (node.id === id) return node

    const children = node.subcategories || node.children || []
    const found = findCategoryById(children, id)
    if (found) return found
  }

  return null
}

/**
 * Filter tree recursively by search query
 * Returns nodes that match or have matching descendants
 */
export function filterTree(
  nodes: CategoryNode[],
  query: string
): CategoryNode[] {
  if (!query.trim()) return nodes

  const lowerQuery = query.toLowerCase()

  return nodes.reduce<CategoryNode[]>((acc, node) => {
    const nameMatches = node.name.toLowerCase().includes(lowerQuery)
    const children = node.subcategories || node.children || []
    const filteredChildren = filterTree(children, query)

    if (nameMatches || filteredChildren.length > 0) {
      acc.push({
        ...node,
        subcategories: filteredChildren,
        children: filteredChildren,
        _matchesSearch: nameMatches,
      })
    }
    return acc
  }, [])
}

/**
 * Get all descendant IDs from a category node
 * Useful if implementing parent-child cascade selection
 */
export function getAllDescendantIds(node: CategoryNode): string[] {
  const ids: string[] = []
  const children = node.subcategories || node.children || []

  children.forEach((child) => {
    ids.push(child.id)
    ids.push(...getAllDescendantIds(child))
  })

  return ids
}

/**
 * Filter flat list of options by search query
 */
export function filterOptions(
  options: FilterOption[],
  query: string
): FilterOption[] {
  if (!query.trim()) return options

  const lowerQuery = query.toLowerCase()
  return options.filter((option) =>
    option.name.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get selected count across all filters
 */
export function getTotalSelectedCount(filters: SelectedFilters): number {
  let count = (
    filters.categoryIds.length +
    filters.brandIds.length +
    filters.storeIds.length +
    filters.tagIds.length
  )

  // Add 1 for discount range if either min or max is set
  if (filters.minDiscount !== undefined || filters.maxDiscount !== undefined) {
    count += 1
  }

  // Add 1 for sortBy if it's set and not the default
  if (filters.sortBy && filters.sortBy !== 'newest') {
    count += 1
  }

  return count
}

/**
 * Check if any filters are applied
 */
export function hasActiveFilters(filters: SelectedFilters): boolean {
  return getTotalSelectedCount(filters) > 0
}

/**
 * Create empty filters state
 */
export function createEmptyFilters(): SelectedFilters {
  return {
    categoryIds: [],
    brandIds: [],
    storeIds: [],
    tagIds: [],
    minDiscount: undefined,
    maxDiscount: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: undefined,
  }
}
