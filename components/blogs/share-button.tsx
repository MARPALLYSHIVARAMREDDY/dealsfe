'use client'

import { Share } from 'lucide-react'
import { shareBlog } from '@/lib/share-utils'
import type { Blog } from '@/types/blogs.types'

interface ShareButtonProps {
  blog: Blog
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showToast?: boolean
}

export const ShareButton = ({
  blog,
  size = 'md',
  className = '',
  showToast = false
}: ShareButtonProps) => {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const success = await shareBlog(blog)

    // Optional: Show toast notification
    if (showToast && success) {
      // You can integrate with sonner or your toast system here
      console.log('Shared successfully!')
    }
  }

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-2.5',
  }

  return (
    <button
      onClick={handleShare}
      className={`
        ${buttonSizeClasses[size]}
        hover:bg-accent rounded-full
        transition-colors duration-200
        group
        ${className}
      `}
      aria-label={`Share ${blog.title}`}
      type="button"
    >
      <Share
        className={`
          ${sizeClasses[size]}
          text-muted-foreground
          group-hover:text-foreground
          transition-colors
        `}
      />
    </button>
  )
}

export default ShareButton
