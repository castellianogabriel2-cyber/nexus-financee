"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronRight,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts"
import { useFinance } from "@/providers/finance-provider"
import { AiInsights } from "@/components/ai-insights"
import { isCurrentMonth } from "@/lib/finance/compute"

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("mes")
  const { totalGastos, evolutionData, donutData, categorias, transactions, percentualUsado, expenseMoM } = useFinance()

  const monthlyComparison = evolutionData.map((row, i) => ({
    month: row.month,
    atual: row.gastos,
    anterior: i > 0 ? evolutionData[i - 1].gastos : row.gastos,
  }))

  const categoryBreakdown = categorias
    .map((cat) => {
      const value = cat.items.reduce((sum, item) => sum + item.value, 0)
      return {
        name: cat.name,
        value,
        color: cat.color,
        percentage: totalGastos > 0 ? ((value / totalGastos) * 100).toFixed(1) : "0",
      }
    })
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)

  const invisibleExpenses = transactions
    .filter((t) => t.type === "expense" && isCurrentMonth(t.transaction_date) && Number(t.amount) < 80)
    .slice(0, 6)
    .map((t) => ({
      name: t.description || "Gasto",
      value: Number(t.amount),
      frequency: "mensal",
    }))

  const totalInvisible = invisibleExpenses.reduce((acc, e) => acc + e.value, 0)
  const healthScore = Math.max(0, Math.min(100, Math.round(100 - percentualUsado)))
  const healthScoreData = [{ name: "score", value: healthScore, fill: "#34d399" }]

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
            Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Insights e analises detalhadas
          </p>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-2 p-1 bg-card/50 border border-border/50 rounded-xl">
          {["semana", "mes", "ano"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                selectedPeriod === period
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Health Score + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 bg-card/30 border border-border/50 rounded-3xl p-6 flex flex-col items-center justify-center"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Saude financeira</h3>
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                data={healthScoreData}
              >
                <RadialBar
                  background={{ fill: "hsl(var(--border) / 0.3)" }}
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-5xl font-bold text-foreground"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                {healthScore}
              </motion.span>
              <span className="text-sm text-muted-foreground">de 100</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-success">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+5 pts vs. mes anterior</span>
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-8 bg-card/30 border border-border/50 rounded-3xl p-6"
        >
          <AiInsights />
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/30 border border-border/50 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Comparacao mensal</h3>
              <p className="text-sm text-muted-foreground mt-1">Atual vs. mes anterior</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Atual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span className="text-xs text-muted-foreground">Anterior</span>
              </div>
            </div>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload) return null
                    return (
                      <div className="glass-strong rounded-xl px-4 py-3 border border-border/50">
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${entry.dataKey === "atual" ? "bg-primary" : "bg-muted"}`} />
                            <span className="text-sm text-foreground">
                              R$ {entry.value?.toLocaleString("pt-BR")}
                            </span>
                          </div>
                        ))}
                      </div>
                    )
                  }}
                />
                <Bar dataKey="anterior" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="atual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card/30 border border-border/50 rounded-3xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Categorias mais caras</h3>

          <div className="flex items-center justify-center mb-6">
            <div className="w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {categoryBreakdown.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2">
            {categoryBreakdown.slice(0, 5).map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-muted-foreground">{cat.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-foreground">
                    R$ {cat.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-muted-foreground w-12 text-right">{cat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Invisible Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-warning/10 via-warning/5 to-transparent border border-warning/20 rounded-3xl p-6"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-warning/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Gastos invisiveis</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Pequenos gastos recorrentes que somam R$ {totalInvisible.toLocaleString("pt-BR")} por mes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {invisibleExpenses.map((expense, i) => (
            <motion.div
              key={expense.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="bg-card/50 border border-border/30 rounded-2xl p-4"
            >
              <p className="text-sm text-foreground font-medium">{expense.name}</p>
              <p className="text-xl font-bold text-warning mt-1">
                R$ {expense.value.toLocaleString("pt-BR")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{expense.frequency}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-card/30 border border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Impacto anual estimado</p>
              <p className="text-2xl font-bold text-warning">
                R$ {(totalInvisible * 12).toLocaleString("pt-BR")}
              </p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-warning text-warning-foreground text-sm font-medium hover:bg-warning/90 transition-colors">
              Ver detalhes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
