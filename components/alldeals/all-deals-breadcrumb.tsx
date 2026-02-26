import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { type LocaleCode, getCountryCodeFromLocale } from '@/lib/locale-utils'
import { getSales, getTags } from '@/data/breadcrumb/breadcrumb-server-only'
import { getStores, getCategories, getBrands } from '@/data/catalogues/catalogues-server-only'

interface AllDealsBreadcrumbProps {
  locale: LocaleCode
  searchParams: Record<string, string | string[] | undefined>
}

interface BreadcrumbItem {
  label: string
  href: string
  isActive: boolean
}

// Helper to parse URL parameters (handle both string and string[])
function parseParam(param: string | string[] | undefined): string[] {
  if (!param) return []
  return Array.isArray(param) ? param : [param]
}

// Helper to build href with specific filters
function buildHrefWithFilters(
  locale: string,
  filtersToInclude: Record<string, string[]>
): string {
  const params = new URLSearchParams()

  Object.entries(filtersToInclude).forEach(([key, values]) => {
    values.forEach((value) => {
      if (value) params.append(key, value)
    })
  })

  const query = params.toString()
  return query ? `/${locale}/all-deals?${query}` : `/${locale}/all-deals`
}

export default async function AllDealsBreadcrumb({
  locale,
  searchParams,
}: AllDealsBreadcrumbProps) {
  // Extract filters from searchParams
  const filters = {
    sales: parseParam(searchParams.sales),
    stores: parseParam(searchParams.stores),
    tags: parseParam(searchParams.tags),
    category: parseParam(searchParams.category),
    subcategory: parseParam(searchParams.subcategory),
    brand: parseParam(searchParams.brand),
  }

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0)

  // If no filters, show basic breadcrumb
  if (!hasActiveFilters) {
    return (
      <nav aria-label="Breadcrumb" className="px-6 md:px-12 pt-4">
        <ol className="flex items-center space-x-2 text-md">
          <li className="flex items-center">
            <Link
              href={`/${locale}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4  text-muted-foreground" />
          </li>
          <li>
            <span className="text-foreground font-medium">All Deals</span>
          </li>
        </ol>
      </nav>
    )
  }

  // Get country code for API calls
  const countryCode = getCountryCodeFromLocale(locale)

  // Fetch all data in parallel with error handling
  const [salesResult, storesResult, tagsResult, categoriesResult, brandsResult] =
    await Promise.allSettled([
      getSales(countryCode),
      getStores(),
      getTags(countryCode),
      getCategories(),
      getBrands(),
    ])

  // Extract data with fallbacks
  const salesData = salesResult.status === 'fulfilled' ? salesResult.value : []
  const storesData = storesResult.status === 'fulfilled' ? storesResult.value : []
  const tagsData = tagsResult.status === 'fulfilled' ? tagsResult.value : []
  const categoriesData = categoriesResult.status === 'fulfilled' ? categoriesResult.value : []
  const brandsData = brandsResult.status === 'fulfilled' ? brandsResult.value : []

  // Lookup functions
  const findSaleBySlug = (slug: string) =>
    salesData.find((s: any) => s.slug === slug)

  const findStore = (identifier: string) =>
    storesData.find(
      (s: any) =>
        s.slug === identifier ||
        s.name === identifier ||
        s.name?.toLowerCase() === identifier.toLowerCase()
    )

  const findTag = (slug: string) =>
    tagsData.find((t: any) => t.slug === slug)

  const findCategory = (name: string) =>
    categoriesData.find(
      (c: any) => c.name === name || c.name?.toLowerCase() === name.toLowerCase()
    )

  const findBrand = (name: string) =>
    brandsData.find(
      (b: any) => b.name === name || b.name?.toLowerCase() === name.toLowerCase()
    )

  // Build breadcrumb items following hierarchy
  const breadcrumbItems: BreadcrumbItem[] = []

  // 1. Home (always)
  breadcrumbItems.push({
    label: 'Home',
    href: `/${locale}`,
    isActive: false,
  })

  // 2. All Deals (always)
  breadcrumbItems.push({
    label: 'All Deals',
    href: `/${locale}/all-deals`,
    isActive: false,
  })

  // Track accumulated filters for progressive links
  const accumulatedFilters: Record<string, string[]> = {}

  // 3. Sales
  if (filters.sales.length > 0) {
    filters.sales.forEach((saleSlug) => {
      const sale = findSaleBySlug(saleSlug)
      if (sale) {
        accumulatedFilters.sales = [...(accumulatedFilters.sales || []), saleSlug]
        breadcrumbItems.push({
          label: sale.name,
          href: buildHrefWithFilters(locale, { ...accumulatedFilters }),
          isActive: false,
        })
      }
    })
  }

  // 4. Stores
  if (filters.stores.length > 0) {
    filters.stores.forEach((storeIdentifier) => {
      const store = findStore(storeIdentifier)
      if (store) {
        accumulatedFilters.stores = [
          ...(accumulatedFilters.stores || []),
          storeIdentifier,
        ]
        breadcrumbItems.push({
          label: store.name,
          href: buildHrefWithFilters(locale, { ...accumulatedFilters }),
          isActive: false,
        })
      }
    })
  }

  // 5. Tags
  if (filters.tags.length > 0) {
    filters.tags.forEach((tagSlug) => {
      const tag = findTag(tagSlug)
      if (tag) {
        accumulatedFilters.tags = [...(accumulatedFilters.tags || []), tagSlug]
        breadcrumbItems.push({
          label: tag.name,
          href: buildHrefWithFilters(locale, { ...accumulatedFilters }),
          isActive: false,
        })
      }
    })
  }

  // 6. Categories
  if (filters.category.length > 0) {
    filters.category.forEach((categoryName) => {
      const category = findCategory(categoryName)
      if (category) {
        accumulatedFilters.category = [
          ...(accumulatedFilters.category || []),
          categoryName,
        ]
        breadcrumbItems.push({
          label: category.name,
          href: buildHrefWithFilters(locale, { ...accumulatedFilters }),
          isActive: false,
        })
      }
    })
  }

  // 7. Subcategories
  if (filters.subcategory.length > 0) {
    filters.subcategory.forEach((subcategoryName) => {
      accumulatedFilters.subcategory = [
        ...(accumulatedFilters.subcategory || []),
        subcategoryName,
      ]
      breadcrumbItems.push({
        label: subcategoryName,
        href: buildHrefWithFilters(locale, { ...accumulatedFilters }),
        isActive: false,
      })
    })
  }

  // 8. Brands
  if (filters.brand.length > 0) {
    filters.brand.forEach((brandName) => {
      const brand = findBrand(brandName)
      if (brand) {
        accumulatedFilters.brand = [...(accumulatedFilters.brand || []), brandName]
        breadcrumbItems.push({
          label: brand.name,
          href: buildHrefWithFilters(locale, { ...accumulatedFilters }),
          isActive: false,
        })
      }
    })
  }

  // Mark the last item as active (non-clickable)
  if (breadcrumbItems.length > 0) {
    breadcrumbItems[breadcrumbItems.length - 1].isActive = true
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4 px-4 py-4">
      <ol className="flex items-center space-x-2 text-sm overflow-x-auto">
        {breadcrumbItems.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center shrink-0">
            {!item.isActive ? (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}

            {index < breadcrumbItems.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
