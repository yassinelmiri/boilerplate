"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

const loaderVariants = cva("flex items-center justify-center", {
  variants: {
    variant: {
      inline: "h-full w-full",
      fullscreen: "min-h-screen w-full",
      overlay: "fixed inset-0 z-50 bg-background/60 backdrop-blur-sm",
    },
  },
  defaultVariants: {
    variant: "inline",
  },
})

type BaseLoaderProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof loaderVariants> & {
    label?: string
  }

export function BaseLoader({
  className,
  variant,
  label,
  ...props
}: BaseLoaderProps) {
  const t = useTranslations("LOADER")

  const accessibleLabel = label ?? t("LOADING")

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(loaderVariants({ variant }), className)}
      {...props}
    >
      {/* aria-hidden so screen readers don't double-announce via the live region */}
      <Spinner aria-hidden="true" />
      <span className="sr-only">{accessibleLabel}</span>
    </div>
  )
}

BaseLoader.displayName = "BaseLoader"
