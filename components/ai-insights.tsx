"use client"

import { motion } from "framer-motion"
import { Brain, TrendingDown, TrendingUp, Info, AlertTriangle, CheckCircle, Target, Zap } from "lucide-react"
import { useFinance } from "@/providers/finance-provider"
import { FinancialScoreCard, BehaviorAnalysisCard, EconomyProjectionCard, SpendingPredictionCard, InsightsGrid } from "@/components/analytics/insight-cards"

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
  const { insights, loading, financialScore, behaviorAnalysis, financialAlerts, economyProjection, spendingPrediction } = useFinance()

  if (loading) return null

  return (
    <div className={compact ? "space-y-3" : "space-y-6"}>
      {!compact && (
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Insights inteligentes</h3>
        </div>
      )}

      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FinancialScoreCard score={financialScore} />
          <BehaviorAnalysisCard analysis={behaviorAnalysis} />
          <EconomyProjectionCard projection={economyProjection} />
          <SpendingPredictionCard prediction={spendingPrediction} />
        </div>
      )}

      <div className="space-y-3">
        {!compact && (
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-primary" />
            <h4 className="text-base font-semibold text-foreground">Alertas e recomendações</h4>
          </div>
        )}
        <InsightsGrid alerts={financialAlerts} />
      </div>

      {!compact && insights.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-primary" />
            <h4 className="text-base font-semibold text-foreground">Dicas adicionais</h4>
          </div>
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
      )}
    </div>
  )
}
