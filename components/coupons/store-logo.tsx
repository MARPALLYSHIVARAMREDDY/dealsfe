import Image from 'next/image'
import { Store } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoreLogoProps {
  storeImage?: string | null
  storeName: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function StoreLogo({
  storeImage,
  storeName,
  size = 'md',
  className,
}: StoreLogoProps) {
  const sizeMap = {
    sm: 40,
    md: 60,
    lg: 80,
  }

  const dimension = sizeMap[size]

  if (!storeImage) {
    // Fallback to icon if no image
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted rounded-lg border border-border',
          className
        )}
        style={{ width: dimension, height: dimension }}
      >
        <Store className={cn('text-muted-foreground', size === 'sm' ? 'h-5 w-5' : size === 'md' ? 'h-7 w-7' : 'h-10 w-10')} />
      </div>
    )
  }

  return (
    <div className={cn('relative rounded-lg overflow-hidden border border-border', className)} style={{ width: dimension, height: dimension }}>
      <Image
        src={storeImage}
        alt={`${storeName} logo`}
        fill
        className="object-contain bg-white p-1"
        sizes={`${dimension}px`}
      />
    </div>
  )
}
