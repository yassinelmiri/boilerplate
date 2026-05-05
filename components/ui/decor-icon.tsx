"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/

const decorIconVariants = cva(
  "pointer-events-none absolute z-10 size-4 shrink-0 text-muted-foreground",
  {
    variants: {
      position: {
        "top-left": "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
        "top-right": "right-0 top-0 translate-x-1/2 -translate-y-1/2",
        "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
        "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
      },
    },
    defaultVariants: {
      position: "top-left",
    },
  }
)

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export interface DecorIconProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof decorIconVariants> {}

/* -------------------------------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------------------------*/

export const DecorIcon = React.forwardRef<
  SVGSVGElement,
  DecorIconProps
>(({ className, position, ...props }, ref) => {
  return (
    <svg
      ref={ref}
      aria-hidden="true"
      className={cn(decorIconVariants({ position }), className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
})

DecorIcon.displayName = "DecorIcon"