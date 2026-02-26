import { Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExpiryBadgeProps {
  formattedExpiry: string
  daysUntilExpiry: number
  isExpired: boolean
  isExpiringSoon: boolean
  size?: 'sm' | 'md'
  className?: string
}

export default function ExpiryBadge({
  formattedExpiry,
  daysUntilExpiry,
  isExpired,
  isExpiringSoon,
  size = 'md',
  className,
}: ExpiryBadgeProps) {
  // Determine color based on urgency
  const getColorClass = () => {
    if (isExpired) {
      return 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
    }
    if (isExpiringSoon || daysUntilExpiry <= 3) {
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }
    if (daysUntilExpiry <= 7) {
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    }
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
  }

  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-md font-medium',
        getColorClass(),
        sizeClasses[size],
        className
      )}
    >
      {isExpired ? (
        <AlertCircle className={iconSize} />
      ) : (
        <Clock className={iconSize} />
      )}
      <span>{formattedExpiry}</span>
    </div>
  )
}
