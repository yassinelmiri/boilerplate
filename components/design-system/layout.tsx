"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Base
 * -----------------------------------------------------------------------------------------------*/

type BaseProps = {
  asChild?: boolean
}

/* -------------------------------------------------------------------------------------------------
 * Stack
 * -----------------------------------------------------------------------------------------------*/

const stackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
  },
  defaultVariants: {
    gap: "md",
    align: "stretch",
  },
})

type StackProps = React.ComponentPropsWithoutRef<"div"> &
  BaseProps &
  VariantProps<typeof stackVariants>

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, asChild, gap, align, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        ref={ref}
        className={cn(stackVariants({ gap, align }), className)}
        {...props}
      />
    )
  }
)
Stack.displayName = "Stack"

/* -------------------------------------------------------------------------------------------------
 * Inline
 * -----------------------------------------------------------------------------------------------*/

const inlineVariants = cva("flex", {
  variants: {
    gap: {
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      baseline: "items-baseline",
    },
    wrap: {
      true: "flex-wrap",
      false: "",
    },
  },
  defaultVariants: {
    gap: "md",
    justify: "start",
    align: "center",
    wrap: false,
  },
})

type InlineProps = React.ComponentPropsWithoutRef<"div"> &
  BaseProps &
  VariantProps<typeof inlineVariants>

export const Inline = React.forwardRef<HTMLDivElement, InlineProps>(
  ({ className, asChild, gap, justify, align, wrap, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        ref={ref}
        className={cn(inlineVariants({ gap, justify, align, wrap }), className)}
        {...props}
      />
    )
  }
)
Inline.displayName = "Inline"

/* -------------------------------------------------------------------------------------------------
 * Center
 * -----------------------------------------------------------------------------------------------*/

type CenterProps = React.ComponentPropsWithoutRef<"div"> &
  BaseProps & {
    axis?: "both" | "x" | "y"
  }

export const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, asChild, axis = "both", ...props }, ref) => {
    const Comp = asChild ? Slot : "div"

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex",
          axis === "both" && "items-center justify-center",
          axis === "x" && "justify-center",
          axis === "y" && "items-center",
          className
        )}
        {...props}
      />
    )
  }
)
Center.displayName = "Center"

/* -------------------------------------------------------------------------------------------------
 * Container
 * -----------------------------------------------------------------------------------------------*/

const containerVariants = cva("w-full mx-auto", {
  variants: {
    size: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-none",
    },
    padding: {
      none: "",
      sm: "px-4",
      md: "px-4 sm:px-6",
      lg: "px-4 sm:px-6 lg:px-8",
    },
  },
  defaultVariants: {
    size: "lg",
    padding: "md",
  },
})

type ContainerProps = React.ComponentPropsWithoutRef<"div"> &
  BaseProps &
  VariantProps<typeof containerVariants>

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, asChild, size, padding, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        ref={ref}
        className={cn(containerVariants({ size, padding }), className)}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

/* -------------------------------------------------------------------------------------------------
 * Section
 * -----------------------------------------------------------------------------------------------*/

const sectionVariants = cva("", {
  variants: {
    size: {
      none: "",
      sm: "py-12",
      md: "py-16",
      lg: "py-24",
      xl: "py-32",
    },
    tone: {
      default: "",
      muted: "bg-muted/40",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

type SectionProps = React.ComponentPropsWithoutRef<"section"> &
  BaseProps &
  VariantProps<typeof sectionVariants>

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, asChild, size, tone, ...props }, ref) => {
    const Comp = asChild ? Slot : "section"
    return (
      <Comp
        ref={ref}
        className={cn(sectionVariants({ size, tone }), className)}
        {...props}
      />
    )
  }
)
Section.displayName = "Section"

/* -------------------------------------------------------------------------------------------------
 * Grid — typed CVA variants prevent Tailwind from purging dynamic class strings
 * -----------------------------------------------------------------------------------------------*/

const gridVariants = cva("grid", {
  variants: {
    cols: {
      "1": "grid-cols-1",
      "2": "grid-cols-1 sm:grid-cols-2",
      "3": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
      "4": "grid-cols-2 md:grid-cols-4",
    },
    gap: {
      sm: "gap-3",
      md: "gap-6",
      lg: "gap-8",
    },
  },
  defaultVariants: {
    cols: "2",
    gap: "md",
  },
})

type GridProps = React.ComponentPropsWithoutRef<"div"> &
  BaseProps &
  VariantProps<typeof gridVariants>

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, asChild, cols, gap, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        ref={ref}
        className={cn(gridVariants({ cols, gap }), className)}
        {...props}
      />
    )
  }
)
Grid.displayName = "Grid"

