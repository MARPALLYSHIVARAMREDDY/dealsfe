'use client'

import { useState } from 'react'
import StoryViewer from './StoryViewer'
import { StoriesProps } from '@/types/stories.types'
import { getStatusColor, getStatusLabel, getHighlightGradient } from './utils/status-helpers'
import { getStoryProgress } from '@/lib/stories-progress-utils'
import { CircularProgress } from './CircularProgress'

const Stories = ({
  stories,
  isLoading = false,
  error = null,
  onStoryClick,
  onClose,
  onStoryActionClick,
  statusBadgeConfig,
  className = '',
  showStatusBadge = true,
  showNewIndicator = true,
}: StoriesProps) => {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedStoreIndex, setSelectedStoreIndex] = useState(0)

  const handleStoryClick = (index: number) => {
    setSelectedStoreIndex(index)
    setViewerOpen(true)

    // Call parent callback if provided
    if (onStoryClick) {
      onStoryClick(index, stories[index])
    }
  }

  const handleClose = () => {
    setViewerOpen(false)

    // Call parent callback if provided
    if (onClose) {
      onClose()
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <section className={`pt-4 py-3 bg-card ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 md:justify-center">
            {/* Loading skeleton */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted animate-pulse" />
                <div className="w-16 h-3 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Error or no data state
  if (error || !stories || stories.length === 0) return null

  return (
    <>
      <section className={`pt-4 py-3 bg-background ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 md:justify-center">
            {stories.map((story, index) => {
              const status = story.status || 'active'
              const isNew = status === 'new'
              const progress = getStoryProgress(story.id, story.products.length)

              return (
                <button
                  key={story.id}
                  onClick={() => handleStoryClick(index)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                  className="flex flex-col items-center cursor-pointer gap-2 shrink-0 group text-center py-[3px] px-[2px]"
                  aria-label={`View ${story.name} story`}
                >
                  <div className="story-circle relative">
                    {/* Circular Progress with Avatar */}
                    <CircularProgress
                      percentage={progress.percentage}
                      size={68}  // Slightly larger than w-16 (64px) to account for stroke
                      strokeWidth={3}
                      className="group-hover:scale-105 transition-transform duration-200"
                    >
                      <img
                        src={story.imageUrl}
                        alt={story.name}
                        className="w-full h-full object-cover"
                      />
                    </CircularProgress>

                    {/* New indicator dot - only show if not started viewing */}
                    {showNewIndicator && isNew && progress.percentage === 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-deal-hot rounded-full border-2 border-card animate-pulse z-10" />
                    )}
                  </div>

                  <span className="text-xs font-medium text-foreground text-center max-w-[60px] truncate mt-1">
                    {story.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Story Viewer Modal */}
      {viewerOpen && (
        <StoryViewer
          stores={stories}
          initialStoreIndex={selectedStoreIndex}
          onClose={handleClose}
          onStoryActionClick={onStoryActionClick}
        />
      )}
    </>
  )
}

export default Stories
