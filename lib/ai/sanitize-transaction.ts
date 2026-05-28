import type { Transaction } from '@/lib/supabase/types'

export interface ParsedTransaction {
  type: "expense" | "income"
  amount: number
  description: string
  category_id: string | null
  payment_method: string | null
  card_id: string | null
  notes: string | null
  attachment_url: string | null
  transaction_date: string
  installments_total: number
  installment_current: number
  parent_installment_id: string | null
}

/**
 * Sanitizes a parsed transaction to match the exact schema expected by addTransaction()
 * Removes any invalid or non-existent fields before saving
 */
export function sanitizeTransactionPayload(
  transaction: ParsedTransaction,
  categoryId: string | null,
  paymentMethod: string
): Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at"> {
  const payload: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at"> = {
    type: transaction.type,
    amount: transaction.amount,
    category_id: categoryId,
    payment_method: paymentMethod,
    card_id: transaction.card_id,
    description: transaction.description,
    notes: transaction.notes,
    attachment_url: transaction.attachment_url,
    transaction_date: transaction.transaction_date,
    installments_total: transaction.installments_total,
    installment_current: transaction.installment_current,
    parent_installment_id: transaction.parent_installment_id,
    is_recurring: false,
    recurrence_frequency: null,
    recurrence_end_date: null,
    recurrence_count: null
  }

  console.log('[AI SANITIZE PAYLOAD]', payload)

  // Remove any undefined or null values (except category_id which can be null)
  const sanitized: any = {}
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined) {
      sanitized[key] = value
    }
  }

  console.log('[AI SANITIZED PAYLOAD]', sanitized)
  return sanitized
}

/**
 * Validates that a transaction has all required fields
 */
export function validateTransaction(transaction: ParsedTransaction): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!transaction.type || (transaction.type !== 'expense' && transaction.type !== 'income')) {
    errors.push('Tipo de transação inválido')
  }

  if (!transaction.amount || transaction.amount <= 0) {
    errors.push('Valor deve ser maior que zero')
  }

  if (!transaction.description || transaction.description.trim() === '') {
    errors.push('Descrição é obrigatória')
  }

  if (!transaction.transaction_date || transaction.transaction_date.trim() === '') {
    errors.push('Data da transação é obrigatória')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Formats the transaction date to ISO string
 */
export function formatTransactionDate(date?: string): string {
  if (!date) {
    return new Date().toISOString().split('T')[0]
  }

  try {
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      return new Date().toISOString().split('T')[0]
    }
    return parsedDate.toISOString().split('T')[0]
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

/**
 * Maps payment method names to the expected format
 */
export function normalizePaymentMethod(method: string | null): string {
  if (!method) return 'dinheiro'

  const normalized = method.toLowerCase().trim()

  const methodMap: Record<string, string> = {
    'credito': 'credito',
    'crédito': 'credito',
    'cartão de crédito': 'credito',
    'cartao de credito': 'credito',
    'cartão': 'credito',
    'cartao': 'credito',
    'debito': 'debito',
    'débito': 'debito',
    'cartão de débito': 'debito',
    'cartao de debito': 'debito',
    'pix': 'pix',
    'dinheiro': 'dinheiro',
    'cash': 'dinheiro',
    'transferência': 'transferencia',
    'transferencia': 'transferencia',
    'boleto': 'boleto'
  }

  return methodMap[normalized] || 'dinheiro'
}
