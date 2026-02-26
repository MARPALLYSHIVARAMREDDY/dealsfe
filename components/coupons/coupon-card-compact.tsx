'use client'

import type { Coupon } from '@/types/coupons.types'
import StoreLogo from './store-logo'
import DiscountBadge from './discount-badge'
import ExpiryBadge from './expiry-badge'
import { cn } from '@/lib/utils'

interface CouponCardCompactProps {
  coupon: Coupon
  className?: string
}

export default function CouponCardCompact({
  coupon,
  className,
}: CouponCardCompactProps) {
  return (
    <article
      className={cn(
        'bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer',
        coupon.isExpired && 'opacity-60 grayscale',
        className
      )}
    >
      <div className="p-3 flex items-center gap-3">
        {/* Store Logo */}
        <StoreLogo
          storeImage={coupon.storeImage}
          storeName={coupon.store}
          size="sm"
        />

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Store Name */}
          <p className="text-xs font-semibold text-muted-foreground truncate">
            {coupon.store}
          </p>

          {/* Title */}
          <h4 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {coupon.title}
          </h4>

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
        </div>

        {/* Discount Badge */}
        <div className="flex-shrink-0">
          <DiscountBadge
            discount={coupon.discount}
            discountType={coupon.discountType}
            size="sm"
          />
        </div>
      </div>
    </article>
  )
}
