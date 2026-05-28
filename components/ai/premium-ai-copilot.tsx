"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, ChevronRight, X } from "lucide-react"
import { minimalLuxury } from "@/lib/design-system/minimal-luxury"
import { useState, memo } from "react"

/**
 * Premium AI Copilot - Elegant Financial Assistant
 * Inspired by: Linear AI, Arc Browser Assistant, Apple Intelligence
 * 
 * Philosophy:
 * - Invisible AI integrated into product
 * - Natural conversation flow
 * - Human-like insights
 * - Premium elegance
 * - No common chat interface
 * - Copilot feel
 */

interface Insight {
  id: string
  type: "opportunity" | "warning" | "tip"
  title: string
  description: string
  action?: string
  timestamp: string
}

const mockInsights: Insight[] = [
  {
    id: "1",
    type: "opportunity",
    title: "Economia potencial",
    description: "Você pode guardar R$ 850 este mês mantendo seu ritmo atual de gastos com alimentação.",
    action: "Ver detalhes",
    timestamp: "Há 2 horas",
  },
  {
    id: "2",
    type: "warning",
    title: "Gasto acima da média",
    description: "Seus gastos com entretenimento estão 23% acima da média dos últimos 3 meses.",
    action: "Analisar",
    timestamp: "Há 5 horas",
  },
  {
    id: "3",
    type: "tip",
    title: "Meta em progresso",
    description: "Sua meta 'Viagem' está 75% completa. Continue assim para atingir em 2 meses.",
    action: "Acelerar",
    timestamp: "Ontem",
  },
]

export function PremiumAICopilot() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  const visibleInsights = mockInsights.filter((insight) => !dismissedIds.has(insight.id))

  const dismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]))
  }

  if (visibleInsights.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
      className="relative"
    >
      {/* AI Copilot Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{
            background: minimalLuxury.colors.accent.primary + "15",
          }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0)",
              "0 0 20px 5px rgba(59, 130, 246, 0.2)",
              "0 0 0 0 rgba(59, 130, 246, 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-5 h-5" style={{ color: minimalLuxury.colors.accent.primary }} />
        </motion.div>
        <div>
          <h3
            className="text-sm font-semibold tracking-tight"
            style={{ color: minimalLuxury.colors.text.primary }}
          >
            Copilot Financeiro
          </h3>
          <p className="text-xs" style={{ color: minimalLuxury.colors.text.quaternary }}>
            {visibleInsights.length} insight{visibleInsights.length !== 1 ? 's' : ''} disponível{visibleInsights.length !== 1 ? 'is' : ''}
          </p>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {visibleInsights.map((insight, index) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            isExpanded={expandedId === insight.id}
            onToggle={() => setExpandedId(expandedId === insight.id ? null : insight.id)}
            onDismiss={() => dismiss(insight.id)}
            delay={index * 0.1}
          />
        ))}
      </div>
    </motion.div>
  )
}

const InsightCard = memo(function InsightCard({
  insight,
  isExpanded,
  onToggle,
  onDismiss,
  delay,
}: {
  insight: Insight
  isExpanded: boolean
  onToggle: () => void
  onDismiss: () => void
  delay: number
}) {
  const icons = {
    opportunity: TrendingUp,
    warning: AlertCircle,
    tip: Lightbulb,
  }

  const colors = {
    opportunity: minimalLuxury.colors.semantic.success,
    warning: minimalLuxury.colors.semantic.warning,
    tip: minimalLuxury.colors.accent.primary,
  }

  const Icon = icons[insight.type]
  const color = colors[insight.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
      className="relative group"
    >
      <div
        className="relative overflow-hidden rounded-2xl cursor-pointer"
        style={{
          background: minimalLuxury.glass.light.background,
          backdropFilter: minimalLuxury.glass.light.backdropFilter,
          WebkitBackdropFilter: minimalLuxury.glass.light.backdropFilter,
          border: `1px solid ${minimalLuxury.colors.border.subtle}`,
        }}
        onClick={onToggle}
      >
        {/* Subtle gradient on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${color}08 0%, transparent 50%)`,
            pointerEvents: "none",
          }}
        />

        <div className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: color + "15",
                }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <h4
                  className="text-sm font-semibold tracking-tight mb-1"
                  style={{ color: minimalLuxury.colors.text.primary }}
                >
                  {insight.title}
                </h4>
                <p className="text-xs" style={{ color: minimalLuxury.colors.text.quaternary }}>
                  {insight.timestamp}
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: minimalLuxury.colors.text.tertiary }} />
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
              >
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: minimalLuxury.colors.text.secondary }}
                >
                  {insight.description}
                </p>
                {insight.action && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-xs font-semibold px-4 py-2 rounded-xl"
                    style={{
                      background: color + "15",
                      color: color,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle action
                    }}
                  >
                    {insight.action}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dismiss button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: minimalLuxury.colors.text.quaternary }}
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
})
