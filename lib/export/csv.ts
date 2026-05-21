import type { Transaction, Category, Card, Goal } from "@/lib/supabase/types"

export interface FinancialSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  month: string
  year: number
}

// Converter array de objetos para CSV
function arrayToCSV<T>(data: T[], headers: string[]): string {
  if (data.length === 0) return ""

  const csvRows: string[] = []
  
  // Adicionar headers
  csvRows.push(headers.join(","))
  
  // Adicionar dados
  for (const row of data) {
    const values = headers.map(header => {
      const value = (row as any)[header]
      // Escapar valores com vírgulas ou aspas
      const escaped = String(value || "").replace(/"/g, '""')
      return `"${escaped}"`
    })
    csvRows.push(values.join(","))
  }
  
  return csvRows.join("\n")
}

// Download CSV
function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

// Exportar transações para CSV
export function exportTransactionsCSV(transactions: Transaction[], filename: string = "transacoes.csv") {
  const headers = [
    "id",
    "type",
    "amount",
    "category_id",
    "payment_method",
    "card_id",
    "description",
    "notes",
    "transaction_date",
    "installments_total",
    "installment_current",
    "is_recurring",
    "created_at"
  ]
  
  const csv = arrayToCSV(transactions, headers)
  downloadCSV(csv, filename)
}

// Exportar categorias para CSV
export function exportCategoriesCSV(categories: Category[], filename: string = "categorias.csv") {
  const headers = ["id", "name", "color", "icon", "is_essential", "is_fixed"]
  const csv = arrayToCSV(categories, headers)
  downloadCSV(csv, filename)
}

// Exportar cartões para CSV
export function exportCardsCSV(cards: Card[], filename: string = "cartoes.csv") {
  const headers = ["id", "bank", "last_digits", "holder", "brand", "color", "credit_limit", "amount_used", "current_invoice", "due_day"]
  const csv = arrayToCSV(cards, headers)
  downloadCSV(csv, filename)
}

// Exportar metas para CSV
export function exportGoalsCSV(goals: Goal[], filename: string = "metas.csv") {
  const headers = ["id", "name", "target_amount", "current_amount", "color", "deadline", "priority", "monthly_target", "is_emergency_fund"]
  const csv = arrayToCSV(goals, headers)
  downloadCSV(csv, filename)
}

// Exportar resumo financeiro para CSV
export function exportFinancialSummaryCSV(summary: FinancialSummary, filename: string = "resumo-financeiro.csv") {
  const headers = ["totalIncome", "totalExpense", "balance", "month", "year"]
  const csv = arrayToCSV([summary], headers)
  downloadCSV(csv, filename)
}

// Exportar mês atual
export function exportMonthlyCSV(
  transactions: Transaction[],
  categories: Category[],
  cards: Card[],
  goals: Goal[],
  summary: FinancialSummary,
  month: string,
  year: number
) {
  const timestamp = new Date().toISOString().split("T")[0]
  
  exportTransactionsCSV(transactions, `transacoes-${month}-${year}-${timestamp}.csv`)
  exportCategoriesCSV(categories, `categorias-${month}-${year}-${timestamp}.csv`)
  exportCardsCSV(cards, `cartoes-${month}-${year}-${timestamp}.csv`)
  exportGoalsCSV(goals, `metas-${month}-${year}-${timestamp}.csv`)
  exportFinancialSummaryCSV(summary, `resumo-${month}-${year}-${timestamp}.csv`)
}

// Exportar ano atual
export function exportAnnualCSV(
  transactions: Transaction[],
  categories: Category[],
  cards: Card[],
  goals: Goal[],
  year: number
) {
  const timestamp = new Date().toISOString().split("T")[0]
  
  exportTransactionsCSV(transactions, `transacoes-ano-${year}-${timestamp}.csv`)
  exportCategoriesCSV(categories, `categorias-ano-${year}-${timestamp}.csv`)
  exportCardsCSV(cards, `cartoes-ano-${year}-${timestamp}.csv`)
  exportGoalsCSV(goals, `metas-ano-${year}-${timestamp}.csv`)
}
