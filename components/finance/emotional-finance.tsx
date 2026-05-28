"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { TrendingUp, TrendingDown, Minus, Sparkles, Heart, Zap } from "lucide-react"
import { useEffect, useState } from "react"

/**
 * Nexus OS - Emotional Finance
 * 
 * Philosophy:
 * - IA parecer consciência, não bot
 * - Frases emocionais
 * - Feedback humano
 * - Conexão emocional
 * 
 * Examples:
 * - "Seu ritmo financeiro está mais equilibrado."
 * - "Você demonstrou mais controle essa semana."
 * - "Seu progresso está consistente."
 * - "Faltam 18 dias para atingir sua meta."
 */

interface EmotionalInsight {
  type: "positive" | "neutral" | "negative"
  message: string
  icon: React.ReactNode
  color: string
}

// Emotional insights generator
function generateEmotionalInsights(balance: number, income: number, expenses: number): EmotionalInsight[] {
  const insights: EmotionalInsight[] = []
  
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
  const balanceGrowth = balance > 0 ? 1 : -1
  
  // Positive insights
  if (savingsRate > 20) {
    insights.push({
      type: "positive",
      message: "Seu ritmo financeiro está mais equilibrado.",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "#00ff9d",
    })
  }
  
  if (balanceGrowth > 0) {
    insights.push({
      type: "positive",
      message: "Você demonstrou mais controle essa semana.",
      icon: <Sparkles className="w-5 h-5" />,
      color: "#00d4ff",
    })
  }
  
  if (expenses < income * 0.7) {
    insights.push({
      type: "positive",
      message: "Seus gastos estão dentro do planejado.",
      icon: <Heart className="w-5 h-5" />,
      color: "#00ff9d",
    })
  }
  
  // Neutral insights
  if (savingsRate >= 10 && savingsRate <= 20) {
    insights.push({
      type: "neutral",
      message: "Seu progresso está consistente.",
      icon: <Minus className="w-5 h-5" />,
      color: "#a3a3a3",
    })
  }
  
  // Negative insights (gentle)
  if (savingsRate < 10 && savingsRate > 0) {
    insights.push({
      type: "neutral",
      message: "Pequenos ajustes podem melhorar sua economia.",
      icon: <Zap className="w-5 h-5" />,
      color: "#fbbf24",
    })
  }
  
  if (expenses > income * 0.9) {
    insights.push({
      type: "negative",
      message: "Seus gastos estão próximos do limite.",
      icon: <TrendingDown className="w-5 h-5" />,
      color: "#f87171",
    })
  }
  
  // Default insight if none generated
  if (insights.length === 0) {
    insights.push({
      type: "neutral",
      message: "Continue assim, você está no caminho certo.",
      icon: <Sparkles className="w-5 h-5" />,
      color: "#00d4ff",
    })
  }
  
  return insights
}

// Days remaining to goal
function getDaysRemaining(goalDeadline: string): number {
  const deadline = new Date(goalDeadline)
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Emotional goal progress message
function getGoalProgressMessage(current: number, target: number, deadline: string): string {
  const daysRemaining = getDaysRemaining(deadline)
  const progress = (current / target) * 100
  
  if (progress >= 100) {
    return "Você alcançou sua meta! Parabéns!"
  }
  
  if (progress >= 80) {
    return `Faltam apenas ${daysRemaining} dias para atingir sua meta.`
  }
  
  if (progress >= 50) {
    return `Você já está na metade do caminho. Continue!`
  }
  
  if (progress >= 20) {
    return `Seu progresso está consistente. Faltam ${daysRemaining} dias.`
  }
  
  return `Faltam ${daysRemaining} dias para atingir sua meta.`
}

// Emotional finance component
export function EmotionalFinance({ 
  balance,
  income,
  expenses,
  goalCurrent,
  goalTarget,
  goalDeadline
}: { 
  balance: number
  income: number
  expenses: number
  goalCurrent?: number
  goalTarget?: number
  goalDeadline?: string
}) {
  const [insights, setInsights] = useState<EmotionalInsight[]>([])
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0)

  useEffect(() => {
    const generatedInsights = generateEmotionalInsights(balance, income, expenses)
    setInsights(generatedInsights)
  }, [balance, income, expenses])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsightIndex((prev) => (prev + 1) % insights.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [insights.length])

  if (insights.length === 0) return null

  const currentInsight = insights[currentInsightIndex]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl"
      style={{
        background: nexusOS.glass.light.background,
        backdropFilter: nexusOS.glass.light.backdropFilter,
        border: `1px solid ${nexusOS.colors.border.subtle}`,
      }}
    >
      <motion.div
        key={currentInsightIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className="flex items-start gap-4"
      >
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
            background: currentInsight.color + "15",
            color: currentInsight.color,
          }}
        >
          {currentInsight.icon}
        </motion.div>

        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-medium mb-2"
            style={{ color: nexusOS.colors.text.primary }}
          >
            {currentInsight.message}
          </motion.p>

          {/* Progress indicator */}
          <div className="flex gap-1">
            {insights.map((_, index) => (
              <motion.div
                key={index}
                animate={{
                  width: index === currentInsightIndex ? 20 : 8,
                  opacity: index === currentInsightIndex ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
                className="h-1 rounded-full"
                style={{
                  background: nexusOS.colors.accent.primary,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Goal progress if available */}
      {goalTarget && goalDeadline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 pt-6 border-t"
          style={{ borderColor: nexusOS.colors.border.subtle }}
        >
          <p className="text-sm mb-3" style={{ color: nexusOS.colors.text.tertiary }}>
            {getGoalProgressMessage(goalCurrent || 0, goalTarget, goalDeadline)}
          </p>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: nexusOS.colors.border.subtle }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((goalCurrent || 0) / goalTarget) * 100}%` }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full rounded-full"
              style={{ background: nexusOS.colors.accent.primary }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Emotional score component
export function EmotionalScore({ 
  score,
  label 
}: { 
  score: number
  label: string 
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#00ff9d"
    if (score >= 60) return "#00d4ff"
    if (score >= 40) return "#fbbf24"
    return "#f87171"
  }

  const scoreColor = getScoreColor(score)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      className="text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-5xl font-bold mb-2"
        style={{ color: scoreColor }}
      >
        {score}
      </motion.div>
      <p className="text-sm" style={{ color: nexusOS.colors.text.tertiary }}>
        {label}
      </p>
    </motion.div>
  )
}
