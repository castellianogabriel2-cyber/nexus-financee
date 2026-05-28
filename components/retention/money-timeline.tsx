"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { TrendingUp, TrendingDown, Minus, Calendar, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

/**
 * Nexus OS - Money Timeline
 * 
 * Philosophy:
 * - Timeline cinematográfica financeira
 * - Mostrar evolução mensal, mudanças emocionais, crescimento, controle
 * - Parecer "história financeira pessoal"
 */

interface TimelineEvent {
  month: string
  balance: number
  income: number
  expenses: number
  sentiment: "positive" | "neutral" | "negative"
  milestone?: string
}

function generateTimeline(
  monthlyData: { month: string; balance: number; income: number; expenses: number }[]
): TimelineEvent[] {
  return monthlyData.map((data) => {
    const savingsRate = data.income > 0 ? ((data.income - data.expenses) / data.income) * 100 : 0
    let sentiment: "positive" | "neutral" | "negative" = "neutral"
    let milestone: string | undefined

    if (savingsRate > 20) {
      sentiment = "positive"
      milestone = "Mês de economia"
    } else if (savingsRate < 0) {
      sentiment = "negative"
      milestone = "Déficit detectado"
    } else if (savingsRate > 10) {
      sentiment = "positive"
    }

    return {
      ...data,
      sentiment,
      milestone,
    }
  })
}

export function MoneyTimeline({ 
  monthlyData,
  className = "" 
}: { 
  monthlyData: { month: string; balance: number; income: number; expenses: number }[]
  className?: string 
}) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const generatedTimeline = generateTimeline(monthlyData)
    setTimeline(generatedTimeline)
    
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [monthlyData])

  if (timeline.length === 0) return null

  const getSentimentIcon = (sentiment: TimelineEvent["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="w-4 h-4" />
      case "negative":
        return <TrendingDown className="w-4 h-4" />
      default:
        return <Minus className="w-4 h-4" />
    }
  }

  const getSentimentColor = (sentiment: TimelineEvent["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return "#00ff9d"
      case "negative":
        return "#f87171"
      default:
        return "#a3a3a3"
    }
  }

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
      <h3 className="text-lg font-semibold mb-6" style={{ color: nexusOS.colors.text.primary }}>
        Sua Jornada Financeira
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{ background: nexusOS.colors.border.subtle }} />

        {/* Timeline events */}
        <div className="space-y-6">
          {timeline.map((event, index) => (
            <motion.div
              key={event.month}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              className="relative pl-16"
            >
              {/* Timeline dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200, damping: 15 }}
                className="absolute left-5 w-3 h-3 rounded-full border-2"
                style={{
                  background: nexusOS.colors.background.primary,
                  borderColor: getSentimentColor(event.sentiment),
                }}
              />

              {/* Event content */}
              <div className="p-4 rounded-2xl" style={{ background: nexusOS.colors.border.subtle + "20" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: nexusOS.colors.text.tertiary }} />
                    <span className="text-sm font-medium" style={{ color: nexusOS.colors.text.primary }}>
                      {event.month}
                    </span>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: getSentimentColor(event.sentiment) }}>
                    {getSentimentIcon(event.sentiment)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-2">
                  <div>
                    <p className="text-[10px]" style={{ color: nexusOS.colors.text.quaternary }}>
                      Saldo
                    </p>
                    <p className="text-sm font-semibold" style={{ color: nexusOS.colors.text.primary }}>
                      R$ {event.balance.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px]" style={{ color: nexusOS.colors.text.quaternary }}>
                      Receita
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "#00ff9d" }}>
                      R$ {event.income.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px]" style={{ color: nexusOS.colors.text.quaternary }}>
                      Gastos
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "#f87171" }}>
                      R$ {event.expenses.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>

                {event.milestone && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-2 mt-3 pt-3 border-t"
                    style={{ borderColor: nexusOS.colors.border.subtle }}
                  >
                    <Sparkles className="w-3 h-3" style={{ color: nexusOS.colors.accent.primary }} />
                    <span className="text-xs" style={{ color: nexusOS.colors.text.tertiary }}>
                      {event.milestone}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Compact timeline for smaller spaces
export function CompactTimeline({ 
  monthlyData,
  className = "" 
}: { 
  monthlyData: { month: string; balance: number; income: number; expenses: number }[]
  className?: string 
}) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])

  useEffect(() => {
    setTimeline(generateTimeline(monthlyData))
  }, [monthlyData])

  if (timeline.length === 0) return null

  return (
    <div className={`space-y-2 ${className}`}>
      {timeline.slice(0, 3).map((event, index) => (
        <motion.div
          key={event.month}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="flex items-center justify-between p-3 rounded-xl"
          style={{ background: nexusOS.colors.border.subtle + "20" }}
        >
          <span className="text-xs font-medium" style={{ color: nexusOS.colors.text.primary }}>
            {event.month}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: nexusOS.colors.text.tertiary }}>
              R$ {event.balance.toLocaleString("pt-BR")}
            </span>
            <div style={{ color: getSentimentColor(event.sentiment) }}>
              {getSentimentIcon(event.sentiment)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function getSentimentColor(sentiment: TimelineEvent["sentiment"]): string {
  switch (sentiment) {
    case "positive":
      return "#00ff9d"
    case "negative":
      return "#f87171"
    default:
      return "#a3a3a3"
  }
}

function getSentimentIcon(sentiment: TimelineEvent["sentiment"]): React.ReactNode {
  switch (sentiment) {
    case "positive":
      return <TrendingUp className="w-4 h-4" />
    case "negative":
      return <TrendingDown className="w-4 h-4" />
    default:
      return <Minus className="w-4 h-4" />
  }
}
