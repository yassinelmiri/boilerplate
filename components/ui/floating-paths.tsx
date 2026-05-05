"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export interface FloatingPathsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controls the horizontal spread of the paths. Defaults to 1. */
  position?: number
  /** Number of paths to render. Defaults to 36. */
  count?: number
}

/* -------------------------------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------------------------*/

export function FloatingPaths({
  position = 1,
  count = 36,
  className,
  ...props
}: FloatingPathsProps) {
  const paths = Array.from({ length: count }, (_, i) => ({
    id: i,
    d: `M${-(380 - i * 5 * position)} ${-(189 + i * 6)}C${-(380 - i * 5 * position)} ${-(189 + i * 6)} ${-(312 - i * 5 * position)} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
    // Deterministic duration per path — Math.random() causes SSR/hydration mismatch
    duration: 20 + (i % 7) * 3,
  }))

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      {...props}
    >
      <svg
        className="h-full w-full text-primary"
        fill="none"
        viewBox="0 0 696 316"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeOpacity={0.1 + path.id * 0.03}
            strokeWidth={path.width}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: path.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

FloatingPaths.displayName = "FloatingPaths"
