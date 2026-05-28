"use client"

import { motion } from "framer-motion"
import { minimalLuxury } from "@/lib/design-system/minimal-luxury"
import { memo } from "react"

/**
 * Premium Streak - Elegant Gamification
 * Inspired by: Apple Fitness rings, Duolingo streaks (but premium), Linear progress
 * 
 * Philosophy:
 * - No game-like elements
 * - Elegant minimalism
 * - Motivational, not addictive
 * - Cinematic progress
 * - Subtle celebration
 */

interface PremiumStreakProps {
  currentStreak: number
  bestStreak: number
  days: Array<{ date: Date; completed: boolean }>
}

export function PremiumStreak({ currentStreak, bestStreak, days }: PremiumStreakProps) {
  const progressPercentage = (currentStreak / bestStreak) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
      className="relative"
    >
      {/* Streak display */}
      <div className="flex items-baseline gap-4 mb-8">
        <div className="text-6xl lg:text-8xl font-semibold tabular-nums tracking-tight" style={{ color: minimalLuxury.colors.text.primary }}>
          {currentStreak}
        </div>
        <div className="text-sm uppercase tracking-[0.2em]" style={{ color: minimalLuxury.colors.text.quaternary }}>
          dias consecutivos
        </div>
      </div>

      {/* Best streak indicator */}
      <div className="flex items-center gap-3 mb-12">
        <div className="text-xs uppercase tracking-[0.2em]" style={{ color: minimalLuxury.colors.text.quaternary }}>
          Melhor sequência
        </div>
        <div className="text-sm font-semibold tabular-nums" style={{ color: minimalLuxury.colors.text.secondary }}>
          {bestStreak} dias
        </div>
      </div>

      {/* Cinematic progress ring */}
      <div className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-12">
        {/* Background ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={minimalLuxury.colors.border.medium}
            strokeWidth="2"
          />
          {/* Progress ring */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={minimalLuxury.colors.accent.primary}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progressPercentage / 100 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] as const }}
            style={{
              strokeDasharray: "283",
              strokeDashoffset: 283,
            }}
          />
        </svg>

        {/* Center glow */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-16 h-16 rounded-full"
            style={{
              background: `radial-gradient(circle, ${minimalLuxury.colors.accent.primary}20, transparent)`,
              filter: `blur(${minimalLuxury.blur.lg})`,
            }}
          />
        </motion.div>
      </div>

      {/* Week view - minimalist */}
      <div className="flex justify-between gap-2">
        {days.slice(-7).map((day, index) => (
          <DayIndicator
            key={index}
            completed={day.completed}
            delay={index * 0.1}
          />
        ))}
      </div>
    </motion.div>
  )
}

const DayIndicator = memo(function DayIndicator({ completed, delay }: { completed: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
      className="flex-1"
    >
      <div
        className="w-full aspect-square rounded-full"
        style={{
          background: completed
            ? minimalLuxury.colors.accent.primary
            : minimalLuxury.colors.border.medium,
          opacity: completed ? 1 : 0.3,
          transition: "all 0.3s ease",
        }}
      />
    </motion.div>
  )
})
