'use client'

import React from 'react'

interface CircularProgressProps {
  percentage: number  // 0-100
  size?: number       // Diameter in pixels (default: 80)
  strokeWidth?: number // Progress ring thickness (default: 3)
  className?: string
  children?: React.ReactNode  // Content (avatar image)
}

/**
 * Circular progress indicator with green arc around avatar
 * Used for showing story viewing progress
 */
export const CircularProgress = ({
  percentage,
  size = 80,
  strokeWidth = 3,
  className = '',
  children
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background circle (gray) and Progress circle (green) */}
      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/30"
        />

        {/* Progress circle (green) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-green-500 transition-all duration-500 ease-out"
        />
      </svg>

      {/* Content (avatar) */}
      <div className="absolute inset-[3px] rounded-full overflow-hidden bg-card">
        {children}
      </div>
    </div>
  )
}
