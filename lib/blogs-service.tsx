import { getBlogsFromApi } from '@/data/blogs/blogs-server-only'
import { transformAllBlogs } from './transform'
import { type LocaleCode } from './locale-utils'

export const fetchAllBlogs = async (
  locale: LocaleCode,
  params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
  }
) => {
  try {
    // Fetch blogs from API
    const rawBlogs = await getBlogsFromApi(locale, params)

    // Transform to frontend format
    const transformedData = transformAllBlogs(rawBlogs)

    return {
      success: true,
      data: transformedData,
      error: null,
    }
  } catch (error) {
    console.error('Error fetching all blogs:', error)
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch all blogs',
    }
  }
}

export const fetchBlogById = async (locale: LocaleCode, id: string) => {
  try {
    const result = await fetchAllBlogs(locale)

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch all blogs')
    }

    const blog = result.data.find((blog: any) => blog.id === id)

    if (!blog) {
      throw new Error(`Blog with id ${id} not found`)
    }

    return {
      success: true,
      data: blog,
      error: null,
    }
  } catch (error) {
    console.error('Error fetching blog by ID:', error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch blog',
    }
  }
}

