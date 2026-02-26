import { Suspense } from "react";
import { headers } from "next/headers";
import AllDealsClientWrapperWithParams from "@/components/alldeals/AllDealsClientWrapperWithParams";
import AllDealsBreadcrumb from "@/components/alldeals/all-deals-breadcrumb";
import { ListingHeader } from "@/components/listing-header";
import { fetchAllDeals } from "@/lib/alldeals-service";
import { AllDealsFilterState } from "@/types/alldeals.types";
import { FilterTabType } from "@/utils/alldealsconfig";
import { type LocaleCode } from "@/lib/locale-utils";
import {
  MultiSelectFiltersSidebarServer,
  ActiveFiltersBarServer,
  MobileBottomActionBarServer,
  parseSearchParams,
} from "@/components/filters";
import {
  applyMultiSelectFilters,
  hasMultiSelectFilters,
} from "@/lib/filter-bridge";
import {
  getCategories,
  getBrands,
  getStores,
} from "@/data/catalogues/catalogues-server-only";
import { getTags } from "@/data/breadcrumb/breadcrumb-server-only";
import {
  getCategorySlugsById,
  getBrandSlugsById,
  getStoreSlugsById,
  getTagSlugsById,
  getCategoryIdsBySlug,
  getBrandIdsBySlug,
  getStoreIdsBySlug,
  getTagIdsBySlug,
} from "@/lib/filter-mappers";
import { getDeals } from "@/data/deals/deals-server-only";
import { getCountryCodeFromLocale } from "@/lib/locale-utils";

async function AllDealsPageContent({
  searchParams,
  locale,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  locale: LocaleCode;
}) {
  // Access headers to opt into dynamic rendering
  await headers();

  // Parse URL search params (now contains slugs for SEO-friendly URLs)
  const parsedParams = parseSearchParams(searchParams);

  // Fetch filter metadata in parallel
  const [categories, brands, stores, tags] = await Promise.all([
    getCategories(),
    getBrands(),
    getStores(),
    getTags(locale),
  ]);

  // URL params contain slugs, so we use them directly for API filtering
  // parsedParams.categoryIds actually contains slugs (naming is legacy)
  const categorySlugs = parsedParams.categoryIds;
  const brandSlugs = parsedParams.brandIds;
  const storeSlugs = parsedParams.storeIds;
  const tagSlugs = parsedParams.tagIds;

  // Extract price filter params (already parsed as numbers by parseSearchParams)
  const maxPrice = parsedParams.maxPrice;
  const minPrice = parsedParams.minPrice;

  // Build API filter params with slugs
  const apiFilterParams = {
    page: 1,
    limit: 100,
    country: getCountryCodeFromLocale(locale),
    categorySlugs: categorySlugs.length > 0 ? categorySlugs : undefined,
    brandSlugs: brandSlugs.length > 0 ? brandSlugs : undefined,
    storeSlugs: storeSlugs.length > 0 ? storeSlugs : undefined,
    tagSlugs: tagSlugs.length > 0 ? tagSlugs : undefined,
    sortBy: parsedParams.sortBy || "newest",
    minDiscount: parsedParams.minDiscount,
    maxDiscount: parsedParams.maxDiscount,
    minPrice: minPrice,
    maxPrice: maxPrice,
  };
  console.log({ apiFilterParams });
  // Fetch deals with API filtering (server-side filtering)
  const result = await getDeals(locale, apiFilterParams);
  let deals = result.deals;
  const error = deals.length === 0 ? "No deals found" : null;

  // Parse old single-value filter state for legacy components
  const filters: AllDealsFilterState = {
    tab: (searchParams?.tab as FilterTabType) || "all",
    category: (searchParams?.category as string) || null,
    subcategory: (searchParams?.subcategory as string) || null,
    store: (searchParams?.store as string) || null,
    brand: (searchParams?.brand as string) || null,
    discount: (searchParams?.discount as string) || null,
    sortBy: (searchParams?.sortBy as string) || "newest",
    viewMode: (searchParams?.viewMode as "grid" | "list") || "grid",
  };

  return (
    <>
      <ListingHeader title="Deals Mocktail 2026 Verified Deals" />
      <AllDealsBreadcrumb locale={locale} searchParams={searchParams} />

      {/* Main Container: Sidebar + Content */}
      <div className="md:mx-4 py-4">
        <div className="flex flex-col md:flex-row gap-0 md:gap-6">
          {/* Left: Filters Sidebar (Desktop) / Hidden on Mobile */}
          <MultiSelectFiltersSidebarServer
            searchParams={searchParams}
            locale={locale}
            hideMobileButton={true}
          />

          {/* Right: Products List */}
          <div className="flex-1 min-w-0 pb-20 md:pb-0">
            {/* Header with title */}

            {/* Active Filters Bar */}
            <ActiveFiltersBarServer
              searchParams={searchParams}
              locale={locale}
            />

            {/* Products Grid */}
            <AllDealsClientWrapperWithParams
              initialDeals={deals}
              initialFilters={filters}
              isLoading={false}
              error={error}
              pageType="listing"
            />
          </div>
        </div>

        {/* Mobile Bottom Action Bar */}
        <MobileBottomActionBarServer
          searchParams={searchParams}
          locale={locale}
        />
      </div>
    </>
  );
}

export default async function AllDealsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <div className="">
      <Suspense
        fallback={
          <AllDealsClientWrapperWithParams
            initialDeals={[]}
            initialFilters={{}}
            isLoading={true}
            pageType="listing"
          />
        }
      >
        <AllDealsPageContent
          searchParams={resolvedSearchParams}
          locale={locale as LocaleCode}
        />
      </Suspense>
    </div>
  );
}
