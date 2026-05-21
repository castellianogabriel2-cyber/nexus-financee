"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  ChevronDown,
  ArrowDownLeft,
  Calendar,
  Receipt,
} from "lucide-react"
import { useFinance } from "@/providers/finance-provider"
import { isCurrentMonth } from "@/lib/finance/compute"
import { EmptyState } from "@/components/empty-state"
import { createClient } from "@/lib/supabase/client"

export default function GastosPage() {
  const { transactions, categories, totalGastos, periodLabel, refresh } = useFinance()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const allExpenses = transactions
    .filter((t) => t.type === "expense" && isCurrentMonth(t.transaction_date))
    .map((t) => {
      const cat = categories.find((c) => c.id === t.category_id)
      return {
        id: t.id,
        name: t.description || "Sem descricao",
        category: cat?.name || "Outros",
        color: cat?.color || "#94a3b8",
        value: Number(t.amount),
        date: new Date(t.transaction_date + "T12:00:00").toLocaleDateString("pt-BR"),
      }
    })
    .sort((a, b) => b.value - a.value)

  const deleteExpense = async (id: string) => {
    const supabase = createClient()
    await supabase.from("transactions").delete().eq("id", id)
    await refresh()
  }

  const filteredExpenses = allExpenses.filter((expense) => {
    const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || expense.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categoryNames = [...new Set(allExpenses.map((e) => e.category))]

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-4xl font-bold text-foreground tracking-tight">
          Gastos
        </h1>
        <p className="text-muted-foreground mt-2">
          Todos os seus gastos de {periodLabel.toLowerCase()}
        </p>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card/30 border border-border/50 rounded-2xl p-5 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de gastos</p>
              <p className="text-2xl font-bold text-foreground">
                R$ {totalGastos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{allExpenses.length} transacoes</p>
          </div>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar gastos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
            showFilters || selectedCategory
              ? "bg-primary/10 border-primary/50 text-primary"
              : "bg-card/50 border-border/50 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">Filtros</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
      </motion.div>

      {/* Filter dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-card/30 border border-border/50">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                Todas
              </button>
              {categoryNames.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {allExpenses.length === 0 && (
        <EmptyState
          title="Nenhum gasto registrado"
          description="Suas despesas do mes aparecerao aqui assim que voce adicionar transacoes."
          actionLabel="Adicionar gasto"
        />
      )}

      {/* Expenses List */}
      <div className="space-y-2">
        {filteredExpenses.map((expense, i) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.02 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-card/30 border border-border/50 hover:border-border transition-colors"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${expense.color}20` }}
            >
              <ArrowDownLeft className="w-5 h-5" style={{ color: expense.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{expense.name}</p>
              <p className="text-xs text-muted-foreground">{expense.category}</p>
            </div>
            <div className="text-right flex items-center gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  R$ {expense.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">{expense.date}</p>
              </div>
              <button
                onClick={() => deleteExpense(expense.id)}
                className="text-xs text-destructive hover:underline"
              >
                Excluir
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredExpenses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum gasto encontrado</p>
        </div>
      )}
    </div>
  )
}
