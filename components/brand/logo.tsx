"use client"

import * as React from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/

const logoVariants = cva(
  "inline-flex items-center font-extrabold tracking-tight select-none",
  {
    variants: {
      size: {
        sm: "text-sm gap-1.5",
        md: "text-base gap-2",
        lg: "text-lg gap-2.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

type LogoProps = Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> &
  VariantProps<typeof logoVariants> & {
    href?: React.ComponentPropsWithoutRef<typeof Link>["href"]
  }

/* -------------------------------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------------------------*/

export function Logo({
  className,
  size,
  href = "/",
  ...props
}: LogoProps) {
  const t = useTranslations("LOGO")

  return (
    <Link
      href={href}
      aria-label={t("ARIA_LABEL")}
      className={cn(logoVariants({ size }), className)}
      {...props}
    >
      {/* Brand */}
      <span>Agency</span>
    </Link>
  )
}

Logo.displayName = "Logo"