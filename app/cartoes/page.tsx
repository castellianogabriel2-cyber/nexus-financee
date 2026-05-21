"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CreditCard,
  Eye,
  EyeOff,
  ChevronRight,
  Wifi,
  Calendar,
  TrendingUp,
} from "lucide-react"
import { useFinance } from "@/providers/finance-provider"
import { EmptyState } from "@/components/empty-state"
import { mapCardsForUI } from "@/lib/finance/compute"

type CardUI = ReturnType<typeof mapCardsForUI>[number]

// Card visual component (Apple Wallet style)
function CreditCardVisual({
  card,
  isExpanded,
  onClick,
  index,
}: {
  card: CardUI
  isExpanded: boolean
  onClick: () => void
  index: number
}) {
  const [showNumber, setShowNumber] = useState(false)

  return (
    <motion.div
      layout
      onClick={onClick}
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: 1,
        y: isExpanded ? 0 : index * -80,
        scale: isExpanded ? 1 : 1 - index * 0.05,
        zIndex: isExpanded ? 50 : 40 - index,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative cursor-pointer ${isExpanded ? "mb-6" : "absolute top-0 left-0 right-0"}`}
      style={{ transformOrigin: "top center" }}
    >
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.color} p-6 lg:p-8 aspect-[1.6/1] shadow-2xl`}
      >
        {/* Card texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzAwMDAwMDA1Ii8+CjwvcmVjdD4KPC9zdmc+')] opacity-30" />

        {/* Shine effect */}
        <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transform rotate-45 animate-shimmer" />

        {/* Card content */}
        <div className="relative h-full flex flex-col justify-between">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">{card.bank}</p>
              <p className="text-white/60 text-xs mt-0.5">Credito</p>
            </div>
            <div className="flex items-center gap-3">
              <Wifi className="w-6 h-6 text-white/60 rotate-90" />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowNumber(!showNumber)
                }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                {showNumber ? (
                  <EyeOff className="w-4 h-4 text-white/80" />
                ) : (
                  <Eye className="w-4 h-4 text-white/80" />
                )}
              </button>
            </div>
          </div>

          {/* Card number */}
          <div className="flex-1 flex items-center">
            <p className="text-white text-xl lg:text-2xl font-mono tracking-[0.2em]">
              {showNumber ? "5412 7512 3456 " : "**** **** **** "}
              {card.lastDigits}
            </p>
          </div>

          {/* Bottom row */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/60 text-xs uppercase">Titular</p>
              <p className="text-white text-sm font-medium">{card.holder}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs uppercase">Validade</p>
              <p className="text-white text-sm font-medium">{card.expiry}</p>
            </div>
            <div className="w-12 h-8">
              {card.brand === "mastercard" ? (
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-red-500 opacity-90" />
                  <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-90 -ml-3" />
                </div>
              ) : (
                <div className="text-white font-bold text-lg italic">VISA</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Card details panel
function CardDetails({ card }: { card: CardUI }) {
  const limiteDisponivel = card.limite - card.usado
  const percentualUsado = (card.usado / card.limite) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Limit usage */}
      <div className="bg-card/30 border border-border/50 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Limite utilizado</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              R$ {card.usado.toLocaleString("pt-BR")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Disponivel</p>
            <p className="text-lg font-semibold text-success mt-1">
              R$ {limiteDisponivel.toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-border/30 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              percentualUsado > 80 ? "bg-destructive" : percentualUsado > 50 ? "bg-warning" : "bg-success"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percentualUsado}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{percentualUsado.toFixed(0)}% usado</span>
          <span className="text-xs text-muted-foreground">Limite: R$ {card.limite.toLocaleString("pt-BR")}</span>
        </div>
      </div>

      {/* Current invoice */}
      <div className="bg-card/30 border border-border/50 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fatura atual</p>
              <p className="text-xl font-bold text-foreground">
                R$ {card.fatura.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Vencimento</p>
            <p className="text-sm font-semibold text-foreground">{card.vencimento}</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-card/50 border border-border/50 text-foreground hover:bg-card/70 transition-colors">
          <CreditCard className="w-5 h-5" />
          <span className="text-sm font-medium">Ver fatura</span>
        </button>
        <button className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm">Pagar fatura</span>
        </button>
      </div>
    </motion.div>
  )
}

export default function CartoesPage() {
  const { cardsData } = useFinance()
  const [expandedCard, setExpandedCard] = useState<number | null>(cardsData.length > 0 ? 0 : null)

  if (cardsData.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
        <h1 className="text-2xl font-bold text-foreground mb-8">Cartoes</h1>
        <EmptyState
          title="Nenhum cartao cadastrado"
          description="Adicione seus cartoes no onboarding ou em configuracoes."
          actionLabel="Nova transacao"
        />
      </div>
    )
  }

  const totalLimite = cardsData.reduce((acc, card) => acc + card.limite, 0)
  const totalUsado = cardsData.reduce((acc, card) => acc + card.usado, 0)
  const totalFaturas = cardsData.reduce((acc, card) => acc + card.fatura, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-4xl font-bold text-foreground tracking-tight">
          Cartoes
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie seus cartoes de credito
        </p>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-card/30 border border-border/50 rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Limite total</p>
          <p className="text-lg lg:text-xl font-bold text-foreground">
            R$ {(totalLimite / 1000).toFixed(0)}k
          </p>
        </div>
        <div className="bg-card/30 border border-border/50 rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Usado</p>
          <p className="text-lg lg:text-xl font-bold text-warning">
            R$ {totalUsado.toLocaleString("pt-BR")}
          </p>
        </div>
        <div className="bg-card/30 border border-border/50 rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Faturas</p>
          <p className="text-lg lg:text-xl font-bold text-destructive">
            R$ {totalFaturas.toLocaleString("pt-BR")}
          </p>
        </div>
      </motion.div>

      {/* Cards Stack (Apple Wallet style) */}
      <div className="relative mb-8" style={{ height: expandedCard !== null ? "auto" : "280px" }}>
        <div className="relative" style={{ paddingTop: expandedCard === null ? `${(cardsData.length - 1) * 80}px` : 0 }}>
          {cardsData.map((card, index) => (
            <CreditCardVisual
              key={card.id}
              card={card}
              index={expandedCard === null ? cardsData.length - 1 - index : index}
              isExpanded={expandedCard !== null}
              onClick={() => setExpandedCard(expandedCard === index ? null : index)}
            />
          ))}
        </div>
      </div>

      {/* Card Details */}
      <AnimatePresence mode="wait">
        {expandedCard !== null && (
          <CardDetails key={expandedCard} card={cardsData[expandedCard]} />
        )}
      </AnimatePresence>

      {/* Help text */}
      {expandedCard === null && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground"
        >
          Toque em um cartao para ver detalhes
        </motion.p>
      )}
    </div>
  )
}
