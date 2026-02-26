'use client'

import { useEffect } from 'react'
import { Stories } from '@/components/stories'
import type { Story, OnStoryActionClickCallback } from '@/types/stories.types'
import { syncProgressWithApiStories } from '@/lib/stories-progress-utils'

interface StoriesClientWrapperProps {
  stories: Story[]
  isLoading?: boolean
  error?: string | null
}

/**
 * Client wrapper that handles client-side interactions for Stories
 * This component receives server-fetched data and adds client-side callbacks
 */
const StoriesClientWrapper = ({ stories, isLoading = false, error = null }: StoriesClientWrapperProps) => {
  // Sync progress with current stories from API
  useEffect(() => {
    if (stories && stories.length > 0) {
      syncProgressWithApiStories(stories)
    }
  }, [stories])

  // Handle story click - can add analytics here
  const handleStoryClick = (storyIndex: number, story: Story) => {
    // Example: Track analytics
    console.log('Story clicked:', story.name, 'at index', storyIndex)
    // You could send analytics events here
  }

  // Handle close - can add cleanup logic here
  const handleClose = () => {
    console.log('Story viewer closed')
  }

  // Handle "View Deal" click
  const handleStoryActionClick: OnStoryActionClickCallback = (product, story) => {
    // Navigate to product detail page
    // For now, just log - implement navigation based on your routing setup
    console.log('View deal clicked:', product.title, 'from', story.name)

    // Example navigation (adjust based on your routing):
    // router.push(`/deals/${product.id}`);
    // OR
    // window.location.href = `/deals/${product.id}`;
  }

  return (
    <Stories
      stories={stories}
      isLoading={isLoading}
      error={error}
      onStoryClick={handleStoryClick}
      onClose={handleClose}
      onStoryActionClick={handleStoryActionClick}
    />
  )
}

export default StoriesClientWrapper
