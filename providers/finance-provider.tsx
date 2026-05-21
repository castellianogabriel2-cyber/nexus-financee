"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { createClient } from "@/lib/supabase/client"
import type {
  CalendarEvent,
  Card,
  Category,
  FundDeposit,
  Goal,
  Installment,
  Profile,
  Transaction,
} from "@/lib/supabase/types"
import {
  computeCategoriesWithItems,
  computeDonutData,
  computeEvolutionData,
  computeMoMChange,
  computeMonthExpenses,
  computeMonthIncome,
  computePercentualUsado,
  computeSaldo,
  computeTotalGastos,
  formatPeriodLabel,
  mapCardsForUI,
  mapGoalsForUI,
} from "@/lib/finance/compute"
import { generateFinancialInsights } from "@/lib/finance/insights"
import { computeModoAperto } from "@/lib/finance/modo-aperto"
import {
  computeFinancialScore,
  predictSpending,
  analyzeBehavior,
  generateFinancialAlerts,
  projectEconomy,
  projectCardPayments,
  analyzeWeeklySpending,
  analyzeMonthlySpending,
} from "@/lib/finance/analytics"
import type { User } from "@supabase/supabase-js"

type FinanceContextValue = {
  user: User | null
  profile: Profile | null
  categories: Category[]
  transactions: Transaction[]
  cards: Card[]
  goals: Goal[]
  installments: Installment[]
  calendarEvents: CalendarEvent[]
  fundDeposits: FundDeposit[]
  loading: boolean
  hasData: boolean
  renda: number
  totalGastos: number
  saldo: number
  percentualUsado: number
  evolutionData: ReturnType<typeof computeEvolutionData>
  donutData: ReturnType<typeof computeDonutData>
  categorias: ReturnType<typeof computeCategoriesWithItems>
  cardsData: ReturnType<typeof mapCardsForUI>
  goalsData: ReturnType<typeof mapGoalsForUI>
  insights: ReturnType<typeof generateFinancialInsights>
  modoAperto: ReturnType<typeof computeModoAperto>
  expenseMoM: number
  incomeMoM: number
  periodLabel: string
  financialScore: ReturnType<typeof computeFinancialScore>
  spendingPrediction: ReturnType<typeof predictSpending>
  behaviorAnalysis: ReturnType<typeof analyzeBehavior>
  financialAlerts: ReturnType<typeof generateFinancialAlerts>
  economyProjection: ReturnType<typeof projectEconomy>
  cardProjections: ReturnType<typeof projectCardPayments>
  weeklyAnalysis: ReturnType<typeof analyzeWeeklySpending>
  monthlyAnalysis: ReturnType<typeof analyzeMonthlySpending>
  refresh: () => Promise<void>
  addTransaction: (payload: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">) => Promise<{ error: string | null }>
  updateTransaction: (id: string, payload: Partial<Transaction>) => Promise<{ error: string | null }>
  deleteTransaction: (id: string) => Promise<{ error: string | null }>
  updateProfile: (payload: Partial<Profile>) => Promise<{ error: string | null }>
  toggleModoAperto: (enabled: boolean) => Promise<void>
  addCard: (
  payload: Omit<Card, "id" | "user_id" | "created_at" | "updated_at">
) => Promise<{ error: string | null }>
  uploadAttachment: (file: File) => Promise<{ url: string | null; error: string | null }>
}

const FinanceContext = createContext<FinanceContextValue | null>(null)

export function FinanceProvider({
  children,
  user,
}: {
  children: React.ReactNode
  user: User | null
}) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [installments, setInstallments] = useState<Installment[]>([])
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [fundDeposits, setFundDeposits] = useState<FundDeposit[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    let supabase
    try {
      supabase = createClient()
    } catch {
      setLoading(false)
      return
    }

    const uid = user.id
    const [p, c, t, cardsRes, g, i, cal, fd] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).single(),
      supabase.from("categories").select("*").eq("user_id", uid).order("name"),
      supabase.from("transactions").select("*").eq("user_id", uid).order("transaction_date", { ascending: false }),
      supabase.from("cards").select("*").eq("user_id", uid),
      supabase.from("goals").select("*").eq("user_id", uid),
      supabase.from("installments").select("*").eq("user_id", uid),
      supabase.from("calendar_events").select("*").eq("user_id", uid).order("event_date"),
      supabase.from("fund_deposits").select("*").eq("user_id", uid).order("deposit_date", { ascending: false }),
    ])

    if (p.data) setProfile(p.data as Profile)
    if (c.data) setCategories(c.data as Category[])
    if (t.data) setTransactions(t.data as Transaction[])
    if (cardsRes.data) setCards(cardsRes.data as Card[])
    if (g.data) setGoals(g.data as Goal[])
    if (i.data) setInstallments(i.data as Installment[])
    if (cal.data) setCalendarEvents(cal.data as CalendarEvent[])
    if (fd.data) setFundDeposits(fd.data as FundDeposit[])
    setLoading(false)
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!user) return
    let supabase
    try {
      supabase = createClient()
    } catch {
      return
    }

    const channel = supabase
      .channel("finance-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions", filter: `user_id=eq.${user.id}` },
        () => refresh()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles", filter: `id=eq.${user.id}` },
        () => refresh()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories", filter: `user_id=eq.${user.id}` },
        () => refresh()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cards", filter: `user_id=eq.${user.id}` },
        () => refresh()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "goals", filter: `user_id=eq.${user.id}` },
        () => refresh()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, refresh])

  const computed = useMemo(() => {
    const totalGastos = computeTotalGastos(transactions)
    const renda = computeMonthIncome(transactions, profile)
    const saldo = computeSaldo(profile, transactions)
    const percentualUsado = computePercentualUsado(transactions, profile)

    return {
      renda,
      totalGastos,
      saldo,
      percentualUsado,
      evolutionData: computeEvolutionData(transactions, profile),
      donutData: computeDonutData(transactions, categories),
      categorias: computeCategoriesWithItems(transactions, categories),
      cardsData: mapCardsForUI(cards),
      goalsData: mapGoalsForUI(goals),
      insights: generateFinancialInsights(transactions, categories, profile),
      modoAperto: computeModoAperto(profile, transactions, categories),
      expenseMoM: computeMoMChange(transactions, "expense"),
      incomeMoM: computeMoMChange(transactions, "income"),
      periodLabel: formatPeriodLabel(),
      hasData: transactions.length > 0 || Number(profile?.current_balance) > 0,
      financialScore: computeFinancialScore(transactions, profile),
      spendingPrediction: predictSpending(transactions),
      behaviorAnalysis: analyzeBehavior(transactions, categories),
      financialAlerts: generateFinancialAlerts(transactions, categories, profile, cards),
      economyProjection: projectEconomy(transactions, categories, profile),
      cardProjections: projectCardPayments(transactions, cards),
      weeklyAnalysis: analyzeWeeklySpending(transactions),
      monthlyAnalysis: analyzeMonthlySpending(transactions),
    }
  }, [transactions, categories, cards, goals, profile])

  const addTransaction = async (
    payload: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    if (!user) return { error: "Nao autenticado" }
    const supabase = createClient()
    const { error } = await supabase.from("transactions").insert({
      ...payload,
      user_id: user.id,
    })
    if (!error && payload.card_id && payload.type === "expense" && payload.payment_method === "credito") {
      const card = cards.find((c) => c.id === payload.card_id)
      if (card) {
        await supabase
          .from("cards")
          .update({
            amount_used: Number(card.amount_used) + Number(payload.amount),
            current_invoice: Number(card.current_invoice) + Number(payload.amount),
          })
          .eq("id", card.id)
      }
    }
    await refresh()
    return { error: error?.message ?? null }
  }

  const updateTransaction = async (id: string, payload: Partial<Transaction>) => {
    const supabase = createClient()
    const { error } = await supabase.from("transactions").update(payload).eq("id", id)
    await refresh()
    return { error: error?.message ?? null }
  }

  const deleteTransaction = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("transactions").delete().eq("id", id)
    await refresh()
    return { error: error?.message ?? null }
  }
