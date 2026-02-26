
import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"
import React from "react"

interface ReusableMarqueeProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  direction?: "left" | "right"
  speed?: "fast" | "normal" | "slow" | string
  pauseOnHover?: boolean
  className?: string
  gradient?: boolean
  gradientWidth?: string
  vertical?: boolean
  repeat?: number
}

export function ReusableMarquee<T>({
  items,
  renderItem,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
  gradient = true,
  gradientWidth = "w-1/4",
  vertical = false,
  repeat = 4,
}: ReusableMarqueeProps<T>) {
  const durationMap = {
    fast: "10s",
    normal: "20s",
    slow: "40s",
  }

  const duration = durationMap[speed as keyof typeof durationMap] || speed

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden",
        className
      )}
    >
      <Marquee
        pauseOnHover={pauseOnHover}
        reverse={direction === "right"}
        vertical={vertical}
        repeat={repeat}
        style={
          {
            "--duration": duration,
          } as React.CSSProperties
        }
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {renderItem(item, index)}
          </React.Fragment>
        ))}
      </Marquee>

      {gradient && (
        <>
          <div
            className={cn(
              "from-background pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r",
              gradientWidth
            )}
          ></div>
          <div
            className={cn(
              "from-background pointer-events-none absolute inset-y-0 right-0 bg-gradient-to-l",
              gradientWidth
            )}
          ></div>
        </>
      )}
    </div>
  )
}
