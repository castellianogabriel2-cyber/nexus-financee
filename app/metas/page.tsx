"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Target,
  Plus,
  TrendingUp,
  Calendar,
  Sparkles,
  Check,
  ChevronRight,
} from "lucide-react"
import { useFinance } from "@/providers/finance-provider"
import { EmptyState } from "@/components/empty-state"

// Extended goals with more details
function GoalCard({ goal, index }: { goal: {
  id?: string
  name: string
  target: number
  current: number
  color: string
  deadline?: string | null
  monthlyTarget?: number | null
  priority?: string
}; index: number }) {
  const percentage = (goal.current / goal.target) * 100
  const remaining = goal.target - goal.current

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1 }}
      className="bg-card/30 border border-border/50 rounded-3xl p-6 hover:border-border transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${goal.color}20` }}
          >
            <Target className="w-7 h-7" style={{ color: goal.color }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{goal.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{goal.deadline}</span>
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            goal.priority === "alta"
              ? "bg-destructive/20 text-destructive"
              : goal.priority === "media"
              ? "bg-warning/20 text-warning"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {goal.priority}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-3xl font-bold text-foreground">
              R$ {goal.current.toLocaleString("pt-BR")}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              de R$ {goal.target.toLocaleString("pt-BR")}
            </p>
          </div>
          <span className="text-2xl font-bold" style={{ color: goal.color }}>
            {percentage.toFixed(0)}%
          </span>
        </div>

        <div className="h-3 bg-border/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: goal.color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: 0.3 + index * 0.1, duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card/50 rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Falta</p>
          <p className="text-lg font-semibold text-foreground mt-1">
            R$ {remaining.toLocaleString("pt-BR")}
          </p>
        </div>
        <div className="bg-card/50 rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Meta mensal</p>
          <p className="text-lg font-semibold text-foreground mt-1">
            R$ {(goal.monthlyTarget ?? 0).toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Action */}
      <button className="w-full mt-4 py-3 rounded-xl bg-card/50 border border-border/50 text-foreground text-sm font-medium hover:bg-card/70 transition-colors flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
        <Plus className="w-4 h-4" />
        Adicionar valor (em breve)
      </button>
    </motion.div>
  )
}

export default function MetasPage() {
  const { goalsData } = useFinance()
  const extendedGoals = goalsData.map((g) => ({
    ...g,
    deadline: g.deadline ? new Date(g.deadline + "T12:00:00").toLocaleDateString("pt-BR", { month: "short", year: "numeric" }) : "—",
    monthlyTarget: g.monthlyTarget ?? 0,
    priority: g.priority || "media",
  }))

  const totalMetas = extendedGoals.reduce((acc, g) => acc + g.target, 0)
  const totalAtual = extendedGoals.reduce((acc, g) => acc + g.current, 0)
  const progressoGeral = totalMetas > 0 ? (totalAtual / totalMetas) * 100 : 0

  if (extendedGoals.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
        <h1 className="text-2xl font-bold text-foreground mb-8">Metas</h1>
        <EmptyState title="Nenhuma meta ainda" description="Defina metas no onboarding ou adicione uma nova meta." />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-foreground tracking-tight">
            Metas
          </h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe seus objetivos financeiros
          </p>
        </div>

        <Link href="/onboarding" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium glow-primary">
          <Plus className="w-4 h-4" />
          Nova meta
        </Link>
      </motion.div>

      {/* Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-3xl p-6 lg:p-8 mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progresso geral</p>
              <p className="text-3xl font-bold text-foreground">
                R$ {totalAtual.toLocaleString("pt-BR")}
                <span className="text-lg text-muted-foreground font-normal ml-2">
                  / R$ {totalMetas.toLocaleString("pt-BR")}
                </span>
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progresso total</span>
              <span className="text-sm font-semibold text-primary">{progressoGeral.toFixed(0)}%</span>
            </div>
            <div className="h-3 bg-border/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-success"
                initial={{ width: 0 }}
                animate={{ width: `${progressoGeral}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-success">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">No caminho certo</span>
          </div>
        </div>
      </motion.div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {extendedGoals.map((goal, i) => (
          <GoalCard key={goal.name} goal={goal} index={i} />
        ))}
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-card/30 border border-border/50 rounded-3xl p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Dicas para alcancar suas metas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            "Configure depositos automaticos mensais",
            "Revise suas metas a cada 3 meses",
            "Comemore pequenas conquistas",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card/50">
              <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">{tip}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
