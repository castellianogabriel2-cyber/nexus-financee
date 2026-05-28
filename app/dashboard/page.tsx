"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  ChevronRight,
  Target,
  Sparkles,
  Wallet,
  CreditCard,
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
} from "recharts"
import { useFinance } from "@/providers/finance-provider"
import { EmptyState } from "@/components/empty-state"
import { AiInsights } from "@/components/ai-insights"
import { PremiumSkeletonCard, PremiumSkeletonChart } from "@/components/ui/premium-loading"
import { FadeInUp, StaggerContainer, StaggerItem, HoverLift, ScaleOnHover } from "@/components/ui/premium-motion"

// Animated number component with spring animation
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 80
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
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="tabular-nums font-semibold"
    >
      {prefix}{displayValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{suffix}
    </motion.span>
  )
}

// Dynamic greeting based on time of day
function getDynamicGreeting(firstName: string) {
  const hour = new Date().getHours()
  let greeting = "Olá"
  let period = ""
  
  if (hour >= 5 && hour < 12) {
    greeting = "Bom dia"
    period = "esta manhã"
  } else if (hour >= 12 && hour < 18) {
    greeting = "Boa tarde"
    period = "esta tarde"
  } else {
    greeting = "Boa noite"
    period = "esta noite"
  }

  return { greeting, period }
}

