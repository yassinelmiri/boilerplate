"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Stack, Box } from "@/components/design-system/layout"

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export interface DashedContainerProps {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
}

/* -------------------------------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------------------------*/

export function DashedContainer({
  className,
  containerClassName,
  children,
}: DashedContainerProps) {
  return (
    <Stack
      data-slot="dashed-container"
      gap="sm"
      className={cn(
        "mx-auto w-full min-w-0 self-stretch lg:max-w-none",
        containerClassName
      )}
    >
      <Box
        data-slot="dashed-container-content"
        className={cn(
          "flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed bg-background p-4 text-foreground sm:p-6",
          className
        )}
      >
        {children}
      </Box>
    </Stack>
  )
}

DashedContainer.displayName = "DashedContainer"
