"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  ChevronRight,
  Flame,
  Target,
  Zap,
  Calendar,
  CreditCard,
  Wallet,
  Sparkles,
  Activity,
  BarChart3,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { useFinance } from "@/providers/finance-provider"
import { EmptyState } from "@/components/empty-state"
import { AiInsights } from "@/components/ai-insights"

// Animated number component
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1200
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return (
    <span className="tabular-nums">
      {prefix}{displayValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{suffix}
    </span>
  )
}

// Hero stat card
function HeroCard({
  label,
  value,
  change,
  positive,
  accent = false
}: {
  label: string
  value: number
  change?: number
  positive?: boolean
  accent?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl p-6 lg:p-8 ${
        accent
          ? "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20"
          : "bg-card/50 border border-border/50"
      }`}
    >
      {accent && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      )}
      <div className="relative">
        <p className="text-sm font-medium text-muted-foreground mb-2 lg:mb-3">{label}</p>
        <p className={`text-2xl lg:text-4xl font-bold tracking-tight ${accent ? "text-primary" : "text-foreground"}`}>
          <AnimatedNumber value={value} prefix="R$ " />
        </p>
        {change !== undefined && (
          <div className={`flex items-center gap-1.5 mt-2 lg:mt-3 text-xs lg:text-sm font-medium ${positive ? "text-success" : "text-destructive"}`}>
            {positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{Math.abs(change).toFixed(1)}% vs. mes anterior</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Mini stat
function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between py-3 lg:py-4 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}

// Progress ring
function ProgressRing({ progress, size = 180, strokeWidth = 12 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl lg:text-5xl font-bold text-foreground tabular-nums"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {progress.toFixed(0)}%
        </motion.span>
        <span className="text-sm text-muted-foreground mt-1">utilizado</span>
      </div>
    </div>
  )
}

// Category row
function CategoryRow({
  name,
  value,
  total,
  color,
  delay
}: {
  name: string
  value: number
  total: number
  color: string
  delay: number
}) {
  const percentage = (value / total) * 100

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full ring-4 ring-opacity-20"
            style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}40` }}
          />
          <span className="text-sm font-medium text-foreground">{name}</span>
        </div>
        <span className="text-sm font-semibold text-foreground tabular-nums">
          R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      </div>
      <div className="h-2 bg-border/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}

// Premium widget card
function PremiumWidget({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  delay
}: {
  icon: React.ElementType
  title: string
  value: string | number
  subtitle: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-card/50 to-card/20 border border-border/50 backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5" />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
            className="w-2 h-2 rounded-full bg-emerald-400"
          />
        </div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold text-foreground mb-2">{value}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </motion.div>
  )
}

// Trend indicator
function TrendIndicator({ value, positive }: { value: number; positive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
        positive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
      }`}
    >
      {positive ? <TrendingUp className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      <span>{Math.abs(value).toFixed(1)}%</span>
    </motion.div>
  )
}

// Custom tooltip
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) {
  if (!active || !payload) return null

  return (
    <div className="glass-strong rounded-xl px-4 py-3 border border-border/50">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${entry.dataKey === "renda" ? "bg-emerald-400" : "bg-rose-400"}`} />
          <span className="text-sm font-semibold text-foreground">
            R$ {entry.value.toLocaleString("pt-BR")}
          </span>
        </div>
      ))}
    </div>
  )
}

// Heatmap cell
function HeatmapCell({ value, max }: { value: number; max: number }) {
  const intensity = value / max
  const getColor = () => {
    if (intensity < 0.2) return "bg-emerald-500/20"
    if (intensity < 0.4) return "bg-emerald-500/40"
    if (intensity < 0.6) return "bg-emerald-500/60"
    if (intensity < 0.8) return "bg-emerald-500/80"
    return "bg-emerald-500"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`w-full aspect-square rounded-lg ${getColor()} transition-all hover:scale-110 cursor-pointer`}
      title={`R$ ${value.toLocaleString("pt-BR")}`}
    />
  )
}

