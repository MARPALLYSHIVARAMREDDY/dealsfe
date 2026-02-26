/**
 * USAGE EXAMPLE: How to integrate MultiSelectFilters in your pages
 *
 * This file demonstrates different integration patterns.
 * Copy the relevant pattern to your actual page.
 */

// ============================================
// EXAMPLE 1: Basic Server Component Integration
// ============================================

/**
 * File: app/your-page/page.tsx
 */

import { MultiSelectFiltersServer } from '@/components/filters'

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function YourPage({ searchParams }: PageProps) {
  // The server component automatically:
  // 1. Fetches categories, brands, stores, tags in parallel
  // 2. Parses searchParams into selected filters
  // 3. Renders responsive UI (Sheet on desktop, Drawer on mobile)

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Page</h1>

        {/* Filter Button */}
        <MultiSelectFiltersServer searchParams={searchParams} />
      </div>

      {/* Your page content here */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Your items */}
      </div>
    </div>
  )
}

// ============================================
// EXAMPLE 2: With Locale Support
// ============================================

/**
 * File: app/[locale]/your-page/page.tsx
 */

import { MultiSelectFiltersServer } from '@/components/filters'

type LocalePageProps = {
  params: { locale: string }
  searchParams: Record<string, string | string[] | undefined>
}

export default async function LocalePage({
  params,
  searchParams
}: LocalePageProps) {
  return (
    <div className="container mx-auto py-6">
      <MultiSelectFiltersServer
        searchParams={searchParams}
        locale={params.locale}
      />
    </div>
  )
}

// ============================================
// EXAMPLE 3: Client Component with Custom Logic
// ============================================

/**
 * File: components/your-feature/filters-with-analytics.tsx
 */

'use client'

import { useState, useEffect } from 'react'
import { MultiSelectFiltersClient } from '@/components/filters'
import type { SelectedFilters, CategoryNode, FilterOption, TagEntity } from '@/components/filters'

interface FiltersWithAnalyticsProps {
  categories: CategoryNode[]
  brands: FilterOption[]
  stores: FilterOption[]
  tags: TagEntity[]
  initialFilters: SelectedFilters
}

export function FiltersWithAnalytics({
  categories,
  brands,
  stores,
  tags,
  initialFilters
}: FiltersWithAnalyticsProps) {
  const [filters, setFilters] = useState(initialFilters)

  // Example: Track filter changes
  const handleFiltersChange = (newFilters: SelectedFilters) => {
    setFilters(newFilters)
    console.log('Filters changed:', newFilters)
  }

  // Example: Custom apply logic
  const handleApply = (appliedFilters: SelectedFilters) => {
    // Send analytics event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'filters_applied', {
        categories_count: appliedFilters.categoryIds.length,
        brands_count: appliedFilters.brandIds.length,
        stores_count: appliedFilters.storeIds.length,
        tags_count: appliedFilters.tagIds.length,
      })
    }

    // Your custom logic here
    console.log('Filters applied:', appliedFilters)
  }

  // Example: Custom clear logic
  const handleClear = () => {
    console.log('Filters cleared')

    // Send analytics event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'filters_cleared')
    }
  }

  return (
    <MultiSelectFiltersClient
      categories={categories}
      brands={brands}
      stores={stores}
      tags={tags}
      initialSelectedFilters={filters}
      onFiltersChange={handleFiltersChange}
      onApply={handleApply}
      onClear={handleClear}
    />
  )
}

// ============================================
// EXAMPLE 4: Filtering Data Based on URL Params
// ============================================

/**
 * File: app/products/page.tsx
 */

import { MultiSelectFiltersServer, parseSearchParams } from '@/components/filters'
import { getProducts } from '@/data/products'

type ProductsPageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Parse filters from URL
  const filters = parseSearchParams(searchParams)

  // Fetch products with filters applied
  const products = await getProducts({
    categoryIds: filters.categoryIds,
    brandIds: filters.brandIds,
    storeIds: filters.storeIds,
    tagIds: filters.tagIds,
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            {products.length} products found
          </p>
        </div>

        <MultiSelectFiltersServer searchParams={searchParams} />
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products match your filters</p>
        </div>
      )}
    </div>
  )
}

// ============================================
// EXAMPLE 5: Individual Components (Custom Layout)
// ============================================

/**
 * File: components/your-feature/custom-filter-sidebar.tsx
 */

'use client'

