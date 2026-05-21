import type {
  CalendarEvent,
  Category,
  Goal,
  Installment,
  Profile,
  Transaction,
} from "@/lib/supabase/types"

const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

export function getMonthKey(date: string) {
  const d = new Date(date + "T12:00:00")
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export function isCurrentMonth(date: string) {
  const now = new Date()
  const d = new Date(date + "T12:00:00")
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

export function computeMonthExpenses(transactions: Transaction[]) {
  return transactions
    .filter((t) => t.type === "expense" && isCurrentMonth(t.transaction_date))
    .reduce((sum, t) => sum + Number(t.amount), 0)
}

export function computeMonthIncome(transactions: Transaction[], profile: Profile | null) {
  const fromTx = transactions
    .filter((t) => t.type === "income" && isCurrentMonth(t.transaction_date))
    .reduce((sum, t) => sum + Number(t.amount), 0)
  return fromTx > 0 ? fromTx : Number(profile?.monthly_income ?? 0)
}

export function computeTotalGastos(transactions: Transaction[]) {
  return computeMonthExpenses(transactions)
}

export function computeSaldo(profile: Profile | null, transactions: Transaction[]) {
  const income = computeMonthIncome(transactions, profile)
  const expenses = computeMonthExpenses(transactions)
  const balance = Number(profile?.current_balance ?? 0)
  if (transactions.length === 0 && balance > 0) return balance - expenses + income
  return income - expenses
}

export function computePercentualUsado(transactions: Transaction[], profile: Profile | null) {
  const income = computeMonthIncome(transactions, profile)
  if (income <= 0) return 0
  return (computeMonthExpenses(transactions) / income) * 100
}

export function computeEvolutionData(
  transactions: Transaction[],
  profile: Profile | null,
  months = 6
) {
  const now = new Date()
  const result: { month: string; gastos: number; renda: number }[] = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const monthTx = transactions.filter((t) => getMonthKey(t.transaction_date) === key)
    const gastos = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0)
    const rendaFromTx = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0)
    const renda = rendaFromTx > 0 ? rendaFromTx : Number(profile?.monthly_income ?? 0)
    result.push({ month: MONTH_LABELS[d.getMonth()], gastos, renda })
  }

  return result
}

export function computeDonutData(transactions: Transaction[], categories: Category[]) {
  const monthExpenses = transactions.filter(
    (t) => t.type === "expense" && isCurrentMonth(t.transaction_date)
  )

  return categories
    .map((cat) => ({
      name: cat.name,
      color: cat.color,
      value: monthExpenses
        .filter((t) => t.category_id === cat.id)
        .reduce((s, t) => s + Number(t.amount), 0),
    }))
    .filter((d) => d.value > 0)
}

export function computeCategoriesWithItems(
  transactions: Transaction[],
  categories: Category[]
) {
  const monthExpenses = transactions.filter(
    (t) => t.type === "expense" && isCurrentMonth(t.transaction_date)
  )

  return categories.map((cat) => ({
    name: cat.name,
    color: cat.color,
    items: monthExpenses
      .filter((t) => t.category_id === cat.id)
      .map((t) => ({
        id: t.id,
        name: t.description || "Sem descricao",
        value: Number(t.amount),
        date: t.transaction_date,
      })),
  }))
}

export function computeMoMChange(transactions: Transaction[], type: "expense" | "income") {
  const now = new Date()
  const thisKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevKey = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`

  const current = transactions
    .filter((t) => t.type === type && getMonthKey(t.transaction_date) === thisKey)
    .reduce((s, t) => s + Number(t.amount), 0)
  const previous = transactions
    .filter((t) => t.type === type && getMonthKey(t.transaction_date) === prevKey)
    .reduce((s, t) => s + Number(t.amount), 0)

  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function formatPeriodLabel() {
  const now = new Date()
  const months = [
    "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ]
  return `${months[now.getMonth()]} ${now.getFullYear()}`
}

export function mapCardsForUI(
  cards: import("@/lib/supabase/types").Card[]
) {
  return cards.map((c) => ({
    id: c.id,
    bank: c.bank,
    lastDigits: c.last_digits || "0000",
    holder: c.holder || "",
    expiry: c.expiry || "",
    brand: c.brand,
    color: c.color,
    limite: Number(c.credit_limit),
    usado: Number(c.amount_used),
    fatura: Number(c.current_invoice),
    vencimento: `${String(c.due_day).padStart(2, "0")}/${String(new Date().getMonth() + 1).padStart(2, "0")}`,
  }))
}

export function mapGoalsForUI(goals: Goal[]) {
  return goals
    .filter((g) => !g.is_emergency_fund)
    .map((g) => ({
      id: g.id,
      name: g.name,
      target: Number(g.target_amount),
      current: Number(g.current_amount),
      color: g.color,
      deadline: g.deadline,
      monthlyTarget: g.monthly_target,
      priority: g.priority,
    }))
}

export function upcomingCalendarDays(events: CalendarEvent[], days = 30) {
  const today = new Date()
  const end = new Date(today)
  end.setDate(end.getDate() + days)
  return events
    .filter((e) => {
      const d = new Date(e.event_date + "T12:00:00")
      return d >= today && d <= end
    })
    .sort((a, b) => a.event_date.localeCompare(b.event_date))
}

export function activeInstallmentsMonthly(installments: Installment[]) {
  return installments
    .filter((i) => i.status === "active")
    .reduce((s, i) => s + Number(i.monthly_amount), 0)
}
