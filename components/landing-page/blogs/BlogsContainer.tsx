import { headers } from 'next/headers'
import BlogsClientWrapper from './BlogsClientWrapper'
import { fetchAllBlogs } from '@/lib/blogs-service'
import { type LocaleCode } from '@/lib/locale-utils'

interface BlogsContainerProps {
  locale: LocaleCode
}

/**
 * Server component that fetches blogs data
 * This separates data fetching concerns from presentation
 */
const BlogsContainer = async ({ locale }: BlogsContainerProps) => {
  // Access headers to opt into dynamic rendering
  await headers()

  // Fetch blogs on server with locale and limit for sidebar
  const result = await fetchAllBlogs(locale, {
    page: 1,
    limit: 6, // Sidebar shows 6 blogs
  })

  const blogs = result.success ? result.data : []

  return <BlogsClientWrapper blogs={blogs} variant="sidebar" />
}

export default BlogsContainer

