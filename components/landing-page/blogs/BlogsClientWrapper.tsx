'use client'

import BlogSection from '@/components/blogs/blogs'
import type { Blog } from '@/types/blogs.types'
import { useStickyScroll } from '@/hooks/useStickyScroll'

interface BlogsClientWrapperProps {
  blogs: Blog[]
  variant?: 'default' | 'sidebar'
}

/**
 * Client wrapper that handles client-side interactions for Blogs
 * This component receives server-fetched data and adds client-side callbacks
 */
const BlogsClientWrapper = ({ blogs, variant = 'sidebar' }: BlogsClientWrapperProps) => {
  const topOffset = 96 // Match the default from useStickyScroll
  const { ref: stickyRef } = useStickyScroll({ topOffset })

  // Only apply sticky behavior for sidebar variant
  const stickyStyles = variant === 'sidebar' ? {
    position: 'sticky' as const,
    top: `${topOffset}px`,
    alignSelf: 'flex-start',
    maxHeight: `calc(100vh - ${topOffset}px - 20px)`,
    overflowY: 'auto' as const,
  } : {}

  return (
    <div ref={stickyRef} style={stickyStyles}>
      <BlogSection blogs={blogs} variant={variant} />
    </div>
  )
}

export default BlogsClientWrapper
