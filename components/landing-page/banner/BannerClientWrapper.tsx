"use client"

import { Carousel } from "@/components/carousel/carousel"
import { BannerSlide } from "./BannerSlide"
import type { Banner } from "@/types/banner.types"

interface BannerClientWrapperProps {
  banners: Banner[]
}

/**
 * Client wrapper for banner carousel
 * Handles client-side interactions and navigation
 *
 * Follows the same pattern as StoriesClientWrapper
 */
export function BannerClientWrapper({ banners }: BannerClientWrapperProps) {
  const handleBannerClick = (banner: Banner) => {
    // Analytics tracking
    console.log('Banner clicked:', banner.name)

    // TODO: Add analytics event
    // analytics.track('banner_clicked', {
    //   bannerId: banner.id,
    //   bannerName: banner.name,
    //   redirectUrl: banner.redirectUrl,
    // })

    // Navigate to redirect URL
    if (banner.redirectUrl) {
      window.location.href = banner.redirectUrl
    }
  }

  const handleSlideChange = (index: number) => {
    // Track slide changes for analytics
    console.log('Slide changed to:', index)

    // TODO: Add analytics event
    // analytics.track('banner_slide_viewed', {
    //   slideIndex: index,
    //   bannerId: banners[index]?.id,
    // })
  }

  // Don't render if no banners (graceful degradation)
  if (banners.length === 0) {
    return null
  }

  return (
    <div className="w-[95%] max-w-7xl mx-auto my-8">
      <Carousel
        items={banners}
        renderSlide={(banner, index, isActive) => (
          <BannerSlide
            banner={banner}
            isActive={isActive}
            onClick={handleBannerClick}
          />
        )}
        autoPlayInterval={5000}
        onSlideChange={handleSlideChange}
      />
    </div>
  )
}
