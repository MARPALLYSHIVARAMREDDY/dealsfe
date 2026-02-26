# Multi-Select Filters Component

A comprehensive, reusable filtering system with categories (tree), brands, stores, and tags (dropdowns with checkboxes). All filters support multiple selections.

## Features

- **Category Tree Filter**: Hierarchical tree with checkboxes, search, and expand/collapse
- **Dropdown Filters**: Reusable dropdown with checkboxes for Brands, Stores, and Tags
- **Filter Badges**: Display and remove active filters
- **Responsive**: Sheet sidebar on desktop, Drawer on mobile
- **URL Integration**: Filters persist in URL for shareability
- **Server-Side Data**: Leverages Next.js caching and server components

## Quick Start

### Basic Usage (Server Component)

```tsx
// app/your-page/page.tsx
import { MultiSelectFiltersServer } from '@/components/filters'

export default async function YourPage({ searchParams }) {
  return (
    <div>
      <MultiSelectFiltersServer searchParams={searchParams} />
      {/* Your other content */}
    </div>
  )
}
```

### With Custom Locale

```tsx
import { MultiSelectFiltersServer } from '@/components/filters'

export default async function YourPage({
  searchParams,
  params
}: {
  searchParams: Record<string, string | string[] | undefined>
  params: { locale: string }
}) {
  return (
    <div>
      <MultiSelectFiltersServer
        searchParams={searchParams}
        locale={params.locale}
      />
    </div>
  )
}
```

### With Suspense and Loading State

```tsx
import { MultiSelectFiltersServerWithSuspense } from '@/components/filters'

export default function YourPage({ searchParams }) {
  return (
    <div>
      <MultiSelectFiltersServerWithSuspense searchParams={searchParams} />
    </div>
  )
}
```

## Advanced Usage

### Client Component (Custom Implementation)

If you need custom callbacks or behavior:

```tsx
'use client'

import { useState } from 'react'
import { MultiSelectFiltersClient } from '@/components/filters'
import type { SelectedFilters } from '@/components/filters'

export function CustomFilters({
  categories,
  brands,
  stores,
  tags
}) {
  const [filters, setFilters] = useState<SelectedFilters>({
    categoryIds: [],
    brandIds: [],
    storeIds: [],
    tagIds: []
  })

  const handleApply = (newFilters: SelectedFilters) => {
    console.log('Filters applied:', newFilters)
    // Your custom logic here
  }

  const handleClear = () => {
    console.log('Filters cleared')
    // Your custom logic here
  }

  return (
    <MultiSelectFiltersClient
      categories={categories}
      brands={brands}
      stores={stores}
      tags={tags}
      initialSelectedFilters={filters}
      onFiltersChange={setFilters}
      onApply={handleApply}
      onClear={handleClear}
    />
  )
}
```

### Individual Components

Use individual filter components for custom layouts:

```tsx
import {
  CategoryTreeFilter,
  DropdownCheckboxFilter
} from '@/components/filters'

export function CustomFilterLayout({ categories, brands }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  return (
    <div className="flex gap-4">
      <div className="w-1/2">
        <CategoryTreeFilter
          categories={categories}
          selectedIds={selectedCategories}
          onSelectionChange={setSelectedCategories}
          searchable
        />
      </div>
      <div className="w-1/2">
        <DropdownCheckboxFilter
          label="Brands"
          options={brands}
          selectedIds={selectedBrands}
          onSelectionChange={setSelectedBrands}
        />
      </div>
    </div>
  )
}
```

## URL Structure

Filters are stored in URL parameters for shareability:

```
/all-deals?category=cat-1&category=cat-2&brand=brand-1&store=store-1&tag=tag-1
```

### Parsing URL Params

```tsx
import { parseSearchParams } from '@/components/filters'

const filters = parseSearchParams(searchParams)
// Returns: { categoryIds: [...], brandIds: [...], storeIds: [...], tagIds: [...] }
```

### Building URL from Filters

```tsx
import { buildFilterUrl } from '@/components/filters'

const url = buildFilterUrl('/all-deals', {
  categoryIds: ['cat-1', 'cat-2'],
  brandIds: ['brand-1'],
  storeIds: [],
  tagIds: []
})
// Returns: "/all-deals?category=cat-1&category=cat-2&brand=brand-1"
```

## Data Structure

### Categories (Hierarchical)

```typescript
interface CategoryNode {
  id: string
  name: string
  subcategories?: CategoryNode[] // Recursive nesting
}
```

### Brands, Stores (Flat)

