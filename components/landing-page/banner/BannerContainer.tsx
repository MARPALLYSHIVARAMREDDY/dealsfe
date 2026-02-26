import { Suspense } from "react"
import { getBanners } from "@/data/banners/banners-server-only"
import { BannerClientWrapper } from "./BannerClientWrapper"
import { BannerSkeleton } from "./BannerSkeleton"
import type { LocaleCode } from "@/lib/locale-utils"

interface BannerContainerProps {
  locale: LocaleCode
}

/**
 * Internal component that fetches banner data
 * Wrapped by Suspense boundary
 */
async function BannerContent({ locale }: BannerContainerProps) {
  // Fetch banners on server with caching
  const banners = await getBanners(locale)

  // Pass data to client component
  return <BannerClientWrapper banners={banners} />
}

/**
 * Server component that fetches banner data with Suspense
 * Separates data fetching from presentation
 *
 * Follows the same pattern as StoriesContainer
 */
export function BannerContainer({ locale }: BannerContainerProps) {
  return (
    <Suspense fallback={<BannerSkeleton />}>
      <BannerContent locale={locale} />
    </Suspense>
  )
}

export default BannerContainer
