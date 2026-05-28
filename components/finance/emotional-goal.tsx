"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { Target, TrendingUp, Calendar } from "lucide-react"

/**
 * Nexus OS - Emotional Goal
 * Premium financial goal with emotional connection
 * 
 * Philosophy:
 * - Emotional connection
 * - Elegant progress
 * - Cinematic presentation
 * - Premium whitespace
 * - Focus on motivation
 */

interface EmotionalGoalProps {
  name: string
  current: number
  target: number
  deadline: string
  image?: string
  className?: string
}

export function EmotionalGoal({ 
  name, 
  current, 
  target, 
  deadline,
  image,
  className = ""
}: EmotionalGoalProps) {
  const progress = (current / target) * 100
  const remaining = target - current
  const daysLeft = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative w-full ${className}`}
    >
      {/* Goal card */}
      <div
        className="p-8 rounded-3xl"
        style={{
          background: nexusOS.glass.light.background,
          backdropFilter: nexusOS.glass.light.backdropFilter,
          WebkitBackdropFilter: nexusOS.glass.light.backdropFilter,
          border: `1px solid ${nexusOS.colors.border.subtle}`,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-2xl font-semibold tracking-tight mb-2"
              style={{ 
                color: nexusOS.colors.text.primary,
                fontFamily: nexusOS.typography.fontFamily.sans,
              }}
            >
              {name}
            </motion.h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" style={{ color: nexusOS.colors.text.quaternary }} />
              <span className="text-sm" style={{ color: nexusOS.colors.text.quaternary }}>
                {daysLeft} dias restantes
              </span>
            </motion.div>
          </div>
          
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: nexusOS.colors.accent.primary + "15",
            }}
          >
            <Target className="w-6 h-6" style={{ color: nexusOS.colors.accent.primary }} />
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-end justify-between mb-3">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl font-semibold tabular-nums tracking-tight"
              style={{ 
                color: nexusOS.colors.text.primary,
                fontFamily: nexusOS.typography.fontFamily.mono,
              }}
            >
              R$ {current.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-sm"
              style={{ color: nexusOS.colors.text.quaternary }}
            >
              de R$ {target.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.span>
          </div>

          {/* Progress bar */}
          <div className="h-2 rounded-full overflow-hidden" style={{ background: nexusOS.colors.border.medium }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full rounded-full relative"
              style={{
                background: `linear-gradient(90deg, ${nexusOS.colors.accent.primary}, ${nexusOS.colors.accent.secondary})`,
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Motivational message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" style={{ color: nexusOS.colors.semantic.success }} />
          <span className="text-sm" style={{ color: nexusOS.colors.text.tertiary }}>
            Faltam R$ {remaining.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </motion.div>
      </div>

      {/* Subtle glow */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-4 -z-10 rounded-3xl"
        style={{
          background: "radial-gradient(circle at center, rgba(0, 212, 255, 0.02) 0%, transparent 50%)",
          filter: `blur(${nexusOS.blur.lg})`,
        }}
      />
    </motion.div>
  )
}
