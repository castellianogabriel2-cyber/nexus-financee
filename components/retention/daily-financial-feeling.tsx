"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { Sparkles, TrendingUp, Heart, Shield, Zap } from "lucide-react"
import { useState, useEffect } from "react"

/**
 * Nexus OS - Daily Financial Feeling
 * 
 * Philosophy:
 * - IA gera sensação do dia
 * - Humano, sofisticado, emocional, premium
 * - NÃO coach, NÃO chatbot, NÃO mensagem automática
 * 
 * Examples:
 * - "Seu mês está mais leve."
 * - "Hoje você está financeiramente estável."
 * - "Seu comportamento financeiro melhorou."
 * - "Seu ritmo está consistente."
 */

interface FinancialFeeling {
  sentiment: "positive" | "neutral" | "negative"
  message: string
  icon: React.ReactNode
  color: string
}

function generateDailyFeeling(
  balance: number,
  income: number,
  expenses: number,
  recentTransactions: number
): FinancialFeeling {
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
  const balanceHealth = balance > 0
  const transactionActivity = recentTransactions > 5

  // Positive feelings
  if (savingsRate > 20 && balanceHealth) {
    return {
      sentiment: "positive",
      message: "Seu mês está mais leve.",
      icon: <Sparkles className="w-5 h-5" />,
      color: "#00ff9d",
    }
  }

  if (savingsRate > 15 && transactionActivity) {
    return {
      sentiment: "positive",
      message: "Seu ritmo está consistente.",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "#00d4ff",
    }
  }

  if (balanceHealth && expenses < income * 0.7) {
    return {
      sentiment: "positive",
      message: "Hoje você está financeiramente estável.",
      icon: <Shield className="w-5 h-5" />,
      color: "#00ff9d",
    }
  }

  if (savingsRate > 10) {
    return {
      sentiment: "positive",
      message: "Seu comportamento financeiro melhorou.",
      icon: <Heart className="w-5 h-5" />,
      color: "#f472b6",
    }
  }

  // Neutral feelings
  if (savingsRate >= 5 && savingsRate <= 10) {
    return {
      sentiment: "neutral",
      message: "Você está mantendo o equilíbrio.",
      icon: <Zap className="w-5 h-5" />,
      color: "#fbbf24",
    }
  }

  if (balanceHealth) {
    return {
      sentiment: "neutral",
      message: "Seu saldo está saudável.",
      icon: <Shield className="w-5 h-5" />,
      color: "#00d4ff",
    }
  }

  // Default positive encouragement
  return {
    sentiment: "positive",
    message: "Continue assim, você está no caminho certo.",
    icon: <Sparkles className="w-5 h-5" />,
    color: "#00d4ff",
  }
}

export function DailyFinancialFeeling({ 
  balance,
  income,
  expenses,
  recentTransactions = 0,
  className = "" 
}: { 
  balance: number
  income: number
  expenses: number
  recentTransactions?: number
  className?: string 
}) {
  const [feeling, setFeeling] = useState<FinancialFeeling | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const generatedFeeling = generateDailyFeeling(balance, income, expenses, recentTransactions)
    setFeeling(generatedFeeling)
    
    // Animate in after a delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [balance, income, expenses, recentTransactions])

  if (!feeling) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`p-6 rounded-3xl ${className}`}
      style={{
        background: nexusOS.glass.light.background,
        backdropFilter: nexusOS.glass.light.backdropFilter,
        border: `1px solid ${nexusOS.colors.border.subtle}`,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon with subtle animation */}
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
          className="p-3 rounded-2xl flex-shrink-0"
          style={{
            background: feeling.color + "15",
            color: feeling.color,
          }}
        >
          {feeling.icon}
        </motion.div>

        {/* Message */}
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl font-medium leading-relaxed"
            style={{ color: nexusOS.colors.text.primary }}
          >
            {feeling.message}
          </motion.p>

          {/* Subtle indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-3 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full" style={{ background: feeling.color }} />
            <span className="text-xs" style={{ color: nexusOS.colors.text.tertiary }}>
              Sentimento do dia
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// Compact version for smaller spaces
export function CompactDailyFeeling({ 
  balance,
  income,
  expenses,
  className = "" 
}: { 
  balance: number
  income: number
  expenses: number
  className?: string 
}) {
  const feeling = generateDailyFeeling(balance, income, expenses, 0)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`flex items-center gap-3 ${className}`}
    >
      <div
        className="p-2 rounded-xl"
        style={{
          background: feeling.color + "15",
          color: feeling.color,
        }}
      >
        {feeling.icon}
      </div>
      <p className="text-sm font-medium" style={{ color: nexusOS.colors.text.primary }}>
        {feeling.message}
      </p>
    </motion.div>
  )
}
