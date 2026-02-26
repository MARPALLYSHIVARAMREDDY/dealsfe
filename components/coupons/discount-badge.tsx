import { formatDiscount } from '@/lib/coupon-utils'
import { cn } from '@/lib/utils'

interface DiscountBadgeProps {
  discount: number
  discountType: 'percentage' | 'fixed'
  currency?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function DiscountBadge({
  discount,
  discountType,
  currency = '$',
  size = 'md',
  className,
}: DiscountBadgeProps) {
  const formattedDiscount = formatDiscount(discount, discountType, currency)

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center bg-primary text-primary-foreground font-bold rounded-lg shadow-md',
        sizeClasses[size],
        className
      )}
    >
      {formattedDiscount}
    </div>
  )
}
