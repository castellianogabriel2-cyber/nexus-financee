"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { minimalLuxury } from "@/lib/design-system/minimal-luxury"
import { ReactNode, useRef } from "react"

/**
 * Apple Level Interactions
 * Inspired by: Apple VisionOS, iOS 17, Tesla UI, Linear
 * 
 * Features:
 * - Motion blur sophisticated
 * - Parallax premium
 * - Tactile animations
 * - Cinematic transitions
 * - Ultra smooth scrolling
 * - Dynamic depth
 */

/**
 * Parallax Container - Premium depth effect
 */
export function ParallaxContainer({ children, speed = 0.5 }: { children: ReactNode; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <motion.div ref={ref} style={{ y, opacity }}>
      {children}
    </motion.div>
  )
}

/**
 * Magnetic Button - Premium tactile feedback
 */
export function MagneticButton({ 
  children, 
  className = "",
  onClick 
}: { 
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  )
}

/**
 * Tactile Card - Premium touch feedback
 */
export function TactileCard({ 
  children, 
  className = "",
  onClick 
}: { 
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.01,
        y: -4,
      }}
      whileTap={{ 
        scale: 0.99,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Motion Blur Container - Cinematic blur on scroll
 */
export function MotionBlurContainer({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll()
  const blur = useTransform(scrollY, [0, 100], [0, 8])
  const opacity = useTransform(scrollY, [0, 100], [1, 0])

  return (
    <motion.div style={{ filter: useSpring(blur), opacity }}>
      {children}
    </motion.div>
  )
}

/**
 * Dynamic Depth Layer - Premium depth effect
 */
export function DynamicDepthLayer({ 
  children, 
  depth = 1,
  className = ""
}: { 
  children: ReactNode
  depth?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, z: depth * -50 }}
      animate={{ opacity: 1, z: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as const,
      }}
      whileHover={{ z: depth * 20 }}
      style={{
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Spring Scale - Premium spring animation
 */
export function SpringScale({ 
  children, 
  trigger = true 
}: { 
  children: ReactNode
  trigger?: boolean
}) {
  return (
    <motion.div
      animate={{
        scale: trigger ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const,
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Smooth Scroll Container - Ultra smooth scrolling
 */
export function SmoothScrollContainer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Cinematic Fade - Premium fade animation
 */
export function CinematicFade({ 
  children, 
  delay = 0,
  direction = "up"
}: { 
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
}) {
  const directions = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        delay,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as const,
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Premium Hover Glow - Subtle glow on hover
 */
export function PremiumHoverGlow({ 
  children, 
  className = ""
}: { 
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 40px ${minimalLuxury.colors.accent.primary}20`,
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1] as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Staggered Children - Premium stagger animation
 */
export function StaggeredChildren({ 
  children, 
  staggerDelay = 0.1 
}: { 
  children: ReactNode
  staggerDelay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
        hidden: {
          opacity: 0,
        },
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Premium Pulse - Subtle pulse animation
 */
export function PremiumPulse({ 
  children, 
  className = ""
}: { 
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.02, 1],
        opacity: [1, 0.9, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