```typescript
interface FilterOption {
  id: string
  name: string
  slug?: string
}
```

### Tags

```typescript
interface TagEntity {
  id: string
  name: string
  slug: string
  country: string
  isActive: boolean
}
```

## Utility Functions

### Toggle Selection

```tsx
import { toggleSelection } from '@/components/filters'

const newIds = toggleSelection(['id1', 'id2'], 'id3')
// Returns: ['id1', 'id2', 'id3']

const removedIds = toggleSelection(['id1', 'id2'], 'id2')
// Returns: ['id1']
```

### Check Active Filters

```tsx
import { hasActiveFilters, getTotalSelectedCount } from '@/components/filters'

const hasFilters = hasActiveFilters(selectedFilters)
// Returns: boolean

const count = getTotalSelectedCount(selectedFilters)
// Returns: number (total across all filter types)
```

### Filter Tree Search

```tsx
import { filterTree } from '@/components/filters'

const filtered = filterTree(categories, 'electronics')
// Returns filtered tree with matching nodes and their ancestors
```

## Styling

The components use Tailwind CSS and inherit your design system tokens:

- `bg-primary`, `text-primary-foreground` - Active states
- `bg-muted`, `border-border` - Inactive states
- `bg-accent` - Hover states

### Custom Styling

All components accept a `className` prop:

```tsx
<MultiSelectFiltersServer
  searchParams={searchParams}
  className="my-custom-class"
/>
```

## Accessibility

- All interactive elements have ARIA labels
- Keyboard navigation supported
- Focus management in Sheet/Drawer
- Screen reader friendly

## Performance

- Server components with Next.js caching
- React.memo on tree nodes for efficient re-renders
- Parallel data fetching with Promise.all()
- Search debouncing (300ms)
- Memoized filter results

## Examples

### Example 1: All Deals Page Integration

```tsx
// app/all-deals/page.tsx
import { MultiSelectFiltersServer } from '@/components/filters'
import { getAllDeals } from '@/data/deals'

export default async function AllDealsPage({ searchParams }) {
  const deals = await getAllDeals(searchParams)

  return (
    <div className="container mx-auto py-6">
      <div className="flex gap-4 items-center mb-6">
        <h1 className="text-2xl font-bold">All Deals</h1>
        <MultiSelectFiltersServer searchParams={searchParams} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {deals.map(deal => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  )
}
```

### Example 2: Custom Filter Callbacks

```tsx
'use client'

import { MultiSelectFiltersClient } from '@/components/filters'
import { useAnalytics } from '@/hooks/useAnalytics'

export function FiltersWithAnalytics({ data }) {
  const { trackEvent } = useAnalytics()

  const handleApply = (filters) => {
    trackEvent('filters_applied', {
      categories: filters.categoryIds.length,
      brands: filters.brandIds.length,
      stores: filters.storeIds.length,
      tags: filters.tagIds.length
    })
  }

  return (
    <MultiSelectFiltersClient
      {...data}
      onApply={handleApply}
    />
  )
}
```

## Component Architecture

```
MultiSelectFiltersServer (Server)
  ↓ Fetches data in parallel
  ↓ Parses URL params
  ↓
MultiSelectFiltersClient (Client)
  ├── Sheet (Desktop)
  │   └── FilterContent
  │       ├── CategoryTreeFilter
  │       ├── DropdownCheckboxFilter (Brands)
  │       ├── DropdownCheckboxFilter (Stores)
  │       ├── DropdownCheckboxFilter (Tags)
  │       └── FilterBadgeList
  └── Drawer (Mobile)
      └── FilterContent (same as above)
```

## Troubleshooting

### Filters not persisting on refresh

Make sure you're using `searchParams` from Next.js:

```tsx
export default function Page({ searchParams }) {
  // searchParams is automatically provided by Next.js
  return <MultiSelectFiltersServer searchParams={searchParams} />
}
```

### Categories not showing subcategories

Ensure your API returns the correct structure:

```typescript
{
  id: '1',
  name: 'Electronics',
  subcategories: [  // or 'children'
    {
      id: '2',
      name: 'Phones',
      subcategories: [...]
    }
  ]
}
```

### Dropdown not opening

Check that you've imported the UI components correctly:

```tsx
// Make sure these exist in your project:
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { Sheet } from '@/components/ui/sheet'
import { Drawer } from '@/components/ui/drawer'
```

## API Reference

See [types.ts](./types.ts) for complete TypeScript definitions.

## License

Part of the DealsMocktail project.
