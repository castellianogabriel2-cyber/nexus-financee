"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { useReducedMotion } from "framer-motion"
import { useState, useEffect } from "react"

/**
 * Nexus OS - Cinematic Background System
 * 
 * Philosophy:
 * - Gradients vivos
 * - Floating particles
 * - Moving blur lights
 * - Depth layers
 * - Soft illumination
 * 
 * Inspired by:
 * - Apple
 * - Tesla UI
 * - Sci-fi elegante
 * 
 * NOT:
 * - Cyberpunk
 * - Gamer
 */

// Floating particle
function FloatingParticle({ 
  delay = 0,
  duration = 10,
  size = 2,
  color = nexusOS.colors.accent.primary
}: { 
  delay?: number
  duration?: number
  size?: number
  color?: string
}) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return null

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -100, 0],
        x: [0, 50, 0],
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

// Moving blur light
function MovingBlurLight({ 
  delay = 0,
  duration = 15,
  size = 300,
  color = "rgba(0, 212, 255, 0.03)"
}: { 
  delay?: number
  duration?: number
  size?: number
  color?: string
}) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return null

  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        background: color,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        x: [0, 200, 0],
        y: [0, -150, 0],
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

// Depth layer
function DepthLayer({ 
  depth = 1,
  children 
}: { 
  depth?: number
  children: React.ReactNode 
}) {
  const prefersReducedMotion = useReducedMotion()

  const depthStyles = prefersReducedMotion 
    ? {}
    : {
        transform: `translateZ(${depth * 10}px)`,
        filter: `blur(${depth * 0.5}px)`,
        opacity: 1 - depth * 0.15,
      }

  return <div style={depthStyles}>{children}</div>
}

// Main cinematic background
export function CinematicBackground({ 
  children,
  intensity = "normal"
}: { 
  children: React.ReactNode
  intensity?: "subtle" | "normal" | "strong"
}) {
  const prefersReducedMotion = useReducedMotion()
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  const intensityConfig = {
    subtle: { particles: 5, lights: 2, glow: 0.02 },
    normal: { particles: 8, lights: 3, glow: 0.03 },
    strong: { particles: 12, lights: 4, glow: 0.05 },
  }

  const config = intensityConfig[intensity]

  // Mouse tracking for dynamic gradient
  useEffect(() => {
    if (prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [prefersReducedMotion])

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: nexusOS.colors.background.primary }}>
      {/* Base gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.01) 0%, transparent 50%)",
        }}
      />

      {/* Dynamic mouse-following gradient */}
      {!prefersReducedMotion && (
        <motion.div
          className="fixed inset-0 pointer-events-none"
          animate={{
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 212, 255, ${config.glow}), transparent 40%)`,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}

      {/* Depth layers */}
      <DepthLayer depth={1}>
        {/* Moving blur lights */}
        {[...Array(config.lights)].map((_, i) => (
          <MovingBlurLight
            key={`light-${i}`}
            delay={i * 2}
            duration={15 + i * 3}
            size={300 + i * 50}
          />
        ))}
      </DepthLayer>

      <DepthLayer depth={2}>
        {/* Floating particles */}
        {[...Array(config.particles)].map((_, i) => (
          <FloatingParticle
            key={`particle-${i}`}
            delay={i * 0.5}
            duration={8 + i * 2}
            size={1 + Math.random() * 2}
          />
        ))}
      </DepthLayer>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// Premium gradient overlay
export function GradientOverlay({ 
  opacity = 0.5,
  direction = "to bottom"
}: { 
  opacity?: number
  direction?: string
}) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `linear-gradient(${direction}, rgba(10, 10, 10, ${opacity}), rgba(10, 10, 10, 0))`,
      }}
    />
  )
}

// Soft illumination
export function SoftIllumination({ 
  position = "top",
  intensity = 0.05
}: { 
  position?: "top" | "bottom" | "left" | "right"
  intensity?: number
}) {
  const positionStyles = {
    top: "radial-gradient(ellipse at top, rgba(0, 212, 255, 0.05) 0%, transparent 50%)",
    bottom: "radial-gradient(ellipse at bottom, rgba(0, 212, 255, 0.05) 0%, transparent 50%)",
    left: "radial-gradient(ellipse at left, rgba(0, 212, 255, 0.05) 0%, transparent 50%)",
    right: "radial-gradient(ellipse at right, rgba(0, 212, 255, 0.05) 0%, transparent 50%)",
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: positionStyles[position],
      }}
    />
  )
}
