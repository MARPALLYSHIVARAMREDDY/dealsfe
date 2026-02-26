import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Coupon } from '@/types/coupons.types'
import CouponCardCompact from './coupon-card-compact'

interface HorizontalCouponCardsProps {
  coupons: Coupon[]
  title: string
  showViewAll?: boolean
  viewAllHref?: string
}

export default function HorizontalCouponCards({
  coupons,
  title,
  showViewAll = true,
  viewAllHref = '/coupons',
}: HorizontalCouponCardsProps) {
  if (coupons.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {title}
        </h2>
        {showViewAll && viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Horizontal Scrolling Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {coupons.map((coupon, index) => (
          <div
            key={coupon.id}
            className="flex-shrink-0 w-72 md:w-80 snap-start"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CouponCardCompact coupon={coupon} />
          </div>
        ))}
      </div>
    </section>
  )
}
