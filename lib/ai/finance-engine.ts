export interface FinanceData {
  totalGastos: number
  renda: number
  saldo: number
  categorias: Array<{
    name: string
    items: Array<{ value: number }>
    color: string
  }>
  goals: Array<{
    id: string
    name: string
    current: number
    target: number
    color: string
  }>
  transactions?: Array<{
    amount: number
    category: string
    date: string
  }>
}

export interface AIResponse {
  message: string
  type: 'insight' | 'answer' | 'suggestion' | 'warning'
  data?: any
}

export class FinanceEngine {
  constructor(private data: FinanceData) {}

  analyzeQuery(query: string): AIResponse {
    const lowerQuery = query.toLowerCase()

    // Perguntas sobre gastos
    if (lowerQuery.includes('gastei') || lowerQuery.includes('gastos')) {
      return this.handleExpenseQuery(lowerQuery)
    }

    // Perguntas sobre categoria
    if (lowerQuery.includes('categoria') || lowerQuery.includes('qual')) {
      return this.handleCategoryQuery(lowerQuery)
    }

    // Perguntas sobre saldo/sobra
    if (lowerQuery.includes('sobra') || lowerQuery.includes('saldo') || lowerQuery.includes('resta')) {
      return this.handleBalanceQuery(lowerQuery)
    }

    // Perguntas sobre metas
    if (lowerQuery.includes('meta') || lowerQuery.includes('objetivo')) {
      return this.handleGoalsQuery(lowerQuery)
    }

    // Perguntas sobre gastos por semana
    if (lowerQuery.includes('semana') || lowerQuery.includes('semanal')) {
      return this.handleWeeklyQuery(lowerQuery)
    }

    // Resumo geral
    if (lowerQuery.includes('resumo') || lowerQuery.includes('geral') || lowerQuery.includes('situação')) {
      return this.handleSummaryQuery()
    }

    // Padrão
    return this.handleDefaultQuery()
  }

  private handleExpenseQuery(query: string): AIResponse {
    const gastos = this.data.totalGastos
    const renda = this.data.renda
    const percentual = renda > 0 ? (gastos / renda) * 100 : 0

    return {
      type: 'answer',
      message: `Você gastou R$ ${gastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} este mês, o que representa ${percentual.toFixed(1)}% da sua renda de R$ ${renda.toLocaleString('pt-BR')}.`,
      data: { gastos, percentual }
    }
  }

