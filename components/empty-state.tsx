"use client"

import { motion } from "framer-motion"
import { Sparkles, Plus, Wallet, Target, CreditCard, TrendingUp } from "lucide-react"
import Link from "next/link"

type EmptyStateType = "transactions" | "goals" | "cards" | "general" | "analytics"

const typeConfig = {
  transactions: {
    icon: Plus,
    title: "Nenhuma transação ainda",
    description: "Comece adicionando sua primeira transação para ver seus gastos e renda.",
    actionLabel: "Adicionar transação",
    actionHref: "/nova-transacao",
    gradient: "from-emerald-400/20 to-emerald-600/20",
  },
  goals: {
    icon: Target,
    title: "Nenhuma meta definida",
    description: "Defina metas financeiras para alcançar seus objetivos mais rápido.",
    actionLabel: "Criar meta",
    actionHref: "/metas",
    gradient: "from-blue-400/20 to-blue-600/20",
  },
  cards: {
    icon: CreditCard,
    title: "Nenhum cartão cadastrado",
    description: "Adicione seus cartões para acompanhar gastos e faturas.",
    actionLabel: "Adicionar cartão",
    actionHref: "/cartoes",
    gradient: "from-purple-400/20 to-purple-600/20",
  },
  analytics: {
    icon: TrendingUp,
    title: "Dados insuficientes",
    description: "Adicione mais transações para ver insights e análises detalhadas.",
    actionLabel: "Adicionar transação",
    actionHref: "/nova-transacao",
    gradient: "from-amber-400/20 to-amber-600/20",
  },
  general: {
    icon: Sparkles,
    title: "Comece sua jornada",
    description: "Complete seu perfil e adicione transações para ver tudo funcionando.",
    actionLabel: "Começar",
    actionHref: "/nova-transacao",
    gradient: "from-primary/20 to-primary/10",
  },
}

export function EmptyState({
  type = "general",
  title,
  description,
  actionLabel,
  actionHref,
}: {
  type?: EmptyStateType
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
}) {
  const config = typeConfig[type]
  const Icon = config.icon
  const finalTitle = title || config.title
  const finalDescription = description || config.description
  const finalActionLabel = actionLabel || config.actionLabel
  const finalActionHref = actionHref || config.actionHref

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-3xl border border-dashed border-border/30 bg-gradient-to-br from-card/50 to-card/20 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-6 shadow-lg shadow-primary/10`}
      >
        <Icon className="w-8 h-8 text-primary" />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl font-semibold text-foreground mb-3"
      >
        {finalTitle}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed"
      >
        {finalDescription}
      </motion.p>
      
      {finalActionLabel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            href={finalActionHref}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
          >
            {finalActionLabel}
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}
