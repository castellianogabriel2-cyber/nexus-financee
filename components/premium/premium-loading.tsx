"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { useReducedMotion } from "framer-motion"

/**
 * Nexus OS - Premium Loading
 * 
 * Philosophy:
 * - Skeleton premium
 * - Blur reveal
 * - Shimmer minimal
 * - Fade transitions
 * 
 * NOT:
 * - Spinner comum
 * - Loading genérico
 */

// Cinematic loader
export function CinematicLoader({ 
  size = "md",
  message 
}: { 
  size?: "sm" | "md" | "lg"
  message?: string 
}) {
  const prefersReducedMotion = useReducedMotion()

  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
  }

  const loaderSize = sizeMap[size]

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <motion.div
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="rounded-full"
        style={{
          width: loaderSize,
          height: loaderSize,
          background: nexusOS.colors.accent.primary + "15",
        }}
      />
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-sm"
          style={{ color: nexusOS.colors.text.tertiary }}
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

// Premium skeleton card
export function PremiumSkeletonCard({ 
  className = "" 
}: { 
  className?: string 
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`rounded-3xl p-6 ${className}`}
      style={{
        background: nexusOS.glass.light.background,
        backdropFilter: nexusOS.glass.light.backdropFilter,
        border: `1px solid ${nexusOS.colors.border.subtle}`,
      }}
    >
      {/* Shimmer effect */}
      {!prefersReducedMotion && (
        <motion.div
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)",
          }}
        />
      )}

      {/* Skeleton content */}
      <div className="space-y-4">
        <div className="h-4 rounded-full" style={{ background: nexusOS.colors.border.medium, width: "60%" }} />
        <div className="h-8 rounded-full" style={{ background: nexusOS.colors.border.medium, width: "40%" }} />
        <div className="h-3 rounded-full" style={{ background: nexusOS.colors.border.subtle, width: "80%" }} />
        <div className="h-3 rounded-full" style={{ background: nexusOS.colors.border.subtle, width: "70%" }} />
      </div>
    </motion.div>
  )
}

// Premium skeleton list item
export function PremiumSkeletonListItem({ 
  className = "" 
}: { 
  className?: string 
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-4 p-4 rounded-2xl ${className}`}
      style={{
        background: nexusOS.glass.light.background,
        backdropFilter: nexusOS.glass.light.backdropFilter,
        border: `1px solid ${nexusOS.colors.border.subtle}`,
      }}
    >
      {/* Shimmer effect */}
      {!prefersReducedMotion && (
        <motion.div
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)",
          }}
        />
      )}

      <div className="w-10 h-10 rounded-xl" style={{ background: nexusOS.colors.border.medium }} />
      <div className="flex-1 space-y-2">
        <div className="h-3 rounded-full" style={{ background: nexusOS.colors.border.medium, width: "50%" }} />
        <div className="h-2 rounded-full" style={{ background: nexusOS.colors.border.subtle, width: "30%" }} />
      </div>
      <div className="h-4 rounded-full" style={{ background: nexusOS.colors.border.medium, width: "20%" }} />
    </motion.div>
  )
}

// Premium skeleton chart
export function PremiumSkeletonChart({ 
  className = "" 
}: { 
  className?: string 
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-48 rounded-3xl ${className}`}
      style={{
        background: nexusOS.glass.light.background,
        backdropFilter: nexusOS.glass.light.backdropFilter,
        border: `1px solid ${nexusOS.colors.border.subtle}`,
      }}
    >
      {/* Shimmer effect */}
      {!prefersReducedMotion && (
        <motion.div
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)",
          }}
        />
      )}

      {/* Chart bars */}
      <div className="flex items-end justify-between h-full p-6 gap-2">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-lg"
            style={{
              background: nexusOS.colors.border.medium,
              height: `${30 + Math.random() * 50}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// Blur reveal loading
export function BlurRevealLoader({ 
  children,
  delay = 0
}: { 
  children: React.ReactNode
  delay?: number 
}) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(20px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

// Shimmer overlay
export function ShimmerOverlay({ 
  children,
  isLoading 
}: { 
  children: React.ReactNode
  isLoading: boolean 
}) {
  const prefersReducedMotion = useReducedMotion()

  if (!isLoading || prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {children}
      <motion.div
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
        }}
      />
    </div>
  )
}

// Page loading state
export function PageLoading({ 
  message = "Carregando..." 
}: { 
  message?: string 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: nexusOS.colors.background.primary }}>
      <CinematicLoader size="lg" message={message} />
    </div>
  )
}
