'use client'

import { Sparkles, Clock, TrendingUp } from 'lucide-react'
import type { Coupon } from '@/types/coupons.types'
import type { SortOption } from '@/lib/coupons-filter-utils'
import CouponHeroBanner from './coupon-hero-banner'
import CouponSearchFilters from './coupon-search-filters'
import CouponSortTabs from './coupon-sort-tabs'
import CouponActiveFilters from './coupon-active-filters'
import CouponCarousel from './coupon-carousel'
import CouponCardList from './coupon-card-list'
import CouponCardFeatured from './coupon-card-featured'
import CouponCardCompact from './coupon-card-compact'
import CouponCardGrid from './coupon-card-grid'
import HorizontalCouponCards from './horizontal-coupon-cards'
import NativeAd from '@/components/common/native-ad'

interface CouponsLandingPageProps {
  locale: string
  heroCoupons: Coupon[]
  featuredCoupons: Coupon[]
  expiringCoupons: Coupon[]
  gridCoupons: Coupon[]
  trendingCoupons: Coupon[]
  allCoupons: Coupon[]
  categories: string[]
  stores: string[]
  tags: string[]
  initialSearch?: string
  initialCategory?: string
  initialStore?: string
  initialTags?: string[]
  initialMinDiscount?: number
  initialMaxDiscount?: number
  initialSortBy?: SortOption
}

export default function CouponsLandingPage({
  locale,
  heroCoupons,
  featuredCoupons,
  expiringCoupons,
  gridCoupons,
  trendingCoupons,
  categories,
  initialSearch = '',
  initialCategory = 'All',
  initialSortBy = 'trending',
}: CouponsLandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="w-full mb-6 md:mb-8">
        <CouponHeroBanner locale={locale} />
      </div>

      {/* Search & Filters */}
      <section className="container mx-auto px-4 pt-6">
        <CouponSearchFilters
          initialSearch={initialSearch}
          initialCategory={initialCategory}
          categories={categories}
        />
        <CouponActiveFilters search={initialSearch} category={initialCategory} />
      </section>

      {/* Sort Tabs */}
      <section className="container mx-auto px-4 py-4">
        <CouponSortTabs value={initialSortBy} />
      </section>

      {/* Three-Column Layout (Desktop) */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Desktop Layout - 3 Columns */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Featured Coupons */}
          <aside className="lg:col-span-3">
            <div className="sticky top-4 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Featured Deals
                </h2>
              </div>
              <div className="space-y-4">
                {featuredCoupons.map((coupon) => (
                  <CouponCardFeatured key={coupon.id} coupon={coupon} />
                ))}
              </div>
            </div>
          </aside>

          {/* Center - Main List */}
          <main className="lg:col-span-6">
            {/* Carousel */}
            {heroCoupons.length > 0 && (
              <div className="mb-6">
                <CouponCarousel coupons={heroCoupons} />
              </div>
            )}

            {/* Ad Section */}
            <div className="mb-6">
              <NativeAd variant="horizontal" />
            </div>

            {/* Main Coupon List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">All Coupons</h2>
              {gridCoupons.map((coupon) => (
                <CouponCardList key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </main>

          {/* Right Sidebar - Expiring Soon */}
          <aside className="lg:col-span-3">
            <div className="sticky top-4 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Expiring Soon
                </h2>
              </div>
              <div className="space-y-3">
                {expiringCoupons.map((coupon) => (
                  <CouponCardCompact key={coupon.id} coupon={coupon} />
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile & Tablet Layout - Stacked */}
        <div className="lg:hidden space-y-6">
          {/* Carousel First */}
          {heroCoupons.length > 0 && (
            <section>
              <CouponCarousel coupons={heroCoupons} />
            </section>
          )}

          {/* Ad Section */}
          <section>
            <NativeAd variant="horizontal" />
          </section>

          {/* Main Coupon List */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">All Coupons</h2>
            {gridCoupons.map((coupon) => (
              <CouponCardList key={coupon.id} coupon={coupon} />
            ))}
          </section>

          {/* Expiring Soon */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Expiring Soon
              </h2>
            </div>
            <div className="space-y-3">
              {expiringCoupons.map((coupon) => (
                <CouponCardCompact key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </section>

          {/* Featured Coupons */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Featured Deals
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredCoupons.map((coupon) => (
                <CouponCardFeatured key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Native Ad Placement */}
      <section className="container mx-auto px-4 py-4 md:py-6">
        <NativeAd variant="horizontal" />
      </section>

      {/* Horizontal Trending Cards */}
      <HorizontalCouponCards
        coupons={trendingCoupons}
        title="Trending Coupons"
        showViewAll={true}
        viewAllHref={`/${locale}/coupons?sortBy=trending`}
      />

      {/* Bottom Grid Section - Popular Coupons */}
      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Popular Coupons
          </h2>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {gridCoupons.slice(0, 12).map((coupon, index) => (
            <div
              key={coupon.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CouponCardGrid coupon={coupon} />
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-4 py-8 mb-8">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 md:p-8 border border-primary/20">
          <div className="max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Never Miss a Deal
            </h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter and get the best coupons and deals delivered straight to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Email address"
              />
              <button className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
