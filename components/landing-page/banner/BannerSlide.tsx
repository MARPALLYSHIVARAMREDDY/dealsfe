"use client"

import Image from "next/image"
import type { Banner } from "@/types/banner.types"

interface BannerSlideProps {
  banner: Banner
  isActive: boolean
  onClick?: (banner: Banner) => void
}

/**
 * Individual banner slide component
 * Handles responsive image display and click interactions
 */
export function BannerSlide({ banner, isActive, onClick }: BannerSlideProps) {
  const handleClick = () => {
    onClick?.(banner)
  }

  return (
    <div
      className="relative w-full h-[35vh] lg:h-[55vh] cursor-pointer"
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick()
        }
      }}
    >
      {/* Desktop Image */}
      <Image
        src={banner.desktopImageUrl}
        alt={banner.name}
        fill
        className="hidden lg:block object-cover"
        priority={isActive}
        sizes="(min-width: 1024px) 100vw, 0px"
      />

      {/* Mobile Image */}
      <Image
        src={banner.mobileImageUrl}
        alt={banner.name}
        fill
        className="block lg:hidden object-cover"
        priority={isActive}
        sizes="(max-width: 1023px) 100vw, 0px"
      />
    </div>
  )
}
