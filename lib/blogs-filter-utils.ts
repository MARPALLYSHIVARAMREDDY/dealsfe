import type { Blog } from '@/types/blogs.types'

export type SortOption = 'latest' | 'popular' | 'trending' | 'most-read'

/**
 * Filter blogs by search query (searches in title, excerpt, and category)
 * @param blogs - Array of blogs to filter
 * @param query - Search query string
 * @returns Filtered array of blogs
 */
export function filterBlogsBySearch(blogs: Blog[], query: string): Blog[] {
  if (!query || query.trim() === '') return blogs

  const searchLower = query.toLowerCase().trim()

  return blogs.filter((blog) => {
    const titleMatch = blog.title.toLowerCase().includes(searchLower)
    const excerptMatch = blog.excerpt?.toLowerCase().includes(searchLower)
    const categoryMatch = blog.category?.toLowerCase().includes(searchLower)
    const contentMatch = blog.content?.toLowerCase().includes(searchLower)

    return titleMatch || excerptMatch || categoryMatch || contentMatch
  })
}

/**
 * Filter blogs by category
 * @param blogs - Array of blogs to filter
 * @param category - Category name (empty or 'all' for all blogs)
 * @returns Filtered array of blogs
 */
export function filterBlogsByCategory(blogs: Blog[], category: string): Blog[] {
  if (!category || category.trim() === '' || category.toLowerCase() === 'all') {
    return blogs
  }

  return blogs.filter(
    (blog) => blog.category?.toLowerCase() === category.toLowerCase()
  )
}

/**
 * Sort blogs by specified option
 * @param blogs - Array of blogs to sort
 * @param sortBy - Sort option
 * @returns Sorted array of blogs
 */
export function sortBlogs(blogs: Blog[], sortBy: SortOption): Blog[] {
  const blogsCopy = [...blogs]

  switch (sortBy) {
    case 'latest':
      return blogsCopy.sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
        return dateB - dateA // Newest first
      })

    case 'popular':
      return blogsCopy.sort((a, b) => {
        const viewsA = a.views || 0
        const viewsB = b.views || 0
        return viewsB - viewsA // Most views first
      })

    case 'trending':
      return blogsCopy.sort((a, b) => {
        const likesA = a.likes || 0
        const likesB = b.likes || 0
        return likesB - likesA // Most likes first
      })

    case 'most-read':
      return blogsCopy.sort((a, b) => {
        // Combination of views and read time (favor shorter, highly-viewed content)
        const scoreA = (a.views || 0) / parseReadTime(a.readTime || '5 min read')
        const scoreB = (b.views || 0) / parseReadTime(b.readTime || '5 min read')
        return scoreB - scoreA
      })

    default:
      return blogsCopy
  }
}

/**
 * Parse read time string to minutes (e.g., "5 min read" -> 5)
 */
function parseReadTime(readTime: string): number {
  const match = readTime.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 5 // Default to 5 minutes
}

/**
 * Apply all filters and sort to blogs
 * @param blogs - Array of blogs to process
 * @param filters - Object containing search and category filters
 * @param sortBy - Sort option
 * @returns Filtered and sorted array of blogs
 */
export function applyFiltersAndSort(
  blogs: Blog[],
  filters: { search?: string; category?: string },
  sortBy: SortOption = 'latest'
): Blog[] {
  let result = [...blogs]

  // Apply category filter first
  if (filters.category) {
    result = filterBlogsByCategory(result, filters.category)
  }

  // Apply search filter
  if (filters.search) {
    result = filterBlogsBySearch(result, filters.search)
  }

  // Apply sorting
  result = sortBlogs(result, sortBy)

  return result
}

/**
 * Get all unique categories from blogs
 * @param blogs - Array of blogs
 * @returns Array of unique category names
 */
export function getAllCategories(blogs: Blog[]): string[] {
  const categories = blogs
    .map((blog) => blog.category)
    .filter((category): category is string => !!category)

  return ['All', ...Array.from(new Set(categories)).sort()]
}

/**
 * Get trending blogs (sorted by combination of views and likes)
 * @param blogs - Array of blogs
 * @param limit - Number of trending blogs to return
 * @returns Array of trending blogs
 */
export function getTrendingBlogs(blogs: Blog[], limit: number = 10): Blog[] {
  const blogsCopy = [...blogs]

  return blogsCopy
    .sort((a, b) => {
      const scoreA = (a.views || 0) + (a.likes || 0) * 2 // Likes weighted 2x
      const scoreB = (b.views || 0) + (b.likes || 0) * 2
      return scoreB - scoreA
    })
    .slice(0, limit)
}
