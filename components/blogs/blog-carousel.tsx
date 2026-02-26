'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BlogCardHero } from './blog-card-hero'
import type { Blog } from '@/types/blogs.types'

interface BlogCarouselProps {
  blogs: Blog[]
  autoPlayInterval?: number
}

export const BlogCarousel = ({
  blogs,
  autoPlayInterval = 5000
}: BlogCarouselProps) => {
  const [index, setIndex] = useState(0)
  const [hydrated, setHydrated] = useState(false)
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setHydrated(true)
    // Enable auto-slide after 2 seconds (after initial render)
    setTimeout(() => setAutoSlideEnabled(true), 2000)
  }, [])

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  useEffect(() => {
    if (!hydrated || !autoSlideEnabled || blogs.length <= 1) return

    resetTimeout()
    timeoutRef.current = setTimeout(() => nextSlide(), autoPlayInterval)

    return () => resetTimeout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, hydrated, autoSlideEnabled, autoPlayInterval, blogs.length])

  const nextSlide = () => {
    setIndex((i) => (i + 1) % blogs.length)
  }

  const prevSlide = () => {
    setIndex((i) => (i - 1 + blogs.length) % blogs.length)
  }

  const goToSlide = (slideIndex: number) => {
    setIndex(slideIndex)
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="w-full h-[35vh] lg:h-[55vh] rounded-2xl bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No blogs available</p>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Main Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl shadow-card border border-border/50">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-out will-change-transform"
          style={{
            transform: hydrated ? `translateX(-${index * 100}%)` : 'translateX(0)',
          }}
        >
          {blogs.map((blog, i) => (
            <div key={blog.id} className="min-w-full">
              <BlogCardHero blog={blog} priority={i === 0} />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {blogs.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="
                absolute top-1/2 -translate-y-1/2 left-4
                h-10 w-10
                bg-white/90 backdrop-blur-sm
                border border-gray-300
                rounded-full
                flex items-center justify-center
                shadow-md
                hover:scale-110 hover:shadow-lg hover:bg-white
                active:scale-95
                transition-all duration-300
                group z-20
              "
            >
              <ChevronLeft
                size={20}
                className="text-gray-700 transition-transform duration-300 group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="
                absolute top-1/2 -translate-y-1/2 right-4
                h-10 w-10
                bg-white/90 backdrop-blur-sm
                border border-gray-300
                rounded-full
                flex items-center justify-center
                shadow-md
                hover:scale-110 hover:shadow-lg hover:bg-white
                active:scale-95
                transition-all duration-300
                group z-20
              "
            >
              <ChevronRight
                size={20}
                className="text-gray-700 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          </>
        )}
      </div>

      {/* Numbered Pagination Indicators */}
      {blogs.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 md:mt-6">
          {blogs.map((blog, i) => (
            <button
              key={blog.id}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1} of ${blogs.length}`}
              aria-current={i === index ? 'true' : 'false'}
              className={`
                w-7 h-7 md:w-8 md:h-8
                rounded-full
                flex items-center justify-center
                font-semibold text-xs md:text-sm
                transition-all duration-300
                ${
                  i === index
                    ? 'bg-primary text-primary-foreground scale-110 shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
                }
              `}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default BlogCarousel
