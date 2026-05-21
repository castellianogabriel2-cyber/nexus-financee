import type { Transaction, Category, Profile, Card } from "@/lib/supabase/types"
import { computeMonthExpenses, computeMonthIncome, computeSaldo, isCurrentMonth } from "./compute"

export type FinancialScore = {
  overall: number
  spending: number
  saving: number
  consistency: number
  category: "excelente" | "bom" | "regular" | "precisa-melhorar"
}

export type SpendingPrediction = {
  nextMonth: number
  next3Months: number
  next6Months: number
  trend: "increasing" | "decreasing" | "stable"
  confidence: number
}

export type BehaviorAnalysis = {
  spendingPattern: "consistent" | "volatile" | "increasing" | "decreasing"
  topCategories: { category: string; amount: number; percentage: number }[]
  averageDailySpend: number
  peakSpendingDay: number
  deliverySpend: number
  deliverySavingsPotential: number
}

export type FinancialAlert = {
  id: string
  type: "warning" | "info" | "success" | "error"
  title: string
  message: string
  value?: number
  actionable: boolean
}

export type EconomyProjection = {
  currentMonthlySave: number
  potentialMonthlySave: number
  annualProjection: number
  savingsOpportunities: {
    category: string
    currentSpend: number
    recommendedReduce: number
    potentialSave: number
  }[]
}

export type CardProjection = {
  cardId: string
  cardName: string
  currentBalance: number
  nextMonthProjection: number
  dueDate: string
  projectedPayment: number
  interestProjection: number
}

export type WeeklyAnalysis = {
  weekNumber: number
  totalSpent: number
  averageDaily: number
  topCategory: string
  comparedToAverage: number
  trend: "up" | "down" | "stable"
}

export type MonthlyAnalysis = {
  month: string
  income: number
  expenses: number
  balance: number
  savingsRate: number
  topExpenseCategory: string
  comparedToPrevious: number
}

export function computeFinancialScore(
  transactions: Transaction[],
  profile: Profile | null
): FinancialScore {
  const income = Number(profile?.monthly_income ?? 0)
  const expenses = computeMonthExpenses(transactions)
  const balance = computeSaldo(profile, transactions)
  
  // Spending score (0-100)
  const spendingRatio = income > 0 ? (expenses / income) * 100 : 0
  let spendingScore = 100
  if (spendingRatio > 100) spendingScore = 0
  else if (spendingRatio > 80) spendingScore = 40
  else if (spendingRatio > 60) spendingScore = 60
  else if (spendingRatio > 40) spendingScore = 80
  else spendingScore = 100
  
  // Saving score (0-100)
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
  let savingScore = Math.min(100, savingsRate * 2)
  
  // Consistency score (0-100)
  const thisMonthTransactions = transactions.filter(t => isCurrentMonth(t.transaction_date))
  const dailyAverage = thisMonthTransactions.length > 0 
    ? thisMonthTransactions.length / 30 
    : 0
  const consistencyScore = Math.min(100, dailyAverage * 10)
  
  const overall = Math.round((spendingScore + savingScore + consistencyScore) / 3)
  
  let category: FinancialScore["category"] = "excelente"
  if (overall >= 80) category = "excelente"
  else if (overall >= 60) category = "bom"
  else if (overall >= 40) category = "regular"
  else category = "precisa-melhorar"
  
  return {
    overall,
    spending: Math.round(spendingScore),
    saving: Math.round(savingScore),
    consistency: Math.round(consistencyScore),
    category,
  }
}

export function predictSpending(transactions: Transaction[]): SpendingPrediction {
  const last3Months = transactions.filter(t => {
    const date = new Date(t.transaction_date)
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    return date >= threeMonthsAgo
  })
  
  const monthlySpending: number[] = []
  for (let i = 0; i < 3; i++) {
    const monthDate = new Date()
    monthDate.setMonth(monthDate.getMonth() - i)
    const monthExpenses = last3Months.filter(t => {
      const tDate = new Date(t.transaction_date)
      return tDate.getMonth() === monthDate.getMonth() && tDate.getFullYear() === monthDate.getFullYear()
    })
    monthlySpending.push(monthExpenses.reduce((sum, t) => sum + Number(t.amount), 0))
  }
  
  const average = monthlySpending.reduce((a, b) => a + b, 0) / monthlySpending.length
  const trend = monthlySpending[0] > monthlySpending[1] ? "increasing" : monthlySpending[0] < monthlySpending[1] ? "decreasing" : "stable"
  const confidence = monthlySpending.length >= 3 ? 85 : 60
  
  return {
    nextMonth: Math.round(average),
    next3Months: Math.round(average * 3),
    next6Months: Math.round(average * 6),
    trend,
    confidence,
  }
}

