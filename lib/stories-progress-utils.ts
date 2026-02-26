'use client'

import type { Story, StoryProgressData, StoryProgress, StoryProgressStats } from '@/types/stories.types'

const STORAGE_KEY = 'storyProductProgress'
const STORAGE_VERSION = 1

/**
 * Initialize or get existing progress data from localStorage
 */
function getProgressData(): StoryProgressData {
  if (typeof window === 'undefined') {
    return { version: STORAGE_VERSION, stories: {} }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { version: STORAGE_VERSION, stories: {} }

    const data = JSON.parse(raw) as StoryProgressData

    // Handle version migrations if needed
    if (data.version !== STORAGE_VERSION) {
      console.warn('Story progress data version mismatch, resetting')
      return { version: STORAGE_VERSION, stories: {} }
    }

    return data
  } catch (error) {
    console.warn('Failed to parse story progress:', error)
    return { version: STORAGE_VERSION, stories: {} }
  }
}

/**
 * Save progress data to localStorage
 */
function saveProgressData(data: StoryProgressData): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save story progress:', error)
  }
}

/**
 * Mark a product as viewed within a story
 */
export function markProductAsViewed(
  storyId: string,
  productId: string,
  totalProducts: number
): void {
  if (!storyId || !productId) return

  const data = getProgressData()

  const existing = data.stories[storyId] || {
    storyId,
    viewedProductIds: [],
    totalProducts,
    lastViewedAt: new Date().toISOString()
  }

  // Add product if not already viewed
  if (!existing.viewedProductIds.includes(productId)) {
    existing.viewedProductIds.push(productId)
  }

  // Update metadata
  existing.totalProducts = totalProducts
  existing.lastViewedAt = new Date().toISOString()

  data.stories[storyId] = existing
  saveProgressData(data)
}

/**
 * Get progress stats for a specific story
 */
export function getStoryProgress(
  storyId: string,
  totalProducts: number
): StoryProgressStats {
  if (!storyId) {
    return {
      viewedCount: 0,
      totalCount: totalProducts,
      percentage: 0,
      isComplete: false
    }
  }

  const data = getProgressData()
  const progress = data.stories[storyId]

  if (!progress) {
    return {
      viewedCount: 0,
      totalCount: totalProducts,
      percentage: 0,
      isComplete: false
    }
  }

  const viewedCount = progress.viewedProductIds.length
  const percentage = totalProducts > 0
    ? Math.round((viewedCount / totalProducts) * 100)
    : 0

  return {
    viewedCount,
    totalCount: totalProducts,
    percentage,
    isComplete: percentage === 100
  }
}

/**
 * Sync progress with current stories from API
 * Removes stale stories and products that no longer exist
 */
export function syncProgressWithApiStories(apiStories: Story[]): void {
  if (!apiStories || apiStories.length === 0) return

  const data = getProgressData()
  const validStoryIds = new Set(apiStories.map(s => s.id))

  // Create map of story ID to valid product IDs
  const storyProductsMap = new Map<string, Set<string>>()
  apiStories.forEach(story => {
    storyProductsMap.set(
      story.id,
      new Set(story.products.map(p => p.id))
    )
  })

  // Clean up stale stories and products
  const updatedStories: Record<string, StoryProgress> = {}

  Object.values(data.stories).forEach(progress => {
    // Skip if story no longer exists
    if (!validStoryIds.has(progress.storyId)) {
      return
    }

    const validProductIds = storyProductsMap.get(progress.storyId)
    if (!validProductIds) return

    // Filter out products that no longer exist
    const cleanedViewedIds = progress.viewedProductIds.filter(
      id => validProductIds.has(id)
    )

    // Only keep if there's still progress
    if (cleanedViewedIds.length > 0) {
      updatedStories[progress.storyId] = {
        ...progress,
        viewedProductIds: cleanedViewedIds,
        totalProducts: validProductIds.size
      }
    }
  })

  data.stories = updatedStories
  saveProgressData(data)
}

/**
 * Get all progress data (for debugging/export)
 */
export function getAllProgress(): StoryProgressData {
  return getProgressData()
}

/**
 * Clear all progress (for testing/reset)
 */
export function clearAllProgress(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear story progress:', error)
  }
}
