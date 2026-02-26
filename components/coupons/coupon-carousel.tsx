'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Coupon } from '@/types/coupons.types'
import CouponCardList from './coupon-card-list'

interface CouponCarouselProps {
  coupons: Coupon[]
  autoPlayInterval?: number
}

export default function CouponCarousel({
  coupons,
  autoPlayInterval = 5000,
}: CouponCarouselProps) {
  const [index, setIndex] = useState(0)
  const [hydrated, setHydrated] = useState(false)
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Prevent hydration mismatch - only enable auto-slide after client hydration
  useEffect(() => {
    setHydrated(true)
    setTimeout(() => setAutoSlideEnabled(true), 2000)
  }, [])

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  useEffect(() => {
    if (!hydrated || !autoSlideEnabled || coupons.length <= 1) return

    resetTimeout()
    timeoutRef.current = setTimeout(() => nextSlide(), autoPlayInterval)

    return () => resetTimeout()
  }, [index, hydrated, autoSlideEnabled, autoPlayInterval, coupons.length])

  const nextSlide = () => setIndex((i) => (i + 1) % coupons.length)
  const prevSlide = () => setIndex((i) => (i - 1 + coupons.length) % coupons.length)
  const goToSlide = (slideIndex: number) => setIndex(slideIndex)

  if (coupons.length === 0) return null

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-2xl shadow-card border border-border/50">
        {/* Slides Container */}
        <div
          className="flex transition-transform duration-700 ease-out will-change-transform"
          style={{
            transform: hydrated ? `translateX(-${index * 100}%)` : 'translateX(0)',
          }}
        >
          {coupons.map((coupon) => (
            <div key={coupon.id} className="min-w-full">
              <CouponCardList coupon={coupon} showFullDetails={true} />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {coupons.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background p-2 rounded-full shadow-lg transition-all duration-200 border border-border"
              aria-label="Previous coupon"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background p-2 rounded-full shadow-lg transition-all duration-200 border border-border"
              aria-label="Next coupon"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {coupons.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {coupons.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  index === i ? 'bg-primary w-8' : 'bg-white/50 w-2'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