export function analyzeBehavior(
  transactions: Transaction[],
  categories: Category[]
): BehaviorAnalysis {
  const thisMonthTransactions = transactions.filter(t => isCurrentMonth(t.transaction_date))
  const totalSpent = thisMonthTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
  
  // Top categories
  const categorySpending = new Map<string, number>()
  thisMonthTransactions.forEach(t => {
    const catId = t.category_id || "outros"
    categorySpending.set(catId, (categorySpending.get(catId) || 0) + Number(t.amount))
  })
  
  const topCategories = Array.from(categorySpending.entries())
    .map(([catId, amount]) => {
      const category = categories.find(c => c.id === catId)
      return {
        category: category?.name || "Outros",
        amount,
        percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
      }
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
  
  // Average daily spend
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const averageDailySpend = totalSpent / daysInMonth
  
  // Peak spending day
  const daySpending = new Map<number, number>()
  thisMonthTransactions.forEach(t => {
    const day = new Date(t.transaction_date).getDate()
    daySpending.set(day, (daySpending.get(day) || 0) + Number(t.amount))
  })
  const peakSpendingDay = Array.from(daySpending.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 1
  
  // Delivery spending
  const deliveryCat = categories.find(c => c.slug === "delivery")
  const deliverySpend = deliveryCat 
    ? thisMonthTransactions.filter(t => t.category_id === deliveryCat.id).reduce((sum, t) => sum + Number(t.amount), 0)
    : 0
  
  const deliverySavingsPotential = deliverySpend * 0.3 // 30% savings potential
  
  // Spending pattern
  const weeklySpending: number[] = []
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - (i * 7))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)
    
    const weekTotal = thisMonthTransactions.filter(t => {
      const tDate = new Date(t.transaction_date)
      return tDate >= weekStart && tDate <= weekEnd
    }).reduce((sum, t) => sum + Number(t.amount), 0)
    
    weeklySpending.push(weekTotal)
  }
  
  const avgWeekly = weeklySpending.reduce((a, b) => a + b, 0) / weeklySpending.length
  const variance = weeklySpending.reduce((sum, val) => sum + Math.pow(val - avgWeekly, 2), 0) / weeklySpending.length
  const stdDev = Math.sqrt(variance)
  
  let spendingPattern: BehaviorAnalysis["spendingPattern"] = "consistent"
  if (stdDev > avgWeekly * 0.5) spendingPattern = "volatile"
  else if (weeklySpending[0] > weeklySpending[1] && weeklySpending[1] > weeklySpending[2]) spendingPattern = "increasing"
  else if (weeklySpending[0] < weeklySpending[1] && weeklySpending[1] < weeklySpending[2]) spendingPattern = "decreasing"
  
  return {
    spendingPattern,
    topCategories,
    averageDailySpend,
    peakSpendingDay,
    deliverySpend,
    deliverySavingsPotential,
  }
}

