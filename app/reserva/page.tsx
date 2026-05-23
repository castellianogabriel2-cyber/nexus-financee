"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Shield,
  TrendingUp,
  Plus,
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react"
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { useFinance } from "@/providers/finance-provider"
import { computeMonthExpenses } from "@/lib/finance/compute"
import { createClient } from "@/lib/supabase/client"

export default function ReservaPage() {
  const { profile, fundDeposits, transactions, refresh } = useFinance()
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [depositing, setDepositing] = useState(false)

  const reservaData = {
    atual: Number(profile?.emergency_reserve_current ?? 0),
    meta: Number(profile?.emergency_reserve_target ?? 0),
    gastoMensal: Math.max(computeMonthExpenses(transactions), 1),
  }

  const evolutionData = fundDeposits.length > 0
    ? fundDeposits.slice(0, 6).reverse().map((d, i) => ({
        month: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"][i] || "—",
        value: Number(d.amount),
      }))
    : [{ month: "Atual", value: reservaData.atual }]

  const depositos = fundDeposits.map((d) => ({
    date: new Date(d.deposit_date + "T12:00:00").toLocaleDateString("pt-BR"),
    value: Number(d.amount),
    description: d.notes || "Deposito",
  }))

  const percentage = reservaData.meta > 0 ? (reservaData.atual / reservaData.meta) * 100 : 0
  const mesesCobertos = reservaData.atual / reservaData.gastoMensal
  const faltam = Math.max(0, reservaData.meta - reservaData.atual)
  const statusSaude = mesesCobertos >= 6 ? "otimo" : mesesCobertos >= 3 ? "bom" : "alerta"

  const handleDeposit = async () => {
    if (!depositAmount || depositing) return

    setDepositing(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const amount = parseFloat(depositAmount.replace(/\D/g, "")) / 100

      // Insert deposit
      await supabase.from("fund_deposits").insert({
        user_id: user.id,
        amount: amount,
        notes: "Depósito manual",
        deposit_date: new Date().toISOString(),
      })

      // Update emergency reserve
      const newReserve = reservaData.atual + amount
      await supabase.from("profiles").update({
        emergency_reserve_current: newReserve,
      }).eq("id", user.id)

      await refresh()
      setShowDepositModal(false)
      setDepositAmount("")
    } catch (error) {
      console.error("Erro ao depositar:", error)
    } finally {
      setDepositing(false)
    }
  }

  const formatMoney = (v: string) => {
    const num = v.replace(/\D/g, "")
    return (parseInt(num || "0") / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-4xl font-bold text-foreground tracking-tight">
          Reserva de Emergencia
        </h1>
        <p className="text-muted-foreground mt-2">
          Sua seguranca financeira
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-br from-success/20 via-success/10 to-transparent border border-success/20 rounded-3xl p-6 lg:p-8 mb-6"
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-success/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-success/20 flex items-center justify-center">
              <Shield className="w-7 h-7 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reserva atual</p>
              <p className="text-4xl font-bold text-foreground">
                R$ {reservaData.atual.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progresso para meta</span>
              <span className="text-sm font-semibold text-success">{percentage.toFixed(0)}%</span>
            </div>
            <div className="h-4 bg-border/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-success to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                Faltam R$ {faltam.toLocaleString("pt-BR")}
              </span>
              <span className="text-xs text-muted-foreground">
                Meta: R$ {reservaData.meta.toLocaleString("pt-BR")}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Meses cobertos</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{mesesCobertos.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">de 6 meses recomendados</p>
            </div>
            <div className="bg-card/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Status</span>
              </div>
              <div className="flex items-center gap-2">
                {statusSaude === "alerta" ? (
                  <AlertTriangle className="w-5 h-5 text-warning" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
                <span className={`text-lg font-semibold ${
                  statusSaude === "alerta" ? "text-warning" : "text-success"
                }`}>
                  {statusSaude === "otimo" ? "Otimo" : statusSaude === "bom" ? "Bom" : "Construindo"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Evolution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card/30 border border-border/50 rounded-3xl p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Evolucao</h3>
            <p className="text-sm text-muted-foreground mt-1">Ultimos 5 meses</p>
          </div>
          <div className="flex items-center gap-2 text-success text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+70% este ano</span>
          </div>
        </div>

        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReserva" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 12 }}
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
                dataKey="value"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#colorReserva)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Deposits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/30 border border-border/50 rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Depositos recentes</h3>
          <button
            onClick={() => setShowDepositModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Depositar
          </button>
        </div>

        <div className="space-y-3">
          {depositos.map((dep, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-card/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{dep.description}</p>
                <p className="text-xs text-muted-foreground">{dep.date}</p>
              </div>
              <p className="text-sm font-semibold text-success">
                +R$ {dep.value.toLocaleString("pt-BR")}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border/50 rounded-3xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-foreground mb-4">Depositar na reserva</h3>
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">Valor</label>
              <div className="flex items-center gap-2 py-4 px-4 rounded-xl bg-card/50 border border-border/50">
                <span className="text-muted-foreground">R$</span>
                <input
                  inputMode="numeric"
                  value={formatMoney(depositAmount)}
                  onChange={(e) => setDepositAmount(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 bg-transparent text-2xl font-bold text-foreground outline-none"
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDepositModal(false)
                  setDepositAmount("")
                }}
                className="flex-1 py-3 rounded-xl bg-card/50 border border-border/50 text-foreground font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeposit}
                disabled={!depositAmount || depositing}
                className="flex-1 py-3 rounded-xl bg-success text-success-foreground font-medium disabled:opacity-50"
              >
                {depositing ? "Depositando..." : "Depositar"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
