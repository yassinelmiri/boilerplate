"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Center } from "@/components/design-system/layout"
import { DecorIcon } from "@/components/ui/decor-icon"

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export interface FramedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: string
}

/* -------------------------------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------------------------*/

export const FramedContainer = React.forwardRef<HTMLDivElement, FramedContainerProps>(
  ({ className, maxWidth = "max-w-sm", children, ...props }, ref) => {
    return (
      <Center
        ref={ref}
        data-slot="framed-container"
        className={cn("relative w-full bg-background", className)}
        {...props}
      >
        {/* Frame lines */}
        <div className="-left-px absolute -inset-y-6 w-px bg-border" />
        <div className="-right-px absolute -inset-y-6 w-px bg-border" />
        <div className="-top-px absolute -inset-x-6 h-px bg-border" />
        <div className="-bottom-px absolute -inset-x-6 h-px bg-border" />

        {/* Corner icons */}
        <DecorIcon position="top-left" />
        <DecorIcon position="bottom-right" />

        {/* Content */}
        <div className={cn("w-full sm:border-x sm:border-border", maxWidth)}>
          {children}
        </div>
      </Center>
    )
  }
)

FramedContainer.displayName = "FramedContainer"