export function generateFinancialAlerts(
  transactions: Transaction[],
  categories: Category[],
  profile: Profile | null,
  cards: Card[]
): FinancialAlert[] {
  const alerts: FinancialAlert[] = []
  const income = Number(profile?.monthly_income ?? 0)
  const expenses = computeMonthExpenses(transactions)
  const balance = computeSaldo(profile, transactions)
  const behavior = analyzeBehavior(transactions, categories)
  const prediction = predictSpending(transactions)
  
  // Alert: Spending above average
  if (behavior.spendingPattern === "increasing") {
    alerts.push({
      id: "spending-increasing",
      type: "warning",
      title: "Gastos em alta",
      message: "Seus gastos têm aumentado nas últimas semanas. Fique atento para manter o controle.",
      actionable: true,
    })
  }
  
  // Alert: Delivery spending
  if (behavior.deliverySpend > 200) {
    alerts.push({
      id: "delivery-high",
      type: "warning",
      title: "Gastos com delivery",
      message: `Você gastou R$ ${behavior.deliverySpend.toFixed(0)} em delivery este mês. Considere cozinhar em casa para economizar R$ ${behavior.deliverySavingsPotential.toFixed(0)}.`,
      value: behavior.deliverySavingsPotential,
      actionable: true,
    })
  }
  
  // Alert: Emergency reserve
  const emergencyReserve = Number(profile?.emergency_reserve_current ?? 0)
  const monthlyExpenses = expenses
  const reserveMonths = monthlyExpenses > 0 ? emergencyReserve / monthlyExpenses : 0
  
  if (reserveMonths < 3) {
    alerts.push({
      id: "reserve-low",
      type: "warning",
      title: "Reserva de emergência baixa",
      message: `Sua reserva atual dura ${reserveMonths.toFixed(1)} meses. O ideal é ter pelo menos 6 meses de gastos cobertos.`,
      actionable: true,
    })
  } else if (reserveMonths >= 6) {
    alerts.push({
      id: "reserve-good",
      type: "success",
      title: "Reserva saudável",
      message: `Sua reserva cobre ${reserveMonths.toFixed(1)} meses de gastos. Parabéns!`,
      actionable: false,
    })
  }
  
  // Alert: Spending above income
  if (expenses > income && income > 0) {
    const percentage = ((expenses - income) / income) * 100
    alerts.push({
      id: "spending-exceeds-income",
      type: "error",
      title: "Gastos acima da renda",
      message: `Você gastou ${percentage.toFixed(0)}% acima da sua renda este mês. Considere ativar o Modo Aperto.`,
      value: percentage,
      actionable: true,
    })
  }
  
  // Alert: Card payment due
  const today = new Date()
  cards.forEach(card => {
    if (card.due_day) {
      const dueDate = new Date(today.getFullYear(), today.getMonth(), card.due_day)
      if (dueDate < today) {
        dueDate.setMonth(dueDate.getMonth() + 1)
      }
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilDue <= 7 && daysUntilDue > 0) {
        alerts.push({
          id: `card-due-${card.id}`,
          type: "warning",
          title: `Fatura vence em ${daysUntilDue} dias`,
          message: `A fatura do cartão ${card.bank} vence em breve. Prepare-se para o pagamento.`,
          actionable: true,
        })
      } else if (daysUntilDue <= 0 && daysUntilDue > -7) {
        alerts.push({
          id: `card-overdue-${card.id}`,
          type: "error",
          title: `Fatura vencida`,
          message: `A fatura do cartão ${card.bank} venceu há ${Math.abs(daysUntilDue)} dias. Pague o quanto antes para evitar juros.`,
          actionable: true,
        })
      }
    }
  })
  
  return alerts
}

export function projectEconomy(
  transactions: Transaction[],
  categories: Category[],
  profile: Profile | null
): EconomyProjection {
  const income = Number(profile?.monthly_income ?? 0)
  const expenses = computeMonthExpenses(transactions)
  const currentMonthlySave = Math.max(0, income - expenses)
  const behavior = analyzeBehavior(transactions, categories)
  
  // Savings opportunities
  const savingsOpportunities = behavior.topCategories
    .filter(cat => cat.percentage > 10)
    .map(cat => ({
      category: cat.category,
      currentSpend: cat.amount,
      recommendedReduce: cat.amount * 0.2, // 20% reduction
      potentialSave: cat.amount * 0.2,
    }))
  
  const potentialMonthlySave = currentMonthlySave + savingsOpportunities.reduce((sum, opp) => sum + opp.potentialSave, 0)
  
  return {
    currentMonthlySave,
    potentialMonthlySave,
    annualProjection: potentialMonthlySave * 12,
    savingsOpportunities,
  }
}

export function projectCardPayments(
  transactions: Transaction[],
  cards: Card[]
): CardProjection[] {
  const projections: CardProjection[] = []
  
  cards.forEach(card => {
    const cardTransactions = transactions.filter(t => t.card_id === card.id)
    const currentBalance = cardTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
    
    // Estimate next month based on current spending
    const thisMonthCardSpending = cardTransactions.filter(t => isCurrentMonth(t.transaction_date))
      .reduce((sum, t) => sum + Number(t.amount), 0)
    
    const nextMonthProjection = currentBalance + thisMonthCardSpending
    const interestRate = 0.05 // 5% monthly interest
    const interestProjection = nextMonthProjection * interestRate
    
    // Calculate due date from due_day
    const today = new Date()
    const dueDate = new Date(today.getFullYear(), today.getMonth(), card.due_day)
    if (dueDate < today) {
      dueDate.setMonth(dueDate.getMonth() + 1)
    }
    
    projections.push({
      cardId: card.id,
      cardName: card.bank,
      currentBalance,
      nextMonthProjection,
      dueDate: dueDate.toISOString().split('T')[0],
      projectedPayment: nextMonthProjection,
      interestProjection,
    })
  })
  
  return projections
}

