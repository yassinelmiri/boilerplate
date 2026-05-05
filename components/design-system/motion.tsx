"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react"

type MotionVariant = "fade" | "slide-up" | "slide-down" | "scale"

const variantsMap = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -24 },
    animate: { opacity: 1, y: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
  },
}

// Override children to ReactNode — HTMLMotionProps widens it to include MotionValues
type MotionProps = Omit<HTMLMotionProps<"div">, "children"> & {
  variant?: MotionVariant
  delay?: number
  duration?: number
  children?: ReactNode
}

export function Motion({
  className,
  variant = "fade",
  delay = 0,
  duration = 0.3,
  children,
  ...props
}: MotionProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  const v = variantsMap[variant]

  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

Motion.displayName = "Motion"
