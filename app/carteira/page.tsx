"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Banknote,
  PiggyBank,
  Calendar,
} from "lucide-react"
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { useFinance } from "@/providers/finance-provider"
import { computeMonthExpenses, isCurrentMonth } from "@/lib/finance/compute"

// Animated number
function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
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
      {prefix}{displayValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  )
}

export default function CarteiraPage() {
  const {
    profile,
    transactions,
    categories,
    renda,
    totalGastos,
    saldo,
    evolutionData,
    incomeMoM,
    periodLabel,
  } = useFinance()

  const entradasMes = renda
  const saidasMes = totalGastos
  const dinheiroDisponivel = Number(profile?.cash_balance ?? 0)
  const reservaEmergencia = Number(profile?.emergency_reserve_current ?? 0)

  const recentTransactions = transactions.slice(0, 8).map((t) => {
    const cat = categories.find((c) => c.id === t.category_id)
    return {
      id: t.id,
      name: t.description || (t.type === "income" ? "Entrada" : "Gasto"),
      category: cat?.name || (t.type === "income" ? "Renda" : "Outros"),
      value: t.type === "income" ? Number(t.amount) : -Number(t.amount),
      date: new Date(t.transaction_date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    }
  })

  const projectionData = [
    { day: "Hoje", saldo },
    { day: "Sem 1", saldo: saldo - saidasMes * 0.25 },
    { day: "Sem 2", saldo: saldo - saidasMes * 0.5 },
    { day: "Sem 3", saldo: saldo - saidasMes * 0.75 },
    { day: "Fim", saldo: saldo - saidasMes },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-4xl font-bold text-foreground tracking-tight">
          Carteira
        </h1>
        <p className="text-muted-foreground mt-2">
          Visao completa das suas financas
        </p>
      </motion.div>

      {/* Main Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-6 lg:p-10 mb-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo atual</p>
              <p className="text-xs text-primary">{periodLabel}</p>
            </div>
          </div>
          
          <p className="text-4xl lg:text-6xl font-bold text-foreground tracking-tight">
            <AnimatedNumber value={saldo} prefix="R$ " />
          </p>
          
          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center gap-1 text-success text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>{incomeMoM >= 0 ? "+" : ""}{incomeMoM.toFixed(1)}%</span>
            </div>
            <span className="text-muted-foreground text-sm">vs. mes anterior</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card/30 border border-border/50 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-success" />
            </div>
            <span className="text-xs text-muted-foreground">Entradas</span>
          </div>
          <p className="text-xl lg:text-2xl font-bold text-success">
            R$ {entradasMes.toLocaleString("pt-BR")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/30 border border-border/50 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-destructive" />
            </div>
            <span className="text-xs text-muted-foreground">Saidas</span>
          </div>
          <p className="text-xl lg:text-2xl font-bold text-destructive">
            R$ {saidasMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card/30 border border-border/50 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
              <Banknote className="w-4 h-4 text-warning" />
            </div>
            <span className="text-xs text-muted-foreground">Dinheiro</span>
          </div>
          <p className="text-xl lg:text-2xl font-bold text-foreground">
            R$ {dinheiroDisponivel.toLocaleString("pt-BR")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/30 border border-border/50 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <PiggyBank className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Reserva</span>
          </div>
          <p className="text-xl lg:text-2xl font-bold text-foreground">
            R$ {reservaEmergencia.toLocaleString("pt-BR")}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Projection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-7 bg-card/30 border border-border/50 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Projecao financeira</h3>
              <p className="text-sm text-muted-foreground mt-1">Estimativa ate fim do mes</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/20">
              <Calendar className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-warning">15 dias</span>
            </div>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProjecao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                  dy={10}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null
                    return (
                      <div className="glass-strong rounded-xl px-4 py-3 border border-border/50">
                        <p className="text-sm font-semibold text-foreground">
                          R$ {payload[0].value?.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    )
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="saldo"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="url(#colorProjecao)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
            <div>
              <p className="text-sm text-muted-foreground">Saldo projetado</p>
              <p className="text-2xl font-bold text-foreground">
                R$ {(saldo - 2500).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex items-center gap-1 text-destructive text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>-R$ 2.500</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-5 bg-card/30 border border-border/50 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Transacoes recentes</h3>
            <button className="text-sm text-primary font-medium hover:underline">
              Ver todas
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.slice(0, 5).map((transaction, i) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-card/50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  transaction.value > 0 ? "bg-success/20" : "bg-muted/50"
                }`}>
                  {transaction.value > 0 ? (
                    <ArrowUpRight className="w-5 h-5 text-success" />
                  ) : (
                    <ArrowDownLeft className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{transaction.name}</p>
                  <p className="text-xs text-muted-foreground">{transaction.category}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${transaction.value > 0 ? "text-success" : "text-foreground"}`}>
                    {transaction.value > 0 ? "+" : ""}R$ {Math.abs(transaction.value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
