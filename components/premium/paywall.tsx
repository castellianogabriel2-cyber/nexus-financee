"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Crown, Sparkles, Check, X, Lock, Zap, TrendingUp, Shield, Star } from "lucide-react"
import { PLANS, PlanType, BillingCycle, getYearlySavings } from "@/lib/subscription/types"
import { useState } from "react"

interface PaywallProps {
  feature?: string
  onClose?: () => void
  onUpgrade?: (plan: PlanType, cycle: BillingCycle) => void
}

export function Paywall({ feature = "recurso premium", onClose, onUpgrade }: PaywallProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("premium")

  const handleUpgrade = () => {
    onUpgrade?.(selectedPlan, billingCycle)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-card border border-border/50 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 text-center border-b border-border/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 20, stiffness: 300 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30"
            >
              <Crown className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Desbloqueie o Premium</h2>
            <p className="text-muted-foreground">
              {feature} está disponível apenas para assinantes Premium
            </p>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative ${
                billingCycle === "yearly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                -{getYearlySavings("premium")}%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`relative p-6 rounded-2xl border-2 transition-all ${
              selectedPlan === "free"
                ? "border-primary bg-primary/5"
                : "border-border/50 bg-card/30 hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">{PLANS.free.name}</h3>
              <div className="text-right">
                <span className="text-3xl font-bold text-foreground">R$ 0</span>
                <span className="text-muted-foreground text-sm">/mês</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{PLANS.free.description}</p>
            <ul className="space-y-3 mb-6">
              {PLANS.free.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedPlan("free")}
              className={`w-full py-3 rounded-xl font-medium transition-all ${
                selectedPlan === "free"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Plano Atual
            </button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`relative p-6 rounded-2xl border-2 transition-all ${
              selectedPlan === "premium"
                ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5"
                : "border-border/50 bg-card/30 hover:border-border"
            }`}
          >
            {selectedPlan === "premium" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            )}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">{PLANS.premium.name}</h3>
              <div className="text-right">
                <span className="text-3xl font-bold text-primary">
                  R$ {PLANS.premium.price[billingCycle].toFixed(2)}
                </span>
                <span className="text-muted-foreground text-sm">/{billingCycle === "monthly" ? "mês" : "ano"}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{PLANS.premium.description}</p>
            <ul className="space-y-3 mb-6">
              {PLANS.premium.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Zap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedPlan("premium")}
              className={`w-full py-3 rounded-xl font-medium transition-all ${
                selectedPlan === "premium"
                  ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {PLANS.premium.trialDays ? `Teste grátis ${PLANS.premium.trialDays} dias` : "Assinar Premium"}
            </button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="p-6 border-t border-border/30">
          <h4 className="text-lg font-semibold text-foreground mb-4 text-center">Recursos Premium</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, label: "IA Financeira", color: "text-emerald-400" },
              { icon: Shield, label: "Segurança Avançada", color: "text-blue-400" },
              { icon: Star, label: "Analytics Completos", color: "text-yellow-400" },
              { icon: Zap, label: "Insights Inteligentes", color: "text-purple-400" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 border border-border/30"
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <span className="text-xs text-foreground text-center">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/30 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
          >
            Continuar no Free
          </button>
          <button
            onClick={handleUpgrade}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
          >
            {selectedPlan === "premium" ? "Assinar Premium" : "Continuar"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