export function analyzeWeeklySpending(transactions: Transaction[]): WeeklyAnalysis[] {
  const analyses: WeeklyAnalysis[] = []
  const today = new Date()
  
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - (i * 7) - 7)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Start of week
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6) // End of week
    
    const weekTransactions = transactions.filter(t => {
      const tDate = new Date(t.transaction_date)
      return tDate >= weekStart && tDate <= weekEnd && t.type === "expense"
    })
    
    const totalSpent = weekTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
    const averageDaily = totalSpent / 7
    
    // Find top category
    const categorySpending = new Map<string, number>()
    weekTransactions.forEach(t => {
      const catId = t.category_id || "outros"
      categorySpending.set(catId, (categorySpending.get(catId) || 0) + Number(t.amount))
    })
    const topCategory = Array.from(categorySpending.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "outros"
    
    // Compare to average
    const allWeeks = analyzeWeeklySpending(transactions)
    const avgSpending = allWeeks.length > 0 
      ? allWeeks.reduce((sum, w) => sum + w.totalSpent, 0) / allWeeks.length 
      : totalSpent
    const comparedToAverage = avgSpending > 0 ? ((totalSpent - avgSpending) / avgSpending) * 100 : 0
    
    // Trend
    const prevWeekStart = new Date(weekStart)
    prevWeekStart.setDate(prevWeekStart.getDate() - 7)
    const prevWeekEnd = new Date(prevWeekStart)
    prevWeekEnd.setDate(prevWeekEnd.getDate() + 6)
    
    const prevWeekTotal = transactions.filter(t => {
      const tDate = new Date(t.transaction_date)
      return tDate >= prevWeekStart && tDate <= prevWeekEnd && t.type === "expense"
    }).reduce((sum, t) => sum + Number(t.amount), 0)
    
    const trend = totalSpent > prevWeekTotal ? "up" : totalSpent < prevWeekTotal ? "down" : "stable"
    
    analyses.push({
      weekNumber: i + 1,
      totalSpent,
      averageDaily,
      topCategory,
      comparedToAverage,
      trend,
    })
  }
  
  return analyses.reverse()
}

export function analyzeMonthlySpending(transactions: Transaction[]): MonthlyAnalysis[] {
  const analyses: MonthlyAnalysis[] = []
  
  for (let i = 0; i < 6; i++) {
    const monthDate = new Date()
    monthDate.setMonth(monthDate.getMonth() - i)
    
    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.transaction_date)
      return tDate.getMonth() === monthDate.getMonth() && tDate.getFullYear() === monthDate.getFullYear()
    })
    
    const income = monthTransactions.filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0)
    const expenses = monthTransactions.filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0)
    const balance = income - expenses
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
    
    // Top expense category
    const categorySpending = new Map<string, number>()
    monthTransactions.filter(t => t.type === "expense").forEach(t => {
      const catId = t.category_id || "outros"
      categorySpending.set(catId, (categorySpending.get(catId) || 0) + Number(t.amount))
    })
    const topExpenseCategory = Array.from(categorySpending.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "outros"
    
    // Compare to previous month
    const prevMonthDate = new Date(monthDate)
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1)
    
    const prevMonthExpenses = transactions.filter(t => {
      const tDate = new Date(t.transaction_date)
      return tDate.getMonth() === prevMonthDate.getMonth() && tDate.getFullYear() === prevMonthDate.getFullYear() && t.type === "expense"
    }).reduce((sum, t) => sum + Number(t.amount), 0)
    
    const comparedToPrevious = prevMonthExpenses > 0 
      ? ((expenses - prevMonthExpenses) / prevMonthExpenses) * 100 
      : 0
    
    analyses.push({
      month: monthDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      income,
      expenses,
      balance,
      savingsRate,
      topExpenseCategory,
      comparedToPrevious,
    })
  }
  
  return analyses.reverse()
}
