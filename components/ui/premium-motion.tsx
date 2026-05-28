"use client"

import { motion } from "framer-motion"

/**
 * Premium Motion Components
 * Consistent micro animations and motion design across the app
 */

// Fade in with slide up
export function FadeInUp({ children, delay = 0, duration = 0.5 }: { children: React.ReactNode; delay?: number; duration?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Fade in with slide down
export function FadeInDown({ children, delay = 0, duration = 0.5 }: { children: React.ReactNode; delay?: number; duration?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Fade in with scale
export function FadeInScale({ children, delay = 0, duration = 0.5 }: { children: React.ReactNode; delay?: number; duration?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animation
export function StaggerContainer({ children, staggerDelay = 0.1 }: { children: React.ReactNode; staggerDelay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Hover lift effect
export function HoverLift({ children, lift = 8 }: { children: React.ReactNode; lift?: number }) {
  return (
    <motion.div
      whileHover={{ y: -lift, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  )
}

// Hover glow effect
export function HoverGlow({ children, color = "#3b82f6" }: { children: React.ReactNode; color?: string }) {
  return (
    <motion.div
      whileHover={{ 
        boxShadow: `0 0 30px ${color}40`,
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
      }}
    >
      {children}
    </motion.div>
  )
}

// Pulse animation for loading/active states
export function Pulse({ children, duration = 2 }: { children: React.ReactNode; duration?: number }) {
  return (
    <motion.div
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}

// Shimmer effect for loading
export function Shimmer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        backgroundPosition: ["200% 0%", "-200% 0%"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
        backgroundSize: "200% 100%",
      }}
    >
      {children}
    </motion.div>
  )
}

// Bounce animation
export function Bounce({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }}
      transition={{
        delay,
        duration: 1,
        repeat: Infinity,
        repeatDelay: 2,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

// Rotate animation
export function Rotate({ children, duration = 20 }: { children: React.ReactNode; duration?: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.div>
  )
}

// Scale on hover
export function ScaleOnHover({ children, scale = 1.05 }: { children: React.ReactNode; scale?: number }) {
  return (
    <motion.div
      whileHover={{ scale, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  )
}

// Press feedback
export function PressFeedback({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
    >
      {children}
    </motion.div>
  )
}

// Slide in from left
export function SlideInLeft({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Slide in from right
export function SlideInRight({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Animated number counter
export function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </motion.div>
    </motion.div>
  )
}
