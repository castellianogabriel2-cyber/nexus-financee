import type { Transaction } from "@/lib/supabase/types"

export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly"

export interface RecurringTransaction {
  baseTransaction: Omit<Transaction, "id" | "created_at" | "updated_at">
  frequency: RecurrenceFrequency
  endDate?: string
  count?: number
}

export function generateRecurringTransactions(
  baseTransaction: Omit<Transaction, "id" | "created_at" | "updated_at">,
  frequency: RecurrenceFrequency,
  endDate?: string,
  count?: number
): Omit<Transaction, "id" | "created_at" | "updated_at">[] {
  const transactions: Omit<Transaction, "id" | "created_at" | "updated_at">[] = []
  const startDate = new Date(baseTransaction.transaction_date)
  const maxDate = endDate ? new Date(endDate) : null
  const maxCount = count || 12 // Default to 12 occurrences if no end date

  let currentDate = new Date(startDate)
  let generatedCount = 0

  while (generatedCount < maxCount) {
    // Check if we've exceeded the end date
    if (maxDate && currentDate > maxDate) {
      break
    }

    // Don't generate the first transaction (it's the base)
    if (generatedCount > 0) {
      transactions.push({
        ...baseTransaction,
        transaction_date: currentDate.toISOString().split("T")[0],
        installment_current: generatedCount + 1,
      })
    }

    // Calculate next date based on frequency
    switch (frequency) {
      case "daily":
        currentDate.setDate(currentDate.getDate() + 1)
        break
      case "weekly":
        currentDate.setDate(currentDate.getDate() + 7)
        break
      case "monthly":
        currentDate.setMonth(currentDate.getMonth() + 1)
        break
      case "yearly":
        currentDate.setFullYear(currentDate.getFullYear() + 1)
        break
    }

    generatedCount++
  }

  return transactions
}

export function getNextRecurringDate(
  lastDate: string,
  frequency: RecurrenceFrequency
): string {
  const date = new Date(lastDate)

  switch (frequency) {
    case "daily":
      date.setDate(date.getDate() + 1)
      break
    case "weekly":
      date.setDate(date.getDate() + 7)
      break
    case "monthly":
      date.setMonth(date.getMonth() + 1)
      break
    case "yearly":
      date.setFullYear(date.getFullYear() + 1)
      break
  }

  return date.toISOString().split("T")[0]
}

export function getRecurrenceLabel(frequency: RecurrenceFrequency): string {
  const labels = {
    daily: "Diária",
    weekly: "Semanal",
    monthly: "Mensal",
    yearly: "Anual",
  }
  return labels[frequency]
}

export function calculateInstallmentAmount(
  totalAmount: number,
  installmentsTotal: number
): number {
  return totalAmount / installmentsTotal
}

export function getInstallmentProgress(
  current: number,
  total: number
): number {
  return (current / total) * 100
}
