export type PlanType = "free" | "premium"

export type BillingCycle = "monthly" | "yearly"

export interface SubscriptionPlan {
  id: string
  name: string
  type: PlanType
  description: string
  features: string[]
  price: {
    monthly: number
    yearly: number
  }
  limits: {
    categories: number
    goals: number
    transactions: number
    analytics: boolean
    aiInsights: boolean
    exportPDF: boolean
    premiumNotifications: boolean
    predictions: boolean
  }
  trialDays?: number
}

export const PLANS: Record<PlanType, SubscriptionPlan> = {
  free: {
    id: "free",
    name: "Free",
    type: "free",
    description: "Para começar sua jornada financeira",
    features: [
      "Até 5 categorias",
      "Até 3 metas",
      "Transações ilimitadas",
      "Dashboard básico",
      "Gráficos simples",
    ],
    price: {
      monthly: 0,
      yearly: 0,
    },
    limits: {
      categories: 5,
      goals: 3,
      transactions: Infinity,
      analytics: false,
      aiInsights: false,
      exportPDF: false,
      premiumNotifications: false,
      predictions: false,
    },
  },
  premium: {
    id: "premium",
    name: "Premium",
    type: "premium",
    description: "IA financeira avançada e recursos completos",
    features: [
      "Categorias ilimitadas",
      "Metas ilimitadas",
      "IA financeira avançada",
      "Analytics completos",
      "Exportação PDF",
      "Insights inteligentes",
      "Notificações premium",
      "Previsões financeiras",
      "Prioridade no suporte",
    ],
    price: {
      monthly: 29.90,
      yearly: 299.90,
    },
    limits: {
      categories: Infinity,
      goals: Infinity,
      transactions: Infinity,
      analytics: true,
      aiInsights: true,
      exportPDF: true,
      premiumNotifications: true,
      predictions: true,
    },
    trialDays: 7,
  },
}

export interface UserSubscription {
  userId: string
  planType: PlanType
  billingCycle: BillingCycle
  trialEndsAt?: Date
  currentPeriodEndsAt?: Date
  cancelAtPeriodEnd: boolean
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

export function isPremium(subscription: UserSubscription | null): boolean {
  if (!subscription) return false
  if (subscription.planType === "premium") {
    // Check if trial is active
    if (subscription.trialEndsAt && new Date(subscription.trialEndsAt) > new Date()) {
      return true
    }
    // Check if subscription is active
    if (subscription.currentPeriodEndsAt && new Date(subscription.currentPeriodEndsAt) > new Date()) {
      return true
    }
  }
  return false
}

export function getPlanPrice(plan: PlanType, cycle: BillingCycle): number {
  return PLANS[plan].price[cycle]
}

export function getYearlySavings(plan: PlanType): number {
  const monthly = PLANS[plan].price.monthly
  const yearly = PLANS[plan].price.yearly
  const yearlyMonthly = yearly / 12
  return Math.round(((monthly - yearlyMonthly) / monthly) * 100)
}
