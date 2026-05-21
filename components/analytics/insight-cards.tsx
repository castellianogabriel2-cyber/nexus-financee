"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, CreditCard, Brain, Zap, ArrowRight } from "lucide-react"
import type { FinancialScore, BehaviorAnalysis, EconomyProjection, FinancialAlert, SpendingPrediction } from "@/lib/finance/analytics"

interface FinancialScoreCardProps {
  score: FinancialScore
}

export function FinancialScoreCard({ score }: FinancialScoreCardProps) {
  const categoryColors = {
    excelente: "text-emerald-400",
    bom: "text-blue-400",
    regular: "text-yellow-400",
    "precisa-melhorar": "text-rose-400",
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong rounded-3xl p-6 border border-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Score Financeiro</h3>
        <div className={`text-3xl font-bold ${categoryColors[score.category]}`}>
          {score.overall}
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Gastos</span>
            <span className="text-foreground font-medium">{score.spending}%</span>
          </div>
          <div className="h-2 bg-border/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score.spending}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Poupança</span>
            <span className="text-foreground font-medium">{score.saving}%</span>
          </div>
          <div className="h-2 bg-border/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score.saving}%` }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Consistência</span>
            <span className="text-foreground font-medium">{score.consistency}%</span>
          </div>
          <div className="h-2 bg-border/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score.consistency}%` }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center gap-2">
          {score.category === "excelente" && <CheckCircle className="w-5 h-5 text-emerald-400" />}
          {score.category === "bom" && <TrendingUp className="w-5 h-5 text-blue-400" />}
          {score.category === "regular" && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
          {score.category === "precisa-melhorar" && <TrendingDown className="w-5 h-5 text-rose-400" />}
          <span className="text-sm font-medium text-foreground capitalize">{score.category.replace("-", " ")}</span>
        </div>
      </div>
    </motion.div>
  )
}

interface BehaviorAnalysisCardProps {
  analysis: BehaviorAnalysis
}

export function BehaviorAnalysisCard({ analysis }: BehaviorAnalysisCardProps) {
  const patternColors = {
    consistent: "text-emerald-400",
    volatile: "text-yellow-400",
    increasing: "text-rose-400",
    decreasing: "text-blue-400",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-3xl p-6 border border-border/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Análise de Comportamento</h3>
          <p className={`text-sm ${patternColors[analysis.spendingPattern]} capitalize`}>
            Padrão: {analysis.spendingPattern}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Gasto médio diário</span>
          <span className="text-sm font-semibold text-foreground">
            R$ {analysis.averageDailySpend.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Pico de gastos</span>
          <span className="text-sm font-semibold text-foreground">
            Dia {analysis.peakSpendingDay}
          </span>
        </div>
        
        {analysis.deliverySpend > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Delivery</span>
            <span className="text-sm font-semibold text-foreground">
              R$ {analysis.deliverySpend.toFixed(2)}
            </span>
          </div>
        )}
      </div>
      
      {analysis.deliverySavingsPotential > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-400">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">
              Economize R$ {analysis.deliverySavingsPotential.toFixed(0)} reduzindo delivery
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

interface EconomyProjectionCardProps {
  projection: EconomyProjection
}

export function EconomyProjectionCard({ projection }: EconomyProjectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-strong rounded-3xl p-6 border border-border/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Projeção de Economia</h3>
          <p className="text-sm text-muted-foreground">Anual estimada</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Poupança atual</span>
          <span className="text-sm font-semibold text-foreground">
            R$ {projection.currentMonthlySave.toFixed(2)}/mês
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Potencial de economia</span>
          <span className="text-sm font-semibold text-primary">
            R$ {projection.potentialMonthlySave.toFixed(2)}/mês
          </span>
        </div>
        
        <div className="pt-3 border-t border-border/30">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Projeção anual</span>
            <span className="text-lg font-bold text-primary">
              R$ {projection.annualProjection.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
      </div>
      
      {projection.savingsOpportunities.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-foreground mb-2">Oportunidades de economia:</p>
          <div className="space-y-2">
            {projection.savingsOpportunities.slice(0, 2).map((opp, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{opp.category}</span>
                <span className="text-emerald-400 font-medium">
                  -R$ {opp.potentialSave.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

interface SpendingPredictionCardProps {
  prediction: SpendingPrediction
}

export function SpendingPredictionCard({ prediction }: SpendingPredictionCardProps) {
  const trendColors = {
    increasing: "text-rose-400",
    decreasing: "text-emerald-400",
    stable: "text-blue-400",
  }

  const trendIcons = {
    increasing: TrendingUp,
    decreasing: TrendingDown,
    stable: Zap,
  }

  const TrendIcon = trendIcons[prediction.trend]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-strong rounded-3xl p-6 border border-border/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <TrendIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Previsão de Gastos</h3>
          <p className={`text-sm ${trendColors[prediction.trend]} capitalize`}>
            Tendência: {prediction.trend}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Próximo mês</span>
          <span className="text-sm font-semibold text-foreground">
            R$ {prediction.nextMonth.toLocaleString("pt-BR")}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">3 meses</span>
          <span className="text-sm font-semibold text-foreground">
            R$ {prediction.next3Months.toLocaleString("pt-BR")}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">6 meses</span>
          <span className="text-sm font-semibold text-foreground">
            R$ {prediction.next6Months.toLocaleString("pt-BR")}
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">
            Confiança: {prediction.confidence}%
          </span>
        </div>
      </div>
    </motion.div>
  )
}

interface FinancialAlertCardProps {
  alert: FinancialAlert
}

export function FinancialAlertCard({ alert }: FinancialAlertCardProps) {
  const alertColors = {
    warning: "border-yellow-500/50 bg-yellow-500/10",
    info: "border-blue-500/50 bg-blue-500/10",
    success: "border-emerald-500/50 bg-emerald-500/10",
    error: "border-rose-500/50 bg-rose-500/10",
  }

  const alertIcons = {
    warning: AlertTriangle,
    info: Zap,
    success: CheckCircle,
    error: TrendingDown,
  }

  const AlertIcon = alertIcons[alert.type]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-2xl border ${alertColors[alert.type]}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <AlertIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{alert.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
          {alert.actionable && (
            <button className="mt-2 text-xs text-primary font-medium flex items-center gap-1 hover:opacity-80 transition-opacity">
              Ver detalhes
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface InsightsGridProps {
  alerts: FinancialAlert[]
}

export function InsightsGrid({ alerts }: InsightsGridProps) {
  if (alerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-strong rounded-3xl p-6 border border-border/50 text-center"
      >
        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Tudo em ordem! Nenhum alerta no momento.</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <FinancialAlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  )
}
