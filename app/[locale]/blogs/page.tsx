import { headers } from 'next/headers'
import BlogsLandingPage from '@/components/blogs/blogs-landing-page'
import { getBlogsForLanding } from '@/data/blogs/blogs-server-only'
import { categorizeBlogsForLanding } from '@/data/mock/blogs-mock-data'
import { applyFiltersAndSort, getAllCategories, type SortOption } from '@/lib/blogs-filter-utils'
import type { LocaleCode } from '@/lib/locale-utils'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BlogsPage({ params, searchParams }: PageProps) {
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
  const sortBy = (typeof resolvedSearchParams.sortBy === 'string'
    ? resolvedSearchParams.sortBy
    : 'latest') as SortOption

  // Fetch all blogs from server (with mock data fallback)
  const allBlogs = await getBlogsForLanding(localeCode)

  // Get all unique categories for filter chips
  const categories = getAllCategories(allBlogs)

  // Apply filters and sorting on server
  const filteredBlogs = applyFiltersAndSort(allBlogs, { search, category }, sortBy)

  // Categorize filtered blogs for different sections
  const categorizedBlogs = categorizeBlogsForLanding(filteredBlogs)

  return (
    <BlogsLandingPage
      locale={locale}
      heroBlogs={categorizedBlogs.heroBlogs}
      featuredBlogs={categorizedBlogs.featuredBlogs}
      latestBlogs={categorizedBlogs.latestBlogs}
      gridBlogs={categorizedBlogs.gridBlogs}
      trendingBlogs={categorizedBlogs.trendingBlogs}
      allBlogs={allBlogs}
      categories={categories}
      initialSearch={search}
      initialCategory={category || 'All'}
      initialSortBy={sortBy}
    />
  )
}
