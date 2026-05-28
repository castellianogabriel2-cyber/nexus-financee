"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { BlurReveal, StaggerItem } from "@/components/motion/motion-system"
import { Sparkles, Target, Wallet, TrendingUp, Plus, CreditCard } from "lucide-react"
import { ReactNode } from "react"

/**
 * Nexus OS - Premium Empty States
 * 
 * Philosophy:
 * - Ilustrações minimalistas
 * - Frases emocionais
 * - Animações suaves
 * - Incentivo humano
 * 
 * Inspired by:
 * - Linear
 * - Notion
 * - Apple
 */

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function PremiumEmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className = "" 
}: EmptyStateProps) {
  return (
    <BlurReveal className={`text-center py-20 ${className}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8"
        style={{
          background: nexusOS.colors.accent.primary + "10",
        }}
      >
        {icon || <Sparkles className="w-10 h-10" style={{ color: nexusOS.colors.accent.primary }} />}
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="text-2xl font-semibold mb-3"
        style={{ color: nexusOS.colors.text.primary }}
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-base max-w-md mx-auto mb-8"
        style={{ color: nexusOS.colors.text.tertiary }}
      >
        {description}
      </motion.p>

      {action && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onClick={action.onClick}
          className="px-8 py-3 rounded-2xl font-medium"
          style={{
            background: nexusOS.colors.accent.primary,
            color: nexusOS.colors.background.primary,
          }}
        >
          {action.label}
        </motion.button>
      )}
    </BlurReveal>
  )
}

// Specific empty states

export function EmptyTransactions({ onAddTransaction }: { onAddTransaction?: () => void }) {
  return (
    <PremiumEmptyState
      icon={<Wallet className="w-10 h-10" />}
      title="Nenhuma transação ainda"
      description="Comece a registrar suas transações para ter controle total das suas finanças."
      action={onAddTransaction ? {
        label: "Adicionar transação",
        onClick: onAddTransaction,
      } : undefined}
    />
  )
}

export function EmptyGoals({ onAddGoal }: { onAddGoal?: () => void }) {
  return (
    <PremiumEmptyState
      icon={<Target className="w-10 h-10" />}
      title="Sem metas definidas"
      description="Defina metas financeiras para alcançar seus sonhos com mais clareza."
      action={onAddGoal ? {
        label: "Criar meta",
        onClick: onAddGoal,
      } : undefined}
    />
  )
}

export function EmptyCards({ onAddCard }: { onAddCard?: () => void }) {
  return (
    <PremiumEmptyState
      icon={<CreditCard className="w-10 h-10" />}
      title="Nenhum cartão cadastrado"
      description="Adicione seus cartões para acompanhar gastos e faturas em um só lugar."
      action={onAddCard ? {
        label: "Adicionar cartão",
        onClick: onAddCard,
      } : undefined}
    />
  )
}

export function EmptyInsights() {
  return (
    <PremiumEmptyState
      icon={<TrendingUp className="w-10 h-10" />}
      title="Aguardando dados"
      description="Adicione algumas transações para que a IA possa gerar insights personalizados."
    />
  )
}

// Minimal empty state for smaller spaces
export function MinimalEmptyState({ 
  icon, 
  message,
  className = "" 
}: { 
  icon?: ReactNode
  message: string
  className?: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      {icon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
          style={{
            background: nexusOS.colors.accent.primary + "10",
          }}
        >
          {icon}
        </motion.div>
      )}
      <p className="text-sm" style={{ color: nexusOS.colors.text.tertiary }}>
        {message}
      </p>
    </motion.div>
  )
}

// Emotional empty state with motivational message
export function EmotionalEmptyState({ 
  type = "transactions",
  action,
  className = "" 
}: { 
  type?: "transactions" | "goals" | "cards" | "insights"
  action?: {
    label: string
    onClick: () => void
  }
  className?: string 
}) {
  const emotionalMessages = {
    transactions: {
      icon: <Wallet className="w-10 h-10" />,
      title: "Sua jornada financeira começa aqui",
      description: "Cada transação é um passo em direção ao seu futuro financeiro. Comece hoje.",
    },
    goals: {
      icon: <Target className="w-10 h-10" />,
      title: "Sonhos esperando por você",
      description: "Transforme seus sonhos em metas alcançáveis. O primeiro passo é definir o que você quer.",
    },
    cards: {
      icon: <CreditCard className="w-10 h-10" />,
      title: "Organização começa aqui",
      description: "Adicione seus cartões para ter visibilidade completa dos seus gastos.",
    },
    insights: {
      icon: <Sparkles className="w-10 h-10" />,
      title: "Inteligência em construção",
      description: "Quanto mais você usa o Nexus, mais inteligente ele se torna.",
    },
  }

  const content = emotionalMessages[type]

  return (
    <PremiumEmptyState
      icon={content.icon}
      title={content.title}
      description={content.description}
      action={action}
      className={className}
    />
  )
}
