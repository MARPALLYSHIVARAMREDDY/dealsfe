import Link from 'next/link'
import { BookOpen, TrendingUp, Sparkles } from 'lucide-react'
import BlogHeroBanner from './blog-hero-banner'
import BlogCarousel from './blog-carousel'
import BlogCardFeatured from './blog-card-featured'
import BlogCardCompact from './blog-card-compact'
import BlogCardGrid from './blog-card-grid'
import BlogSearchFilters from './blog-search-filters'
import BlogSortTabs from './blog-sort-tabs'
import BlogActiveFilters from './blog-active-filters'
import HorizontalBlogCards from './horizontal-blog-cards'
import NativeAd from '@/components/common/native-ad'
import type { Blog } from '@/types/blogs.types'
import type { SortOption } from '@/lib/blogs-filter-utils'
import { getAllCategories, filterBlogsByCategory } from '@/lib/blogs-filter-utils'

interface BlogsLandingPageProps {
  locale: string
  heroBlogs: Blog[]
  featuredBlogs: Blog[]
  latestBlogs: Blog[]
  gridBlogs: Blog[]
  trendingBlogs: Blog[]
  allBlogs: Blog[]
  categories: string[]
  initialSearch?: string
  initialCategory?: string
  initialSortBy?: SortOption
}

export default function BlogsLandingPage({
  locale,
  heroBlogs,
  featuredBlogs,
  latestBlogs,
  gridBlogs,
  trendingBlogs,
  allBlogs,
  categories,
  initialSearch = '',
  initialCategory = 'All',
  initialSortBy = 'latest',
}: BlogsLandingPageProps) {
  // Group blogs by category for horizontal sections
  const uniqueCategories = getAllCategories(allBlogs).filter(cat => cat !== 'All')
  const categorySections = uniqueCategories
    .map(category => ({
      category,
      blogs: filterBlogsByCategory(allBlogs, category)
    }))
    .filter(section => section.blogs.length >= 3) // Only show categories with at least 3 blogs
    .slice(0, 8) // Limit to top 8 categories

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="w-full mb-6 md:mb-8">
        <BlogHeroBanner locale={locale} />
      </div>

      {/* Search & Filters */}
      <section className="container mx-auto px-4 pt-6">
        <BlogSearchFilters
          initialSearch={initialSearch}
          initialCategory={initialCategory}
          categories={categories}
        />
        <BlogActiveFilters search={initialSearch} category={initialCategory} />
      </section>

      {/* Sort Tabs */}
      <section className="container mx-auto px-4 py-4">
        <BlogSortTabs value={initialSortBy} />
      </section>

      {/* Three-Column Layout (Desktop) */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Desktop Layout - 3 Columns */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Featured Blogs */}
          <aside className="lg:col-span-3">
            <div className="sticky top-4 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Featured Guides
                </h2>
              </div>
              <div className="space-y-4">
                {featuredBlogs.map((blog) => (
                  <BlogCardFeatured key={blog.id} blog={blog} />
                ))}
              </div>
            </div>
          </aside>

          {/* Center - Carousel + Ad + Category Sections */}
          <main className="lg:col-span-6">
            {/* Carousel */}
            <BlogCarousel blogs={heroBlogs} />

            {/* Ad Section */}
            <div className="mt-6">
              <NativeAd variant="horizontal" />
            </div>

            {/* Category-based Vertical Sections */}
            <div className="space-y-6 mt-6">
              {categorySections.map((section, index) => (
                <div key={section.category}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-foreground">
                        {section.category}
                      </h2>
                      <Link
                        href={`/${locale}/blogs?category=${section.category}`}
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        View All
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {section.blogs.slice(0, 4).map((blog) => (
                        <BlogCardCompact key={blog.id} blog={blog} />
                      ))}
                    </div>
                  </div>
                  {/* Ad after each section */}
                  <div className="mt-6">
                    <NativeAd variant="horizontal" />
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* Right Sidebar - Latest Articles */}
          <aside className="lg:col-span-3">
            <div className="sticky top-4 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Latest Articles
                </h2>
              </div>
              <div className="space-y-3">
                {latestBlogs.map((blog) => (
                  <BlogCardCompact key={blog.id} blog={blog} />
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile & Tablet Layout - Stacked */}
        <div className="lg:hidden space-y-6">
          {/* Carousel First */}
          <section>
            <BlogCarousel blogs={heroBlogs} />
          </section>

          {/* Ad Section */}
          <section>
            <NativeAd variant="horizontal" />
          </section>

          {/* Category-based Vertical Sections */}
          {categorySections.map((section, index) => (
            <div key={section.category}>
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    {section.category}
                  </h2>
                  <Link
                    href={`/${locale}/blogs?category=${section.category}`}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {section.blogs.slice(0, 4).map((blog) => (
                    <BlogCardCompact key={blog.id} blog={blog} />
                  ))}
                </div>
              </section>
              {/* Ad after each section */}
              <section>
                <NativeAd variant="horizontal" />
              </section>
            </div>
          ))}

          {/* Latest Articles */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Latest Articles
              </h2>
            </div>
            <div className="space-y-3">
              {latestBlogs.map((blog) => (
                <BlogCardCompact key={blog.id} blog={blog} />
              ))}
            </div>
          </section>

          {/* Featured Blogs */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Featured Guides
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredBlogs.map((blog) => (
                <BlogCardFeatured key={blog.id} blog={blog} />
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
      <HorizontalBlogCards
        blogs={trendingBlogs}
        title="Trending Stories"
        showViewAll={true}
        viewAllHref={`/${locale}/blogs?sortBy=trending`}
      />

      {/* Bottom Grid Section - Popular Topics */}
      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Popular Topics
          </h2>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {gridBlogs.map((blog, index) => (
            <div
              key={blog.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <BlogCardGrid blog={blog} />
            </div>
          ))}
        </div>
      </section>

      {/* Optional: Call to Action Section */}
      <section className="container mx-auto px-4 py-8 mb-8">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 md:p-8 border border-primary/20">
          <div className="max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Never Miss a Deal
            </h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter and get the best deals delivered straight to your inbox.
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
