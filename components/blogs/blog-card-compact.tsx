'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import { ShareButton } from './share-button'
import type { Blog } from '@/types/blogs.types'

interface BlogCardCompactProps {
  blog: Blog
}

export const BlogCardCompact = ({ blog }: BlogCardCompactProps) => {
  const imageUrl = blog.coverImage || blog.image || '/placeholder-blog.jpg'

  return (
    <Link href={`/blogs/${blog.slug || blog.id}`} className="block">
      <article className="flex gap-3 bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-all duration-200 group p-2">
        {/* Thumbnail Image */}
        <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden">
          <Image
            src={imageUrl}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="80px"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between py-1 pr-1 min-w-0">
          {/* Title */}
          <h3 className="font-semibold text-foreground text-xs line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {blog.title}
          </h3>

          {/* Metadata */}
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            {blog.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" />
                {blog.timeAgo || blog.formattedDate}
              </span>
            )}
            {blog.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {blog.readTime}
              </span>
            )}
          </div>
        </div>

        {/* Share Button */}
        <div className="self-start">
          <ShareButton blog={blog} size="sm" />
        </div>
      </article>
    </Link>
  )
}

export default BlogCardCompact