const addCard = async (
  payload: Omit<Card, "id" | "user_id" | "created_at" | "updated_at">
) => {
  if (!user) return { error: "Não autenticado" }

  const supabase = createClient()

  const { error } = await supabase.from("cards").insert({
    ...payload,
    user_id: user.id,
  })

  await refresh()

  return { error: error?.message ?? null }
}
  const updateProfile = async (payload: Partial<Profile>) => {
    if (!user) return { error: "Nao autenticado" }
    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", user.id)
    await refresh()
    return { error: error?.message ?? null }
  }

  const toggleModoAperto = async (enabled: boolean) => {
    await updateProfile({ modo_aperto: enabled })
  }

  const uploadAttachment = async (file: File) => {
    if (!user) return { url: null, error: "Nao autenticado" }
    const supabase = createClient()
    const ext = file.name.split(".").pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from("attachments").upload(path, file)
    if (error) return { url: null, error: error.message }
    const { data } = supabase.storage.from("attachments").getPublicUrl(path)
    return { url: data.publicUrl, error: null }
  }

  const value: FinanceContextValue = {
    user,
    profile,
    categories,
    transactions,
    cards,
    goals,
    installments,
    calendarEvents,
    fundDeposits,
    loading,
    ...computed,
    refresh,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateProfile,
    toggleModoAperto,
    addCard,
    uploadAttachment,
  }

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider")
  return ctx
}
