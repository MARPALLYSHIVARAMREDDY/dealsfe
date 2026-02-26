import Link from "next/link"
import Image from "next/image"
import { getBanners } from "@/data/banners/banners-server-only"
import type { LocaleCode } from "@/lib/locale-utils"

interface BannerProps {
  name: string
  params: Promise<{ locale: string }>
}

/**
 * Server component that displays a single named banner
 * Fetches banners from API, filters by name, and renders with responsive images
 *
 * @param name - Banner name to filter and display
 * @param params - Next.js 15 locale params (Promise-based)
 * @returns Clickable banner with desktop/mobile images, or null if not found
 */
export default async function Banner({ name, params }: BannerProps) {
  // Await params to extract locale (Next.js 15 pattern)
  const { locale } = await params

  // Fetch all banners for the locale (uses cache, error handling)
  const banners = await getBanners(locale as LocaleCode)

  // Filter to find the specific banner by name
  const banner = banners.find((b) => b.name === name)

  // Return null if banner not found (graceful degradation)
  if (!banner) {
    return null
  }

  // Render clickable banner with responsive images
  return (
    <Link
      href={banner.redirectUrl || '/'}
      className="block relative w-full h-[10vh] lg:h-[22vh] overflow-hidden px-4 lg:px-[5%]"
    >
      {/* Desktop Image */}
      <Image
        src={banner.desktopImageUrl}
        alt={banner.name}
        fill
        className="hidden lg:block object-cover transition-transform duration-300 hover:scale-105"
        priority
        sizes="(min-width: 1024px) 90vw, 0px"
      />

      {/* Mobile Image */}
      <Image
        src={banner.mobileImageUrl}
        alt={banner.name}
        fill
        className="block lg:hidden object-cover transition-transform duration-300 hover:scale-105"
        priority
        sizes="(max-width: 1023px) calc(100vw - 2rem), 0px"
      />
    </Link>
  )
}
