"use client"

import { motion } from "framer-motion"
import { minimalLuxury } from "@/lib/design-system/minimal-luxury"
import { memo } from "react"

/**
 * Premium Progress - Minimalist Goal Tracking
 * Inspired by: Apple Fitness, Linear progress, Notion progress
 * 
 * Philosophy:
 * - Cinematic progress bars
 * - Subtle animations
 * - Clean typography
 * - Emotional connection
 * - No game-like elements
 */

interface PremiumProgressProps {
  title: string
  current: number
  target: number
  subtitle?: string
  showPercentage?: boolean
  cinematic?: boolean
}

export function PremiumProgress({
  title,
  current,
  target,
  subtitle,
  showPercentage = true,
  cinematic = true,
}: PremiumProgressProps) {
  const percentage = Math.min((current / target) * 100, 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
      className="relative"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: minimalLuxury.colors.text.quaternary }}>
            {title}
          </div>
          {subtitle && (
            <div className="text-sm" style={{ color: minimalLuxury.colors.text.tertiary }}>
              {subtitle}
            </div>
          )}
        </div>
        {showPercentage && (
          <div className="text-3xl font-semibold tabular-nums tracking-tight" style={{ color: minimalLuxury.colors.text.primary }}>
            {percentage.toFixed(0)}%
          </div>
        )}
      </div>

      {/* Cinematic progress bar */}
      <div className="relative h-1 rounded-full overflow-hidden" style={{ background: minimalLuxury.colors.border.medium }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: cinematic ? 1.5 : 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${minimalLuxury.colors.accent.primary}, ${minimalLuxury.colors.accent.primary}cc)`,
          }}
        >
          {/* Animated shimmer */}
          {cinematic && (
            <motion.div
              className="absolute inset-0"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Amount display */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm tabular-nums" style={{ color: minimalLuxury.colors.text.secondary }}>
          R$ {current.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
        <div className="text-sm tabular-nums" style={{ color: minimalLuxury.colors.text.quaternary }}>
          R$ {target.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Premium Goal Card - Cinematic Goal Display
 */
interface PremiumGoalCardProps {
  name: string
  current: number
  target: number
  icon?: React.ReactNode
  deadline?: string
  image?: string
}

export function PremiumGoalCard({ name, current, target, icon, deadline, image }: PremiumGoalCardProps) {
  const percentage = Math.min((current / target) * 100, 100)
  const remaining = target - current

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: minimalLuxury.glass.medium.background,
        backdropFilter: minimalLuxury.glass.medium.backdropFilter,
        WebkitBackdropFilter: minimalLuxury.glass.medium.backdropFilter,
        border: `1px solid ${minimalLuxury.colors.border.subtle}`,
      }}
    >
      {/* Background gradient */}
      {image && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      <div className="relative p-8 lg:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            {icon && (
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: minimalLuxury.colors.background.elevated,
                }}
              >
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold tracking-tight mb-1" style={{ color: minimalLuxury.colors.text.primary }}>
                {name}
              </h3>
              {deadline && (
                <div className="text-xs" style={{ color: minimalLuxury.colors.text.quaternary }}>
                  {deadline}
                </div>
              )}
            </div>
          </div>
          <div className="text-4xl font-semibold tabular-nums tracking-tight" style={{ color: minimalLuxury.colors.text.primary }}>
            {percentage.toFixed(0)}%
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 rounded-full overflow-hidden mb-6" style={{ background: minimalLuxury.colors.border.medium }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${minimalLuxury.colors.accent.primary}, ${minimalLuxury.colors.accent.primary}cc)`,
            }}
          />
        </div>

        {/* Amounts */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] mb-1" style={{ color: minimalLuxury.colors.text.quaternary }}>
              Acumulado
            </div>
            <div className="text-2xl font-semibold tabular-nums tracking-tight" style={{ color: minimalLuxury.colors.text.primary }}>
              R$ {current.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-[0.2em] mb-1" style={{ color: minimalLuxury.colors.text.quaternary }}>
              Restante
            </div>
            <div className="text-2xl font-semibold tabular-nums tracking-tight" style={{ color: minimalLuxury.colors.text.secondary }}>
              R$ {remaining.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
