import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface BlogHeroBannerProps {
  locale?: string
}

export const BlogHeroBanner = ({ locale = 'us' }: BlogHeroBannerProps) => {
  return (
    <section className="relative w-full h-48 md:h-64 overflow-hidden rounded-none md:rounded-2xl">
      {/* Background Image */}
      <Image
        src="https://picsum.photos/seed/hero-banner/1600/400"
        alt="Black Friday Sale - 35% Off"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 md:px-6 flex items-center">
        <div className="max-w-2xl space-y-3 md:space-y-4">
          {/* Badge */}
          <div className="inline-block">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs md:text-sm font-bold rounded-full shadow-lg">
              LIMITED TIME OFFER
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Save Big with
            <br />
            <span className="text-primary">35% OFF</span> Deals
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-lg text-white/90 max-w-xl">
            Discover the best deals, shopping guides, and money-saving tips from our expert team.
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <Link
              href={`/${locale}/all-deals`}
              className="
                inline-flex items-center gap-2
                px-4 md:px-6 py-2 md:py-3
                bg-primary text-primary-foreground
                font-semibold text-sm md:text-base
                rounded-lg shadow-lg
                hover:bg-primary/90
                transition-all duration-300
                hover:scale-105
                group
              "
            >
              Explore All Deals
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Corner Badge */}
      <div className="absolute bottom-0 right-0 hidden md:block">
        <div
          className="
            h-24 w-32
            bg-white/95 backdrop-blur-sm
            rounded-tl-3xl
            border-l-4 border-t-4 border-primary
            shadow-xl
            flex items-center justify-center
            px-4
          "
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">35%</p>
            <p className="text-xs font-semibold text-gray-700 uppercase">Off</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogHeroBanner
