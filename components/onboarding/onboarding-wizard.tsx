"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AdaptiveLogo } from "@/components/adaptive-logo"
import { createClient } from "@/lib/supabase/client"
import { DEFAULT_CATEGORIES, CARD_GRADIENTS } from "@/lib/finance/defaults"
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User,
  Wallet,
  Target,
  CreditCard,
  Receipt,
  Shield,
  Loader2,
} from "lucide-react"

const STEPS = [
  { id: 1, title: "Como podemos te chamar?", icon: User },
  { id: 2, title: "Sua situacao financeira", icon: Wallet },
  { id: 3, title: "Reserva de emergencia", icon: Shield },
  { id: 4, title: "Metas financeiras", icon: Target },
  { id: 5, title: "Seus cartoes", icon: CreditCard },
  { id: 6, title: "Gastos fixos", icon: Receipt },
]

type GoalInput = { name: string; target: string; color: string }
type CardInput = { bank: string; limit: string; digits: string }
type FixedInput = { name: string; amount: string }

export function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [fullName, setFullName] = useState("")
  const [monthlyIncome, setMonthlyIncome] = useState("")
  const [currentBalance, setCurrentBalance] = useState("")
  const [reserveTarget, setReserveTarget] = useState("")
  const [goals, setGoals] = useState<GoalInput[]>([{ name: "", target: "", color: "#34d399" }])
  const [cards, setCards] = useState<CardInput[]>([{ bank: "", limit: "", digits: "" }])
  const [fixedExpenses, setFixedExpenses] = useState<FixedInput[]>([{ name: "", amount: "" }])

  const parseMoney = (v: string) => parseFloat(v.replace(/\D/g, "")) / 100 || 0

  const formatInput = (v: string) => {
    const num = v.replace(/\D/g, "")
    return (parseInt(num || "0") / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const canProceed = () => {
    if (step === 1) return fullName.trim().length >= 2
    if (step === 2) return parseMoney(monthlyIncome) > 0
    if (step === 3) return parseMoney(reserveTarget) >= 0
    return true
  }

  const finish = async () => {
    setSaving(true)
    setSaveError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setSaveError("Sessao expirada. Faca login novamente.")
        return
      }

      const income = parseMoney(monthlyIncome)
      const balance = parseMoney(currentBalance)
      const reserve = parseMoney(reserveTarget)

      // 1. Perfil — upsert garante linha mesmo se o trigger de signup falhou
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: user.email ?? null,
          full_name: fullName.trim(),
          monthly_income: income,
          current_balance: balance,
          cash_balance: balance,
          emergency_reserve_target: reserve,
          emergency_reserve_current: 0,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )

      if (profileError) {
        console.error("[onboarding] profile", profileError)
        setSaveError(profileError.message || "Erro ao salvar perfil.")
        return
      }

      // 2. Categorias padrao (somente se ainda nao existirem)
      const { count: categoryCount } = await supabase
        .from("categories")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)

      if (!categoryCount) {
        const categoriesToInsert = DEFAULT_CATEGORIES.map((c) => ({
          user_id: user.id,
          slug: c.slug,
          name: c.name,
          color: c.color,
          icon: c.icon,
          is_essential: c.is_essential,
          is_fixed: false,
        }))
        const { error: catError } = await supabase
          .from("categories")
          .insert(categoriesToInsert)
        if (catError) {
          console.error("[onboarding] categories", catError)
          setSaveError(catError.message || "Erro ao criar categorias.")
          return
        }
      }

      // 3. Opcionais — falhas nao bloqueiam conclusao
      const validGoals = goals.filter((g) => g.name.trim() && parseMoney(g.target) > 0)
      if (validGoals.length > 0) {
        const { error } = await supabase.from("goals").insert(
          validGoals.map((g) => ({
            user_id: user.id,
            name: g.name.trim(),
            target_amount: parseMoney(g.target),
            current_amount: 0,
            color: g.color,
            is_emergency_fund: false,
          }))
        )
        if (error) console.error("[onboarding] goals", error)
      }

      if (reserve > 0) {
        const { count: reserveGoalCount } = await supabase
          .from("goals")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("is_emergency_fund", true)

        if (!reserveGoalCount) {
          const { error } = await supabase.from("goals").insert({
            user_id: user.id,
            name: "Reserva de emergencia",
            target_amount: reserve,
            current_amount: 0,
            color: "#34d399",
            is_emergency_fund: true,
          })
          if (error) console.error("[onboarding] reserve goal", error)
        }
      }

      const validCards = cards.filter(
        (c) => c.bank.trim() && parseMoney(c.limit) > 0
      )
      if (validCards.length > 0) {
        const { error } = await supabase.from("cards").insert(
          validCards.map((c, i) => ({
            user_id: user.id,
            bank: c.bank.trim(),
            last_digits: c.digits || "0000",
            holder: fullName.trim().toUpperCase(),
            credit_limit: parseMoney(c.limit),
            color: CARD_GRADIENTS[i % CARD_GRADIENTS.length],
          }))
        )
        if (error) console.error("[onboarding] cards", error)
      }

      const { data: cats } = await supabase
        .from("categories")
        .select("id, slug")
        .eq("user_id", user.id)
      const moradia = cats?.find((c) => c.slug === "moradia")

      const validFixed = fixedExpenses.filter(
        (f) => f.name.trim() && parseMoney(f.amount) > 0
      )
      if (validFixed.length > 0) {
        const { error } = await supabase.from("fixed_expenses").insert(
          validFixed.map((f) => ({
            user_id: user.id,
            name: f.name.trim(),
            amount: parseMoney(f.amount),
            category_id: moradia?.id ?? null,
            due_day: 5,
          }))
        )
        if (error) console.error("[onboarding] fixed_expenses", error)
      }

      // 4. Confirmar flag antes de redirecionar (evita loop com middleware)
      const { data: profileCheck, error: checkError } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single()

      if (checkError || !profileCheck?.onboarding_completed) {
        console.error("[onboarding] verify", checkError, profileCheck)
        setSaveError("Nao foi possivel confirmar o onboarding. Tente novamente.")
        return
      }

      // Navegacao completa para o middleware ler a sessao/perfil atualizados
      window.location.href = "/dashboard"
    } catch (err) {
      console.error("[onboarding] unexpected", err)
      setSaveError(
        err instanceof Error ? err.message : "Erro inesperado ao salvar."
      )
    } finally {
      setSaving(false)
    }
  }

  const handlePrimaryAction = () => {
    if (step < STEPS.length) {
      setStep(step + 1)
      return
    }
    void finish()
  }

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      <div className="fixed inset-0 gradient-radial pointer-events-none" />
      <div className="relative w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center glow-primary">
            <AdaptiveLogo className="w-12 h-12 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Configurar Nexus Finance</h1>
            <p className="text-sm text-muted-foreground">Passo {step} de {STEPS.length}</p>
          </div>
        </div>

        <div className="flex gap-1.5 mb-8">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`h-1 flex-1 rounded-full transition-colors ${s.id <= step ? "bg-primary" : "bg-border/40"}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="glass-strong rounded-3xl p-6 lg:p-8 border border-border/50"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">{STEPS[step - 1].title}</h2>
            <p className="text-muted-foreground text-sm mb-6">
              {step === 1 && "Personalize sua experiencia desde o primeiro dia."}
              {step === 2 && "Sem dados ficticios — apenas o que voce informar."}
              {step === 3 && "Quanto voce quer guardar para imprevistos?"}
              {step === 4 && "Opcional — adicione metas que deseja alcancar."}
              {step === 5 && "Opcional — cadastre seus cartoes de credito."}
              {step === 6 && "Opcional — aluguel, internet, assinaturas..."}
            </p>

            {step === 1 && (
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome"
                className="w-full py-4 px-4 rounded-2xl bg-card/50 border border-border/50 text-foreground text-lg focus:outline-none focus:border-primary/50"
                autoFocus
              />
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Renda mensal</label>
                  <div className="flex items-center gap-2 py-4 px-4 rounded-2xl bg-card/50 border border-border/50">
                    <span className="text-muted-foreground">R$</span>
                    <input
                      inputMode="numeric"
                      value={formatInput(monthlyIncome)}
                      onChange={(e) => setMonthlyIncome(e.target.value.replace(/\D/g, ""))}
                      className="flex-1 bg-transparent text-2xl font-bold text-foreground outline-none"
                      placeholder="0,00"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Saldo atual</label>
                  <div className="flex items-center gap-2 py-4 px-4 rounded-2xl bg-card/50 border border-border/50">
                    <span className="text-muted-foreground">R$</span>
                    <input
                      inputMode="numeric"
                      value={formatInput(currentBalance)}
                      onChange={(e) => setCurrentBalance(e.target.value.replace(/\D/g, ""))}
                      className="flex-1 bg-transparent text-2xl font-bold text-foreground outline-none"
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex items-center gap-2 py-4 px-4 rounded-2xl bg-card/50 border border-border/50">
                <span className="text-muted-foreground">R$</span>
                <input
                  inputMode="numeric"
                  value={formatInput(reserveTarget)}
                  onChange={(e) => setReserveTarget(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 bg-transparent text-2xl font-bold text-foreground outline-none"
                  placeholder="0,00"
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                {goals.map((g, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={g.name}
                      onChange={(e) => {
                        const next = [...goals]
                        next[i].name = e.target.value
                        setGoals(next)
                      }}
                      placeholder="Nome da meta"
                      className="flex-1 py-3 px-4 rounded-xl bg-card/50 border border-border/50 text-foreground text-sm"
                    />
                    <input
                      inputMode="numeric"
                      value={g.target ? formatInput(g.target) : ""}
                      onChange={(e) => {
                        const next = [...goals]
                        next[i].target = e.target.value.replace(/\D/g, "")
                        setGoals(next)
                      }}
                      placeholder="Valor"
                      className="w-28 py-3 px-3 rounded-xl bg-card/50 border border-border/50 text-foreground text-sm"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setGoals([...goals, { name: "", target: "", color: "#60a5fa" }])}
                  className="text-sm text-primary"
                >
                  + Adicionar meta
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-3">
                {cards.map((c, i) => (
                  <div key={i} className="space-y-2 p-4 rounded-2xl bg-card/30 border border-border/40">
                    <input
                      value={c.bank}
                      onChange={(e) => {
                        const next = [...cards]
                        next[i].bank = e.target.value
                        setCards(next)
                      }}
                      placeholder="Banco (ex: Nubank)"
                      className="w-full py-3 px-4 rounded-xl bg-card/50 border border-border/50 text-foreground text-sm"
                    />
                    <div className="flex gap-2">
                      <input
                        inputMode="numeric"
                        value={c.limit ? formatInput(c.limit) : ""}
                        onChange={(e) => {
                          const next = [...cards]
                          next[i].limit = e.target.value.replace(/\D/g, "")
                          setCards(next)
                        }}
                        placeholder="Limite"
                        className="flex-1 py-3 px-4 rounded-xl bg-card/50 border border-border/50 text-foreground text-sm"
                      />
                      <input
                        value={c.digits}
                        onChange={(e) => {
                          const next = [...cards]
                          next[i].digits = e.target.value.slice(0, 4)
                          setCards(next)
                        }}
                        placeholder="4 digitos"
                        className="w-24 py-3 px-4 rounded-xl bg-card/50 border border-border/50 text-foreground text-sm"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCards([...cards, { bank: "", limit: "", digits: "" }])}
                  className="text-sm text-primary"
                >
                  + Adicionar cartao
                </button>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-3">
                {fixedExpenses.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={f.name}
                      onChange={(e) => {
                        const next = [...fixedExpenses]
                        next[i].name = e.target.value
                        setFixedExpenses(next)
                      }}
                      placeholder="Ex: Aluguel"
                      className="flex-1 py-3 px-4 rounded-xl bg-card/50 border border-border/50 text-foreground text-sm"
                    />
                    <input
                      inputMode="numeric"
                      value={f.amount ? formatInput(f.amount) : ""}
                      onChange={(e) => {
                        const next = [...fixedExpenses]
                        next[i].amount = e.target.value.replace(/\D/g, "")
                        setFixedExpenses(next)
                      }}
                      placeholder="Valor"
                      className="w-28 py-3 px-3 rounded-xl bg-card/50 border border-border/50 text-foreground text-sm"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFixedExpenses([...fixedExpenses, { name: "", amount: "" }])}
                  className="text-sm text-primary"
                >
                  + Adicionar gasto fixo
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {saveError && (
          <p className="mt-4 text-sm text-destructive text-center px-2">{saveError}</p>
        )}

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              type="button"
              disabled={saving}
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 rounded-2xl bg-card/50 border border-border/50 text-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
          )}
          <button
            type="button"
            disabled={!canProceed() || saving}
            onClick={handlePrimaryAction}
            className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold glow-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : step < STEPS.length ? (
              <>Continuar <ArrowRight className="w-4 h-4" /></>
            ) : (
              <>Comecar <Sparkles className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
