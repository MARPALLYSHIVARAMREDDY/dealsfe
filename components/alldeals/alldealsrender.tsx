"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Percent,
  Flame,
} from "lucide-react";
import ProductCard from "@/components/card/productcard";
import NativeAd from "@/components/common/native-ad";
import SortBy from "@/components/sort-by/sort-by";
import {
  FilterTabType,
  filterTabsConfig,
  AllDealsFilterValues,
} from "@/utils/alldealsconfig";
import { useAppDispatch } from "@/store/hooks";
import { openPreview } from "@/store/preview-store";

type ViewMode = "grid" | "list";

interface SheetFilters extends AllDealsFilterValues {}

type GridItem =
  | { type: "deal"; data: any; index: number }
  | { type: "ad"; id: string; deviceType: "mobile" | "desktop" };

const ITEMS_PER_PAGE = 100;
const AD_CONFIG = {
  mobile: { interval: 10 },
  desktop: { interval: 18 },
};

// Utility function to merge deals with ad placements
const createGridItems = (deals: any[]): GridItem[] => {
  const items: GridItem[] = [];

  deals.forEach((deal, index) => {
    items.push({ type: "deal", data: deal, index });

    const position = index + 1;
    const isNotLastDeal = index < deals.length - 1;

    if (position % AD_CONFIG.mobile.interval === 0 && isNotLastDeal) {
      items.push({
        type: "ad",
        id: `ad-mobile-${index}`,
        deviceType: "mobile",
      });
    }

    if (position % AD_CONFIG.desktop.interval === 0 && isNotLastDeal) {
      items.push({
        type: "ad",
        id: `ad-desktop-${index}`,
        deviceType: "desktop",
      });
    }
  });

  return items;
};

interface AllDealsRenderProps {
  allDeals: any[];
  loading: boolean;
  error: string | null;
  activeFilter: FilterTabType;
  onActiveFilterChange: (filter: FilterTabType) => void;
  sheetFilters?: SheetFilters; // Optional (can be omitted)
  onSheetFiltersChange?: (filters: SheetFilters) => void; // Optional (can be omitted)
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onClearFilters: () => void;
  pageType?: "home" | "listing";
}

