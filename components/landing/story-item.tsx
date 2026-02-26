'use client'

import { useState } from 'react'

interface StoryItemProps {
  story: {
    id: string
    username: string
    clickCount: number
    postId?: string
    storyId?: string
    image?: string
    bgcolor?: string
    link?: string
    caption?: string
    createdAt?: string
  }
}

export default function StoryItemClient({ story }: StoryItemProps) {
  const [isViewed, setIsViewed] = useState(false)

  const handleClick = () => {
    setIsViewed(true)
    if (story.link) {
      window.open(story.link, '_blank')
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center cursor-pointer gap-2 shrink-0 group text-center"
    >
      <div className="relative">
        {/* Gradient ring */}
        <div
          className={`absolute -inset-0.5 rounded-full bg-gradient-to-tr ${
            isViewed
              ? 'from-gray-300 to-gray-400'
              : 'from-primary via-emerald-500 to-teal-500'
          } opacity-50 group-hover:opacity-70 transition-opacity`}
        />

        <div className="relative">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[3px] border-card overflow-hidden group-hover:scale-105 transition-transform duration-200"
            style={{ backgroundColor: story.bgcolor || '#f3f4f6' }}
          >
            {story.image ? (
              <img
                src={story.image}
                alt={story.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                {story.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      <span className="text-xs font-medium text-foreground text-center max-w-[60px] truncate">
        {story.username}
      </span>
    </button>
  )
}
