"use client"

import * as React from "react"
import {
  Command,
  CommandDialog,
  CommandFooter,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiCornerDownLeftLine,
} from "@remixicon/react"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/

const dialogVariants = cva("", {
  variants: {
    size: {
      sm: "sm:max-w-md",
      md: "sm:max-w-lg",
      lg: "sm:max-w-xl",
    },
  },
  defaultVariants: {
    size: "sm",
  },
})

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

type BaseCmdProps = {
  open: boolean
  onOpenChange: (open: boolean) => void

  title?: string
  placeholder?: string

  children: React.ReactNode

  navigateLabel?: React.ReactNode
  openLabel?: React.ReactNode
  closeLabel?: React.ReactNode
} & VariantProps<typeof dialogVariants>

/* -------------------------------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------------------------*/

export function BaseCmd({
  open,
  onOpenChange,
  title,
  placeholder,
  size,
  children,
  navigateLabel = "Navigate",
  openLabel = "Open",
  closeLabel = "Close",
}: BaseCmdProps) {
  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      className={cn(dialogVariants({ size }))}
    >
      {/* Accessibility */}
      {title && <h2 className="sr-only">{title}</h2>}

      <Command>
        <CommandInput placeholder={placeholder} />

        <CommandList>{children}</CommandList>

        <CommandFooter className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <KbdGroup>
                <Kbd><RiArrowUpLine className="size-3" /></Kbd>
                <Kbd><RiArrowDownLine className="size-3" /></Kbd>
              </KbdGroup>
              <span>{navigateLabel}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Kbd><RiCornerDownLeftLine className="size-3" /></Kbd>
              <span>{openLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Kbd>Esc</Kbd>
            <span>{closeLabel}</span>
          </div>
        </CommandFooter>
      </Command>
    </CommandDialog>
  )
}

BaseCmd.displayName = "BaseCmd"