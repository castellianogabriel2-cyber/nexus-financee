"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { ReactNode } from "react"

/**
 * Nexus OS - Cinematic Block
 * Editorial component with premium whitespace
 * 
 * Philosophy:
 * - Cinematic presentation
 * - Premium whitespace
 * - Editorial hierarchy
 * - Emotional connection
 * - Minimal borders
 * - Focus on content
 */

interface CinematicBlockProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function CinematicBlock({ children, className = "", delay = 0 }: CinematicBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  )
}

/**
 * Editorial Section - Premium spacing
 */
export function EditorialSection({ 
  children, 
  className = "",
  spacing = "xl"
}: { 
  children: ReactNode
  className?: string
  spacing?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
}) {
  const spacingMap = {
    sm: nexusOS.spacing.md,
    md: nexusOS.spacing.lg,
    lg: nexusOS.spacing.xl,
    xl: nexusOS.spacing["2xl"],
    "2xl": nexusOS.spacing["3xl"],
    "3xl": nexusOS.spacing["4xl"],
  }

  return (
    <section 
      className={`w-full ${className}`}
      style={{ marginBottom: spacingMap[spacing] }}
    >
      {children}
    </section>
  )
}

/**
 * Editorial Title - Absurdly large
 */
export function EditorialTitle({ 
  children, 
  className = "",
  size = "6xl"
}: { 
  children: ReactNode
  className?: string
  size?: "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl" | "10xl"
}) {
  const sizeMap = {
    "4xl": nexusOS.typography.fontSize["4xl"],
    "5xl": nexusOS.typography.fontSize["5xl"],
    "6xl": nexusOS.typography.fontSize["6xl"],
    "7xl": nexusOS.typography.fontSize["7xl"],
    "8xl": nexusOS.typography.fontSize["8xl"],
    "9xl": nexusOS.typography.fontSize["9xl"],
    "10xl": nexusOS.typography.fontSize["10xl"],
  }

  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`font-semibold tracking-tight leading-[0.9] ${className}`}
      style={{ 
        fontSize: sizeMap[size],
        color: nexusOS.colors.text.primary,
        fontFamily: nexusOS.typography.fontFamily.sans,
      }}
    >
      {children}
    </motion.h2>
  )
}

/**
 * Editorial Subtitle - Elegant and light
 */
export function EditorialSubtitle({ 
  children, 
  className = ""
}: { 
  children: ReactNode
  className?: string
}) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className={`font-light leading-relaxed ${className}`}
      style={{ 
        fontSize: nexusOS.typography.fontSize.xl,
        color: nexusOS.colors.text.tertiary,
        fontFamily: nexusOS.typography.fontFamily.sans,
      }}
    >
      {children}
    </motion.p>
  )
}

/**
 * Cinematic Divider - Premium gradient line
 */
export function CinematicDivider({ 
  className = "",
  width = "100px"
}: { 
  className?: string
  width?: string
}) {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={`h-[1px] ${className}`}
      style={{
        background: "linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent)",
      }}
    />
  )
}

/**
 * Premium Whitespace - Editorial spacing
 */
export function PremiumWhitespace({ 
  size = "xl"
}: { 
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl"
}) {
  const sizeMap = {
    sm: nexusOS.spacing.sm,
    md: nexusOS.spacing.md,
    lg: nexusOS.spacing.lg,
    xl: nexusOS.spacing.xl,
    "2xl": nexusOS.spacing["2xl"],
    "3xl": nexusOS.spacing["3xl"],
    "4xl": nexusOS.spacing["4xl"],
    "5xl": nexusOS.spacing["5xl"],
  }

  return <div style={{ height: sizeMap[size] }} />
}