  private handleCategoryQuery(query: string): AIResponse {
    console.log('[AI CATEGORIES DATA]', this.data.categorias)
    
    const categoryExpenses = this.data.categorias
      .filter(cat => cat.items.length > 0)
      .map(cat => ({
        name: cat.name,
        total: cat.items.reduce((sum, item) => sum + item.value, 0)
      }))
      .sort((a, b) => b.total - a.total)

    console.log('[AI CATEGORY EXPENSES]', categoryExpenses)

    if (categoryExpenses.length === 0) {
      return {
        type: 'answer',
        message: 'Você ainda não tem gastos registrados neste mês.'
      }
    }

    const topCategory = categoryExpenses[0]
    return {
      type: 'insight',
      message: `A categoria onde você mais gastou foi ${topCategory.name} com R$ ${topCategory.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
      data: { topCategory, allCategories: categoryExpenses }
    }
  }

  private handleBalanceQuery(query: string): AIResponse {
    const saldo = this.data.saldo
    const diasRestantes = this.getDaysRemainingInMonth()
    const saldoPorDia = diasRestantes > 0 ? saldo / diasRestantes : 0

    if (saldo < 0) {
      return {
        type: 'warning',
        message: `Você está R$ ${Math.abs(saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} no vermelho este mês. Recomendo revisar seus gastos.`,
        data: { saldo, diasRestantes }
      }
    }

    return {
      type: 'answer',
      message: `Você tem R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de sobra este mês. Com ${diasRestantes} dias restantes, isso equivale a R$ ${saldoPorDia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por dia.`,
      data: { saldo, diasRestantes, saldoPorDia }
    }
  }

  private handleGoalsQuery(query: string): AIResponse {
    if (this.data.goals.length === 0) {
      return {
        type: 'suggestion',
        message: 'Você ainda não tem metas financeiras cadastradas. Que tal definir uma meta para economizar?'
      }
    }

    const goal = this.data.goals[0]
    const progress = (goal.current / goal.target) * 100
    const remaining = goal.target - goal.current

    return {
      type: 'insight',
      message: `Sua meta "${goal.name}" está ${progress.toFixed(0)}% completa. Você já economizou R$ ${goal.current.toLocaleString('pt-BR')} e faltam R$ ${remaining.toLocaleString('pt-BR')} para alcançar R$ ${goal.target.toLocaleString('pt-BR')}.`,
      data: { goal, progress, remaining }
    }
  }

  private handleWeeklyQuery(query: string): AIResponse {
    const gastos = this.data.totalGastos
    const semanasNoMes = 4
    const gastoSemanal = gastos / semanasNoMes

    return {
      type: 'answer',
      message: `Você está gastando em média R$ ${gastoSemanal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por semana este mês.`,
      data: { gastoSemanal, gastos }
    }
  }

  private handleSummaryQuery(): AIResponse {
    const gastos = this.data.totalGastos
    const renda = this.data.renda
    const saldo = this.data.saldo
    const percentualGastos = renda > 0 ? (gastos / renda) * 100 : 0

    let status = 'saudável'
    if (percentualGastos > 90) status = 'crítico'
    else if (percentualGastos > 75) status = 'atenção'
    else if (percentualGastos > 50) status = 'moderado'

    return {
      type: 'insight',
      message: `📊 Resumo Financeiro:\n\n• Renda: R$ ${renda.toLocaleString('pt-BR')}\n• Gastos: R$ ${gastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${percentualGastos.toFixed(1)}%)\n• Sobra: R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n• Status: ${status.toUpperCase()}`,
      data: { gastos, renda, saldo, percentualGastos, status }
    }
  }

  private handleDefaultQuery(): AIResponse {
    const suggestions = [
      'Quanto gastei esse mês?',
      'Qual categoria gasto mais?',
      'Quanto sobra até o fim do mês?',
      'Quanto estou gastando por semana?',
      'Como está minha meta de economia?',
      'Me dê um resumo das minhas finanças'
    ]

    return {
      type: 'suggestion',
      message: `Posso ajudar você com suas finanças! Aqui estão algumas perguntas que você pode fazer:\n\n${suggestions.map(s => `• ${s}`).join('\n')}`,
      data: { suggestions }
    }
  }

  private getDaysRemainingInMonth(): number {
    const now = new Date()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const daysRemaining = endOfMonth.getDate() - now.getDate()
    return Math.max(0, daysRemaining)
  }

  generateInsights(): AIResponse[] {
    const insights: AIResponse[] = []

    // Insight 1: Gastos vs Renda
    const percentualGastos = this.data.renda > 0 ? (this.data.totalGastos / this.data.renda) * 100 : 0
    if (percentualGastos > 80) {
      insights.push({
        type: 'warning',
        message: `⚠️ Seus gastos representam ${percentualGastos.toFixed(1)}% da sua renda. Considere reduzir despesas não essenciais.`
      })
    }

    // Insight 2: Categoria principal
    const topCategory = this.data.categorias
      .filter(cat => cat.items.length > 0)
      .map(cat => ({
        name: cat.name,
        total: cat.items.reduce((sum, item) => sum + item.value, 0)
      }))
      .sort((a, b) => b.total - a.total)[0]

    if (topCategory) {
      insights.push({
        type: 'insight',
        message: `💡 Sua maior despesa é ${topCategory.name} com R$ ${topCategory.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`
      })
    }

    // Insight 3: Metas
    if (this.data.goals.length > 0) {
      const goal = this.data.goals[0]
      const progress = (goal.current / goal.target) * 100
      if (progress < 50) {
        insights.push({
          type: 'suggestion',
          message: `🎯 Sua meta "${goal.name}" está apenas ${progress.toFixed(0)}% completa. Aumente seus depósitos para alcançá-la mais rápido!`
        })
      }
    }

    return insights
  }
}
