"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { ReactNode, useRef, useState } from "react"

/**
 * Nexus OS - Apple-Level Details
 * 
 * Philosophy:
 * - Micro blur em hover
 * - Opacity transitions
 * - Subtle glow
 * - Glass reflections
 * - Dynamic shadows
 * - Smooth counters
 * 
 * Inspired by:
 * - Apple
 * - iOS
 * - VisionOS
 */

// Micro blur on hover
export function MicroBlur({ 
  children, 
  blurAmount = 8,
  className = "" 
}: { 
  children: ReactNode
  blurAmount?: number
  className?: string 
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={className}
      style={{
        backdropFilter: isHovered ? `blur(${blurAmount}px)` : "none",
        transition: "backdrop-filter 0.3s ease",
      }}
    >
      {children}
    </motion.div>
  )
}

// Opacity transition
export function OpacityTransition({ 
  children, 
  delay = 0,
  duration = 0.3,
  className = "" 
}: { 
  children: ReactNode
  delay?: number
  duration?: number
  className?: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Subtle glow
export function SubtleGlow({ 
  children, 
  glowColor = nexusOS.colors.accent.primary,
  glowIntensity = 0.15,
  className = "" 
}: { 
  children: ReactNode
  glowColor?: string
  glowIntensity?: number
  className?: string 
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={className}
      style={{
        boxShadow: isHovered 
          ? `0 0 40px ${glowColor}${Math.floor(glowIntensity * 255).toString(16).padStart(2, "0")}`
          : "none",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {children}
    </motion.div>
  )
}

// Glass reflection
export function GlassReflection({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
        }}
      />
    </div>
  )
}

// Dynamic shadow
export function DynamicShadow({ 
  children, 
  shadowColor = nexusOS.colors.accent.primary,
  className = "" 
}: { 
  children: ReactNode
  shadowColor?: string
  className?: string 
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={className}
      style={{
        boxShadow: isHovered
          ? `0 20px 60px ${shadowColor}20`
          : `0 4px 20px ${shadowColor}10`,
        transition: "box-shadow 0.3s ease",
      }}
    >
      {children}
    </motion.div>
  )
}

// Smooth counter
export function SmoothCounter({ 
  value,
  duration = 1,
  className = "" 
}: { 
  value: number
  duration?: number
  className?: string 
}) {
  const [displayValue, setDisplayValue] = useState(0)

  // Animate counter on value change
  // This is a simplified version - in production you'd use a more sophisticated animation
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {value.toLocaleString("pt-BR")}
    </motion.span>
  )
}

// Premium card with all Apple-level details
export function PremiumCard({ 
  children, 
  className = "",
  enableGlow = true,
  enableReflection = true 
}: { 
  children: ReactNode
  className?: string
  enableGlow?: boolean
  enableReflection?: boolean
}) {
  const CardContent = enableReflection ? GlassReflection : ({ children }: { children: ReactNode }) => <>{children}</>
  const GlowContent = enableGlow ? SubtleGlow : ({ children }: { children: ReactNode }) => <>{children}</>

  return (
    <GlowContent>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`p-6 rounded-3xl ${className}`}
          style={{
            background: nexusOS.glass.light.background,
            backdropFilter: nexusOS.glass.light.backdropFilter,
            border: `1px solid ${nexusOS.colors.border.subtle}`,
          }}
        >
          {children}
        </motion.div>
      </CardContent>
    </GlowContent>
  )
}

// Interactive element with micro-interactions
export function InteractiveElement({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 50, y: 50 })}
      className={className}
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`,
      }}
    >
      {children}
    </motion.div>
  )
}

// Smooth scale on hover
export function SmoothScale({ 
  children, 
  scale = 1.05,
  className = "" 
}: { 
  children: ReactNode
  scale?: number
  className?: string 
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Premium button with Apple-level details
export function PremiumButton({ 
  children, 
  onClick,
  variant = "primary",
  className = "" 
}: { 
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost"
  className?: string 
}) {
  const variantStyles = {
    primary: {
      background: nexusOS.colors.accent.primary,
      color: nexusOS.colors.background.primary,
    },
    secondary: {
      background: nexusOS.colors.border.medium,
      color: nexusOS.colors.text.primary,
    },
    ghost: {
      background: "transparent",
      color: nexusOS.colors.text.primary,
    },
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`px-6 py-3 rounded-2xl font-medium ${className}`}
      style={variantStyles[variant]}
    >
      {children}
    </motion.button>
  )
}
