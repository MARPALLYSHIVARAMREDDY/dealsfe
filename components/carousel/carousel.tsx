"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CarouselProps<T> {
  items: T[]
  renderSlide: (item: T, index: number, isActive: boolean) => React.ReactNode
  autoPlayInterval?: number
  className?: string
  slideClassName?: string
  showNavigation?: boolean
  showIndicators?: boolean
  onSlideChange?: (index: number) => void
}

/**
 * Generic, reusable carousel component
 * Based on existing caruosal.tsx but redesigned for composition
 *
 * Features:
 * - Auto-rotation with configurable interval
 * - Manual navigation (prev/next buttons)
 * - Dot indicators for direct navigation
 * - Smooth transitions (700ms ease-out)
 * - SSR-safe with hydration handling
 * - Responsive design
 */
export function Carousel<T>({
  items,
  renderSlide,
  autoPlayInterval = 5000,
  className,
  slideClassName,
  showNavigation = true,
  showIndicators = true,
  onSlideChange,
}: CarouselProps<T>) {
  const [index, setIndex] = useState(0)
  const [hydrated, setHydrated] = useState(false)
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle hydration
  useEffect(() => {
    setHydrated(true)
    // Delay auto-slide to prevent flashing on initial load
    setTimeout(() => setAutoSlideEnabled(true), 2000)
  }, [])

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  // Auto-rotation effect
  useEffect(() => {
    if (!hydrated || !autoSlideEnabled || items.length <= 1) return

    resetTimeout()
    timeoutRef.current = setTimeout(() => nextSlide(), autoPlayInterval)

    return () => resetTimeout()
  }, [index, hydrated, autoSlideEnabled, items.length, autoPlayInterval])

  const nextSlide = () => {
    setIndex((i) => {
      const newIndex = (i + 1) % items.length
      onSlideChange?.(newIndex)
      return newIndex
    })
  }

  const prevSlide = () => {
    setIndex((i) => {
      const newIndex = (i - 1 + items.length) % items.length
      onSlideChange?.(newIndex)
      return newIndex
    })
  }

  const goToSlide = (slideIndex: number) => {
    setIndex(slideIndex)
    onSlideChange?.(slideIndex)
  }

  // Don't render if no items
  if (items.length === 0) {
    return null
  }

  // Single item - no carousel needed
  if (items.length === 1) {
    return (
      <div className={cn("relative w-full", className)}>
        <div className={cn("w-full", slideClassName)}>
          {renderSlide(items[0], 0, true)}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative w-full max-w-7xl mx-auto", className)}>
      {/* Main Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl shadow-card border border-border/50">
        {/* Slides */}
        <div
          className={cn(
            "flex transition-transform duration-700 ease-out will-change-transform",
            slideClassName
          )}
          style={{
            transform: hydrated ? `translateX(-${index * 100}%)` : "translateX(0)",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="min-w-full"
            >
              {renderSlide(item, i, i === index)}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {showNavigation && (
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

      {/* Progress Indicators */}
      {showIndicators && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="group relative"
            >
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  i === index
                    ? "w-8 bg-gray-800"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                )}
              />

              {i !== index && (
                <div className="absolute inset-0 scale-0 rounded-full bg-gray-400/50
                              group-hover:scale-150 transition-transform duration-300" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
