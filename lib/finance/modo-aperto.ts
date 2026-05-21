import type { Category, Profile, Transaction } from "@/lib/supabase/types"
import { computeMonthExpenses } from "./compute"

export type ModoApertoStats = {
  daysUntilPayday: number
  dailyAllowance: number
  essentialMonthly: number
  nonEssentialBlocked: number
  survivalDays: number
  essentials: { name: string; amount: number; color: string }[]
}

export function computeModoAperto(
  profile: Profile | null,
  transactions: Transaction[],
  categories: Category[]
): ModoApertoStats {
  const income = Number(profile?.monthly_income ?? 0)
  const balance = Number(profile?.current_balance ?? 0)
  const expenses = computeMonthExpenses(transactions)

  const essentialCats = categories.filter((c) => c.is_essential)
  const essentialMonthly = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        essentialCats.some((c) => c.id === t.category_id)
    )
    .reduce((s, t) => s + Number(t.amount), 0)

  const fixedEssential = essentialCats.length > 0 ? essentialMonthly : income * 0.6
  const available = Math.max(0, balance - fixedEssential * 0.3)

  let daysUntilPayday = 15
  if (profile?.next_payday) {
    const payday = new Date(profile.next_payday + "T12:00:00")
    const today = new Date()
    daysUntilPayday = Math.max(1, Math.ceil((payday.getTime() - today.getTime()) / 86400000))
  }

  const dailyAllowance = available / daysUntilPayday
  const survivalDays = expenses > 0 ? Math.floor(balance / (expenses / 30)) : 30

  const essentials = essentialCats.map((cat) => ({
    name: cat.name,
    color: cat.color,
    amount: transactions
      .filter((t) => t.category_id === cat.id && t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0),
  }))

  return {
    daysUntilPayday,
    dailyAllowance,
    essentialMonthly: fixedEssential,
    nonEssentialBlocked: Math.max(0, expenses - fixedEssential),
    survivalDays,
    essentials,
  }
}
