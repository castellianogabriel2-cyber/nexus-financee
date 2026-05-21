"use client"

import { motion } from "framer-motion"
import {
  Repeat,
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Pause,
  Play,
  Trash2,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import { useFinance } from "@/providers/finance-provider"
import { EmptyState } from "@/components/empty-state"
import { getRecurrenceLabel } from "@/lib/recurrence/generator"

export default function RecorrenciasPage() {
  const { transactions } = useFinance()

  // Filter recurring transactions (only the base ones, not generated ones)
  const recurringTransactions = transactions.filter(
    (t) => t.is_recurring && !t.parent_installment_id
  )

  // Group by type
  const expenses = recurringTransactions.filter((t) => t.type === "expense")
  const incomes = recurringTransactions.filter((t) => t.type === "income")

  const totalMonthlyExpenses = expenses.reduce((acc, t) => acc + t.amount, 0)
  const totalMonthlyIncomes = incomes.reduce((acc, t) => acc + t.amount, 0)

  if (recurringTransactions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
        <h1 className="text-2xl font-bold text-foreground mb-8">Recorrências</h1>
        <EmptyState
          title="Sem recorrências"
          description="Configure assinaturas, despesas fixas e receitas recorrentes aqui."
          actionLabel="Nova transação"
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
          Recorrências
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas assinaturas e despesas recorrentes
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
            <TrendingDown className="w-5 h-5 text-destructive" />
            <span className="text-sm text-muted-foreground">Saídas mensais</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-destructive">
            R$ {totalMonthlyExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-card/30 border border-border/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground">Entradas mensais</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-success">
            R$ {totalMonthlyIncomes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </motion.div>

      {/* Recurring Transactions List */}
      <div className="space-y-4">
        {recurringTransactions.map((transaction, i) => {
          const isExpense = transaction.type === "expense"
          const frequencyLabel = transaction.recurrence_frequency
            ? getRecurrenceLabel(transaction.recurrence_frequency)
            : "Mensal"
          const endDate = transaction.recurrence_end_date
            ? new Date(transaction.recurrence_end_date).toLocaleDateString("pt-BR")
            : null

          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-card/30 border border-border/50 rounded-3xl p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isExpense ? "bg-destructive/20" : "bg-success/20"
                    }`}
                  >
                    {isExpense ? (
                      <TrendingDown className="w-6 h-6 text-destructive" />
                    ) : (
                      <TrendingUp className="w-6 h-6 text-success" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {transaction.description || "Sem descrição"}
                    </h3>
                    <p className="text-sm text-muted-foreground">{frequencyLabel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-2xl font-bold ${
                      isExpense ? "text-destructive" : "text-success"
                    }`}
                  >
                    {isExpense ? "-" : "+"}R${" "}
                    {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  {endDate && (
                    <p className="text-xs text-muted-foreground mt-1">Até {endDate}</p>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {transaction.card_id && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Cartão</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(transaction.transaction_date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4" />
                    <span>Recorrente</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-xl bg-card/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Pause className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-card/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-card/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
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
          <p className="text-sm font-medium text-foreground">Atenção às recorrências</p>
          <p className="text-sm text-muted-foreground mt-1">
            Suas recorrências representam R${" "}
            {totalMonthlyExpenses.toLocaleString("pt-BR")} em saídas mensais. Revise
            periodicamente para manter seu orçamento equilibrado.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
