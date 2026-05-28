// Re-export from new modular architecture
export { detectIntent } from './intent-detector'
export { detectCategory, getCategoryConfidence } from './category-engine'
export { 
  sanitizeTransactionPayload, 
  validateTransaction, 
  formatTransactionDate, 
  normalizePaymentMethod 
} from './sanitize-transaction'

import type { ParsedTransaction } from './sanitize-transaction'

export type { ParsedTransaction }

export interface ParseResult {
  success: boolean
  confidence: number
  transaction?: ParsedTransaction
  missingFields?: string[]
  summary?: string
}

/**
 * Robust parser for financial commands in natural language
 * Now uses the new modular architecture
 */
export function parseFinancialCommand(message: string): ParseResult {
  console.log('[AI PARSE COMMAND]', message)
  
  const { detectIntent } = require('./intent-detector')
  const { detectCategory } = require('./category-engine')
  const { formatTransactionDate, normalizePaymentMethod } = require('./sanitize-transaction')
  
  const intent = detectIntent(message)
  console.log('[AI PARSE INTENT]', intent)

  // If not a create transaction intent, return early
  if (intent !== 'create_expense' && intent !== 'create_income') {
    return {
      success: false,
      confidence: 0,
      summary: 'Not a transaction creation command'
    }
  }

  const lowerMessage = message.toLowerCase()
  
  // Determine transaction type
  const transactionType: 'expense' | 'income' = intent === 'create_income' ? 'income' : 'expense'
  
  // Extract amount
  const amount = extractAmount(lowerMessage)
  if (!amount || amount <= 0) {
    return {
      success: false,
      confidence: 0,
      missingFields: ['amount'],
      summary: 'Could not extract amount'
    }
  }

  // Extract description
  const description = extractDescription(lowerMessage, transactionType)
  
  // Detect category
  const categoryDetection = detectCategory(message)
  console.log('[AI CATEGORY DETECTED]', categoryDetection)
  
  // Store category name for later mapping to category_id
  const categoryName = categoryDetection.category
  
  // Detect payment method
  const paymentMethod = detectPaymentMethod(lowerMessage)
  
  // Detect installments
  const installments = extractInstallments(lowerMessage)
  
  // Format date
  const transactionDate = formatTransactionDate()

  const transaction: ParsedTransaction = {
    type: transactionType,
    amount,
    description,
    category_id: categoryName, // Store category name for later mapping to category_id
    payment_method: normalizePaymentMethod(paymentMethod),
    card_id: null,
    notes: null,
    attachment_url: null,
    transaction_date: transactionDate,
    installments_total: installments.total,
    installment_current: installments.current,
    parent_installment_id: null
  }

  console.log('[AI PARSED TRANSACTION]', transaction)

  return {
    success: true,
    confidence: 0.85,
    transaction,
    summary: `${transactionType === 'expense' ? 'Gasto' : 'Receita'} de R$ ${amount.toFixed(2)} em ${description}, categoria ${categoryName}`
  }
}

/**
 * Extracts amount from message
 * Handles formats: "29,90", "29.90", "R$ 29,90", "29 reais", etc.
 */
function extractAmount(message: string): number | null {
  console.log('[AI EXTRACT AMOUNT]', message)
  
  // Remove currency symbols and spaces
  const cleaned = message
    .replace(/[r$]/gi, '')
    .replace(/reais/gi, '')
    .replace(/\s/g, '')
    .replace(/,/g, '.') // Replace comma with dot for parsing
  
  // Find numbers
  const numberPattern = /(\d+\.?\d*)/
  const match = cleaned.match(numberPattern)
  
  if (!match) {
    console.log('[AI EXTRACT AMOUNT FAILED]', 'No number found')
    return null
  }
  
  const amount = parseFloat(match[1])
  console.log('[AI EXTRACTED AMOUNT]', amount)
  return amount
}

/**
 * Extracts description from message
 * Removes amount, payment method, and other transaction metadata
 */
function extractDescription(message: string, type: 'expense' | 'income'): string {
  console.log('[AI EXTRACT DESCRIPTION]', { message, type })
  
  let description = message
  
  // Remove amount
  description = description.replace(/r?\$?\s*\d+[,.]?\d*/gi, '')
  description = description.replace(/\d+[,.]?\d*/g, '')
  
  // Remove common transaction verbs
  const verbs = type === 'expense' 
    ? ['gastei', 'comprei', 'paguei', 'pague', 'gastar', 'comprar', 'pagar', 'gasto', 'compra', 'pagamento']
    : ['recebi', 'ganhei', 'entrou', 'receber', 'ganhar', 'receita', 'renda', 'salário']
  
  verbs.forEach(verb => {
    description = description.replace(new RegExp(verb, 'gi'), '')
  })
  
  // Remove payment method keywords
  const paymentKeywords = ['no', 'na', 'com', 'em', 'no cartão', 'no cartao', 'no pix', 'via pix', 'no débito', 'no debito']
  paymentKeywords.forEach(keyword => {
    description = description.replace(new RegExp(keyword, 'gi'), '')
  })
  
  // Clean up
  description = description.trim()
  
  // If empty, use category as fallback
  if (!description) {
    description = type === 'expense' ? 'Despesa' : 'Receita'
  }
  
  console.log('[AI EXTRACTED DESCRIPTION]', description)
  return description
}

/**
 * Detects payment method from message
 */
function detectPaymentMethod(message: string): string | null {
  console.log('[AI DETECT PAYMENT METHOD]', message)
  
  const paymentMap: Record<string, string> = {
    'pix': 'pix',
    'crédito': 'credito',
    'credito': 'credito',
    'cartão': 'credito',
    'cartao': 'credito',
    'débito': 'debito',
    'debito': 'debito',
    'dinheiro': 'dinheiro',
    'cash': 'dinheiro'
  }
  
  for (const [keyword, method] of Object.entries(paymentMap)) {
    if (message.includes(keyword)) {
      console.log('[AI DETECTED PAYMENT METHOD]', method)
      return method
    }
  }
  
  console.log('[AI PAYMENT METHOD DEFAULT]', 'dinheiro')
  return 'dinheiro'
}

/**
 * Extracts installments information
 * Handles formats: "em 10x", "10x", "parcelado em 10"
 */
function extractInstallments(message: string): { total: number; current: number } {
  console.log('[AI EXTRACT INSTALLMENTS]', message)
  
  const installmentPattern = /(\d+)x/i
  const match = message.match(installmentPattern)
  
  if (match) {
    const total = parseInt(match[1])
    console.log('[AI EXTRACTED INSTALLMENTS]', { total, current: 1 })
    return { total, current: 1 }
  }
  
  console.log('[AI NO INSTALLMENTS]')
  return { total: 1, current: 1 }
}
