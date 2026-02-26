/**
 * API Response Types for Blogs
 * These types match the structure returned by the blogs API endpoint
 */

export interface ApiBlog {
  id: string
  title: string
  content: string
  image: string
  category: string
  country: string
  seoLabels: string[]
  publishedAt: string
  createdAt: string
  author: string // Note: API returns string, not object
}

export interface BlogsApiResponse {
  status: number
  message: string
  data: ApiBlog[]
  meta: {
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface BlogsFilterParams {
  page?: number
  limit?: number
  category?: string
  country?: string
  search?: string
}

export interface BlogsMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
