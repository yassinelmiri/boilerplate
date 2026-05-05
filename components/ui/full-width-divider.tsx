"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/

const dividerVariants = cva(
  "pointer-events-none absolute inset-x-0 bg-gradient-to-r from-transparent via-border to-transparent",
  {
    variants: {
      position: {
        top: "top-0",
        bottom: "bottom-0",
      },
      inset: {
        none: "mx-0",
        contained: "mx-4 md:mx-6",
      },
      thickness: {
        sm: "h-px",
        md: "h-[2px]",
      },
    },
    defaultVariants: {
      position: "top",
      inset: "none",
      thickness: "sm",
    },
  }
)

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export interface FullWidthDividerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerVariants> {}

/* -------------------------------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------------------------*/

export function FullWidthDivider({
  className,
  position,
  inset,
  thickness,
  ...props
}: FullWidthDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        dividerVariants({ position, inset, thickness }),
        className
      )}
      {...props}
    />
  )
}

FullWidthDivider.displayName = "FullWidthDivider"