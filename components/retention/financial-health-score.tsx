"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { Activity, Shield, Target, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

/**
 * Nexus OS - Financial Health Score
 * 
 * Philosophy:
 * - Visual elegante inspirado em Apple Fitness, WHOOP, Oura Ring
 * - NÃO parecer score bancário
 * - Mostrar estabilidade, controle, constância, equilíbrio
 * 
 * Inspired by:
 * - Apple Fitness rings
 * - WHOOP recovery score
 * - Oura Ring readiness
 */

interface HealthMetric {
  name: string
  value: number
  max: number
  icon: React.ReactNode
  color: string
}

function calculateHealthMetrics(
  balance: number,
  income: number,
  expenses: number,
  savingsRate: number
): HealthMetric[] {
  const metrics: HealthMetric[] = []

  // Stability - based on balance consistency
  const stabilityScore = balance > 0 ? Math.min(100, (balance / income) * 100) : 0
  metrics.push({
    name: "Estabilidade",
    value: Math.round(stabilityScore),
    max: 100,
    icon: <Shield className="w-5 h-5" />,
    color: "#00d4ff",
  })

  // Control - based on expense management
  const controlScore = income > 0 ? Math.max(0, 100 - (expenses / income) * 100) : 0
  metrics.push({
    name: "Controle",
    value: Math.round(controlScore),
    max: 100,
    icon: <Target className="w-5 h-5" />,
    color: "#00ff9d",
  })

  // Constancy - based on savings rate consistency
  const constancyScore = savingsRate > 0 ? Math.min(100, savingsRate * 2) : 0
  metrics.push({
    name: "Constância",
    value: Math.round(constancyScore),
    max: 100,
    icon: <Activity className="w-5 h-5" />,
    color: "#f472b6",
  })

  // Balance - overall financial balance
  const balanceScore = (stabilityScore + controlScore + constancyScore) / 3
  metrics.push({
    name: "Equilíbrio",
    value: Math.round(balanceScore),
    max: 100,
    icon: <TrendingUp className="w-5 h-5" />,
    color: "#fbbf24",
  })

  return metrics
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#00ff9d"
  if (score >= 60) return "#00d4ff"
  if (score >= 40) return "#fbbf24"
  return "#f87171"
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excelente"
  if (score >= 75) return "Ótimo"
  if (score >= 60) return "Bom"
  if (score >= 40) return "Em desenvolvimento"
  return "Precisa de atenção"
}

export function FinancialHealthScore({ 
  balance,
  income,
  expenses,
  savingsRate,
  className = "" 
}: { 
  balance: number
  income: number
  expenses: number
  savingsRate: number
  className?: string 
}) {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [overallScore, setOverallScore] = useState(0)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    const calculatedMetrics = calculateHealthMetrics(balance, income, expenses, savingsRate)
    setMetrics(calculatedMetrics)
    
    const avgScore = calculatedMetrics.reduce((sum, metric) => sum + metric.value, 0) / calculatedMetrics.length
    setOverallScore(Math.round(avgScore))
    
    setIsAnimated(true)
  }, [balance, income, expenses, savingsRate])

  const scoreColor = getScoreColor(overallScore)
  const scoreLabel = getScoreLabel(overallScore)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`p-6 rounded-3xl ${className}`}
      style={{
        background: nexusOS.glass.light.background,
        backdropFilter: nexusOS.glass.light.backdropFilter,
        border: `1px solid ${nexusOS.colors.border.subtle}`,
      }}
    >
      {/* Overall Score */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-medium mb-1" style={{ color: nexusOS.colors.text.tertiary }}>
            Saúde Financeira
          </h3>
          <p className="text-xs" style={{ color: nexusOS.colors.text.quaternary }}>
            {scoreLabel}
          </p>
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: isAnimated ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative"
        >
          {/* Circular progress */}
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={nexusOS.colors.border.subtle}
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: overallScore / 100 }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              transform="rotate(-90 50 50)"
              style={{
                strokeDasharray: "283",
                strokeDashoffset: 283,
              }}
            />
          </svg>
          
          {/* Score in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: isAnimated ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-2xl font-bold"
              style={{ color: scoreColor }}
            >
              {overallScore}
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Individual Metrics */}
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-xl"
                  style={{
                    background: metric.color + "15",
                    color: metric.color,
                  }}
                >
                  {metric.icon}
                </div>
                <span className="text-sm font-medium" style={{ color: nexusOS.colors.text.primary }}>
                  {metric.name}
                </span>
              </div>
              <span className="text-sm font-bold" style={{ color: metric.color }}>
                {metric.value}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 rounded-full overflow-hidden" style={{ background: nexusOS.colors.border.subtle }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                transition={{ delay: 0.3 + index * 0.1, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                className="h-full rounded-full"
                style={{ background: metric.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Compact version for smaller spaces
export function CompactHealthScore({ 
  balance,
  income,
  expenses,
  savingsRate,
  className = "" 
}: { 
  balance: number
  income: number
  expenses: number
  savingsRate: number
  className?: string 
}) {
  const [overallScore, setOverallScore] = useState(0)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    const metrics = calculateHealthMetrics(balance, income, expenses, savingsRate)
    const avgScore = metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length
    setOverallScore(Math.round(avgScore))
    setIsAnimated(true)
  }, [balance, income, expenses, savingsRate])

  const scoreColor = getScoreColor(overallScore)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`flex items-center gap-4 ${className}`}
    >
      <div className="relative">
        <svg width="48" height="48" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={nexusOS.colors.border.subtle}
            strokeWidth="10"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={scoreColor}
            strokeWidth="10"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isAnimated ? overallScore / 100 : 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            transform="rotate(-90 50 50)"
            style={{
              strokeDasharray: "283",
              strokeDashoffset: 283,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color: scoreColor }}>
            {overallScore}
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: nexusOS.colors.text.primary }}>
          Saúde Financeira
        </p>
        <p className="text-xs" style={{ color: nexusOS.colors.text.tertiary }}>
          {getScoreLabel(overallScore)}
        </p>
      </div>
    </motion.div>
  )
}
