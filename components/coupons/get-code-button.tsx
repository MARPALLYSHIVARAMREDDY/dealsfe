'use client'

import { useState } from 'react'
import { Check, Copy, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GetCodeButtonProps {
  code: string
  link: string
  couponId: string
  onReveal?: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline'
  className?: string
}

export default function GetCodeButton({
  code,
  link,
  couponId,
  onReveal,
  size = 'md',
  variant = 'default',
  className,
}: GetCodeButtonProps) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    if (!revealed) {
      // First click: Reveal code and open link
      setRevealed(true)

      // Open affiliate link in new tab
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer')
      }

      // Track analytics if callback provided
      if (onReveal) {
        onReveal()
      }
    } else {
      // Second click: Copy code to clipboard
      try {
        await navigator.clipboard.writeText(code)
        setCopied(true)

        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopied(false)
        }, 2000)
      } catch (error) {
        console.error('Failed to copy code:', error)
        // Fallback: Alert the user with the code
        alert(`Coupon code: ${code}`)
      }
    }
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size="default"
      className={cn(
        'font-bold transition-all duration-200 relative overflow-hidden',
        sizeClasses[size],
        revealed && 'bg-green-600 hover:bg-green-700',
        copied && 'bg-green-700',
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          COPIED!
        </>
      ) : revealed ? (
        <>
          <Copy className="h-4 w-4 mr-2" />
          {code}
        </>
      ) : (
        <>
          GET CODE
          <ArrowRight className="h-4 w-4 ml-2" />
        </>
      )}
    </Button>
  )
}