import { useState } from 'react'
import {
  CategoryTreeFilter,
  DropdownCheckboxFilter,
  FilterBadgeList
} from '@/components/filters'
import type { CategoryNode, FilterOption, SelectedFilters } from '@/components/filters'
import { Button } from '@/components/ui/button'

interface CustomFilterSidebarProps {
  categories: CategoryNode[]
  brands: FilterOption[]
}

export function CustomFilterSidebar({
  categories,
  brands
}: CustomFilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  const handleApply = () => {
    // Your custom apply logic
    console.log('Categories:', selectedCategories)
    console.log('Brands:', selectedBrands)
  }

  // Create SelectedFilters object for FilterBadgeList
  const selectedFilters: SelectedFilters = {
    categoryIds: selectedCategories,
    brandIds: selectedBrands,
    storeIds: [],
    tagIds: []
  }

  const handleRemove = (type: keyof SelectedFilters, id: string) => {
    if (type === 'categoryIds') {
      setSelectedCategories(prev => prev.filter(x => x !== id))
    } else if (type === 'brandIds') {
      setSelectedBrands(prev => prev.filter(x => x !== id))
    }
  }

  const handleClearAll = () => {
    setSelectedCategories([])
    setSelectedBrands([])
  }

  return (
    <div className="w-64 border-r p-4 space-y-6">
      <h2 className="text-lg font-semibold">Filters</h2>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Categories</h3>
        <CategoryTreeFilter
          categories={categories}
          selectedIds={selectedCategories}
          onSelectionChange={setSelectedCategories}
          searchable
          maxHeight="300px"
        />
      </div>

      {/* Brands */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Brands</h3>
        <DropdownCheckboxFilter
          label="Select Brands"
          options={brands}
          selectedIds={selectedBrands}
          onSelectionChange={setSelectedBrands}
          searchable
        />
      </div>

      {/* Active Filters */}
      <FilterBadgeList
        selectedFilters={selectedFilters}
        categories={categories}
        brands={brands}
        stores={[]}
        tags={[]}
        onRemove={handleRemove}
        onClearAll={handleClearAll}
      />

      {/* Apply Button */}
      <Button onClick={handleApply} className="w-full">
        Apply Filters
      </Button>
    </div>
  )
}

// ============================================
// EXAMPLE 6: Utility Function Usage
// ============================================

/**
 * Common utility patterns
 */

import {
  parseSearchParams,
  buildFilterUrl,
  getTotalSelectedCount,
  hasActiveFilters,
  toggleSelection,
  filterTree,
  flattenCategoryTree
} from '@/components/filters'

// Parse URL params
const searchParams = { category: ['1', '2'], brand: 'nike' }
const filters = parseSearchParams(searchParams)
// Result: { categoryIds: ['1', '2'], brandIds: ['nike'], storeIds: [], tagIds: [] }

// Build URL from filters
const url = buildFilterUrl('/products', {
  categoryIds: ['1'],
  brandIds: ['nike', 'adidas'],
  storeIds: [],
  tagIds: []
})
// Result: "/products?category=1&brand=nike&brand=adidas"

// Count selected filters
const count = getTotalSelectedCount(filters)
// Result: number (total across all types)

// Check if any filters active
const hasFilters = hasActiveFilters(filters)
// Result: boolean

// Toggle selection (add/remove from array)
const newIds = toggleSelection(['1', '2'], '3')
// Result: ['1', '2', '3']

const removedIds = toggleSelection(['1', '2'], '2')
// Result: ['1']

// Filter tree by search query
const filteredCategories = filterTree(categories, 'electronics')
// Result: CategoryNode[] (only matching nodes and ancestors)

// Flatten category tree for lookups
const categoryMap = flattenCategoryTree(categories)
// Result: Map<string, CategoryNode>
const category = categoryMap.get('category-id')

// ============================================
// EXAMPLE 7: TypeScript Type Usage
// ============================================

import type {
  CategoryNode,
  FilterOption,
  TagEntity,
  SelectedFilters,
  FilterSearchParams
} from '@/components/filters'

// Type your component props
interface MyComponentProps {
  categories: CategoryNode[]
  brands: FilterOption[]
  stores: FilterOption[]
  tags: TagEntity[]
  initialFilters: SelectedFilters
}

// Type your state
const [filters, setFilters] = useState<SelectedFilters>({
  categoryIds: [],
  brandIds: [],
  storeIds: [],
  tagIds: []
})

// Type your search params
type MyPageProps = {
  searchParams: FilterSearchParams
}
