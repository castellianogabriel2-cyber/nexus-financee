import type { Category, Profile, Transaction } from "@/lib/supabase/types"
import { computeMonthExpenses, computeSaldo, isCurrentMonth } from "./compute"

export type FinancialInsight = {
  id: string
  type: "warning" | "success" | "info"
  title: string
  message: string
}

export function generateFinancialInsights(
  transactions: Transaction[],
  categories: Category[],
  profile: Profile | null
): FinancialInsight[] {
  const insights: FinancialInsight[] = []
  const monthExpenses = transactions.filter(
    (t) => t.type === "expense" && isCurrentMonth(t.transaction_date)
  )

  if (monthExpenses.length === 0) {
    return [
      {
        id: "empty",
        type: "info",
        title: "Comece registrando",
        message: "Adicione sua primeira transacao para receber insights personalizados.",
      },
    ]
  }

  const byCategory = new Map<string, number>()
  monthExpenses.forEach((t) => {
    const key = t.category_id || "outros"
    byCategory.set(key, (byCategory.get(key) || 0) + Number(t.amount))
  })

  const sorted = [...byCategory.entries()].sort((a, b) => b[1] - a[1])
  const topCatId = sorted[0]?.[0]
  const topCat = categories.find((c) => c.id === topCatId)
  if (topCat && sorted[0][1] > 0) {
    insights.push({
      id: "top-category",
      type: "info",
      title: "Maior categoria do mes",
      message: `Voce gastou mais em ${topCat.name} essa semana — R$ ${sorted[0][1].toLocaleString("pt-BR", { minimumFractionDigits: 2 })} no mes.`,
    })
  }

  const smallExpenses = monthExpenses.filter((t) => Number(t.amount) < 50)
  if (smallExpenses.length >= 5) {
    const totalSmall = smallExpenses.reduce((s, t) => s + Number(t.amount), 0)
    insights.push({
      id: "small-spending",
      type: "warning",
      title: "Pequenos gastos somam",
      message: `Seu padrao indica aumento de pequenos gastos — ${smallExpenses.length} compras abaixo de R$ 50 totalizam R$ ${totalSmall.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`,
    })
  }

  const income = Number(profile?.monthly_income ?? 0)
  const expenses = computeMonthExpenses(transactions)
  const potentialSave = Math.max(0, income - expenses) * 0.15
  if (potentialSave >= 50) {
    insights.push({
      id: "save-tip",
      type: "success",
      title: "Oportunidade de economia",
      message: `Voce pode guardar R$ ${Math.round(potentialSave).toLocaleString("pt-BR")} este mes mantendo seu ritmo atual.`,
    })
  }

  const saldo = computeSaldo(profile, transactions)
  if (saldo < 0) {
    insights.push({
      id: "negative-balance",
      type: "warning",
      title: "Atencao ao saldo",
      message: "Seus gastos do mes ultrapassaram sua renda. Considere ativar o Modo Aperto.",
    })
  }

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const thisWeek = monthExpenses.filter((t) => new Date(t.transaction_date) >= weekAgo)
  const foodCat = categories.find((c) => c.slug === "alimentacao")
  if (foodCat) {
    const foodWeek = thisWeek
      .filter((t) => t.category_id === foodCat.id)
      .reduce((s, t) => s + Number(t.amount), 0)
    if (foodWeek > 100) {
      insights.push({
        id: "food-week",
        type: "info",
        title: "Alimentacao",
        message: `Voce gastou R$ ${foodWeek.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em alimentacao nos ultimos 7 dias.`,
      })
    }
  }

  // Novo insight: Comparação com mês anterior
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const lastMonthExpenses = transactions.filter(
    (t) => t.type === "expense" && new Date(t.transaction_date).getMonth() === lastMonth.getMonth()
  )
  const lastMonthTotal = lastMonthExpenses.reduce((s, t) => s + Number(t.amount), 0)
  const thisMonthTotal = monthExpenses.reduce((s, t) => s + Number(t.amount), 0)
  
  if (lastMonthTotal > 0) {
    const change = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
    if (change > 20) {
      insights.push({
        id: "spending-increase",
        type: "warning",
        title: "Aumento de gastos",
        message: `Seus gastos aumentaram ${change.toFixed(0)}% em relacao ao mes anterior. Fique atento!`,
      })
    } else if (change < -20) {
      insights.push({
        id: "spending-decrease",
        type: "success",
        title: "Reducao de gastos",
        message: `Parabens! Seus gastos diminuiram ${Math.abs(change).toFixed(0)}% em relacao ao mes anterior.`,
      })
    }
  }

  // Novo insight: Gastos com delivery
  const deliveryCat = categories.find((c) => c.slug === "delivery")
  if (deliveryCat) {
    const deliveryExpenses = thisWeek.filter((t) => t.category_id === deliveryCat.id)
    const deliveryTotal = deliveryExpenses.reduce((s, t) => s + Number(t.amount), 0)
    if (deliveryTotal > 200) {
      insights.push({
        id: "delivery-spending",
        type: "warning",
        title: "Gastos com delivery",
        message: `Voce gastou R$ ${deliveryTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em delivery essa semana. Considere cozinhar em casa.`,
      })
    }
  }

  // Novo insight: Reserva de emergência
  const emergencyReserve = Number(profile?.emergency_reserve_target ?? 0)
  const emergencyCurrent = Number(profile?.emergency_reserve_current ?? 0)
  if (emergencyReserve > 0) {
    const reservePercent = (emergencyCurrent / emergencyReserve) * 100
    if (reservePercent < 50) {
      insights.push({
        id: "reserve-low",
        type: "warning",
        title: "Reserva de emergencia",
        message: `Sua reserva esta em ${reservePercent.toFixed(0)}%. Tente aumentar para pelo menos 50%.`,
      })
    } else if (reservePercent >= 100) {
      insights.push({
        id: "reserve-full",
        type: "success",
        title: "Reserva completa",
        message: "Parabens! Voce atingiu sua meta de reserva de emergencia.",
      })
    }
  }

  return insights.slice(0, 5)
}
