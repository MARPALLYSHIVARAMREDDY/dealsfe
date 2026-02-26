'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ThumbsUp } from 'lucide-react'
import { ShareButton } from './share-button'
import type { Blog } from '@/types/blogs.types'

interface BlogCardGridProps {
  blog: Blog
}

export const BlogCardGrid = ({ blog }: BlogCardGridProps) => {
  const imageUrl = blog.coverImage || blog.image || '/placeholder-blog.jpg'

  return (
    <Link href={`/blogs/${blog.slug || blog.id}`} className="block">
      <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
        {/* Square Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageUrl}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
          />
          {/* Category Badge */}
          {blog.category && (
            <div className="absolute top-2 left-2">
              <span className="inline-block px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-md shadow-md">
                {blog.category}
              </span>
            </div>
          )}
          {/* Share Button */}
          <div className="absolute top-2 right-2">
            <ShareButton
              blog={blog}
              size="sm"
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex-1 flex flex-col justify-between">
          {/* Title */}
          <h3 className="font-semibold text-foreground text-sm line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>

          {/* Bottom Metadata */}
          <div className="space-y-1.5">
            {/* Author */}
            {blog.author && (
              <p className="text-xs text-muted-foreground truncate">
                {blog.author.name}
              </p>
            )}

            {/* Date & Stats */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {blog.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {blog.timeAgo || blog.formattedDate}
                </span>
              )}
              {blog.likes !== undefined && (
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  {blog.likes}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default BlogCardGrid
