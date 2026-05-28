/**
 * Nexus Emotional Intelligence System
 * 
 * Philosophy:
 * - AI as premium financial advisor
 * - Human-like communication
 * - Emotional awareness
 * - Sophisticated and calm
 * - Never robotic
 * - Always supportive
 */

export interface EmotionalProfile {
  anxietyLevel: "low" | "medium" | "high"
  impulsivityLevel: "low" | "medium" | "high"
  emotionalControl: "improving" | "stable" | "declining"
  financialStress: number // 0-100
  spendingPatterns: {
    emotional: boolean
    impulsive: boolean
    planned: boolean
  }
}

export interface EmotionalInsight {
  id: string
  type: "emotional" | "behavioral" | "predictive" | "motivational"
  message: string
  tone: "calm" | "encouraging" | "concerned" | "celebratory" | "supportive"
  actionable: boolean
  confidence: number
}

/**
 * Analyze emotional patterns from financial data
 */
export function analyzeEmotionalProfile(data: {
  transactions: any[]
  monthlyIncome: number
  monthlyExpenses: number
  savingsRate: number
}): EmotionalProfile {
  // Simplified emotional analysis
  // In production, this would use ML models
  
  const anxietyLevel = data.savingsRate < 10 ? "high" : data.savingsRate < 20 ? "medium" : "low"
  const impulsivityLevel = calculateImpulsivity(data.transactions)
  const emotionalControl = determineEmotionalControl(data.transactions)
  const financialStress = calculateFinancialStress(data.monthlyIncome, data.monthlyExpenses)
  const spendingPatterns = analyzeSpendingPatterns(data.transactions)

  return {
    anxietyLevel,
    impulsivityLevel,
    emotionalControl,
    financialStress,
    spendingPatterns,
  }
}

function calculateImpulsivity(transactions: any[]): "low" | "medium" | "high" {
  // Analyze frequency of small, unplanned transactions
  const smallTransactions = transactions.filter(t => t.amount < 100)
  const weekendTransactions = transactions.filter(t => {
    const date = new Date(t.transaction_date)
    return date.getDay() === 0 || date.getDay() === 6
  })
  
  if (weekendTransactions.length > transactions.length * 0.4) return "high"
  if (weekendTransactions.length > transactions.length * 0.25) return "medium"
  return "low"
}

function determineEmotionalControl(transactions: any[]): "improving" | "stable" | "declining" {
  // Compare current month with previous month
  // Simplified logic
  return "stable"
}

function calculateFinancialStress(income: number, expenses: number): number {
  const ratio = expenses / income
  if (ratio > 0.9) return 90
  if (ratio > 0.8) return 70
  if (ratio > 0.7) return 50
  if (ratio > 0.6) return 30
  return 10
}

function analyzeSpendingPatterns(transactions: any[]): {
  emotional: boolean
  impulsive: boolean
  planned: boolean
} {
  return {
    emotional: false,
    impulsive: false,
    planned: true,
  }
}

/**
 * Generate emotional insights
 */
export function generateEmotionalInsights(profile: EmotionalProfile): EmotionalInsight[] {
  const insights: EmotionalInsight[] = []

  // Anxiety-based insights
  if (profile.anxietyLevel === "high") {
    insights.push({
      id: "anxiety-high",
      type: "emotional",
      message: "Percebo que você pode estar se sentindo ansioso com suas finanças. Vamos trabalhar juntos para criar mais tranquilidade.",
      tone: "supportive",
      actionable: true,
      confidence: 0.85,
    })
  }

  // Impulsivity insights
  if (profile.impulsivityLevel === "high") {
    insights.push({
      id: "impulsivity-high",
      type: "behavioral",
      message: "Notei alguns padrões de gastos que podem ser impulsivos. Pequenas pausas antes de comprar podem fazer uma grande diferença.",
      tone: "calm",
      actionable: true,
      confidence: 0.8,
    })
  }

  // Emotional control insights
  if (profile.emotionalControl === "improving") {
    insights.push({
      id: "control-improving",
      type: "motivational",
      message: "Você demonstrou mais controle emocional nas compras este mês. Isso é um sinal de evolução importante.",
      tone: "celebratory",
      actionable: false,
      confidence: 0.9,
    })
  }

  // Financial stress insights
  if (profile.financialStress > 70) {
    insights.push({
      id: "stress-high",
      type: "predictive",
      message: "Seus gastos estão próximos da sua renda. Vamos ajustar para criar uma margem de segurança.",
      tone: "concerned",
      actionable: true,
      confidence: 0.85,
    })
  }

  return insights
}

/**
 * Generate human-like advisor messages
 */
export function generateAdvisorMessage(context: {
  situation: string
  emotion: string
  suggestion?: string
}): string {
  const messages: Record<string, string> = {
    "savings-good": "Você está construindo uma relação saudável com o dinheiro. Isso vai se multiplicar com o tempo.",
    "savings-excellent": "Sua disciplina financeira é inspiradora. Você está criando liberdade para o futuro.",
    "savings-improving": "Vejo que você está melhorando. Cada passo conta, e você está no caminho certo.",
    "spending-concern": "Vamos entender juntos o que está acontecendo. Pequenos ajustes podem trazer grande tranquilidade.",
    "goal-progress": "Você está mais perto do que imagina. Continue focado, o resultado virá.",
    "pattern-detected": "Percebi algo interessante nos seus padrões. Quer que eu explique?",
    "emotional-support": "Finanças podem ser emocionais. Estou aqui para ajudar você a navegar isso com calma.",
    "motivation": "Você tem capacidade de transformar sua relação com o dinheiro. Vamos juntos.",
  }

  return messages[context.situation] || "Estou aqui para ajudar você a entender suas finanças com clareza e calma."
}

/**
 * AI Personality System
 */
export const AI_PERSONALITY = {
  tone: "sophisticated",
  style: "calm",
  approach: "supportive",
  characteristics: [
    "Never robotic",
    "Always human-like",
    "Premium advisor feel",
    "Emotionally intelligent",
    "Calm and reassuring",
    "Clear and direct",
    "Never judgmental",
  ],
  
  forbidden: [
    "Never use exclamation marks excessively",
    "Never use emojis inappropriately",
    "Never sound like a chatbot",
    "Never use generic phrases",
    "Never be overly casual",
    "Never be robotic",
  ],
  
  preferred: [
    "Use sophisticated vocabulary",
    "Be concise but warm",
    "Focus on emotional connection",
    "Acknowledge progress",
    "Provide specific insights",
    "Be encouraging",
  ],
}

/**
 * Generate emotionally intelligent response
 */
export function generateEmotionalResponse(input: string, context: EmotionalProfile): string {
  // This would use NLP in production
  // For now, return human-like responses based on context
  
  if (context.anxietyLevel === "high") {
    return "Entendo que as finanças podem gerar ansiedade. Vamos trabalhar juntos para criar mais clareza e tranquilidade. Pequenos passos consistentes levam a grandes mudanças."
  }
  
  if (context.impulsivityLevel === "high") {
    return "Percebo que às vezes compramos por impulso. Uma pausa de 24 horas antes de compras maiores pode ajudar. Estou aqui para apoiar suas decisões."
  }
  
  if (context.emotionalControl === "improving") {
    return "Você está evoluindo sua relação com o dinheiro. Continue assim, você está no caminho certo."
  }
  
  return "Estou aqui para ajudar você a entender suas finanças com clareza. O que você gostaria de saber?"
}
