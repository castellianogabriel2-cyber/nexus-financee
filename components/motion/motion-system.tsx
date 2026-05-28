"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ReactNode, useRef, useEffect, useState } from "react"

/**
 * Nexus OS - Motion System Global
 * 
 * Philosophy:
 * - Spring physics naturais
 * - Inertia scrolling
 * - Blur transitions
 * - Smooth page transitions
 * - Stagger animations
 * - Dynamic depth
 * - Tactile interactions
 * 
 * Inspired by:
 * - iOS
 * - VisionOS
 * - Arc Browser
 * - Linear
 */

// Spring physics presets
export const springPresets = {
  // iOS native spring
  ios: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
  // Cinematic smooth
  cinematic: {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
  },
  // Quick snappy
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 20,
  },
  // Gentle bounce
  bounce: {
    type: "spring" as const,
    stiffness: 350,
    damping: 15,
  },
}

// Easing presets
export const easingPresets = {
  // iOS native
  ios: [0.175, 0.885, 0.32, 1.275] as const,
  // Cinematic
  cinematic: [0.25, 0.1, 0.25, 1] as const,
  // Smooth
  smooth: [0.4, 0, 0.2, 1] as const,
  // Ease out
  easeOut: [0, 0, 0.2, 1] as const,
}

// Duration presets
export const durationPresets = {
  instant: 150,
  fast: 250,
  normal: 400,
  slow: 600,
  cinematic: 800,
  epic: 1200,
}

// Stagger presets
export const staggerPresets = {
  tight: 0.03,
  normal: 0.05,
  relaxed: 0.08,
  cinematic: 0.12,
}

// Motion wrapper with reduced motion support
export function MotionWrapper({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string 
}) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: durationPresets.cinematic, ease: easingPresets.cinematic }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animation
export function StaggerChildren({ 
  children, 
  stagger = staggerPresets.normal,
  className = "" 
}: { 
  children: ReactNode
  stagger?: number
  className?: string 
}) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger item
export function StaggerItem({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string 
}) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: durationPresets.normal,
            ease: easingPresets.cinematic,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Smooth page transition
export function PageTransition({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string 
}) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: durationPresets.cinematic,
        ease: easingPresets.cinematic,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Magnetic button effect
export function MagneticButton({ 
  children, 
  className = "",
  strength = 0.3
}: { 
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const prefersReducedMotion = useReducedMotion()

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    setPosition({ x: x * strength, y: y * strength })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: prefersReducedMotion ? 0 : position.x,
        y: prefersReducedMotion ? 0 : position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Tactile press effect
export function TactilePress({ 
  children, 
  className = "",
  scale = 0.95
}: { 
  children: ReactNode
  className?: string
  scale?: number
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      whileTap={prefersReducedMotion ? {} : { scale }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Blur reveal effect
export function BlurReveal({ 
  children, 
  delay = 0,
  className = "" 
}: { 
  children: ReactNode
  delay?: number
  className?: string 
}) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(20px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{
        duration: durationPresets.cinematic,
        delay,
        ease: easingPresets.cinematic,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Smooth scroll container
export function SmoothScroll({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string 
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: durationPresets.slow,
        ease: easingPresets.cinematic,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Dynamic depth layer
export function DepthLayer({ 
  children, 
  depth = 1,
  className = "" 
}: { 
  children: ReactNode
  depth?: number
  className?: string 
}) {
  const prefersReducedMotion = useReducedMotion()

  const depthStyles = {
    transform: prefersReducedMotion ? "none" : `translateZ(${depth * 10}px)`,
    filter: prefersReducedMotion ? "none" : `blur(${depth * 0.5}px)`,
    opacity: prefersReducedMotion ? 1 : 1 - depth * 0.1,
  }

  return (
    <div style={depthStyles} className={className}>
      {children}
    </div>
  )
}

// Premium hover glow
export function PremiumHoverGlow({ 
  children, 
  className = "",
  color = "rgba(0, 212, 255, 0.15)"
}: { 
  children: ReactNode
  className?: string
  color?: string
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      whileHover={prefersReducedMotion ? {} : {
        boxShadow: `0 0 40px ${color}`,
      }}
      transition={{
        duration: durationPresets.normal,
        ease: easingPresets.smooth,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
