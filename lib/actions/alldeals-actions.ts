'use server'

import { fetchAllDeals } from '@/lib/alldeals-service'
import { AllDealsFilterState, ServiceResponse, Deal } from '@/types/alldeals.types'
import { type LocaleCode } from '@/lib/locale-utils'

/**
 * Server Action to filter deals
 * Called from home page client wrapper (no URL params)
 *
 * This action provides server-side filtering without modifying the URL,
 * keeping the home page URL clean while still benefiting from server-side processing.
 *
 * @param locale - User's locale
 * @param filters - Filter state from client
 * @returns Filtered deals with metadata
 */
export async function filterAllDealsAction(
  locale: LocaleCode,
  filters: AllDealsFilterState
): Promise<ServiceResponse<Deal[]>> {
  try {
    const result = await fetchAllDeals(locale, filters)
    return result
  } catch (error) {
    console.error('Server Action error filtering deals:', error)
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to filter deals',
      metadata: {
        totalCount: 0,
        filteredCount: 0,
      },
    }
  }
}
