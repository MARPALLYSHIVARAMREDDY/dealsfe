import { getDeals } from '@/data/deals/deals-server-only'
import { type LocaleCode } from '@/lib/locale-utils'
import { transformAllProducts } from './transform';
import {
  applyTabFilter,
  applySidebarFilters,
  applySorting,
  type FilterTabType,
} from '@/utils/alldealsconfig';
import { Deal, AllDealsFilterState, ServiceResponse } from '@/types/alldeals.types';

/**
 * Map filter tab to API tag slug
 */
const mapTabToTag = (tab?: FilterTabType): string | undefined => {
  if (!tab || tab === 'all') return undefined

  const mapping: Record<FilterTabType, string | undefined> = {
    all: undefined,
    blackfriday: 'black-friday',
    hot: 'hot-deal',
    new: 'new-arrival',
    yours: undefined, // Requires user auth
    mostviewed: undefined, // Handle via sorting
  }

  return mapping[tab]
}

export const fetchAllDeals = async (
  locale: LocaleCode,
  filters?: AllDealsFilterState
): Promise<ServiceResponse<Deal[]>> => {
  try {
    // Fetch deals from API
    const tagSlug = mapTabToTag(filters?.tab)
    const { deals: apiDeals, meta } = await getDeals(locale, {
      page: 1,
      limit: 100,
      tagSlugs: tagSlug ? [tagSlug] : undefined,
    })

    // Use API deals directly (already transformed by getDeals)
    let transformedDeals = apiDeals

    // Apply server-side filters
    let filteredDeals = [...transformedDeals];
    const totalCount = meta.totalCount;

    // Note: Tab filter already applied via API tagSlug parameter
    // Only apply additional tab filtering if needed for special cases
    if (filters?.tab && filters.tab !== 'all' && !tagSlug) {
      filteredDeals = applyTabFilter(filteredDeals, filters.tab);
    }

    // 2. Apply sidebar filters (category, store, brand, discount)
    const sidebarFilters = {
      category: filters?.category || null,
      subcategory: filters?.subcategory || null,
      store: filters?.store || null,
      brand: filters?.brand || null,
      discount: filters?.discount || null,
      sortBy: filters?.sortBy || 'newest',
    };

    filteredDeals = applySidebarFilters(filteredDeals, sidebarFilters);

    // 3. Apply sorting
    filteredDeals = applySorting(filteredDeals, sidebarFilters.sortBy);

    return {
      success: true,
      data: filteredDeals,
      error: null,
      metadata: {
        totalCount: totalCount,
        filteredCount: filteredDeals.length,
        page: meta.page,
        totalPages: meta.totalPages,
        hasMore: meta.page < meta.totalPages,
      },
    };
  } catch (error) {
    console.error('Error fetching all deals:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch all deals',
      metadata: {
        totalCount: 0,
        filteredCount: 0,
      },
    };
  }
};


export const fetchDealById = async (
  locale: LocaleCode,
  id: string
): Promise<ServiceResponse<Deal | null>> => {
  try {
    const result = await fetchAllDeals(locale);

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch all deals');
    }

    // Data is already transformed by fetchAllDeals
    const deal = result.data.find((product) => product.id === id);

    if (!deal) {
      throw new Error(`Deal with id ${id} not found`);
    }

    return {
      success: true,
      data: deal,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching deal by ID:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch deal',
    };
  }
};


export const getTopDeals = async (
  locale: LocaleCode,
  limit: number = 12
): Promise<ServiceResponse<Deal[]>> => {
  try {
    // Fetch latest deals from API (no tag filtering for home page)
    const { deals, meta } = await getDeals(locale, {
      page: 1,
      limit,
    })

    return {
      success: true,
      data: deals,
      error: null,
      metadata: {
        totalCount: meta.totalCount,
        filteredCount: deals.length,
        page: meta.page,
        totalPages: meta.totalPages,
      },
    };
  } catch (error) {
    console.error('Error fetching top deals:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch top deals',
      metadata: {
        totalCount: 0,
        filteredCount: 0,
      },
    };
  }
};
