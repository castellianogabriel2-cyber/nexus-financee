"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { ReactNode } from "react"

/**
 * Nexus OS - Mobile First Real
 * 
 * Philosophy:
 * - Desktop deve parecer "um iPhone premium ampliado"
 * - NÃO um sistema web tradicional
 * - Mobile-first design
 * - iPhone form factor on desktop
 * 
 * Inspired by:
 * - Apple iPhone
 * - iOS
 * - iPad
 */

interface MobileFirstWrapperProps {
  children: ReactNode
  className?: string
}

export function MobileFirstWrapper({ 
  children, 
  className = "" 
}: MobileFirstWrapperProps) {
  return (
    <div className={`min-h-screen ${className}`}>
      {/* Mobile: Full width */}
      <div className="lg:hidden">
        {children}
      </div>

      {/* Desktop: iPhone-like container */}
      <div className="hidden lg:flex items-center justify-center min-h-screen p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="relative"
          style={{
            width: "390px",
            height: "844px",
            background: nexusOS.colors.background.primary,
            borderRadius: "50px",
            boxShadow: "0 50px 100px -20px rgba(0, 0, 0, 0.5), 0 30px 60px -30px rgba(0, 0, 0, 0.3)",
            border: "8px solid #1a1a1a",
            overflow: "hidden",
          }}
        >
          {/* Dynamic Island */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50"
            style={{
              width: "120px",
              height: "35px",
              background: "#000",
              borderRadius: "20px",
            }}
          />

          {/* Content */}
          <div className="h-full overflow-y-auto overflow-x-hidden">
            {children}
          </div>

          {/* Home indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50"
            style={{
              width: "134px",
              height: "5px",
              background: "rgba(255, 255, 255, 0.3)",
              borderRadius: "3px",
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

// iPad-like container for tablet
export function TabletWrapper({ 
  children, 
  className = "" 
}: MobileFirstWrapperProps) {
  return (
    <div className={`min-h-screen ${className}`}>
      {/* Mobile: Full width */}
      <div className="md:hidden">
        {children}
      </div>

      {/* Tablet: iPad-like container */}
      <div className="hidden md:flex items-center justify-center min-h-screen p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="relative"
          style={{
            width: "820px",
            height: "1180px",
            background: nexusOS.colors.background.primary,
            borderRadius: "35px",
            boxShadow: "0 50px 100px -20px rgba(0, 0, 0, 0.5), 0 30px 60px -30px rgba(0, 0, 0, 0.3)",
            border: "12px solid #1a1a1a",
            overflow: "hidden",
          }}
        >
          {/* Content */}
          <div className="h-full overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Responsive container that adapts to screen size
export function ResponsiveContainer({ 
  children, 
  className = "" 
}: MobileFirstWrapperProps) {
  return (
    <div className={`min-h-screen ${className}`}>
      {/* Mobile: Full width */}
      <div className="max-w-md mx-auto md:hidden">
        {children}
      </div>

      {/* Tablet: Centered with max width */}
      <div className="hidden md:block lg:hidden max-w-2xl mx-auto">
        {children}
      </div>

      {/* Desktop: iPhone-like */}
      <div className="hidden lg:flex items-center justify-center min-h-screen p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="relative"
          style={{
            width: "390px",
            height: "844px",
            background: nexusOS.colors.background.primary,
            borderRadius: "50px",
            boxShadow: "0 50px 100px -20px rgba(0, 0, 0, 0.5), 0 30px 60px -30px rgba(0, 0, 0, 0.3)",
            border: "8px solid #1a1a1a",
            overflow: "hidden",
          }}
        >
          {/* Dynamic Island */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50"
            style={{
              width: "120px",
              height: "35px",
              background: "#000",
              borderRadius: "20px",
            }}
          />

          {/* Content */}
          <div className="h-full overflow-y-auto overflow-x-hidden">
            {children}
          </div>

          {/* Home indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50"
            style={{
              width: "134px",
              height: "5px",
              background: "rgba(255, 255, 255, 0.3)",
              borderRadius: "3px",
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

// Safe area padding for iOS
export function SafeAreaPadding({ 
  children, 
  className = "" 
}: MobileFirstWrapperProps) {
  return (
    <div 
      className={className}
      style={{
        paddingTop: "env(safe-area-inset-top, 20px)",
        paddingBottom: "env(safe-area-inset-bottom, 20px)",
        paddingLeft: "env(safe-area-inset-left, 20px)",
        paddingRight: "env(safe-area-inset-right, 20px)",
      }}
    >
      {children}
    </div>
  )
}
