export type NotificationType =
  | "bill_due"
  | "card_closing"
  | "invoice_due"
  | "goal_near_complete"
  | "excessive_spending"
  | "low_balance"
  | "modo_aperto_activated"
  | "ai_insight"
  | "savings_reminder"
  | "weekly_summary"
  | "monthly_summary"

export type NotificationPriority = "low" | "medium" | "high" | "urgent"

export type NotificationCategory =
  | "bills"
  | "cards"
  | "goals"
  | "spending"
  | "balance"
  | "modo_aperto"
  | "insights"
  | "savings"
  | "summary"

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  category: NotificationCategory
  priority: NotificationPriority
  title: string
  body: string
  data?: Record<string, unknown>
  read: boolean
  createdAt: string
  scheduledFor?: string
  sentAt?: string
  actionUrl?: string
  actionLabel?: string
}

export interface NotificationPreferences {
  userId: string
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
  frequency: {
    daily: boolean
    weekly: boolean
    monthly: boolean
  }
  quietHours: {
    enabled: boolean
    start: string // "22:00"
    end: string // "08:00"
  }
}

export interface NotificationTemplate {
  type: NotificationType
  category: NotificationCategory
  priority: NotificationPriority
  title: string
  body: string
  actionUrl?: string
  actionLabel?: string
}

export const NOTIFICATION_TEMPLATES: Record<NotificationType, NotificationTemplate> = {
  bill_due: {
    type: "bill_due",
    category: "bills",
    priority: "high",
    title: "Conta vence em breve",
    body: "Sua conta {billName} vence em {daysUntilDue} dias. Valor: R$ {amount}",
    actionUrl: "/gastos",
    actionLabel: "Ver contas",
  },
  card_closing: {
    type: "card_closing",
    category: "cards",
    priority: "medium",
    title: "Fechamento do cartão",
    body: "O fechamento do cartão {cardName} é dia {closingDay}. Prepare-se para o pagamento.",
    actionUrl: "/cartoes",
    actionLabel: "Ver cartões",
  },
  invoice_due: {
    type: "invoice_due",
    category: "cards",
    priority: "urgent",
    title: "Fatura vence em breve",
    body: "A fatura do cartão {cardName} vence em {daysUntilDue} dias. Valor: R$ {amount}",
    actionUrl: "/cartoes",
    actionLabel: "Ver fatura",
  },
  goal_near_complete: {
    type: "goal_near_complete",
    category: "goals",
    priority: "medium",
    title: "Meta quase concluída!",
    body: "Você está a {percentage}% de atingir sua meta {goalName}. Continue assim!",
    actionUrl: "/metas",
    actionLabel: "Ver metas",
  },
  excessive_spending: {
    type: "excessive_spending",
    category: "spending",
    priority: "high",
    title: "Gastos acima da média",
    body: "Você gastou {percentage}% acima da média hoje. Considere ativar o Modo Aperto.",
    actionUrl: "/dashboard",
    actionLabel: "Ver dashboard",
  },
  low_balance: {
    type: "low_balance",
    category: "balance",
    priority: "high",
    title: "Saldo baixo",
    body: "Seu saldo está abaixo de R$ {threshold}. Considere recarregar.",
    actionUrl: "/carteira",
    actionLabel: "Ver carteira",
  },
  modo_aperto_activated: {
    type: "modo_aperto_activated",
    category: "modo_aperto",
    priority: "medium",
    title: "Modo Aperto ativado",
    body: "Modo Aperto foi ativado automaticamente para controlar seus gastos.",
    actionUrl: "/configuracoes",
    actionLabel: "Configurar",
  },
  ai_insight: {
    type: "ai_insight",
    category: "insights",
    priority: "low",
    title: "Insight da IA Financeira",
    body: "{insightMessage}",
    actionUrl: "/dashboard",
    actionLabel: "Ver detalhes",
  },
  savings_reminder: {
    type: "savings_reminder",
    category: "savings",
    priority: "low",
    title: "Lembrete de economia",
    body: "Você pode economizar R$ {potentialSavings} reduzindo gastos com {category}.",
    actionUrl: "/gastos",
    actionLabel: "Ver gastos",
  },
  weekly_summary: {
    type: "weekly_summary",
    category: "summary",
    priority: "low",
    title: "Resumo semanal",
    body: "Você gastou R$ {totalSpent} esta semana. {trendMessage}",
    actionUrl: "/analytics",
    actionLabel: "Ver analytics",
  },
  monthly_summary: {
    type: "monthly_summary",
    category: "summary",
    priority: "low",
    title: "Resumo mensal",
    body: "Você economizou R$ {savings} este mês. {performanceMessage}",
    actionUrl: "/analytics",
    actionLabel: "Ver analytics",
  },
}

export function createNotification(
  userId: string,
  type: NotificationType,
  data: Record<string, unknown>
): Omit<Notification, "id" | "read" | "createdAt" | "sentAt"> {
  const template = NOTIFICATION_TEMPLATES[type]
  
  let title = template.title
  let body = template.body
  
  // Replace placeholders with actual data
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{${key}}`
    title = title.replace(placeholder, String(value))
    body = body.replace(placeholder, String(value))
  })
  
  return {
    userId,
    type,
    category: template.category,
    priority: template.priority,
    title,
    body,
    data,
    actionUrl: template.actionUrl,
    actionLabel: template.actionLabel,
  }
}
