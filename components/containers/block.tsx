"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

import { Section, Box } from "@/components/design-system/layout"
import { DecorIcon } from "@/components/ui/decor-icon"
import { FullWidthDivider } from "@/components/ui/full-width-divider"

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

type CornerIconPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"

type BlockProps = {
  children: React.ReactNode
  className?: string
  contentClassName?: string

  // optional visuals (opt-in, not enforced)
  icons?: CornerIconPosition[]
  withDivider?: boolean
}

/* -------------------------------------------------------------------------------------------------
 * Defaults
 * -----------------------------------------------------------------------------------------------*/

const DEFAULT_ICONS: CornerIconPosition[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
]

/* -------------------------------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------------------------*/

export function Block({
  children,
  className,
  contentClassName,
  icons,
  withDivider = false,
}: BlockProps) {
  const hasIcons = icons !== undefined

  return (
    <>
      <Section
        size="none"
        data-slot="block"
        className={cn("relative border-y border-border/80", className)}
      >
        {/* Corner icons (opt-in) */}
        {hasIcons &&
          (icons ?? DEFAULT_ICONS).map((position) => (
            <DecorIcon key={position} position={position} />
          ))}

        {/* Top divider */}
        <FullWidthDivider inset="contained" position="top" />

        {/* Content */}
        <Box className={cn("px-4 md:px-6", contentClassName)}>
          {children}
        </Box>

        {/* Bottom divider */}
        <FullWidthDivider inset="contained" position="bottom" />
      </Section>

      {/* Optional separator */}
      {withDivider && (
        <div aria-hidden="true" className="h-6 w-full">
          <div className="h-full w-full bg-muted/30" />
        </div>
      )}
    </>
  )
}

Block.displayName = "Block"