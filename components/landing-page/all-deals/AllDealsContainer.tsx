import { headers } from 'next/headers'
import AllDealsClientWrapper from './AllDealsClientWrapper'
import { fetchAllDeals } from '@/lib/alldeals-service'
import { type LocaleCode } from '@/lib/locale-utils'

/**
 * Server component that fetches all deals for HOME PAGE
 * Fetches initial data with default filters (no URL params)
 *
 * This separates data fetching concerns from presentation.
 * The client wrapper handles filter state via Server Actions.
 */
const AllDealsContainer = async ({ locale }: { locale: LocaleCode }) => {
  // Access headers to opt into dynamic rendering
  // Required since we want fresh data on each request
  await headers()

  // Fetch initial data with default filters (show all deals)
  const result = await fetchAllDeals(locale, { tab: 'all' })

  const deals = result.success ? result.data : []
  const error = result.success ? null : result.error

  return (
    <AllDealsClientWrapper
      initialDeals={deals}
      initialFilters={{ tab: 'all' }}
      isLoading={false}
      error={error}
      pageType="home"
    />
  )
}

export default AllDealsContainer
