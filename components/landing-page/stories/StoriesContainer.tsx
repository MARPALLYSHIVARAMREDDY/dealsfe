import StoriesClientWrapper from './StoriesClientWrapper'
import { getStoriesFromApi } from '@/data/stories/stories-server-only'
import { transformApiStories } from '@/lib/transform'
import type { LocaleCode } from '@/lib/locale-utils'

interface StoriesContainerProps {
  params: Promise<{ locale: string }>
}

/**
 * Server component that displays stories carousel
 * Fetches stories from API, transforms data, and renders with client wrapper
 *
 * @param params - Next.js 15 locale params (Promise-based)
 * @returns Stories carousel wrapped in client component, or error state if fetch fails
 */
export default async function StoriesContainer({ params }: StoriesContainerProps) {
  // Await params to extract locale (Next.js 15 pattern)
  const { locale } = await params

  // Fetch stories from API (uses cache, error handling)
  const apiStories = await getStoriesFromApi(locale as LocaleCode)

  // Transform API response to frontend Story type
  const stories = transformApiStories(apiStories)

  return <StoriesClientWrapper stories={stories} isLoading={false} error={null} />
}
