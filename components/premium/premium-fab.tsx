"use client"

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { useRef, useState } from "react"
import { Plus } from "lucide-react"

/**
 * Nexus OS - Premium Floating Action Button
 * 
 * Philosophy:
 * - Botão físico premium
 * - Magnético
 * - Vivo
 * - Tátil
 * 
 * Inspired by:
 * - iOS
 * - Tesla UI
 * - Apple
 */

interface PremiumFABProps {
  onClick: () => void
  icon?: React.ReactNode
  size?: "sm" | "md" | "lg"
  position?: "bottom-right" | "bottom-center"
  className?: string
}

export function PremiumFAB({ 
  onClick, 
  icon,
  size = "md",
  position = "bottom-right",
  className = ""
}: PremiumFABProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Magnetic effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])
  
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const sizeMap = {
    sm: { width: 48, height: 48, icon: 20 },
    md: { width: 56, height: 56, icon: 24 },
    lg: { width: 64, height: 64, icon: 28 },
  }

  const dimensions = sizeMap[size]

  const positionStyles = {
    "bottom-right": "bottom-24 right-6",
    "bottom-center": "bottom-24 left-1/2 -translate-x-1/2",
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
    
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateX,
        rotateY,
        width: dimensions.width,
        height: dimensions.height,
        perspective: 1000,
        background: nexusOS.colors.accent.primary,
        boxShadow: isHovered 
          ? `0 0 60px ${nexusOS.colors.accent.primary}40` 
          : `0 8px 32px ${nexusOS.colors.accent.primary}20`,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: `0 0 40px ${nexusOS.colors.accent.primary}30`,
      }}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
      className={`fixed z-50 rounded-full flex items-center justify-center ${positionStyles[position]} ${className}`}
    >
      {/* Inner glow */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.6 : 0.3,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{
          duration: 0.3,
        }}
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${nexusOS.colors.accent.primary}60, transparent)`,
        }}
      />

      {/* Icon */}
      <motion.div
        animate={{
          rotate: isHovered ? 90 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      >
        {icon || <Plus size={dimensions.icon} style={{ color: nexusOS.colors.background.primary }} />}
      </motion.div>

      {/* Blur effect */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.3 : 0,
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{
          duration: 0.3,
        }}
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background: nexusOS.colors.accent.primary,
        }}
      />
    </motion.button>
  )
}

// Mini FAB for secondary actions
export function MiniFAB({ 
  onClick, 
  icon,
  className = ""
}: { 
  onClick: () => void
  icon: React.ReactNode
  className?: string 
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        scale: 1.1,
        boxShadow: `0 0 30px ${nexusOS.colors.accent.primary}25`,
      }}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
      className={`w-12 h-12 rounded-full flex items-center justify-center ${className}`}
      style={{
        background: nexusOS.colors.accent.primary + "15",
        border: `1px solid ${nexusOS.colors.border.subtle}`,
      }}
    >
      {icon}
    </motion.button>
  )
}
