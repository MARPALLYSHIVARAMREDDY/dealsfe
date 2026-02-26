import type { Blog } from '@/types/blogs.types'

export interface ShareData {
  title: string
  text: string
  url: string
}

/**
 * Check if Web Share API is supported in the browser
 * @returns true if navigator.share is available
 */
export const canShare = (): boolean => {
  if (typeof navigator === 'undefined') return false
  return !!navigator.share
}

/**
 * Share a blog using Web Share API or fallback to clipboard
 * @param blog - Blog object to share
 * @returns Promise<boolean> - true if share was successful
 */
export const shareBlog = async (blog: Blog): Promise<boolean> => {
  // Construct share data
  const shareData: ShareData = {
    title: blog.title,
    text: blog.excerpt || blog.title,
    url: `${typeof window !== 'undefined' ? window.location.origin : ''}/blogs/${blog.slug || blog.id}`,
  }

  // Try Web Share API first
  if (canShare()) {
    try {
      await navigator.share(shareData)
      return true
    } catch (err) {
      // User cancelled or share failed
      const error = err as Error
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error)
        // Fall through to clipboard fallback
      } else {
        // User cancelled - not an error
        return false
      }
    }
  }

  // Fallback: Copy to clipboard
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url)
      return true
    }
    return false
  } catch (err) {
    console.error('Clipboard copy failed:', err)
    return false
  }
}

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise<boolean> - true if copy was successful
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    }
    return false
  } catch (err) {
    console.error('Clipboard copy failed:', err)
    return false
  }
}
