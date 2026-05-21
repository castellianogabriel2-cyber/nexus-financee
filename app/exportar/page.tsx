"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Download,
  FileText,
  Calendar,
  Database,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { useFinance } from "@/providers/finance-provider"
import {
  exportTransactionsCSV,
  exportCategoriesCSV,
  exportCardsCSV,
  exportGoalsCSV,
  exportFinancialSummaryCSV,
  exportMonthlyCSV,
  exportAnnualCSV,
} from "@/lib/export/csv"

export default function ExportarPage() {
  const { transactions, categories, cards, goals, renda, totalGastos, saldo, loading } = useFinance()
  const [exporting, setExporting] = useState<string | null>(null)
  const [exported, setExported] = useState<string | null>(null)

  const handleExportTransactions = () => {
    setExporting("transactions")
    setTimeout(() => {
      exportTransactionsCSV(transactions)
      setExporting(null)
      setExported("transactions")
      setTimeout(() => setExported(null), 2000)
    }, 500)
  }

  const handleExportCategories = () => {
    setExporting("categories")
    setTimeout(() => {
      exportCategoriesCSV(categories)
      setExporting(null)
      setExported("categories")
      setTimeout(() => setExported(null), 2000)
    }, 500)
  }

  const handleExportCards = () => {
    setExporting("cards")
    setTimeout(() => {
      exportCardsCSV(cards)
      setExporting(null)
      setExported("cards")
      setTimeout(() => setExported(null), 2000)
    }, 500)
  }

  const handleExportGoals = () => {
    setExporting("goals")
    setTimeout(() => {
      exportGoalsCSV(goals)
      setExporting(null)
      setExported("goals")
      setTimeout(() => setExported(null), 2000)
    }, 500)
  }

  const handleExportMonthly = () => {
    setExporting("monthly")
    setTimeout(() => {
      const now = new Date()
      const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
      const month = monthNames[now.getMonth()]
      const year = now.getFullYear()

      const summary = {
        totalIncome: renda,
        totalExpense: totalGastos,
        balance: saldo,
        month,
        year,
      }

      exportMonthlyCSV(transactions, categories, cards, goals, summary, month, year)
      setExporting(null)
      setExported("monthly")
      setTimeout(() => setExported(null), 2000)
    }, 500)
  }

  const handleExportAnnual = () => {
    setExporting("annual")
    setTimeout(() => {
      const year = new Date().getFullYear()
      exportAnnualCSV(transactions, categories, cards, goals, year)
      setExporting(null)
      setExported("annual")
      setTimeout(() => setExported(null), 2000)
    }, 500)
  }

  const ExportButton = ({
    icon: Icon,
    title,
    description,
    onClick,
    isLoading,
    isSuccess,
  }: {
    icon: React.ElementType
    title: string
    description: string
    onClick: () => void
    isLoading: boolean
    isSuccess: boolean
  }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={isLoading || loading}
      className="relative overflow-hidden bg-card/50 border border-border/50 rounded-3xl p-6 lg:p-8 text-left hover:bg-card/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          ) : isSuccess ? (
            <CheckCircle className="w-6 h-6 text-success" />
          ) : (
            <Icon className="w-6 h-6 text-primary" />
          )}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.button>
  )

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 lg:mb-12"
      >
        <h1 className="text-2xl lg:text-4xl font-bold text-foreground tracking-tight text-balance">
          Exportar dados
        </h1>
        <p className="text-muted-foreground mt-2 text-base lg:text-lg">
          Exporte seus dados financeiros em formato CSV
        </p>
      </motion.div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
        <ExportButton
          icon={Calendar}
          title="Exportar mês atual"
          description="Transações, categorias, cartões, metas e resumo do mês atual"
          onClick={handleExportMonthly}
          isLoading={exporting === "monthly"}
          isSuccess={exported === "monthly"}
        />
        <ExportButton
          icon={FileText}
          title="Exportar ano atual"
          description="Todas as transações e dados do ano atual"
          onClick={handleExportAnnual}
          isLoading={exporting === "annual"}
          isSuccess={exported === "annual"}
        />
        <ExportButton
          icon={Database}
          title="Exportar todas transações"
          description="Histórico completo de todas as transações"
          onClick={handleExportTransactions}
          isLoading={exporting === "transactions"}
          isSuccess={exported === "transactions"}
        />
      </div>

      {/* Individual Exports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/30 border border-border/50 rounded-3xl p-6 lg:p-8"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6">Exportar individualmente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ExportButton
            icon={Database}
            title="Transações"
            description="Histórico de transações"
            onClick={handleExportTransactions}
            isLoading={exporting === "transactions"}
            isSuccess={exported === "transactions"}
          />
          <ExportButton
            icon={FileText}
            title="Categorias"
            description="Todas as categorias"
            onClick={handleExportCategories}
            isLoading={exporting === "categories"}
            isSuccess={exported === "categories"}
          />
          <ExportButton
            icon={Download}
            title="Cartões"
            description="Cartões cadastrados"
            onClick={handleExportCards}
            isLoading={exporting === "cards"}
            isSuccess={exported === "cards"}
          />
          <ExportButton
            icon={CheckCircle}
            title="Metas"
            description="Metas financeiras"
            onClick={handleExportGoals}
            isLoading={exporting === "goals"}
            isSuccess={exported === "goals"}
          />
        </div>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-6 lg:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Sobre a exportação</h3>
            <p className="text-sm text-muted-foreground">
              Os arquivos são exportados em formato CSV (Comma Separated Values), compatível com Excel, Google Sheets e outras planilhas. 
              Os dados incluem todas as informações relevantes para análise financeira.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
