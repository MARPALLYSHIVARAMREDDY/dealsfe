'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Eye, ThumbsUp } from 'lucide-react'
import { ShareButton } from './share-button'
import type { Blog } from '@/types/blogs.types'

interface BlogCardFeaturedProps {
  blog: Blog
  showExcerpt?: boolean
}

export const BlogCardFeatured = ({ blog, showExcerpt = true }: BlogCardFeaturedProps) => {
  const imageUrl = blog.coverImage || blog.image || '/placeholder-blog.jpg'

  return (
    <Link href={`/blogs/${blog.slug || blog.id}`} className="block">
      <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
          {/* Category Badge Overlay */}
          {blog.category && (
            <div className="absolute top-3 left-3">
              <span className="inline-block px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-md shadow-md">
                {blog.category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <h3 className="font-semibold text-foreground text-base lg:text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {blog.title}
          </h3>

          {/* Excerpt */}
          {showExcerpt && blog.excerpt && (
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* Author Info */}
          {blog.author && (
            <div className="flex items-center gap-2 pt-1">
              {blog.author.avatar && (
                <Image
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span className="text-xs text-foreground font-medium">
                {blog.author.name}
              </span>
            </div>
          )}

          {/* Metadata & Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {blog.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {blog.timeAgo || blog.formattedDate}
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

          {/* Engagement Stats */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {blog.likes !== undefined && (
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  {blog.likes}
                </span>
              )}
              {blog.views !== undefined && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {blog.views}
                </span>
              )}
            </div>
            {/* Share Button */}
            <ShareButton blog={blog} size="sm" />
          </div>
        </div>
      </article>
    </Link>
  )
}

export default BlogCardFeatured
