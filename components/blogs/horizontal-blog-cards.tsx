import Link from 'next/link'
import { TrendingUp, ArrowRight } from 'lucide-react'
import BlogCardCompact from './blog-card-compact'
import type { Blog } from '@/types/blogs.types'

interface HorizontalBlogCardsProps {
  blogs: Blog[]
  title?: string
  showViewAll?: boolean
  viewAllHref?: string
}

export const HorizontalBlogCards = ({
  blogs,
  title = 'Trending Stories',
  showViewAll = true,
  viewAllHref = '#',
}: HorizontalBlogCardsProps) => {
  if (!blogs || blogs.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="h-6 w-6 md:h-7 md:w-7 text-primary" />
          {title}
        </h2>

        {showViewAll && (
          <Link
            href={viewAllHref}
            className="text-sm md:text-base text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
          >
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        <div
          className="
            flex gap-4 overflow-x-auto pb-4
            snap-x snap-mandatory
            [&::-webkit-scrollbar]:hidden
            [-ms-overflow-style:none]
            [scrollbar-width:none]
          "
        >
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="w-[280px] md:w-[320px] flex-shrink-0 snap-start"
            >
              <BlogCardCompact blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HorizontalBlogCards
