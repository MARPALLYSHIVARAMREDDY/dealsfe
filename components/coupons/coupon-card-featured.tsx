'use client'

import { BadgeCheck } from 'lucide-react'
import type { Coupon } from '@/types/coupons.types'
import StoreLogo from './store-logo'
import DiscountBadge from './discount-badge'
import ExpiryBadge from './expiry-badge'
import GetCodeButton from './get-code-button'
import { cn } from '@/lib/utils'

interface CouponCardFeaturedProps {
  coupon: Coupon
  className?: string
}

export default function CouponCardFeatured({
  coupon,
  className,
}: CouponCardFeaturedProps) {
  return (
    <article
      className={cn(
        'bg-card rounded-xl border-2 border-primary/50 overflow-hidden hover:shadow-xl transition-all duration-300 group relative',
        'bg-gradient-to-br from-primary/5 to-transparent',
        coupon.isExpired && 'opacity-60 grayscale',
        className
      )}
    >
      {/* Featured Badge */}
      <div className="absolute top-2 left-2 z-10">
        <span className="inline-block px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-md">
          FEATURED
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Top: Store Logo & Discount */}
        <div className="flex items-start justify-between">
          <StoreLogo
            storeImage={coupon.storeImage}
            storeName={coupon.store}
            size="md"
          />
          <DiscountBadge
            discount={coupon.discount}
            discountType={coupon.discountType}
            size="md"
          />
        </div>

        {/* Store Name & Verified */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground text-sm">
            {coupon.store}
          </span>
          {coupon.verified && (
            <BadgeCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-foreground text-base line-clamp-2 group-hover:text-primary transition-colors">
          {coupon.title}
        </h3>

        {/* Expiry */}
        {coupon.formattedExpiry && (
          <ExpiryBadge
            formattedExpiry={coupon.formattedExpiry}
            daysUntilExpiry={coupon.daysUntilExpiry || 0}
            isExpired={coupon.isExpired || false}
            isExpiringSoon={coupon.isExpiringSoon || false}
            size="sm"
          />
        )}

        {/* Get Code Button */}
        <GetCodeButton
          code={coupon.code}
          link={coupon.link}
          couponId={coupon.id}
          size="md"
          className="w-full"
        />
      </div>
    </article>
  )
}