export default function AllDealsRender({
  allDeals,
  loading,
  error,
  activeFilter,
  onActiveFilterChange,
  sheetFilters, // Now optional
  onSheetFiltersChange, // Now optional
  viewMode,
  onViewModeChange,
  onClearFilters,
  pageType = "home",
}: AllDealsRenderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  // Handler to open preview modal with product data
  const handleProductPreview = (deal: any) => {
    dispatch(
      openPreview({
        data: {
          id: deal.id,
          title: deal.title,
          description: deal.description,
          price: deal.salePrice,
          originalPrice: deal.originalPrice,
          discount: deal.discountPercent,
          imageUrl: deal.image,
          store: deal.store,
          brand: deal.brand,
          category: deal.category,
          badges: deal.badges,
          badgeColor: deal.badgeColor,
          badgeTextColor: deal.badgeTextColor,
          isHot: deal.isHot,
          isTrending: deal.isTrending,
          affiliateUrl: deal.affiliateUrl,
        },
        allProducts: displayDeals.map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          price: d.salePrice,
          originalPrice: d.originalPrice,
          discount: d.discountPercent,
          imageUrl: d.image,
          store: d.store,
          brand: d.brand,
          category: d.category,
          badges: d.badges,
          badgeColor: d.badgeColor,
          badgeTextColor: d.badgeTextColor,
          isHot: d.isHot,
          isTrending: d.isTrending,
          affiliateUrl: d.affiliateUrl,
        })),
      })
    );
  };

  // Get filter tabs with icons
  const filterTabs = filterTabsConfig.map((filter) => ({
    ...filter,
    icon:
      filter.id === "blackfriday" ? (
        <Percent className="h-3 w-3" />
      ) : filter.id === "hot" ? (
        <Flame className="h-3 w-3" />
      ) : undefined,
  }));

  // Only calculate if sheetFilters is provided
  const activeFiltersCount = sheetFilters
    ? [
        sheetFilters.category,
        sheetFilters.subcategory,
        sheetFilters.store,
        sheetFilters.brand,
        sheetFilters.discount,
      ].filter(Boolean).length
    : 0;

  // Data is already filtered by server
  // No need to apply client-side filtering
  const filteredDeals = useMemo(() => {
    return allDeals; // Already filtered on server
  }, [allDeals]);

  const displayDeals = filteredDeals.length > 0 ? filteredDeals : allDeals;
  const visibleDeals = displayDeals.slice(0, visibleCount);
  const hasMore = visibleCount < displayDeals.length;

  const gridItems = useMemo(
    () => createGridItems(visibleDeals),
    [visibleDeals]
  );

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, 500);
  };

  // Reset visible count when tab changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeFilter]);

  // Sticky scroll handler
  useEffect(() => {
    const stickyHeight = 40;
    const handleScroll = () => {
      if (sectionRef.current && loadMoreRef.current) {
        const sectionRect = sectionRef.current.getBoundingClientRect();
        const loadMoreRect = loadMoreRef.current.getBoundingClientRect();
        const headerHeight = 56;

        const sectionInView = sectionRect.bottom > headerHeight + stickyHeight;
        const shouldBeSticky =
          sectionRect.top <= headerHeight &&
          loadMoreRect.top > headerHeight + stickyHeight &&
          sectionInView;
        setIsSticky(shouldBeSticky);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleApplyFilters = () => {
    setVisibleCount(ITEMS_PER_PAGE);
    setShowFilterSheet(false);
  };

  const stickyHeight = 40;

  // Loading state
  if (loading) {
    return (
      <section className="py-4 bg-background pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading all deals...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-4 bg-background pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-destructive mb-4">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section ref={sectionRef} className="py-2">
        <div className={pageType === "listing" ? "" : " "}>

          {/* Sort-By Component */}
          <div className="flex justify-end items-center py-3 px-2 md:sticky md:top-14 md:z-40 md:bg-background">
            <SortBy hideMobileButton={true} />
          </div>

          <div
            className={`${
              viewMode === "grid"
                ? "grid gap-1 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                : "flex flex-col gap-1"
            }`}
          >
            {gridItems.map((item, idx) => {
              const animationDelay = `${idx * 50}ms`;

              if (item.type === "ad") {
                const adClasses = {
                  mobile: "col-span-2 md:hidden",
                  desktop: "hidden md:block col-span-full",
                }[item.deviceType];

                return (
                  <div
                    key={item.id}
                    className={`animate-fade-up ${adClasses}`}
                    style={{ animationDelay }}
                  >
                    <NativeAd />
                  </div>
                );
              }

              const { data: deal } = item;
              return (
                <div
                  key={deal.id}
                  className="animate-fade-up w-full"
                  style={{ animationDelay }}
                >
                  <ProductCard
                    id={deal.id}
                    title={deal.title}
                    description={deal.description}
                    category={deal.category}
                    store={deal.store}
                    brand={deal.brand}
                    imageUrl={deal.image}
                    originalPrice={deal.originalPrice}
                    salePrice={deal.salePrice}
                    discountPercent={deal.discountPercent}
                    affiliateUrl={deal.affiliateUrl}
                    badges={deal.badges}
                    badgeColor={deal.badgeColor}
                    badgeTextColor={deal.badgeTextColor}
                    isTrending={deal.isTrending}
                    isHot={deal.isHot}
                    postedAt={deal.postedAt}
                    variant={viewMode === "list" ? "horizontal" : "compact"}
                    onPreviewClick={() => handleProductPreview(deal)}
                  />
                </div>
              );
            })}
          </div>

          <div ref={loadMoreRef} className="text-center mt-8">
            {hasMore ? (
              <button onClick={handleLoadMore} disabled={isLoading}>
                {isLoading
                  ? "Loading..."
                  : `Load More Deals (${
                      displayDeals.length - visibleCount
                    } remaining)`}
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
