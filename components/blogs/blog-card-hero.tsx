'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Sparkles } from 'lucide-react'
import { ShareButton } from './share-button'
import type { Blog } from '@/types/blogs.types'

interface BlogCardHeroProps {
  blog: Blog
  priority?: boolean
}

export const BlogCardHero = ({ blog, priority = false }: BlogCardHeroProps) => {
  const imageUrl = blog.coverImage || blog.image || '/placeholder-blog.jpg'

  return (
    <Link href={`/blogs/${blog.slug || blog.id}`} className="block">
      <article className="relative w-full h-[35vh] lg:h-[55vh] rounded-2xl overflow-hidden group">
        {/* Background Image */}
        <Image
          src={imageUrl}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 60vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-between p-4 md:p-6 lg:p-8">
          {/* Top Row: Category Badge + Share Button */}
          <div className="flex items-start justify-between">
            {/* Category Badge */}
            {blog.category && (
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-md shadow-lg">
                {blog.category}
              </span>
            )}

            {/* Share Button */}
            <ShareButton
              blog={blog}
              size="md"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
            />
          </div>

          {/* Bottom Content */}
          <div className="space-y-3">
            {/* Title */}
            <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-white line-clamp-2 leading-tight">
              {blog.title}
            </h2>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-white/90 text-xs md:text-sm">
              {blog.author && (
                <span className="font-medium">{blog.author.name}</span>
              )}
              {blog.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {blog.formattedDate || blog.timeAgo}
                </span>
              )}
              {blog.readTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {blog.readTime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom-right Promotional Badge (35% OFF style) */}
        <div
          className="
            absolute bottom-0 right-0
            h-[8vh] w-[20vw] min-w-[120px] md:min-w-[140px]
            bg-white/95 backdrop-blur-sm
            rounded-tl-2xl
            border-l-2 border-t-2 border-gray-200
            shadow-lg
            flex items-center justify-center gap-2 p-3
            transition-all duration-500 ease-out
            hover:scale-105 hover:shadow-xl
          "
        >
          <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary animate-pulse" />
          <span className="text-xs md:text-sm font-bold text-gray-800 text-center leading-tight">
            Top Deal
          </span>
        </div>
      </article>
    </Link>
  )
}

export default BlogCardHero
