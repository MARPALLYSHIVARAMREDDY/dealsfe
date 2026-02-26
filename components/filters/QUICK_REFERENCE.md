# Multi-Select Filters - Quick Reference Card

## 🚀 5-Second Start

```tsx
import { MultiSelectFiltersServer } from '@/components/filters'

export default async function Page({ searchParams }) {
  return <MultiSelectFiltersServer searchParams={searchParams} />
}
```

---

## 📦 Import Paths

```tsx
// Main components
import { MultiSelectFiltersServer } from '@/components/filters'
import { MultiSelectFiltersClient } from '@/components/filters'

// Individual components
import { CategoryTreeFilter } from '@/components/filters'
import { DropdownCheckboxFilter } from '@/components/filters'
import { FilterBadgeList } from '@/components/filters'

// Types
import type { SelectedFilters, CategoryNode, FilterOption } from '@/components/filters'

// Utilities
import { parseSearchParams, buildFilterUrl, toggleSelection } from '@/components/filters'
```

---

## 🔧 Common Patterns

### Server Component (Recommended)
```tsx
<MultiSelectFiltersServer searchParams={searchParams} />
```

### With Locale
```tsx
<MultiSelectFiltersServer searchParams={searchParams} locale="USA" />
```

### Client Component (Custom Logic)
```tsx
<MultiSelectFiltersClient
  categories={categories}
  brands={brands}
  stores={stores}
  tags={tags}
  initialSelectedFilters={filters}
  onApply={(filters) => console.log(filters)}
/>
```

---

## 📊 Data Structures

### SelectedFilters
```typescript
{
  categoryIds: string[]
  brandIds: string[]
  storeIds: string[]
  tagIds: string[]
}
```

### CategoryNode (Hierarchical)
```typescript
{
  id: string
  name: string
  subcategories?: CategoryNode[]
}
```

### FilterOption (Flat)
```typescript
{
  id: string
  name: string
  slug?: string
}
```

---

## 🛠️ Utility Functions

### Parse URL → Filters
```tsx
const filters = parseSearchParams(searchParams)
// { categoryIds: ['1'], brandIds: ['2'], ... }
```

### Build Filters → URL
```tsx
const url = buildFilterUrl('/products', filters)
// "/products?category=1&brand=2"
```

### Toggle Selection
```tsx
const newIds = toggleSelection(['1', '2'], '3')
// ['1', '2', '3']
```

### Check Active Filters
```tsx
const hasFilters = hasActiveFilters(filters)
const count = getTotalSelectedCount(filters)
```

---

## 📱 Responsive Behavior

| Screen Size | Component | Position |
|-------------|-----------|----------|
| Desktop (lg+) | Sheet | Right sidebar |
| Mobile (<lg) | Drawer | Bottom panel |

---

## 🎨 Customization

### Add Custom Class
```tsx
<MultiSelectFiltersServer
  searchParams={searchParams}
  className="my-4"
/>
```

### Custom Callbacks
```tsx
<MultiSelectFiltersClient
  {...props}
  onApply={(filters) => {
    // Custom logic
  }}
  onClear={() => {
    // Custom logic
  }}
/>
```

---

## 🔗 URL Format

```
/page?category=id1&category=id2&brand=id3&store=id4&tag=id5
```

Multiple values for the same filter type are repeated parameters.

---

## 📂 File Locations

| File | Purpose |
|------|---------|
| `types.ts` | TypeScript interfaces |
| `utils.ts` | Helper functions |
| `dropdown-checkbox-filter.tsx` | Reusable dropdown |
| `category-tree-filter.tsx` | Tree component |
| `filter-badge-list.tsx` | Active filters display |
| `multi-select-filters-client.tsx` | Main UI component |
| `multi-select-filters-server.tsx` | Server wrapper |
| `index.ts` | Barrel exports |

---

## ✅ Props Reference

### MultiSelectFiltersServer
```typescript
{
  searchParams: Record<string, string | string[] | undefined>
  locale?: string  // Default: 'USA'
}
```

### MultiSelectFiltersClient
```typescript
{
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
```

### CategoryTreeFilter
```typescript
{
  categories: CategoryNode[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  searchable?: boolean  // Default: true
  defaultExpanded?: boolean  // Default: false
  maxHeight?: string  // Default: '400px'
  className?: string
}
```

### DropdownCheckboxFilter
```typescript
{
  label: string
  options: FilterOption[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  searchable?: boolean  // Default: true
  placeholder?: string
  icon?: React.ReactNode
  maxHeight?: string  // Default: '300px'
  className?: string
}
```

---

## 🎯 Key Features at a Glance

✅ **Categories**: Tree with search, expand/collapse
✅ **Brands/Stores/Tags**: Dropdown with checkboxes
✅ **Multiple selections**: All filters support multi-select
✅ **URL persistence**: Filters saved in URL
✅ **Responsive**: Sheet (desktop) + Drawer (mobile)
✅ **Server-side**: Data fetching with caching
✅ **TypeScript**: Fully typed
✅ **Accessible**: ARIA labels, keyboard nav

---

## 🐛 Troubleshooting

**Filters not persisting?**
→ Ensure you're passing `searchParams` from Next.js page props

**TypeScript errors?**
→ Import types from `@/components/filters`

**Categories not showing children?**
→ Check API returns `subcategories` or `children` array

**Dropdown not opening?**
→ Verify UI components exist in `/components/ui/`

---

## 📚 Documentation

- **README.md**: Full documentation (8.9 KB)
- **USAGE_EXAMPLES.md**: 7 integration examples (10 KB)
- **IMPLEMENTATION_SUMMARY.md**: Architecture overview (13 KB)
- **QUICK_REFERENCE.md**: This file

---

## 💡 Pro Tips

1. **Start simple**: Use `MultiSelectFiltersServer` for most cases
2. **Custom logic**: Use `MultiSelectFiltersClient` for callbacks
3. **Advanced layouts**: Use individual components (CategoryTreeFilter, etc.)
4. **Type safety**: Import types for better IntelliSense
5. **Performance**: Data is cached automatically via Next.js

---

## 🔥 Most Common Use Case

```tsx
// app/your-page/page.tsx
import { MultiSelectFiltersServer, parseSearchParams } from '@/components/filters'
import { getYourData } from '@/data/your-data'

export default async function YourPage({ searchParams }) {
  // Parse filters from URL
  const filters = parseSearchParams(searchParams)

  // Fetch filtered data
  const data = await getYourData(filters)

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1>Your Page ({data.length})</h1>
        <MultiSelectFiltersServer searchParams={searchParams} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {data.map(item => <YourCard key={item.id} item={item} />)}
      </div>
    </div>
  )
}
```

**That's it!** 🎉

---

Print this page and keep it handy while integrating the filters component!
