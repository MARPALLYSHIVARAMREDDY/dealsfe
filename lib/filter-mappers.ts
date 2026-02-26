import type { CategoryNode, FilterOption, TagEntity } from '@/components/filters/types'

/**
 * Flatten category tree to a Map for O(1) slug/ID lookups
 */
export function flattenCategoriesForSlugLookup(
  categories: CategoryNode[]
): Map<string, CategoryNode> {
  const map = new Map<string, CategoryNode>()

  function traverse(node: CategoryNode) {
    map.set(node.id, node)
    if (node.slug) {
      map.set(node.slug, node)
    }
    const children = node.subcategories || node.children || []
    children.forEach(traverse)
  }

  categories.forEach(traverse)
  return map
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(
  slug: string,
  categories: CategoryNode[]
): CategoryNode | null {
  const map = flattenCategoriesForSlugLookup(categories)
  return map.get(slug) || null
}

/**
 * Get category by ID
 */
export function getCategoryById(
  id: string,
  categories: CategoryNode[]
): CategoryNode | null {
  const map = flattenCategoriesForSlugLookup(categories)
  return map.get(id) || null
}

/**
 * Get brand by slug
 */
export function getBrandBySlug(
  slug: string,
  brands: FilterOption[]
): FilterOption | null {
  return brands.find((brand) => brand.slug === slug) || null
}

/**
 * Get brand by ID
 */
export function getBrandById(
  id: string,
  brands: FilterOption[]
): FilterOption | null {
  return brands.find((brand) => brand.id === id) || null
}

/**
 * Get store by slug
 */
export function getStoreBySlug(
  slug: string,
  stores: FilterOption[]
): FilterOption | null {
  return stores.find((store) => store.slug === slug) || null
}

/**
 * Get store by ID
 */
export function getStoreById(
  id: string,
  stores: FilterOption[]
): FilterOption | null {
  return stores.find((store) => store.id === id) || null
}

/**
 * Get tag by slug
 */
export function getTagBySlug(
  slug: string,
  tags: TagEntity[]
): TagEntity | null {
  return tags.find((tag) => tag.slug === slug) || null
}

/**
 * Get tag by ID
 */
export function getTagById(
  id: string,
  tags: TagEntity[]
): TagEntity | null {
  return tags.find((tag) => tag.id === id) || null
}

/**
 * Convert category IDs to slugs
 */
export function getCategorySlugsById(
  ids: string[],
  categories: CategoryNode[]
): string[] {
  const map = flattenCategoriesForSlugLookup(categories)
  return ids
    .map((id) => {
      const category = map.get(id)
      return category?.slug || null
    })
    .filter((slug): slug is string => slug !== null)
}

/**
 * Convert brand IDs to slugs
 */
export function getBrandSlugsById(
  ids: string[],
  brands: FilterOption[]
): string[] {
  return ids
    .map((id) => {
      const brand = brands.find((b) => b.id === id)
      return brand?.slug || null
    })
    .filter((slug): slug is string => slug !== null)
}

/**
 * Convert store IDs to slugs
 */
export function getStoreSlugsById(
  ids: string[],
  stores: FilterOption[]
): string[] {
  return ids
    .map((id) => {
      const store = stores.find((s) => s.id === id)
      return store?.slug || null
    })
    .filter((slug): slug is string => slug !== null)
}

/**
 * Convert tag IDs to slugs
 */
export function getTagSlugsById(
  ids: string[],
  tags: TagEntity[]
): string[] {
  return ids
    .map((id) => {
      const tag = tags.find((t) => t.id === id)
      return tag?.slug || null
    })
    .filter((slug): slug is string => slug !== null)
}

/**
 * Convert category slugs to IDs
 */
export function getCategoryIdsBySlug(
  slugs: string[],
  categories: CategoryNode[]
): string[] {
  const map = flattenCategoriesForSlugLookup(categories)
  const results: string[] = []

  slugs.forEach((slug) => {
    const category = map.get(slug)
    if (category?.id) {
      results.push(category.id)
    } else {
      console.warn(`[Filter] Category slug not found: "${slug}"`)
    }
  })

  return results
}

/**
 * Convert brand slugs to IDs
 */
export function getBrandIdsBySlug(
  slugs: string[],
  brands: FilterOption[]
): string[] {
  const results: string[] = []

  slugs.forEach((slug) => {
    const brand = brands.find((b) => b.slug === slug)
    if (brand?.id) {
      results.push(brand.id)
    } else {
      console.warn(`[Filter] Brand slug not found: "${slug}"`)
    }
  })

  return results
}

/**
 * Convert store slugs to IDs
 */
export function getStoreIdsBySlug(
  slugs: string[],
  stores: FilterOption[]
): string[] {
  const results: string[] = []

  slugs.forEach((slug) => {
    const store = stores.find((s) => s.slug === slug)
    if (store?.id) {
      results.push(store.id)
    } else {
      console.warn(`[Filter] Store slug not found: "${slug}"`)
    }
  })

  return results
}

/**
 * Convert tag slugs to IDs
 */
export function getTagIdsBySlug(
  slugs: string[],
  tags: TagEntity[]
): string[] {
  const results: string[] = []

  slugs.forEach((slug) => {
    const tag = tags.find((t) => t.slug === slug)
    if (tag?.id) {
      results.push(tag.id)
    } else {
      console.warn(`[Filter] Tag slug not found: "${slug}"`)
    }
  })

  return results
}

/**
 * Generic function to convert IDs to slugs
 */
export function mapIdsToSlugs(
  ids: string[],
  entities: Array<{ id: string; slug?: string }>
): string[] {
  return ids
    .map((id) => {
      const entity = entities.find((e) => e.id === id)
      return entity?.slug || null
    })
    .filter((slug): slug is string => slug !== null)
}

/**
 * Generic function to convert slugs to IDs
 */
export function mapSlugsToIds(
  slugs: string[],
  entities: Array<{ id: string; slug?: string }>
): string[] {
  return slugs
    .map((slug) => {
      const entity = entities.find((e) => e.slug === slug)
      return entity?.id || null
    })
    .filter((id): id is string => id !== null)
}