/* -------------------------------------------------------------------------------------------------
 * TwoCol
 * -----------------------------------------------------------------------------------------------*/

const twoColVariants = cva("grid md:grid-cols-2", {
  variants: {
    gap: {
      sm: "gap-6",
      md: "gap-12",
      lg: "gap-16",
    },
  },
  defaultVariants: {
    gap: "md",
  },
})

type TwoColProps = React.ComponentPropsWithoutRef<"div"> &
  BaseProps &
  VariantProps<typeof twoColVariants> & {
    reverse?: boolean
  }

export const TwoCol = React.forwardRef<HTMLDivElement, TwoColProps>(
  ({ className, asChild, reverse, gap, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        ref={ref}
        className={cn(
          twoColVariants({ gap }),
          reverse && "md:[&>*:first-child]:order-last",
          className
        )}
        {...props}
      />
    )
  }
)
TwoCol.displayName = "TwoCol"

/* -------------------------------------------------------------------------------------------------
 * Spacer
 * -----------------------------------------------------------------------------------------------*/

export const Spacer = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => {
  return <div className={cn("flex-1", className)} aria-hidden="true" {...props} />
}
Spacer.displayName = "Spacer"

/* -------------------------------------------------------------------------------------------------
 * Divider
 * -----------------------------------------------------------------------------------------------*/

type DividerProps = React.ComponentPropsWithoutRef<"hr"> & {
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
}

export const Divider = ({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: DividerProps) => {
  const isHorizontal = orientation === "horizontal"

  return (
    <hr
      className={cn(
        "shrink-0 border-border",
        isHorizontal ? "h-px w-full border-t" : "h-full w-px border-l",
        className
      )}
      role={decorative ? "presentation" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      {...props}
    />
  )
}
Divider.displayName = "Divider"

/* -------------------------------------------------------------------------------------------------
 * Box
 * -----------------------------------------------------------------------------------------------*/

export const Box = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & BaseProps
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return <Comp ref={ref} className={className} {...props} />
})
Box.displayName = "Box"

/* -------------------------------------------------------------------------------------------------
 * Prose
 * -----------------------------------------------------------------------------------------------*/

const proseVariants = cva("prose prose-neutral dark:prose-invert", {
  variants: {
    size: {
      sm: "max-w-[55ch]",
      md: "max-w-[65ch]",
      lg: "max-w-[75ch]",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

type ProseProps = React.ComponentPropsWithoutRef<"div"> &
  BaseProps &
  VariantProps<typeof proseVariants>

export const Prose = React.forwardRef<HTMLDivElement, ProseProps>(
  ({ className, asChild, size, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"

    return (
      <Comp
        ref={ref}
        className={cn(proseVariants({ size }), className)}
        {...props}
      />
    )
  }
)
Prose.displayName = "Prose"

/* -------------------------------------------------------------------------------------------------
 * Export
 * -----------------------------------------------------------------------------------------------*/

export const Layout = {
  Stack,
  Inline,
  Center,
  Container,
  Section,
  Grid,
  TwoCol,
  Spacer,
  Divider,
  Box,
  Prose,
} as const
