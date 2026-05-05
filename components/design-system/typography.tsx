"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Core factory
 * -----------------------------------------------------------------------------------------------*/

type Props<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  asChild?: boolean
}

function create<T extends React.ElementType>(
  tag: T,
  base: string,
  displayName: string
) {
  const Comp = React.forwardRef<any, Props<T>>(
    ({ className, asChild, ...props }, ref) => {
      const Component = asChild ? Slot : tag
      return (
        <Component
          ref={ref}
          className={cn(base, className)}
          {...props}
        />
      )
    }
  )

  Comp.displayName = displayName
  return Comp
}

/* -------------------------------------------------------------------------------------------------
 * Headings (landing + app)
 * -----------------------------------------------------------------------------------------------*/

export const Display = create(
  "h1",
  "scroll-m-20 text-4xl font-extrabold tracking-tight leading-[1.1] md:text-6xl lg:text-7xl text-balance",
  "Display"
)

export const H1 = create(
  "h1",
  "scroll-m-20 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-balance",
  "H1"
)

export const H2 = create(
  "h2",
  "scroll-m-20 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl",
  "H2"
)

export const H3 = create(
  "h3",
  "scroll-m-20 text-xl font-semibold md:text-2xl lg:text-3xl",
  "H3"
)

/* -------------------------------------------------------------------------------------------------
 * Text (core content)
 * -----------------------------------------------------------------------------------------------*/

export const Text = create(
  "p",
  "text-sm leading-7 md:text-base",
  "Text"
)

export const Lead = create(
  "p",
  "text-lg leading-8 text-muted-foreground",
  "Lead"
)

export const Muted = create(
  "p",
  "text-sm text-muted-foreground",
  "Muted"
)

export const Caption = create(
  "span",
  "text-xs text-muted-foreground",
  "Caption"
)

/* -------------------------------------------------------------------------------------------------
 * UI Typography (forms, labels, etc.)
 * -----------------------------------------------------------------------------------------------*/

export const Label = create(
  "span",
  "text-sm font-medium leading-none",
  "Label"
)

export const Code = create(
  "code",
  "rounded bg-muted px-1.5 py-0.5 font-mono text-xs",
  "Code"
)

/* -------------------------------------------------------------------------------------------------
 * Marketing / Landing helpers
 * -----------------------------------------------------------------------------------------------*/

export const Eyebrow = create(
  "p",
  "text-xs font-semibold uppercase tracking-wider text-primary",
  "Eyebrow"
)

// forced-colors:text-current restores visible text in Windows High Contrast mode
// where bg-clip-text / text-transparent renders as invisible
export const GradientText = create(
  "span",
  "bg-gradient-to-br from-foreground to-foreground/40 bg-clip-text text-transparent forced-colors:text-current forced-colors:bg-none",
  "GradientText"
)

/* -------------------------------------------------------------------------------------------------
 * Content blocks
 * -----------------------------------------------------------------------------------------------*/

export const Blockquote = create(
  "blockquote",
  "border-l-2 pl-4 italic text-muted-foreground",
  "Blockquote"
)

export const List = create(
  "ul",
  "ml-5 list-disc space-y-2 text-sm md:text-base",
  "List"
)

export const OrderedList = create(
  "ol",
  "ml-5 list-decimal space-y-2 text-sm md:text-base",
  "OrderedList"
)

/* -------------------------------------------------------------------------------------------------
 * ExternalLink — opens in new tab with safe rel attributes
 * -----------------------------------------------------------------------------------------------*/

type ExternalLinkProps = React.ComponentPropsWithoutRef<"a"> & {
  asChild?: boolean
}

export const ExternalLink = React.forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  ({ className, asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"
    return (
      <Comp
        ref={ref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
ExternalLink.displayName = "ExternalLink"

/* -------------------------------------------------------------------------------------------------
 * Export group
 * -----------------------------------------------------------------------------------------------*/

export const Typography = {
  Display,
  H1,
  H2,
  H3,
  Text,
  Lead,
  Muted,
  Caption,
  Label,
  Code,
  Eyebrow,
  GradientText,
  Blockquote,
  List,
  OrderedList,
  ExternalLink,
} as const