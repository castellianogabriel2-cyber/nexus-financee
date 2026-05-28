/**
 * Nexus OS - Invisible AI Insights Engine
 * 
 * Philosophy:
 * - AI should feel natural, not robotic
 * - Insights should appear organically
 * - Language should be human-like
 * - Predictions should be contextual
 * - Patterns should be emotional, not just data
 * - Advisor should be premium and sophisticated
 */

import { generateAdvisorMessage, AI_PERSONALITY } from "./emotional-intelligence"

export interface FinancialInsight {
  id: string
  type: "opportunity" | "warning" | "celebration" | "pattern" | "prediction" | "emotional"
  title: string
  description: string
  humanMessage: string // Natural language message from premium advisor
  confidence: number
  actionable: boolean
  actionText?: string
  emotionalTone: "calm" | "motivational" | "concerned" | "celebratory" | "neutral" | "supportive"
  timestamp: Date
  category?: string
}

export interface SpendingPattern {
  category: string
  trend: "increasing" | "decreasing" | "stable"
  percentage: number
  emotionalContext: string
  suggestion: string
}

export interface FinancialPrediction {
  type: "savings" | "spending" | "goal" | "risk"
  timeframe: string
  prediction: string
  confidence: number
  humanInterpretation: string
}

/**
 * Generate intelligent insights based on financial data
 * This simulates AI analysis - in production, this would use actual ML
 */
export function generateInsights(data: {
  totalIncome: number
  totalExpenses: number
  balance: number
  transactions: any[]
  goals: any[]
}): FinancialInsight[] {
  const insights: FinancialInsight[] = []
  const savingsRate = ((data.totalIncome - data.totalExpenses) / data.totalIncome) * 100

  // Savings opportunity - with human-like advisor message
  if (savingsRate > 20) {
    insights.push({
      id: "savings-excellent",
      type: "celebration",
      title: "Excelente controle",
      description: `Você está economizando ${savingsRate.toFixed(0)}% da sua renda. Isso é impressionante.`,
      humanMessage: generateAdvisorMessage({ situation: "savings-excellent", emotion: "celebratory" }),
      confidence: 0.95,
      actionable: false,
      emotionalTone: "celebratory",
      timestamp: new Date(),
    })
  } else if (savingsRate > 10) {
    insights.push({
      id: "savings-good",
      type: "opportunity",
      title: "Potencial de economia",
      description: `Você está economizando ${savingsRate.toFixed(0)}% da sua renda. Com pequenos ajustes, pode chegar a 20%.`,
      humanMessage: generateAdvisorMessage({ situation: "savings-good", emotion: "motivational" }),
      confidence: 0.85,
      actionable: true,
      actionText: "Ver sugestões",
      emotionalTone: "motivational",
      timestamp: new Date(),
    })
  } else {
    insights.push({
      id: "savings-low",
      type: "warning",
      title: "Atenção aos gastos",
      description: `Sua taxa de economia é de ${savingsRate.toFixed(0)}%. Considere revisar seus gastos fixos.`,
      humanMessage: generateAdvisorMessage({ situation: "spending-concern", emotion: "concerned" }),
      confidence: 0.9,
      actionable: true,
      actionText: "Analisar gastos",
      emotionalTone: "concerned",
      timestamp: new Date(),
    })
  }

  // Spending pattern detection - with emotional context
  const categorySpending = analyzeCategorySpending(data.transactions)
  categorySpending.forEach(pattern => {
    if (pattern.trend === "increasing" && pattern.percentage > 15) {
      insights.push({
        id: `pattern-${pattern.category}`,
        type: "pattern",
        title: `Padrão em ${pattern.category}`,
        description: `Seus gastos com ${pattern.category} aumentaram ${pattern.percentage}% em relação ao mês anterior.`,
        humanMessage: pattern.emotionalContext,
        confidence: 0.8,
        actionable: true,
        actionText: "Ver detalhes",
        emotionalTone: "concerned",
        timestamp: new Date(),
        category: pattern.category,
      })
    }
  })

  // Goal progress - with motivational message
  data.goals.forEach(goal => {
    const progress = (goal.current / goal.target) * 100
    if (progress > 75 && progress < 100) {
      insights.push({
        id: `goal-${goal.id}`,
        type: "celebration",
        title: `Quase lá: ${goal.name}`,
        description: `Você está a ${goal.target - goal.current} de atingir sua meta.`,
        humanMessage: generateAdvisorMessage({ situation: "goal-progress", emotion: "motivational" }),
        confidence: 0.95,
        actionable: true,
        actionText: "Acelerar",
        emotionalTone: "motivational",
        timestamp: new Date(),
      })
    }
  })

  // Emotional insight - new
  insights.push({
    id: "emotional-pattern",
    type: "emotional",
    title: "Seu padrão financeiro",
    description: "Análise do seu comportamento financeiro este mês.",
    humanMessage: "Seu padrão financeiro está mais equilibrado esta semana. Você demonstrou mais controle emocional nas compras.",
    confidence: 0.85,
    actionable: false,
    emotionalTone: "supportive",
    timestamp: new Date(),
  })

  return insights
}

/**
 * Analyze spending patterns by category
 */
function analyzeCategorySpending(transactions: any[]): SpendingPattern[] {
  // Simplified pattern analysis
  // In production, this would use actual ML models
  const patterns: SpendingPattern[] = []
  
  // Example pattern detection
  patterns.push({
    category: "Alimentação",
    trend: "stable",
    percentage: 5,
    emotionalContext: "Seus gastos com alimentação estão estáveis. Isso mostra consistência e planejamento.",
    suggestion: "Continue mantendo esse equilíbrio.",
  })

  return patterns
}

/**
 * Generate financial predictions
 */
export function generatePredictions(data: {
  balance: number
  monthlyIncome: number
  monthlyExpenses: number
}): FinancialPrediction[] {
  const predictions: FinancialPrediction[] = []
  const monthlySavings = data.monthlyIncome - data.monthlyExpenses

  if (monthlySavings > 0) {
    const monthsToDouble = data.balance / monthlySavings
    predictions.push({
      type: "savings",
      timeframe: `${Math.ceil(monthsToDouble)} meses`,
      prediction: `Seu saldo pode dobrar em ${Math.ceil(monthsToDouble)} meses mantendo o ritmo atual.`,
      confidence: 0.7,
      humanInterpretation: "Seu ritmo atual aproxima sua meta em 18 dias. Continue assim.",
    })
  }

  return predictions
}

/**
 * Generate human-like messages based on context
 */
export function generateHumanMessage(context: {
  situation: string
  emotion: string
  action?: string
}): string {
  const messages: Record<string, string> = {
    "savings-good": "Você está construindo hábitos financeiros saudáveis. Isso vai se multiplicar com o tempo.",
    "savings-excellent": "Sua disciplina financeira é inspiradora. Você está criando liberdade para o futuro.",
    "savings-low": "Pequenos ajustes hoje criam grandes oportunidades amanhã. Vamos juntos.",
    "spending-high": "Às vezes gastamos mais sem perceber. Vamos entender juntos o que está acontecendo.",
    "goal-close": "A reta final é onde a maioria desiste. Você não é a maioria.",
    "pattern-detected": "Percebi um padrão interessante nos seus gastos. Quer que eu explique?",
    "emotional-improving": "Seu comportamento financeiro evoluiu. Continue assim.",
    "motivational": "Você tem capacidade de transformar sua relação com o dinheiro.",
  }

  return messages[context.situation] || "Estou aqui para ajudar você a entender suas finanças."
}
