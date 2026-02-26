'use client'

import Link from 'next/link'
import { BadgeCheck, Eye, ThumbsUp } from 'lucide-react'
import type { Coupon } from '@/types/coupons.types'
import StoreLogo from './store-logo'
import DiscountBadge from './discount-badge'
import ExpiryBadge from './expiry-badge'
import GetCodeButton from './get-code-button'
import { cn } from '@/lib/utils'

interface CouponCardListProps {
  coupon: Coupon
  showFullDetails?: boolean
  className?: string
}

export default function CouponCardList({
  coupon,
  showFullDetails = true,
  className,
}: CouponCardListProps) {
  const handleReveal = () => {
    // Track analytics or perform any action when code is revealed
    console.log(`Coupon revealed: ${coupon.id}`)
  }

  return (
    <article
      className={cn(
        'bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group',
        coupon.isExpired && 'opacity-60 grayscale',
        className
      )}
    >
      <div className="p-4 md:p-5 flex flex-col md:flex-row gap-4">
        {/* Left: Store Logo */}
        <div className="flex-shrink-0">
          <StoreLogo
            storeImage={coupon.storeImage}
            storeName={coupon.store}
            size="lg"
          />
        </div>

        {/* Middle: Content */}
        <div className="flex-1 space-y-3">
          {/* Store Name & Verified Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground text-sm md:text-base">
              {coupon.store}
            </span>
            {coupon.verified && (
              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                <BadgeCheck className="h-4 w-4" />
                <span className="font-medium">VERIFIED</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-foreground text-lg md:text-xl line-clamp-2 group-hover:text-primary transition-colors">
            {coupon.title}
          </h3>

          {/* Description (if showFullDetails) */}
          {showFullDetails && coupon.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {coupon.description}
            </p>
          )}

          {/* Metadata Row 1: Category & Tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {coupon.category && (
              <span className="px-2 py-1 bg-muted rounded-md font-medium">
                {coupon.category}
              </span>
            )}
            {coupon.tags && coupon.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-accent/50 text-accent-foreground rounded-md font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Metadata Row 2: Expiry & Engagement */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {/* Expiry Badge */}
            {coupon.formattedExpiry && (
              <ExpiryBadge
                formattedExpiry={coupon.formattedExpiry}
                daysUntilExpiry={coupon.daysUntilExpiry || 0}
                isExpired={coupon.isExpired || false}
                isExpiringSoon={coupon.isExpiringSoon || false}
                size="sm"
              />
            )}

            {/* Uses */}
            {coupon.uses !== undefined && (
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {coupon.uses >= 1000
                  ? `${(coupon.uses / 1000).toFixed(1)}k`
                  : coupon.uses}{' '}
                uses
              </span>
            )}

            {/* Views */}
            {coupon.views !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {coupon.views >= 1000
                  ? `${(coupon.views / 1000).toFixed(1)}k`
                  : coupon.views}{' '}
                views
              </span>
            )}
          </div>

          {/* Terms & Conditions (if showFullDetails) */}
          {showFullDetails && coupon.termsAndConditions && (
            <p className="text-xs text-muted-foreground italic line-clamp-1">
              {coupon.termsAndConditions}
            </p>
          )}
        </div>

        {/* Right: Discount Badge & Get Code Button */}
        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4">
          {/* Discount Badge */}
          <DiscountBadge
            discount={coupon.discount}
            discountType={coupon.discountType}
            size="lg"
          />

          {/* Get Code Button */}
          <GetCodeButton
            code={coupon.code}
            link={coupon.link}
            couponId={coupon.id}
            onReveal={handleReveal}
            size="lg"
          />
        </div>
      </div>
    </article>
  )
}
