'use client'

import React, { useState, useEffect } from 'react'
import { Percent } from 'lucide-react'

export interface DiscountRangeFilterProps {
  minDiscount?: number
  maxDiscount?: number
  onChange: (min: number | undefined, max: number | undefined) => void
  className?: string
}

export function DiscountRangeFilter({
  minDiscount = 0,
  maxDiscount = 100,
  onChange,
  className = '',
}: DiscountRangeFilterProps) {
  const [localMin, setLocalMin] = useState(minDiscount)
  const [localMax, setLocalMax] = useState(maxDiscount)

  // Sync with external prop changes
  useEffect(() => {
    setLocalMin(minDiscount || 0)
    setLocalMax(maxDiscount || 100)
  }, [minDiscount, maxDiscount])

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, localMax)
    setLocalMin(newMin)
    onChange(newMin > 0 ? newMin : undefined, localMax < 100 ? localMax : undefined)
  }

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, localMin)
    setLocalMax(newMax)
    onChange(localMin > 0 ? localMin : undefined, newMax < 100 ? newMax : undefined)
  }

  const handleReset = () => {
    setLocalMin(0)
    setLocalMax(100)
    onChange(undefined, undefined)
  }

  const handlePresetClick = (min: number, max: number) => {
    setLocalMin(min)
    setLocalMax(max)
    onChange(min > 0 ? min : undefined, max < 100 ? max : undefined)
  }

  const hasActiveRange = localMin > 0 || localMax < 100

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Percent className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">Discount Range</span>
        </div>
        {hasActiveRange && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Reset
          </button>
        )}
      </div>

      {/* Range Display */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{localMin}%</span>
        <span className="text-gray-400">to</span>
        <span className="font-medium text-gray-700">{localMax}%</span>
      </div>

      {/* Dual Range Sliders */}
      <div className="space-y-2">
        {/* Min Slider */}
        <div className="space-y-1">
          <label htmlFor="min-discount" className="text-xs text-gray-600">
            Minimum
          </label>
          <input
            id="min-discount"
            type="range"
            min="0"
            max="100"
            step="5"
            value={localMin}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Max Slider */}
        <div className="space-y-1">
          <label htmlFor="max-discount" className="text-xs text-gray-600">
            Maximum
          </label>
          <input
            id="max-discount"
            type="range"
            min="0"
            max="100"
            step="5"
            value={localMax}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => handlePresetClick(25, 100)}
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            localMin === 25 && localMax === 100
              ? 'bg-blue-100 border-blue-600 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
          }`}
        >
          25%+
        </button>
        <button
          type="button"
          onClick={() => handlePresetClick(50, 100)}
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            localMin === 50 && localMax === 100
              ? 'bg-blue-100 border-blue-600 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
          }`}
        >
          50%+
        </button>
        <button
          type="button"
          onClick={() => handlePresetClick(75, 100)}
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            localMin === 75 && localMax === 100
              ? 'bg-blue-100 border-blue-600 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
          }`}
        >
          75%+
        </button>
      </div>
    </div>
  )
}
