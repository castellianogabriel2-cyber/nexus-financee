import type { Transaction, Category, Profile, Card, Goal } from "@/lib/supabase/types"
import { computeMonthExpenses, computeSaldo, isCurrentMonth } from "../finance/compute"
import { analyzeBehavior, generateFinancialAlerts } from "../finance/analytics"
import { createNotification, type NotificationType } from "./types"

export function generateBillDueNotification(
  userId: string,
  billName: string,
  amount: number,
  daysUntilDue: number
) {
  return createNotification(userId, "bill_due", {
    billName,
    amount: amount.toFixed(2),
    daysUntilDue,
  })
}

export function generateCardClosingNotification(
  userId: string,
  cardName: string,
  closingDay: number
) {
  return createNotification(userId, "card_closing", {
    cardName,
    closingDay,
  })
}

export function generateInvoiceDueNotification(
  userId: string,
  cardName: string,
  amount: number,
  daysUntilDue: number
) {
  return createNotification(userId, "invoice_due", {
    cardName,
    amount: amount.toFixed(2),
    daysUntilDue,
  })
}

export function generateGoalNearCompleteNotification(
  userId: string,
  goalName: string,
  percentage: number
) {
  return createNotification(userId, "goal_near_complete", {
    goalName,
    percentage: percentage.toFixed(0),
  })
}

export function generateExcessiveSpendingNotification(
  userId: string,
  percentage: number
) {
  return createNotification(userId, "excessive_spending", {
    percentage: percentage.toFixed(0),
  })
}

export function generateLowBalanceNotification(
  userId: string,
  threshold: number
) {
  return createNotification(userId, "low_balance", {
    threshold: threshold.toFixed(2),
  })
}

export function generateModoApertoActivatedNotification(userId: string) {
  return createNotification(userId, "modo_aperto_activated", {})
}

export function generateAIInsightNotification(
  userId: string,
  insightMessage: string
) {
  return createNotification(userId, "ai_insight", {
    insightMessage,
  })
}

export function generateSavingsReminderNotification(
  userId: string,
  potentialSavings: number,
  category: string
) {
  return createNotification(userId, "savings_reminder", {
    potentialSavings: potentialSavings.toFixed(2),
    category,
  })
}

export function generateWeeklySummaryNotification(
  userId: string,
  totalSpent: number,
  trendMessage: string
) {
  return createNotification(userId, "weekly_summary", {
    totalSpent: totalSpent.toFixed(2),
    trendMessage,
  })
}

export function generateMonthlySummaryNotification(
  userId: string,
  savings: number,
  performanceMessage: string
) {
  return createNotification(userId, "monthly_summary", {
    savings: savings.toFixed(2),
    performanceMessage,
  })
}

export function analyzeAndGenerateNotifications(
  userId: string,
  transactions: Transaction[],
  categories: Category[],
  profile: Profile | null,
  cards: Card[],
  goals: Goal[]
) {
  const notifications: Omit<Notification, "id" | "read" | "createdAt" | "sentAt">[] = []

  // Check for excessive spending
  const behavior = analyzeBehavior(transactions, categories)
  if (behavior.spendingPattern === "increasing") {
    notifications.push(generateExcessiveSpendingNotification(userId, 23))
  }

  // Check for delivery spending
  if (behavior.deliverySpend > 200) {
    notifications.push(generateSavingsReminderNotification(userId, behavior.deliverySavingsPotential, "delivery"))
  }

  // Check for low balance
  const balance = computeSaldo(profile, transactions)
  if (balance < 500) {
    notifications.push(generateLowBalanceNotification(userId, 500))
  }

  // Check for goals near completion
  goals.forEach((goal) => {
    const percentage = (Number(goal.current_amount || 0) / Number(goal.target_amount || 1)) * 100
    if (percentage >= 75 && percentage < 100) {
      notifications.push(generateGoalNearCompleteNotification(userId, goal.name, percentage))
    }
  })

  // Check for card invoices due
  const today = new Date()
  cards.forEach((card) => {
    if (card.due_day) {
      const dueDate = new Date(today.getFullYear(), today.getMonth(), card.due_day)
      if (dueDate < today) {
        dueDate.setMonth(dueDate.getMonth() + 1)
      }
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (daysUntilDue <= 7 && daysUntilDue > 0) {
        notifications.push(generateInvoiceDueNotification(userId, card.bank, card.current_invoice, daysUntilDue))
      }
    }
  })

  // Generate AI insights
  const alerts = generateFinancialAlerts(transactions, categories, profile, cards)
  alerts.forEach((alert) => {
    if (alert.type === "warning" || alert.type === "error") {
      notifications.push(generateAIInsightNotification(userId, alert.message))
    }
  })

  return notifications
}

export function shouldSendNotification(
  notification: Omit<Notification, "id" | "read" | "createdAt" | "sentAt">,
  preferences: {
    enabled: boolean
    categories: {
      bills: boolean
      cards: boolean
      goals: boolean
      spending: boolean
      balance: boolean
      modo_aperto: boolean
      insights: boolean
      savings: boolean
      summary: boolean
    }
    quietHours: {
      enabled: boolean
      start: string
      end: string
    }
  }
) {
  if (!preferences.enabled) return false

  const categoryEnabled = preferences.categories[notification.category as keyof typeof preferences.categories]
  if (!categoryEnabled) return false

  // Check quiet hours
  if (preferences.quietHours.enabled) {
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
    
    if (currentTime >= preferences.quietHours.start || currentTime <= preferences.quietHours.end) {
      // Only send urgent notifications during quiet hours
      return notification.priority === "urgent"
    }
  }

  return true
}
