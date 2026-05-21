"use client"

import { motion } from "framer-motion"
import {
  CalendarClock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  ChevronRight,
} from "lucide-react"

import { useFinance } from "@/providers/finance-provider"
import { EmptyState } from "@/components/empty-state"

export default function ParcelamentosPage() {
  const { installments, cards } = useFinance()

  const parcelamentos = installments.map((item, i) => {
    const card = cards.find((c) => c.id === item.card_id)
    return {
      id: item.id,
      name: item.name,
      total: Number(item.total_amount),
      parcelas: item.installments_total,
      parcelaAtual: item.installment_current,
      valorParcela: Number(item.monthly_amount),
      cartao: card?.bank || "—",
      color: card?.color || "from-purple-600 to-purple-900",
      vencimento: item.next_due_date
        ? new Date(item.next_due_date + "T12:00:00").getDate().toString()
        : "10",
      concluido: item.status === "completed",
    }
  })

  const parcelamentosAtivos = parcelamentos.filter((p) => !p.concluido)
  const totalMensal = parcelamentosAtivos.reduce((acc, p) => acc + p.valorParcela, 0)
  const totalRestante = parcelamentosAtivos.reduce(
    (acc, p) => acc + (p.parcelas - p.parcelaAtual + 1) * p.valorParcela,
    0
  )

  if (parcelamentos.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
        <h1 className="text-2xl font-bold text-foreground mb-8">Parcelamentos</h1>
        <EmptyState
          title="Sem parcelamentos"
          description="Compras parceladas no cartao aparecerao aqui."
          actionLabel="Nova transacao"
        />
      </div>
    )
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
          Parcelamentos
        </h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe suas compras parceladas
        </p>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <div className="bg-card/30 border border-border/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <CalendarClock className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total mensal</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-foreground">
            R$ {totalMensal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-card/30 border border-border/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total restante</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-warning">
            R$ {totalRestante.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </motion.div>

      {/* Installments List */}
      <div className="space-y-4">
        {parcelamentos.map((item, i) => {
          const progress = (item.parcelaAtual / item.parcelas) * 100
          const restante = (item.parcelas - item.parcelaAtual + 1) * item.valorParcela

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`bg-card/30 border rounded-3xl p-6 ${
                item.concluido ? "border-success/30" : "border-border/50"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-8 rounded-lg bg-gradient-to-br ${item.color}`} />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.cartao}</p>
                  </div>
                </div>
                {item.concluido ? (
                  <div className="flex items-center gap-1 text-success text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Quitado</span>
                  </div>
                ) : (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Vence dia</p>
                    <p className="text-lg font-semibold text-foreground">{item.vencimento}</p>
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Parcela {item.parcelaAtual} de {item.parcelas}
                  </span>
                  <span className="text-sm font-medium text-foreground">{progress.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${item.concluido ? "bg-success" : "bg-primary"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <div>
                  <p className="text-xs text-muted-foreground">Valor da parcela</p>
                  <p className="text-lg font-semibold text-foreground">
                    R$ {item.valorParcela.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Restante</p>
                  <p className={`text-lg font-semibold ${item.concluido ? "text-success" : "text-foreground"}`}>
                    {item.concluido ? "R$ 0,00" : `R$ ${restante.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  </p>
                </div>
                <button className="w-10 h-10 rounded-xl bg-card/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Warning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex items-start gap-4 p-4 rounded-2xl bg-warning/10 border border-warning/20"
      >
        <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Atencao ao limite de parcelamentos</p>
          <p className="text-sm text-muted-foreground mt-1">
            Seus parcelamentos representam R$ {totalMensal.toLocaleString("pt-BR")} do seu orcamento mensal.
            Evite novos parcelamentos ate quitar os atuais.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
