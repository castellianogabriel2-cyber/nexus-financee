"use client"

import { motion } from "framer-motion"
import { Brain, TrendingDown, TrendingUp, Info } from "lucide-react"
import { useFinance } from "@/providers/finance-provider"

const iconMap = {
  warning: TrendingDown,
  success: TrendingUp,
  info: Info,
}

const colorMap = {
  warning: "text-warning",
  success: "text-success",
  info: "text-primary",
}

export function AiInsights({ compact = false }: { compact?: boolean }) {
  const { insights, loading } = useFinance()

  if (loading) return null

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {!compact && (
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Insights inteligentes</h3>
        </div>
      )}
      {insights.map((insight, i) => {
        const Icon = iconMap[insight.type]
        return (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-4 border border-border/40"
          >
            <div className="flex gap-3">
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${colorMap[insight.type]}`} />
              <div>
                <p className="text-sm font-medium text-foreground">{insight.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{insight.message}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
