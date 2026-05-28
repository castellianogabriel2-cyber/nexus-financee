"use client"

import { motion } from "framer-motion"
import { minimalLuxury } from "@/lib/design-system/minimal-luxury"
import { Sparkles, Plus, Wallet, TrendingUp, Target } from "lucide-react"
import { memo } from "react"

/**
 * Premium Empty State - Cinematic Empty States
 * Inspired by: Linear empty states, Notion empty states, Apple empty states
 * 
 * Philosophy:
 * - Cinematic presentation
 * - Emotional connection
 * - Motivational, not depressing
 * - Premium aesthetics
 * - Clear call to action
 */

interface PremiumEmptyStateProps {
  type: "transactions" | "goals" | "cards" | "insights"
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function PremiumEmptyState({ type, title, description, action }: PremiumEmptyStateProps) {
  const configs = {
    transactions: {
      icon: Wallet,
      defaultTitle: "Sem transações",
      defaultDescription: "Comece adicionando sua primeira transação para ver seus gastos.",
      gradient: "from-blue-500/10 to-purple-500/10",
    },
    goals: {
      icon: Target,
      defaultTitle: "Sem metas",
      defaultDescription: "Defina suas metas financeiras para começar a alcançar seus sonhos.",
      gradient: "from-green-500/10 to-blue-500/10",
    },
    cards: {
      icon: Wallet,
      defaultTitle: "Sem cartões",
      defaultDescription: "Adicione seus cartões para acompanhar gastos e limites.",
      gradient: "from-purple-500/10 to-pink-500/10",
    },
    insights: {
      icon: Sparkles,
      defaultTitle: "Sem insights",
      defaultDescription: "A IA está aprendendo seus padrões. Insights aparecerão em breve.",
      gradient: "from-blue-500/10 to-cyan-500/10",
    },
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
      className="relative flex flex-col items-center justify-center py-20 lg:py-32"
    >
      {/* Animated icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] as const }}
        className="relative mb-8"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-24 h-24 lg:w-32 lg:h-32 rounded-full"
            style={{
              background: `radial-gradient(circle, ${minimalLuxury.colors.accent.primary}30, transparent)`,
              filter: `blur(${minimalLuxury.blur.xl})`,
            }}
          />
        </motion.div>

        <div
          className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center"
          style={{
            background: minimalLuxury.colors.accent.primary + "15",
          }}
        >
          <Icon className="w-10 h-10 lg:w-12 lg:h-12" style={{ color: minimalLuxury.colors.accent.primary }} />
        </div>
      </motion.div>

      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="text-center max-w-md"
      >
        <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-4" style={{ color: minimalLuxury.colors.text.primary }}>
          {title || config.defaultTitle}
        </h3>
        <p className="text-lg leading-relaxed mb-8" style={{ color: minimalLuxury.colors.text.tertiary }}>
          {description || config.defaultDescription}
        </p>

        {action && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className="px-8 py-4 rounded-2xl font-medium tracking-wide flex items-center gap-2"
            style={{
              background: minimalLuxury.colors.accent.primary,
              color: minimalLuxury.colors.background.primary,
            }}
          >
            <Plus className="w-4 h-4" />
            {action.label}
          </motion.button>
        )}
      </motion.div>

      {/* Cinematic gradient line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100px" }}
        transition={{ delay: 0.8, duration: 1, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="h-[1px] mt-12"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)",
        }}
      />
    </motion.div>
  )
}

/**
 * Premium Empty State - Minimal Version
 * For smaller spaces
 */
export function PremiumEmptyStateMinimal({ type }: { type: "transactions" | "goals" | "cards" }) {
  const icons = {
    transactions: Wallet,
    goals: Target,
    cards: Wallet,
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: minimalLuxury.colors.border.medium,
        }}
      >
        <Icon className="w-5 h-5" style={{ color: minimalLuxury.colors.text.tertiary }} />
      </div>
      <p className="text-sm" style={{ color: minimalLuxury.colors.text.quaternary }}>
        Nada aqui ainda
      </p>
    </motion.div>
  )
}
