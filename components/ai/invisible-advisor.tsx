"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { Sparkles, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

/**
 * Nexus OS - Invisible AI Advisor
 * Premium financial advisor, not a chatbot
 * 
 * Philosophy:
 * - Invisible AI
 * - Premium advisor feel
 * - Human-like communication
 * - No chat interface
 * - Contextual insights
 * - Emotional intelligence
 */

interface Insight {
  id: string
  type: "opportunity" | "warning" | "celebration" | "pattern"
  message: string
  icon: any
  tone: "calm" | "motivational" | "concerned" | "celebratory"
}

const sampleInsights: Insight[] = [
  {
    id: "1",
    type: "celebration",
    message: "Seu padrão financeiro está mais equilibrado esta semana. Você demonstrou mais controle emocional nas compras.",
    icon: CheckCircle,
    tone: "celebratory",
  },
  {
    id: "2",
    type: "opportunity",
    message: "Seu ritmo atual aproxima sua meta em 18 dias. Continue assim.",
    icon: TrendingUp,
    tone: "motivational",
  },
  {
    id: "3",
    type: "pattern",
    message: "Notei que você gastou menos em alimentação este mês. Isso mostra planejamento.",
    icon: Sparkles,
    tone: "calm",
  },
]

export function InvisibleAdvisor() {
  const [currentInsight, setCurrentInsight] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % sampleInsights.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const insight = sampleInsights[currentInsight]
  const Icon = insight.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative w-full"
    >
      {/* Subtle glow */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-4 -z-10"
        style={{
          background: "radial-gradient(circle at center, rgba(0, 212, 255, 0.03) 0%, transparent 50%)",
          filter: `blur(${nexusOS.blur.xl})`,
        }}
      />

      {/* Insight card */}
      <motion.div
        key={currentInsight}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-start gap-4 p-6 rounded-3xl"
        style={{
          background: nexusOS.glass.light.background,
          backdropFilter: nexusOS.glass.light.backdropFilter,
          WebkitBackdropFilter: nexusOS.glass.light.backdropFilter,
          border: `1px solid ${nexusOS.colors.border.subtle}`,
        }}
      >
        {/* Icon */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{
            background: insight.type === "celebration" 
              ? nexusOS.colors.semantic.success + "15"
              : insight.type === "warning"
              ? nexusOS.colors.semantic.warning + "15"
              : nexusOS.colors.accent.primary + "15",
          }}
        >
          <Icon 
            className="w-5 h-5"
            style={{
              color: insight.type === "celebration"
                ? nexusOS.colors.semantic.success
                : insight.type === "warning"
                ? nexusOS.colors.semantic.warning
                : nexusOS.colors.accent.primary,
            }}
          />
        </div>

        {/* Message */}
        <div className="flex-1">
          <p
            className="text-base leading-relaxed"
            style={{
              color: nexusOS.colors.text.secondary,
              fontFamily: nexusOS.typography.fontFamily.sans,
            }}
          >
            {insight.message}
          </p>
        </div>

        {/* AI indicator */}
        <div className="flex-shrink-0">
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-2 h-2 rounded-full"
            style={{
              background: nexusOS.colors.accent.primary,
            }}
          />
        </div>
      </motion.div>

      {/* Progress indicator */}
      <div className="flex gap-1 mt-4">
        {sampleInsights.map((_, index) => (
          <motion.div
            key={index}
            initial={{ width: 4 }}
            animate={{ width: index === currentInsight ? 16 : 4 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-[2px] rounded-full"
            style={{
              background: index === currentInsight
                ? nexusOS.colors.accent.primary
                : nexusOS.colors.border.medium,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
