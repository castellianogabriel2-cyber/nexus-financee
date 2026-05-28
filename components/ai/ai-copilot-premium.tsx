"use client"

import { motion, AnimatePresence } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { Sparkles, Brain, TrendingUp, Shield, Target, Zap, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

/**
 * Nexus OS - AI Copilot Premium
 * 
 * Philosophy:
 * - Advisor invisível
 * - Sistema operacional financeiro
 * - Inteligência integrada
 * - Não chatbot
 * - Consciência financeira
 * 
 * Inspired by:
 * - Apple Siri
 * - Tesla Autopilot
 * - Linear AI
 */

interface CopilotInsight {
  id: string
  type: "insight" | "warning" | "opportunity" | "celebration"
  message: string
  icon: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

const sampleInsights: CopilotInsight[] = [
  {
    id: "1",
    type: "insight",
    message: "Seus gastos com alimentação diminuíram 15% esta semana. Ótimo controle.",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    id: "2",
    type: "opportunity",
    message: "Você pode economizar R$ 200 transferindo seu saldo para conta com rendimento.",
    icon: <Zap className="w-5 h-5" />,
    action: {
      label: "Ver opções",
      onClick: () => {},
    },
  },
  {
    id: "3",
    type: "celebration",
    message: "Você atingiu sua meta de economia mensal! Continue assim.",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: "4",
    type: "warning",
    message: "Sua fatura do cartão está 80% do limite. Considere reduzir gastos.",
    icon: <Shield className="w-5 h-5" />,
    action: {
      label: "Ver detalhes",
      onClick: () => {},
    },
  },
]

export function AICopilotPremium({ 
  className = "" 
}: { 
  className?: string 
}) {
  const [insights, setInsights] = useState<CopilotInsight[]>(sampleInsights)
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsightIndex((prev) => (prev + 1) % insights.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [insights.length])

  const currentInsight = insights[currentInsightIndex]
  const getTypeColor = (type: CopilotInsight["type"]) => {
    switch (type) {
      case "insight":
        return nexusOS.colors.accent.primary
      case "warning":
        return "#fbbf24"
      case "opportunity":
        return "#00ff9d"
      case "celebration":
        return "#f472b6"
      default:
        return nexusOS.colors.accent.primary
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {/* Copilot Header */}
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="p-6 rounded-3xl cursor-pointer"
        style={{
          background: nexusOS.glass.light.background,
          backdropFilter: nexusOS.glass.light.backdropFilter,
          border: `1px solid ${nexusOS.colors.border.subtle}`,
        }}
      >
        <div className="flex items-center gap-4">
          {/* AI Indicator */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="p-3 rounded-2xl"
            style={{
              background: getTypeColor(currentInsight.type) + "15",
              color: getTypeColor(currentInsight.type),
            }}
          >
            <Brain className="w-5 h-5" />
          </motion.div>

          {/* Message */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentInsight.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="text-base font-medium"
                style={{ color: nexusOS.colors.text.primary }}
              >
                {currentInsight.message}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Expand Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="w-5 h-5" style={{ color: nexusOS.colors.text.tertiary }} />
          </motion.div>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-1 mt-4">
          {insights.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                width: index === currentInsightIndex ? 24 : 8,
                opacity: index === currentInsightIndex ? 1 : 0.3,
              }}
              transition={{ duration: 0.3 }}
              className="h-1 rounded-full"
              style={{
                background: getTypeColor(currentInsight.type),
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Expanded View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-3"
          >
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-2xl"
                style={{
                  background: nexusOS.glass.light.background,
                  backdropFilter: nexusOS.glass.light.backdropFilter,
                  border: `1px solid ${nexusOS.colors.border.subtle}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-xl"
                    style={{
                      background: getTypeColor(insight.type) + "15",
                      color: getTypeColor(insight.type),
                    }}
                  >
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2" style={{ color: nexusOS.colors.text.primary }}>
                      {insight.message}
                    </p>
                    {insight.action && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={insight.action.onClick}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg"
                        style={{
                          background: getTypeColor(insight.type) + "20",
                          color: getTypeColor(insight.type),
                        }}
                      >
                        {insight.action.label}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Floating AI indicator
export function FloatingAIIndicator({ 
  onClick,
  isActive = false 
}: { 
  onClick: () => void
  isActive?: boolean 
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-32 right-6 z-40 p-4 rounded-full"
      style={{
        background: isActive ? nexusOS.colors.accent.primary : nexusOS.glass.light.background,
        backdropFilter: nexusOS.glass.light.backdropFilter,
        border: `1px solid ${nexusOS.colors.border.subtle}`,
        boxShadow: isActive 
          ? `0 0 40px ${nexusOS.colors.accent.primary}30`
          : `0 8px 32px ${nexusOS.colors.border.subtle}20`,
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Brain 
          className="w-6 h-6" 
          style={{ color: isActive ? nexusOS.colors.background.primary : nexusOS.colors.accent.primary }} 
        />
      </motion.div>
    </motion.button>
  )
}

// Quick AI suggestions
export function QuickAISuggestions({ 
  suggestions = [],
  onSelect 
}: { 
  suggestions?: string[]
  onSelect?: (suggestion: string) => void 
}) {
  const defaultSuggestions = [
    "Quanto gastei essa semana?",
    "Como posso economizar mais?",
    "Análise dos meus gastos",
  ]

  const displaySuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      {displaySuggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect?.(suggestion)}
          className="w-full text-left p-4 rounded-2xl text-sm"
          style={{
            background: nexusOS.glass.light.background,
            backdropFilter: nexusOS.glass.light.backdropFilter,
            border: `1px solid ${nexusOS.colors.border.subtle}`,
            color: nexusOS.colors.text.primary,
          }}
        >
          {suggestion}
        </motion.button>
      ))}
    </motion.div>
  )
}
