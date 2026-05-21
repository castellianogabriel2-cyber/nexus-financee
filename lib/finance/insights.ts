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

  return insights.slice(0, 5)
}
