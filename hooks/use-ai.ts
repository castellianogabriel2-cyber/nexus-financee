import { useState, useCallback, useRef, useEffect } from 'react'
import { useFinance } from '@/providers/finance-provider'
import { FinanceEngine, FinanceData, AIResponse } from '@/lib/ai/finance-engine'
import { parseFinancialCommand, ParsedTransaction, detectIntent } from '@/lib/ai/transaction-parser'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  type?: 'insight' | 'answer' | 'suggestion' | 'warning' | 'confirmation'
  timestamp: Date
  data?: any
  parsedTransaction?: ParsedTransaction
}

export function useAI() {
  const { renda, totalGastos, saldo, categorias, goalsData, refresh, addTransaction, cardsData, categories: allCategories, loading, transactions } = useFinance()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [pendingTransaction, setPendingTransaction] = useState<ParsedTransaction | null>(null)
  const engineRef = useRef<FinanceEngine | null>(null)

  // Sanitize transaction payload to match exactly what Nova Transação sends
  const sanitizeTransactionPayload = (transaction: ParsedTransaction, categoryId: string | null, paymentMethod: string) => {
    const payload = {
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
    }

    // Remove any undefined or null values (except category_id which can be null)
    const sanitized: any = {}
    for (const [key, value] of Object.entries(payload)) {
      if (value !== undefined) {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  const initializeEngine = useCallback(() => {
    // Filter transactions for current month expenses only
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const monthExpenses = transactions.filter(t => {
      const txDate = new Date(t.transaction_date + "T12:00:00")
      return t.type === "expense" && 
             txDate.getMonth() === currentMonth && 
             txDate.getFullYear() === currentYear
    })

    console.log('[AI FINANCE DATA]', { totalGastos, renda, saldo, categorias, goalsData })
    console.log('[AI MONTHLY EXPENSES]', monthExpenses)
    console.log('[AI CATEGORIES RAW]', categorias)

    // Group expenses by category
    const categoryGroups: Record<string, number> = {}
    monthExpenses.forEach(t => {
      const catId = t.category_id || 'uncategorized'
      categoryGroups[catId] = (categoryGroups[catId] || 0) + Number(t.amount)
    })
    console.log('[AI CATEGORY GROUPS]', categoryGroups)

    const financeData: FinanceData = {
      totalGastos,
      renda,
      saldo,
      categorias,
      goals: goalsData,
      transactions: monthExpenses.map(t => ({
        amount: Number(t.amount),
        category: t.category_id || "",
        date: t.transaction_date
      }))
    }
    console.log('[AI ENGINE DATA]', financeData)
    console.log('[AI TRANSACTIONS]', transactions)
    console.log('[AI EXPENSES]', monthExpenses)
    engineRef.current = new FinanceEngine(financeData)
  }, [totalGastos, renda, saldo, categorias, goalsData, transactions])

  // Re-initialize engine whenever data changes
  useEffect(() => {
    initializeEngine()
  }, [initializeEngine])

  // Show initial message when chat opens for the first time
  useEffect(() => {
    if (messages.length === 0 && !loading) {
      const initialMessage: Message = {
        id: 'initial',
        role: 'assistant',
        content: 'Olá, eu sou o Nexus. Posso registrar gastos, receitas e te ajudar a entender suas finanças. Escreva algo como: "gastei 50 no mercado" ou "quanto gastei esse mês?"',
        type: 'answer',
        timestamp: new Date()
      }
      setMessages([initialMessage])
    }
  }, [loading, messages.length])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    // Initialize engine if not already
    if (!engineRef.current) {
      initializeEngine()
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    // Show typing indicator
    setIsTyping(true)
    setIsLoading(true)

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))

    // Detect intent first
    const intent = detectIntent(content)
    console.log('[AI INTENT]', intent)

    // Handle greeting
    if (intent === 'greeting') {
      const greetingMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Olá, tudo bem? Eu sou o Nexus, seu assistente financeiro. Posso te ajudar a registrar gastos, receitas, analisar seu mês, ver categorias, metas e saldo. O que você quer fazer hoje?',
        type: 'answer',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, greetingMessage])
      setIsTyping(false)
      setIsLoading(false)
      return
    }

    // Handle small talk
    if (intent === 'small_talk') {
      const smallTalkMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Eu sou o Nexus, seu assistente financeiro. Posso registrar gastos e receitas, mostrar relatórios do mês, categorias, metas e saldo. Escreva algo como "gastei 50 no mercado" ou "quanto gastei esse mês?"',
        type: 'answer',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, smallTalkMessage])
      setIsTyping(false)
      setIsLoading(false)
      return
    }

    // Handle help
    if (intent === 'help') {
      const helpMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Posso ajudar você com:\n\n• Registrar gastos: "gastei 50 no mercado"\n• Registrar receitas: "recebi 1200 de cliente"\n• Ver gastos do mês: "quanto gastei esse mês?"\n• Ver categorias: "qual categoria gastei mais?"\n• Ver saldo: "quanto sobra?"\n• Ver metas: "como estão minhas metas?"\n• Resumo geral: "resumo do mês"',
        type: 'answer',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, helpMessage])
      setIsTyping(false)
      setIsLoading(false)
      return
    }

    // If data is still loading, inform the user
    if (loading && (intent === 'report' || intent === 'question')) {
      const loadingMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Estou carregando seus dados financeiros. Tente novamente em alguns segundos.',
        type: 'suggestion',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, loadingMessage])
      setIsTyping(false)
      setIsLoading(false)
      return
    }

    // If it's a report or question, use the finance engine to answer
    if (intent === 'report' || intent === 'question') {
      if (engineRef.current) {
        const response: AIResponse = engineRef.current.analyzeQuery(content)

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.message,
          type: response.type,
          timestamp: new Date(),
          data: response.data
        }

        setMessages(prev => [...prev, assistantMessage])
        setIsTyping(false)
        setIsLoading(false)
        return
      }
    }

    // If it's an insight, generate insights
    if (intent === 'insight') {
      if (engineRef.current) {
        const insights = engineRef.current.generateInsights()
        
        const insightMessages: Message[] = insights.map((insight, index) => ({
          id: (Date.now() + index).toString(),
          role: 'assistant',
          content: insight.message,
          type: insight.type,
          timestamp: new Date(),
          data: insight.data
        }))

        setMessages(prev => [...prev, ...insightMessages])
        setIsTyping(false)
        setIsLoading(false)
        return
      }
    }

    // Only parse as transaction if intent is create_transaction or unknown
    if (intent === 'create_transaction' || intent === 'unknown') {
      const parseResult = parseFinancialCommand(content)
      
      if (parseResult.success && parseResult.transaction) {
        console.log('[AI PARSED]', parseResult.transaction)
        
        setPendingTransaction(parseResult.transaction)
        
        const confirmationMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: parseResult.summary || 'Entendi. Posso salvar?',
          type: 'confirmation',
          timestamp: new Date(),
          parsedTransaction: parseResult.transaction
        }
        
        setMessages(prev => [...prev, confirmationMessage])
        setIsTyping(false)
        setIsLoading(false)
        return
      }
      
      // If parsing failed due to missing fields, ask for them
      if (!parseResult.success && parseResult.missingFields && parseResult.missingFields.length > 0) {
        const missingFieldsText = parseResult.missingFields.join(', ')
        const questionMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Preciso de mais informações. ${missingFieldsText.charAt(0).toUpperCase() + missingFieldsText.slice(1)}. Por favor, forneça esses detalhes.`,
          type: 'suggestion',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, questionMessage])
        setIsTyping(false)
        setIsLoading(false)
        return
      }
    }

    // Check if user is confirming a pending transaction with text
    if (pendingTransaction) {
      const lowerContent = content.toLowerCase()
      const confirmKeywords = ['sim', 'pode', 'confirma', 'salvar', 'ok', 'yes', 'confirmar']
      const cancelKeywords = ['não', 'nao', 'cancela', 'cancelar', 'no', 'n']
      
      if (confirmKeywords.some(keyword => lowerContent.includes(keyword))) {
        await confirmTransaction()
        return
      }
      
      if (cancelKeywords.some(keyword => lowerContent.includes(keyword))) {
        cancelTransaction()
        return
      }
    }

    // Generate regular response
    if (engineRef.current) {
      const response: AIResponse = engineRef.current.analyzeQuery(content)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        type: response.type,
        timestamp: new Date(),
        data: response.data
      }

      setMessages(prev => [...prev, assistantMessage])
    }

    setIsTyping(false)
    setIsLoading(false)
  }, [initializeEngine])

  const confirmTransaction = useCallback(async () => {
    if (!pendingTransaction) return

    setIsLoading(true)

    try {
      console.log('[AI SAVE START]', pendingTransaction)
      
      // Map category name to category_id
      const category = allCategories.find(cat => 
        cat.name.toLowerCase() === pendingTransaction.category_id?.toLowerCase() || ''
      )
      const categoryId = category?.id || null

      // Map payment method to the format expected by addTransaction
      const paymentMethodMap: Record<string, string> = {
        'credit_card': 'credito',
        'debit_card': 'debito',
        'pix': 'pix',
        'cash': 'dinheiro',
        'bank_transfer': 'transferencia',
        'unknown': 'dinheiro'
      }
      const paymentMethod = paymentMethodMap[pendingTransaction.payment_method || 'unknown'] || 'dinheiro'

      // Sanitize transaction to match exactly what Nova Transação sends
      const sanitizedTransaction = sanitizeTransactionPayload(pendingTransaction, categoryId, paymentMethod)

      console.log('[AI SAVE PAYLOAD]', sanitizedTransaction)

      // Use the same addTransaction function from useFinance (same as Nova Transação page)
      const { error } = await addTransaction(sanitizedTransaction)

      console.log('[AI SAVE RESULT]', { error })

      if (error) {
        console.error('[AI SAVE ERROR]', error)
        throw new Error(error)
      }

      console.log('[AI SAVE SUCCESS]')

      // Refresh financial data to update dashboard, gastos, carteira, cartões
      await refresh()

      // Show success message
      const successMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '✅ Transação salva com sucesso!',
        type: 'answer',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, successMessage])

    } catch (error) {
      console.error('[AI SAVE ERROR]', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Erro ao salvar: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Tente novamente.`,
        type: 'warning',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setPendingTransaction(null)
    setIsLoading(false)
  }, [pendingTransaction, addTransaction, allCategories, refresh])

  const editTransaction = useCallback(() => {
    // For now, just cancel and let user re-type
    setPendingTransaction(null)
    
    const editMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Por favor, reescreva o comando com mais detalhes.',
      type: 'suggestion',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, editMessage])
  }, [])

  const cancelTransaction = useCallback(() => {
    setPendingTransaction(null)
    
    const cancelMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Cancelado.',
      type: 'answer',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, cancelMessage])
  }, [])

  const generateInsights = useCallback(() => {
    if (!engineRef.current) {
      initializeEngine()
    }

    if (engineRef.current) {
      const insights = engineRef.current.generateInsights()
      
      const insightMessages: Message[] = insights.map((insight, index) => ({
        id: (Date.now() + index).toString(),
        role: 'assistant',
        content: insight.message,
        type: insight.type,
        timestamp: new Date(),
        data: insight.data
      }))

      setMessages(prev => [...prev, ...insightMessages])
    }
  }, [initializeEngine])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    isTyping,
    pendingTransaction,
    sendMessage,
    generateInsights,
    clearMessages,
    confirmTransaction,
    editTransaction,
    cancelTransaction
  }
}