// Premium Hero Card with glassmorphism and glow
function PremiumHeroCard({
  label,
  value,
  change,
  positive,
  accent = false,
  icon: Icon,
  delay
}: {
  label: string
  value: number
  change?: number
  positive?: boolean
  accent?: boolean
  icon?: any
  delay?: number
}) {
  return (
    <HoverLift>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          delay: delay || 0,
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        className={`relative overflow-hidden rounded-[2rem] p-6 lg:p-8 transition-all duration-500 ${
          accent
            ? "glass-glow border-primary/30"
            : "glass-strong border-border/20"
        }`}
      >
        {accent && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs lg:text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            {Icon && (
              <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center ${accent ? 'bg-primary/20' : 'bg-card/50'}`}>
                <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${accent ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
            )}
          </div>
          <p className={`text-3xl lg:text-5xl font-bold tracking-tight mb-2 ${accent ? "text-gradient" : "text-foreground"}`}>
            <AnimatedNumber value={value} prefix="R$ " />
          </p>
          {change !== undefined && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (delay || 0) + 0.3 }}
              className={`flex items-center gap-1.5 text-xs lg:text-sm font-medium ${positive ? "text-emerald-400" : "text-rose-400"}`}
            >
              {positive ? <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" /> : <ArrowDownRight className="w-3 h-3 lg:w-4 lg:h-4" />}
              <span>{Math.abs(change).toFixed(1)}% vs. mês anterior</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </HoverLift>
  )
}

// Premium Progress Ring with glow
function PremiumProgressRing({ progress, size = 200, strokeWidth = 16 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id="premiumProgress" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity={1} />
            <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border/20"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#premiumProgress)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ filter: "url(#glow)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl lg:text-6xl font-bold text-gradient tabular-nums"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {progress.toFixed(0)}%
        </motion.span>
        <motion.span
          className="text-sm text-muted-foreground mt-2 uppercase tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          Utilizado
        </motion.span>
      </div>
    </div>
  )
}

// Premium Category Row with hover effects
function PremiumCategoryRow({
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
  const percentage = total > 0 ? (value / total) * 100 : 0

  return (
    <ScaleOnHover>
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          delay,
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        className="group"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}60` }}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
            />
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">{name}</span>
          </div>
          <span className="text-sm font-semibold text-foreground tabular-nums">
            R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="h-2 bg-border/20 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full rounded-full relative"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              delay: delay + 0.2,
              duration: 1,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </ScaleOnHover>
  )
}

// Premium Tooltip
function PremiumTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) {
  if (!active || !payload) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong rounded-2xl px-5 py-4 border border-border/30 shadow-2xl"
    >
      <p className="text-xs text-muted-foreground mb-3 font-medium">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-3 mb-2 last:mb-0">
          <div className={`w-2 h-2 rounded-full ${entry.dataKey === "renda" ? "bg-emerald-400" : "bg-rose-400"}`} />
          <span className="text-sm font-semibold text-foreground">
            R$ {entry.value.toLocaleString("pt-BR")}
          </span>
        </div>
      ))}
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

  const firstName = profile?.full_name?.split(" ")[0] || "lá"
  const { greeting, period } = getDynamicGreeting(firstName)

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="fixed inset-0 gradient-radial pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-16 relative">
          <div className="mb-12 lg:mb-16">
            <div className="h-12 w-64 bg-card/30 rounded-2xl mb-3 animate-pulse" />
            <div className="h-6 w-96 bg-card/20 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
            <PremiumSkeletonCard />
            <PremiumSkeletonCard />
            <PremiumSkeletonCard />
            <PremiumSkeletonCard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8"><PremiumSkeletonChart /></div>
            <div className="lg:col-span-4"><PremiumSkeletonCard /></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 gradient-radial pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-16 relative">
        {/* Premium Hero Section */}
        <FadeInUp delay={0}>
          <div className="mb-12 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-foreground tracking-tight text-balance mb-4">
                {greeting}, <span className="text-gradient">{firstName}</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground font-light">
                Seu saldo disponível {period}
              </p>
            </motion.div>
          </div>
        </FadeInUp>

        {!hasData && (
          <div className="mb-12">
            <EmptyState
              title="Seu dashboard está zerado"
              description="Adicione transações ou complete seu perfil para ver gráficos e indicadores reais."
              actionLabel="Nova transação"
            />
          </div>
        )}

        {/* Premium Hero Cards */}
        <StaggerContainer staggerDelay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 lg:mb-20">
            <StaggerItem>
              <PremiumHeroCard 
                label="Saldo disponível" 
                value={saldo} 
                change={incomeMoM} 
                positive={incomeMoM >= 0} 
                accent 
                icon={Wallet}
                delay={0}
              />
            </StaggerItem>
            <StaggerItem>
              <PremiumHeroCard 
                label="Total de gastos" 
                value={totalGastos} 
                change={expenseMoM} 
                positive={expenseMoM <= 0} 
                icon={CreditCard}
                delay={0.1}
              />
            </StaggerItem>
            <StaggerItem>
              <PremiumHeroCard 
                label="Renda do mês" 
                value={renda} 
                icon={TrendingUp}
                delay={0.2}
              />
            </StaggerItem>
            <StaggerItem>
              <PremiumHeroCard 
                label="Recorrências" 
                value={0} 
                icon={Sparkles}
                delay={0.3}
              />
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Main Grid */}
        <StaggerContainer staggerDelay={0.15}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-20">

            {/* Premium Chart Section */}
            <StaggerItem>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="lg:col-span-8 glass-strong rounded-[2rem] p-6 lg:p-8 border border-border/20 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                      <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-2">Evolução mensal</h3>
                      <p className="text-sm text-muted-foreground">Renda vs. gastos nos últimos 6 meses</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30" />
                        <span className="text-sm text-muted-foreground">Renda</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-400 shadow-lg shadow-rose-400/30" />
                        <span className="text-sm text-muted-foreground">Gastos</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-[280px] lg:h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="premiumRenda" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="premiumGastos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fb7185" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#fb7185" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#71717a", fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#71717a", fontSize: 12 }}
                          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<PremiumTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="renda"
                          stroke="#34d399"
                          strokeWidth={3}
                          fill="url(#premiumRenda)"
                          dot={false}
                          activeDot={{ r: 6, fill: "#34d399", strokeWidth: 2, stroke: "#fff" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="gastos"
                          stroke="#fb7185"
                          strokeWidth={3}
                          fill="url(#premiumGastos)"
                          dot={false}
                          activeDot={{ r: 6, fill: "#fb7185", strokeWidth: 2, stroke: "#fff" }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>

            {/* Premium Progress Ring */}
            <StaggerItem>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                className="lg:col-span-4 glass-strong rounded-[2rem] p-8 border border-border/20 flex flex-col items-center justify-center relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative">
                  <PremiumProgressRing progress={percentualUsado} />
                  <div className="mt-8 w-full space-y-4">
                    {[
                      { label: "Renda", value: renda, color: "#34d399" },
                      { label: "Gastos", value: totalGastos, color: "#fb7185" },
                      { label: "Sobra", value: saldo, color: "#22d3ee" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                        className="flex items-center justify-between py-3 border-b border-border/10 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}40` }} />
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground tabular-nums">
                          R$ {item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </StaggerItem>

            {/* Premium Categories */}
            <StaggerItem>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="lg:col-span-6 glass-strong rounded-[2rem] p-8 border border-border/20 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-2">Categorias</h3>
                      <p className="text-sm text-muted-foreground">Distribuição dos gastos</p>
                    </div>
                    <ScaleOnHover>
                      <button className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors duration-300 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20">
                        Ver todas <ChevronRight className="w-4 h-4" />
                      </button>
                    </ScaleOnHover>
                  </div>

                  <div className="space-y-6">
                    {categorias
                      .filter((cat) => cat.items.length > 0)
                      .slice(0, 5)
                      .map((cat, i) => (
                      <PremiumCategoryRow
                        key={cat.name}
                        name={cat.name}
                        value={cat.items.reduce((sum, item) => sum + item.value, 0)}
                        total={totalGastos || 1}
                        color={cat.color}
                        delay={0.4 + i * 0.08}
                      />
                    ))}
                    {categorias.every((c) => c.items.length === 0) && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-muted-foreground text-center py-12"
                      >
                        Nenhum gasto por categoria este mês.
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            </StaggerItem>

            {/* Premium Donut + Goals */}
            <StaggerItem>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                className="lg:col-span-6 space-y-8"
              >
                {/* Premium Donut */}
                <div className="glass-strong rounded-[2rem] p-8 border border-border/20 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-transparent"
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <div className="relative">
                    <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-6">Visão geral</h3>
                    <div className="flex items-center justify-center">
                      <div className="w-[220px] h-[220px] lg:w-[240px] lg:h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={donutData}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={100}
                              paddingAngle={4}
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
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      {donutData.slice(0, 4).map((item, i) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}40` }} />
                          <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Premium Goals */}
                <div className="glass-strong rounded-[2rem] p-8 border border-border/20 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent"
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl lg:text-2xl font-semibold text-foreground">Metas</h3>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      {goalsData.length === 0 && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-muted-foreground text-center py-8"
                        >
                          Nenhuma meta cadastrada.
                        </motion.p>
                      )}
                      {goalsData.slice(0, 3).map((goal, i) => (
                        <motion.div
                          key={goal.id || goal.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-foreground">{goal.name}</span>
                            <span className="text-xs text-muted-foreground font-semibold">
                              {((goal.current / goal.target) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 bg-border/20 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full relative"
                              style={{ backgroundColor: goal.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                              transition={{ delay: 0.6 + i * 0.1, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-white/20"
                                animate={{
                                  x: ["-100%", "100%"],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                            </motion.div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              R$ {goal.current.toLocaleString("pt-BR")}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              R$ {goal.target.toLocaleString("pt-BR")}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>

            {/* Premium AI Insights */}
            <StaggerItem>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="lg:col-span-12 glass-glow rounded-[2rem] p-8 lg:p-10 border border-primary/30 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/5 to-transparent"
                  animate={{
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Target className="w-6 h-6 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-1">Insights Inteligentes</h3>
                      <p className="text-sm text-muted-foreground">Análise preditiva e comportamental em tempo real</p>
                    </div>
                  </div>
                  <AiInsights />
                </div>
              </motion.div>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </div>
    </div>
  )
}
