'use client'

import { useEffect, useState, useRef, RefObject } from 'react'

interface UseStickyScrollOptions {
  topOffset?: number
  onStick?: () => void
  onUnstick?: () => void
  onReachBottom?: () => void
}

interface UseStickyScrollReturn {
  ref: RefObject<HTMLDivElement | null>
  isStuck: boolean
  reachedBottom: boolean
}

export const useStickyScroll = (
  options: UseStickyScrollOptions = {}
): UseStickyScrollReturn => {
  const {
    topOffset = 96, // 96px = Tailwind's top-24
    onStick = () => {},
    onUnstick = () => {},
    onReachBottom = () => {}
  } = options

  const ref = useRef<HTMLDivElement>(null)
  const [isStuck, setIsStuck] = useState(false)
  const [reachedBottom, setReachedBottom] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const stuck = rect.top <= topOffset

        // Check if reached bottom
        const bottom = rect.bottom <= window.innerHeight

        // Handle stick/unstick callbacks
        if (stuck !== isStuck) {
          if (stuck) {
            onStick()
          } else {
            onUnstick()
          }
          setIsStuck(stuck)
        }

        // Handle bottom reached callback
        if (bottom !== reachedBottom) {
          if (bottom) {
            onReachBottom()
          }
          setReachedBottom(bottom)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [topOffset, onStick, onUnstick, onReachBottom, isStuck, reachedBottom])

  return { ref, isStuck, reachedBottom }
}
