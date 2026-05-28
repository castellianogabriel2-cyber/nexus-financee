"use client"

import { motion } from "framer-motion"

/**
 * Premium Loading Components
 * Cinematic loading states and skeletons
 */

// Full page cinematic loader
export function CinematicLoader({ message = "Carregando..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 mx-auto mb-4 glow-primary"
        />
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-muted-foreground text-sm"
        >
          {message}
        </motion.p>
      </div>
    </div>
  )
}

// Inline spinner
export function PremiumSpinner({ size = 24 }: { size?: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`border-2 border-primary/20 border-t-primary rounded-full`}
      style={{ width: size, height: size }}
    />
  )
}

// Pulse loader
export function PulseLoader() {
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          className="w-2 h-2 rounded-full bg-primary"
        />
      ))}
    </div>
  )
}

// Premium skeleton card
export function PremiumSkeletonCard({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`glass-strong rounded-3xl p-6 ${className}`}
    >
      <div className="space-y-4">
        <div className="h-4 w-1/3 bg-card/50 rounded-lg animate-pulse" />
        <div className="h-8 w-2/3 bg-card/50 rounded-lg animate-pulse" />
        <div className="h-3 w-1/4 bg-card/50 rounded-lg animate-pulse" />
      </div>
    </motion.div>
  )
}

// Premium skeleton list item
export function PremiumSkeletonListItem() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-subtle rounded-2xl p-4 flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-xl bg-card/50 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 bg-card/50 rounded-lg animate-pulse" />
        <div className="h-3 w-1/3 bg-card/50 rounded-lg animate-pulse" />
      </div>
      <div className="h-6 w-20 bg-card/50 rounded-lg animate-pulse" />
    </motion.div>
  )
}

// Premium skeleton chart
export function PremiumSkeletonChart() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-strong rounded-3xl p-6 h-[300px]"
    >
      <div className="space-y-4 mb-6">
        <div className="h-5 w-1/3 bg-card/50 rounded-lg animate-pulse" />
        <div className="h-3 w-1/4 bg-card/50 rounded-lg animate-pulse" />
      </div>
      <div className="h-[220px] flex items-end gap-2">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${Math.random() * 80 + 20}%` }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            className="flex-1 bg-card/50 rounded-t-lg animate-pulse"
          />
        ))}
      </div>
    </motion.div>
  )
}

// Premium skeleton progress
export function PremiumSkeletonProgress() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-1/3 bg-card/50 rounded-lg animate-pulse" />
        <div className="h-4 w-16 bg-card/50 rounded-lg animate-pulse" />
      </div>
      <div className="h-2 bg-card/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-primary/50 rounded-full animate-pulse"
        />
      </div>
    </div>
  )
}

// Shimmer effect overlay
export function ShimmerOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}

// Loading dots
export function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
          className="w-2 h-2 rounded-full bg-primary"
        />
      ))}
    </div>
  )
}
