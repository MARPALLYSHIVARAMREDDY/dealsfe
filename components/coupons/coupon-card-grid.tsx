'use client'

import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'
import type { Coupon } from '@/types/coupons.types'
import StoreLogo from './store-logo'
import DiscountBadge from './discount-badge'
import ExpiryBadge from './expiry-badge'
import { cn } from '@/lib/utils'

interface CouponCardGridProps {
  coupon: Coupon
  className?: string
}

export default function CouponCardGrid({
  coupon,
  className,
}: CouponCardGridProps) {
  return (
    <Link
      href={`/coupons/${coupon.slug || coupon.id}`}
      className={cn(
        'block bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group h-full',
        coupon.isExpired && 'opacity-60 grayscale',
        className
      )}
    >
      <div className="p-3 flex flex-col gap-2 h-full">
        {/* Top: Store Logo & Discount Badge */}
        <div className="flex items-start justify-between">
          <StoreLogo
            storeImage={coupon.storeImage}
            storeName={coupon.store}
            size="sm"
          />
          <DiscountBadge
            discount={coupon.discount}
            discountType={coupon.discountType}
            size="sm"
          />
        </div>

        {/* Store Name & Verified */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold text-muted-foreground truncate">
            {coupon.store}
          </span>
          {coupon.verified && (
            <BadgeCheck className="h-3 w-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          )}
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-foreground line-clamp-3 group-hover:text-primary transition-colors flex-1">
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

        {/* Code Preview */}
        <div className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded truncate text-center">
          {coupon.code}
        </div>
      </div>
    </Link>
  )
}