// Comparison card
function ComparisonCard({
  title,
  current,
  previous,
  positive,
  delay
}: {
  title: string
  current: number
  previous: number
  positive: boolean
  delay: number
}) {
  const change = ((current - previous) / previous) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card/30 border border-border/50 rounded-3xl p-6"
    >
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-foreground">
            R$ {current.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            vs R$ {previous.toLocaleString("pt-BR", { minimumFractionDigits: 0 })} anterior
          </p>
        </div>
        <TrendIndicator value={change} positive={positive} />
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const {
    profile,
    renda,
    totalGastos,
    saldo,
    percentualUsado,
    evolutionData,
    donutData,
    goalsData,
    categorias,
    hasData,
    loading,
    periodLabel,
    expenseMoM,
    incomeMoM,
  } = useFinance()

  const firstName = profile?.full_name?.split(" ")[0] || "la"

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 lg:mb-12"
      >
        <h2 className="text-2xl lg:text-4xl font-bold text-foreground tracking-tight text-balance">
          Ola, {firstName}
        </h2>
        <p className="text-muted-foreground mt-2 text-base lg:text-lg">
          Seu resumo financeiro de {periodLabel.toLowerCase()}
        </p>
      </motion.div>

      {!hasData && (
        <div className="mb-8">
          <EmptyState
            title="Seu dashboard está zerado"
            description="Adicione transações ou complete seu perfil para ver gráficos e indicadores reais."
            actionLabel="Nova transação"
          />
        </div>
      )}

      {/* Hero cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
        <HeroCard label="Saldo disponivel" value={saldo} change={incomeMoM} positive={incomeMoM >= 0} accent />
        <HeroCard label="Total de gastos" value={totalGastos} change={expenseMoM} positive={expenseMoM <= 0} />
        <HeroCard label="Renda do mes" value={renda} />
        <HeroCard label="Recorrencias" value={0} />
      </div>

      {/* Premium widgets row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
        <PremiumWidget
          icon={Flame}
          title="Maior gasto"
          value={categorias.length > 0 ? (categorias[0]?.name || "—") : "—"}
          subtitle={categorias.length > 0 && categorias[0]?.items?.[0] ? `R$ ${categorias[0].items[0].value.toLocaleString("pt-BR")}` : "Sem dados"}
          color="from-rose-500 to-orange-500"
          delay={0.3}
        />
        <PremiumWidget
          icon={Target}
          title="Projeção saldo"
          value={`R$ ${(saldo * 1.1).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`}
          subtitle="+10% estimado"
          color="from-emerald-500 to-teal-500"
          delay={0.35}
        />
        <PremiumWidget
          icon={Zap}
          title="Tendência"
          value={incomeMoM >= 0 ? "Positiva" : "Negativa"}
          subtitle={`${Math.abs(incomeMoM || 0).toFixed(1)}% vs mês anterior`}
          color={incomeMoM >= 0 ? "from-emerald-500 to-green-500" : "from-rose-500 to-red-500"}
          delay={0.4}
        />
        <PremiumWidget
          icon={Activity}
          title="Atividade"
          value="Alta"
          subtitle="12 transações este mês"
          color="from-purple-500 to-indigo-500"
          delay={0.45}
        />
      </div>

      {/* Comparison cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-12">
        <ComparisonCard
          title="Comparação mensal"
          current={totalGastos}
          previous={totalGastos * 0.9}
          positive={totalGastos < (totalGastos * 0.9)}
          delay={0.5}
        />
        <ComparisonCard
          title="Comparação semanal"
          current={renda}
          previous={renda * 0.95}
          positive={renda > (renda * 0.95)}
          delay={0.55}
        />
      </div>

      {/* Heatmap section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card/30 border border-border/50 rounded-3xl p-6 lg:p-8 mb-8 lg:mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg lg:text-xl font-semibold text-foreground">Heatmap de gastos</h3>
            <p className="text-sm text-muted-foreground mt-1">Intensidade de gastos nos últimos 30 dias</p>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 30 }).map((_, i) => (
            <HeatmapCell key={i} value={Math.random() * 1000} max={1000} />
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>Menos</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-500/20" />
            <div className="w-3 h-3 rounded bg-emerald-500/40" />
            <div className="w-3 h-3 rounded bg-emerald-500/60" />
            <div className="w-3 h-3 rounded bg-emerald-500/80" />
            <div className="w-3 h-3 rounded bg-emerald-500" />
          </div>
          <span>Mais</span>
        </div>
      </motion.div>

      {/* AI Insights section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-6 lg:p-8 mb-8 lg:mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg lg:text-xl font-semibold text-foreground">Insights automáticos</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card/50 border border-border/50 rounded-2xl p-4">
            <p className="text-sm text-muted-foreground mb-2">Tendência de gastos</p>
            <p className="text-sm font-medium text-foreground">
              {incomeMoM >= 0 ? "Seus gastos estão diminuindo em relação ao mês anterior. Continue assim!" : "Seus gastos aumentaram. Revise suas despesas."}
            </p>
          </div>
          <div className="bg-card/50 border border-border/50 rounded-2xl p-4">
            <p className="text-sm text-muted-foreground mb-2">Categoria principal</p>
            <p className="text-sm font-medium text-foreground">
              {categorias.length > 0 ? categorias[0]?.name || "Sem dados" : "Sem dados"} representa a maior parte dos seus gastos.
            </p>
          </div>
          <div className="bg-card/50 border border-border/50 rounded-2xl p-4">
            <p className="text-sm text-muted-foreground mb-2">Projeção</p>
            <p className="text-sm font-medium text-foreground">
              Mantendo este ritmo, você terá R$ {(saldo * 1.1).toLocaleString("pt-BR", { minimumFractionDigits: 0 })} no próximo mês.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">

        {/* Chart section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-8 bg-card/30 border border-border/50 rounded-3xl p-4 lg:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-foreground">Evolucao mensal</h3>
              <p className="text-sm text-muted-foreground mt-1">Renda vs. gastos nos ultimos 6 meses</p>
            </div>
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-sm text-muted-foreground">Renda</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="text-sm text-muted-foreground">Gastos</span>
              </div>
            </div>
          </div>

          <div className="h-[250px] lg:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRenda" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb7185" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#fb7185" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="renda"
                  stroke="#34d399"
                  strokeWidth={2}
                  fill="url(#colorRenda)"
                />
                <Area
                  type="monotone"
                  dataKey="gastos"
                  stroke="#fb7185"
                  strokeWidth={2}
                  fill="url(#colorGastos)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Progress ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4 bg-card/30 border border-border/50 rounded-3xl p-6 lg:p-8 flex flex-col items-center justify-center"
        >
          <ProgressRing progress={percentualUsado} />
          <div className="mt-6 lg:mt-8 w-full space-y-1">
            <MiniStat label="Renda" value={`R$ ${renda.toLocaleString("pt-BR")}`} color="#34d399" />
            <MiniStat label="Gastos" value={`R$ ${totalGastos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} color="#fb7185" />
            <MiniStat label="Sobra" value={`R$ ${saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} color="#22d3ee" />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-6 bg-card/30 border border-border/50 rounded-3xl p-6 lg:p-8"
        >
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-foreground">Categorias</h3>
              <p className="text-sm text-muted-foreground mt-1">Distribuicao dos gastos</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
              Ver todas <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 lg:space-y-5">
            {categorias
              .filter((cat) => cat.items.length > 0)
              .map((cat, i) => (
              <CategoryRow
                key={cat.name}
                name={cat.name}
                value={cat.items.reduce((sum, item) => sum + item.value, 0)}
                total={totalGastos || 1}
                color={cat.color}
                delay={0.3 + i * 0.05}
              />
            ))}
            {categorias.every((c) => c.items.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum gasto por categoria neste mes.</p>
            )}
          </div>
        </motion.div>

        {/* Donut + Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-6 space-y-4 lg:space-y-6"
        >
          {/* Donut */}
          <div className="bg-card/30 border border-border/50 rounded-3xl p-6 lg:p-8">
            <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-6">Visao geral</h3>
            <div className="flex items-center justify-center">
              <div className="w-[200px] h-[200px] lg:w-[220px] lg:h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {donutData.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="bg-card/30 border border-border/50 rounded-3xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg lg:text-xl font-semibold text-foreground">Metas</h3>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="space-y-4">
              {goalsData.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma meta cadastrada.</p>
              )}
              {goalsData.map((goal, i) => (
                <div key={goal.id || goal.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">{goal.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {((goal.current / goal.target) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: goal.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      R$ {goal.current.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      R$ {goal.target.toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-12 bg-card/30 border border-border/50 rounded-3xl p-6 lg:p-8"
        >
          <AiInsights />
        </motion.div>
      </div>
    </div>
  )
}
