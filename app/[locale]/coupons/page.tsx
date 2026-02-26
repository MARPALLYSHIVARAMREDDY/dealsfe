import { headers } from 'next/headers'
import CouponsLandingPage from '@/components/coupons/coupons-landing-page'
import { getCouponsForLanding } from '@/data/coupons/coupons-server-only'
import { categorizeCouponsForLanding } from '@/data/mock/coupons-mock-data'
import {
  applyFiltersAndSort,
  getAllCategories,
  getAllStores,
  getAllTags,
  type SortOption,
} from '@/lib/coupons-filter-utils'
import type { LocaleCode } from '@/lib/locale-utils'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CouponsPage({ params, searchParams }: PageProps) {
  // Force dynamic rendering
  await headers()

  // Await params and searchParams
  const { locale } = await params
  const localeCode = locale as LocaleCode
  const resolvedSearchParams = await searchParams

  // Extract filters from URL params
  const search = typeof resolvedSearchParams.search === 'string'
    ? resolvedSearchParams.search
    : ''
  const category = typeof resolvedSearchParams.category === 'string'
    ? resolvedSearchParams.category
    : ''
  const store = typeof resolvedSearchParams.store === 'string'
    ? resolvedSearchParams.store
    : ''
  const tags = Array.isArray(resolvedSearchParams.tags)
    ? resolvedSearchParams.tags
    : typeof resolvedSearchParams.tags === 'string'
    ? [resolvedSearchParams.tags]
    : []
  const minDiscount = typeof resolvedSearchParams.minDiscount === 'string'
    ? parseInt(resolvedSearchParams.minDiscount)
    : undefined
  const maxDiscount = typeof resolvedSearchParams.maxDiscount === 'string'
    ? parseInt(resolvedSearchParams.maxDiscount)
    : undefined
  const sortBy = (typeof resolvedSearchParams.sortBy === 'string'
    ? resolvedSearchParams.sortBy
    : 'trending') as SortOption

  // Fetch all coupons from server (with mock data fallback)
  const allCoupons = await getCouponsForLanding(localeCode)

  // Get all unique filter options
  const categories = getAllCategories(allCoupons)
  const stores = getAllStores(allCoupons)
  const allTags = getAllTags(allCoupons)

  // Apply filters and sorting on server
  const filteredCoupons = applyFiltersAndSort(
    allCoupons,
    {
      search,
      category,
      store,
      tags,
      minDiscount,
      maxDiscount,
    },
    sortBy
  )

  // Categorize filtered coupons for different sections
  const categorizedCoupons = categorizeCouponsForLanding(filteredCoupons)

  return (
    <CouponsLandingPage
      locale={locale}
      heroCoupons={categorizedCoupons.heroCoupons}
      featuredCoupons={categorizedCoupons.featuredCoupons}
      expiringCoupons={categorizedCoupons.expiringCoupons}
      gridCoupons={categorizedCoupons.gridCoupons}
      trendingCoupons={categorizedCoupons.trendingCoupons}
      allCoupons={allCoupons}
      categories={categories}
      stores={stores}
      tags={allTags}
      initialSearch={search}
      initialCategory={category || 'All'}
      initialStore={store || 'All'}
      initialTags={tags}
      initialMinDiscount={minDiscount}
      initialMaxDiscount={maxDiscount}
      initialSortBy={sortBy}
    />
  )
}
