"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { TrendingUp, AlertTriangle, Calendar, Wallet, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

/**
 * Nexus OS - Smart Predictions
 * 
 * Philosophy:
 * - IA preve gastos futuros, risco emocional, excesso
 * - Calma, não agressiva, sofisticada
 * 
 * Predictions:
 * - Gastos futuros
 * - Risco emocional
 * - Excesso de gastos
 * - Recorrências
 * - Sobra estimada
 */

interface Prediction {
  type: "spending" | "risk" | "excess" | "recurrence" | "surplus"
  title: string
  description: string
  icon: React.ReactNode
  color: string
  confidence: number
}

function generatePredictions(
  balance: number,
  income: number,
  expenses: number,
  monthlyAverage: number
): Prediction[] {
  const predictions: Prediction[] = []
  const daysInMonth = 30
  const dailyAverage = monthlyAverage / daysInMonth
  const projectedSpending = dailyAverage * daysInMonth
  const projectedSurplus = income - projectedSpending
  const spendingRate = expenses / income

  // Future spending prediction
  if (spendingRate > 0.8) {
    predictions.push({
      type: "spending",
      title: "Gastos projetados",
      description: `Com base no seu ritmo atual, você pode gastar R$ ${projectedSpending.toLocaleString("pt-BR")} este mês.`,
      icon: <Wallet className="w-5 h-5" />,
      color: "#fbbf24",
      confidence: 85,
    })
  }

  // Emotional risk prediction
  if (spendingRate > 0.9) {
    predictions.push({
      type: "risk",
      title: "Risco de excesso",
      description: "Seus gastos estão próximos da sua renda. Considere reduzir despesas não essenciais.",
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "#f87171",
      confidence: 75,
    })
  }

  // Excess spending prediction
  if (expenses > monthlyAverage * 1.2) {
    predictions.push({
      type: "excess",
      title: "Acima da média",
      description: `Você gastou 20% acima da sua média mensal de R$ ${monthlyAverage.toLocaleString("pt-BR")}.`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "#f87171",
      confidence: 90,
    })
  }

  // Recurrence prediction
  if (expenses > 0) {
    predictions.push({
      type: "recurrence",
      title: "Padrão identificado",
      description: "Seus gastos seguem um padrão consistente. Continue mantendo esse controle.",
      icon: <Calendar className="w-5 h-5" />,
      color: "#00d4ff",
      confidence: 80,
    })
  }

  // Surplus prediction
  if (projectedSurplus > 0) {
    predictions.push({
      type: "surplus",
      title: "Sobra estimada",
      description: `Você pode economizar R$ ${projectedSurplus.toLocaleString("pt-BR")} este mês mantendo o ritmo atual.`,
      icon: <Sparkles className="w-5 h-5" />,
      color: "#00ff9d",
      confidence: 70,
    })
  }

  // Default positive prediction
  if (predictions.length === 0) {
    predictions.push({
      type: "surplus",
      title: "Trajetória positiva",
      description: "Seus gastos estão dentro do planejado. Continue assim.",
      icon: <Sparkles className="w-5 h-5" />,
      color: "#00ff9d",
      confidence: 85,
    })
  }

  return predictions.slice(0, 3) // Show top 3 predictions
}

export function SmartPredictions({ 
  balance,
  income,
  expenses,
  monthlyAverage,
  className = "" 
}: { 
  balance: number
  income: number
  expenses: number
  monthlyAverage: number
  className?: string 
}) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const generatedPredictions = generatePredictions(balance, income, expenses, monthlyAverage)
    setPredictions(generatedPredictions)
    
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [balance, income, expenses, monthlyAverage])

  if (predictions.length === 0) return null

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
        Previsões Inteligentes
      </h3>

      <div className="space-y-4">
        {predictions.map((prediction, index) => (
          <motion.div
            key={prediction.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            className="p-4 rounded-2xl"
            style={{
              background: prediction.color + "08",
              border: `1px solid ${prediction.color}20`,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-xl flex-shrink-0"
                style={{
                  background: prediction.color + "15",
                  color: prediction.color,
                }}
              >
                {prediction.icon}
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-1" style={{ color: nexusOS.colors.text.primary }}>
                  {prediction.title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: nexusOS.colors.text.tertiary }}>
                  {prediction.description}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-medium" style={{ color: prediction.color }}>
                  {prediction.confidence}%
                </span>
                <p className="text-[10px]" style={{ color: nexusOS.colors.text.quaternary }}>
                  confiança
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Compact version for smaller spaces
export function CompactPrediction({ 
  prediction,
  className = "" 
}: { 
  prediction: Prediction
  className?: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`flex items-center gap-3 p-3 rounded-2xl ${className}`}
      style={{
        background: prediction.color + "08",
        border: `1px solid ${prediction.color}20`,
      }}
    >
      <div
        className="p-2 rounded-xl"
        style={{
          background: prediction.color + "15",
          color: prediction.color,
        }}
      >
        {prediction.icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium" style={{ color: nexusOS.colors.text.primary }}>
          {prediction.title}
        </p>
        <p className="text-[10px]" style={{ color: nexusOS.colors.text.tertiary }}>
          {prediction.description}
        </p>
      </div>
    </motion.div>
  )
}
