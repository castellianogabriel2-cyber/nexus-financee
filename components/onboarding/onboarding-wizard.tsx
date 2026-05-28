"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AdaptiveLogo } from "@/components/adaptive-logo"
import { createClient } from "@/lib/supabase/client"
import { DEFAULT_CATEGORIES, CARD_GRADIENTS } from "@/lib/finance/defaults"
import { minimalLuxury } from "@/lib/design-system/minimal-luxury"
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
  { id: 1, title: "Como podemos te chamar?", subtitle: "Personalize sua experiencia desde o primeiro dia.", icon: User },
  { id: 2, title: "Sua situacao financeira", subtitle: "Sem dados ficticios — apenas o que voce informar.", icon: Wallet },
  { id: 3, title: "Qual sua maior dificuldade?", subtitle: "Vamos adaptar o Nexus para suas necessidades.", icon: Target },
  { id: 4, title: "Reserva de emergencia", subtitle: "Quanto voce quer guardar para imprevistos?", icon: Shield },
  { id: 5, title: "Metas financeiras", subtitle: "Opcional — adicione metas que deseja alcancar.", icon: Target },
  { id: 6, title: "Seus cartoes", subtitle: "Opcional — cadastre seus cartoes de credito.", icon: CreditCard },
  { id: 7, title: "Gastos fixos", subtitle: "Opcional — aluguel, internet, assinaturas...", icon: Receipt },
]

type GoalInput = { name: string; target: string; color: string }
type CardInput = { bank: string; limit: string; digits: string }
type FixedInput = { name: string; amount: string }

type FinancialDifficulty = 'economizar' | 'dividas' | 'investir' | 'controlar' | 'organizar' | null

export function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [fullName, setFullName] = useState("")
  const [monthlyIncome, setMonthlyIncome] = useState("")
  const [currentBalance, setCurrentBalance] = useState("")
  const [financialDifficulty, setFinancialDifficulty] = useState<FinancialDifficulty>(null)
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
    if (step === 3) return financialDifficulty !== null
    if (step === 4) return parseMoney(reserveTarget) >= 0
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
          financial_difficulty: financialDifficulty,
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
    <div className="min-h-screen relative flex items-center justify-center p-6" style={{ background: minimalLuxury.colors.background.primary }}>
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)",
        }}
      />

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="flex items-center gap-4 mb-12"
        >
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center"
            style={{
              background: minimalLuxury.colors.accent.primary + "15",
            }}
          >
            <AdaptiveLogo className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: minimalLuxury.colors.text.primary }}>
              Configurar Nexus
            </h1>
            <p className="text-sm" style={{ color: minimalLuxury.colors.text.quaternary }}>
              Passo {step} de {STEPS.length}
            </p>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-12">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`h-[2px] flex-1 rounded-full transition-all duration-500 ${
                s.id <= step ? "" : ""
              }`}
              style={{
                background: s.id <= step ? minimalLuxury.colors.accent.primary : minimalLuxury.colors.border.medium,
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="relative overflow-hidden rounded-3xl p-8 lg:p-12"
            style={{
              background: minimalLuxury.glass.strong.background,
              backdropFilter: minimalLuxury.glass.strong.backdropFilter,
              WebkitBackdropFilter: minimalLuxury.glass.strong.backdropFilter,
              border: `1px solid ${minimalLuxury.colors.border.subtle}`,
            }}
          >
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3" style={{ color: minimalLuxury.colors.text.primary }}>
              {STEPS[step - 1].title}
            </h2>
            <p className="text-lg mb-8" style={{ color: minimalLuxury.colors.text.tertiary }}>
              {STEPS[step - 1].subtitle}
            </p>

            {step === 1 && (
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome"
                className="w-full py-5 px-6 rounded-2xl text-lg tracking-wide outline-none transition-all"
                style={{
                  background: minimalLuxury.colors.background.elevated,
                  border: `1px solid ${minimalLuxury.colors.border.subtle}`,
                  color: minimalLuxury.colors.text.primary,
                }}
                autoFocus
              />
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm uppercase tracking-[0.2em] mb-3 block" style={{ color: minimalLuxury.colors.text.quaternary }}>
                    Renda mensal
                  </label>
                  <div className="flex items-center gap-3 py-5 px-6 rounded-2xl" style={{ background: minimalLuxury.colors.background.elevated, border: `1px solid ${minimalLuxury.colors.border.subtle}` }}>
                    <span style={{ color: minimalLuxury.colors.text.tertiary }}>R$</span>
                    <input
                      inputMode="numeric"
                      value={formatInput(monthlyIncome)}
                      onChange={(e) => setMonthlyIncome(e.target.value.replace(/\D/g, ""))}
                      className="flex-1 bg-transparent text-3xl font-semibold tabular-nums tracking-tight outline-none"
                      style={{ color: minimalLuxury.colors.text.primary }}
                      placeholder="0,00"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm uppercase tracking-[0.2em] mb-3 block" style={{ color: minimalLuxury.colors.text.quaternary }}>
                    Saldo atual
                  </label>
                  <div className="flex items-center gap-3 py-5 px-6 rounded-2xl" style={{ background: minimalLuxury.colors.background.elevated, border: `1px solid ${minimalLuxury.colors.border.subtle}` }}>
                    <span style={{ color: minimalLuxury.colors.text.tertiary }}>R$</span>
                    <input
                      inputMode="numeric"
                      value={formatInput(currentBalance)}
                      onChange={(e) => setCurrentBalance(e.target.value.replace(/\D/g, ""))}
                      className="flex-1 bg-transparent text-3xl font-semibold tabular-nums tracking-tight outline-none"
                      style={{ color: minimalLuxury.colors.text.primary }}
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {[
                  { value: 'economizar' as const, label: 'Quero economizar mais', icon: '💰' },
                  { value: 'dividas' as const, label: 'Quero sair das dívidas', icon: '📉' },
                  { value: 'investir' as const, label: 'Quero começar a investir', icon: '📈' },
                  { value: 'controlar' as const, label: 'Quero controlar meus gastos', icon: '🎯' },
                  { value: 'organizar' as const, label: 'Quero organizar minhas finanças', icon: '📊' },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => setFinancialDifficulty(option.value)}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                      financialDifficulty === option.value
                        ? ''
                        : ''
                    }`}
                    style={{
                      background: financialDifficulty === option.value
                        ? minimalLuxury.colors.accent.primary + "15"
                        : minimalLuxury.colors.background.elevated,
                      borderColor: financialDifficulty === option.value
                        ? minimalLuxury.colors.accent.primary
                        : minimalLuxury.colors.border.subtle,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{option.icon}</span>
                      <span className="font-medium tracking-wide" style={{ color: minimalLuxury.colors.text.secondary }}>
                        {option.label}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="flex items-center gap-3 py-5 px-6 rounded-2xl" style={{ background: minimalLuxury.colors.background.elevated, border: `1px solid ${minimalLuxury.colors.border.subtle}` }}>
                <span style={{ color: minimalLuxury.colors.text.tertiary }}>R$</span>
                <input
                  inputMode="numeric"
                  value={formatInput(reserveTarget)}
                  onChange={(e) => setReserveTarget(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 bg-transparent text-3xl font-semibold tabular-nums tracking-tight outline-none"
                  style={{ color: minimalLuxury.colors.text.primary }}
                  placeholder="0,00"
                />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                {goals.map((g, i) => (
                  <div key={i} className="flex gap-4">
                    <input
                      value={g.name}
                      onChange={(e) => {
                        const next = [...goals]
                        next[i].name = e.target.value
                        setGoals(next)
                      }}
                      placeholder="Nome da meta"
                      className="flex-1 py-4 px-5 rounded-xl text-sm tracking-wide outline-none"
                      style={{
                        background: minimalLuxury.colors.background.elevated,
                        border: `1px solid ${minimalLuxury.colors.border.subtle}`,
                        color: minimalLuxury.colors.text.primary,
                      }}
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
                      className="w-32 py-4 px-4 rounded-xl text-sm tabular-nums tracking-tight outline-none"
                      style={{
                        background: minimalLuxury.colors.background.elevated,
                        border: `1px solid ${minimalLuxury.colors.border.subtle}`,
                        color: minimalLuxury.colors.text.primary,
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setGoals([...goals, { name: "", target: "", color: "#60a5fa" }])}
                  className="text-sm tracking-wide"
                  style={{ color: minimalLuxury.colors.accent.primary }}
                >
                  + Adicionar meta
                </button>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                {cards.map((c, i) => (
                  <div key={i} className="space-y-3 p-5 rounded-2xl" style={{ background: minimalLuxury.colors.background.elevated, border: `1px solid ${minimalLuxury.colors.border.subtle}` }}>
                    <input
                      value={c.bank}
                      onChange={(e) => {
                        const next = [...cards]
                        next[i].bank = e.target.value
                        setCards(next)
                      }}
                      placeholder="Banco (ex: Nubank)"
                      className="w-full py-3 px-4 rounded-xl text-sm tracking-wide outline-none"
                      style={{
                        background: minimalLuxury.colors.background.primary,
                        border: `1px solid ${minimalLuxury.colors.border.subtle}`,
                        color: minimalLuxury.colors.text.primary,
                      }}
                    />
                    <div className="flex gap-3">
                      <input
                        inputMode="numeric"
                        value={c.limit ? formatInput(c.limit) : ""}
                        onChange={(e) => {
                          const next = [...cards]
                          next[i].limit = e.target.value.replace(/\D/g, "")
                          setCards(next)
                        }}
                        placeholder="Limite"
                        className="flex-1 py-3 px-4 rounded-xl text-sm tabular-nums tracking-tight outline-none"
                        style={{
                          background: minimalLuxury.colors.background.primary,
                          border: `1px solid ${minimalLuxury.colors.border.subtle}`,
                          color: minimalLuxury.colors.text.primary,
                        }}
                      />
                      <input
                        value={c.digits}
                        onChange={(e) => {
                          const next = [...cards]
                          next[i].digits = e.target.value.slice(0, 4)
                          setCards(next)
                        }}
                        placeholder="4 dígitos"
                        className="w-28 py-3 px-4 rounded-xl text-sm tabular-nums tracking-tight outline-none"
                        style={{
                          background: minimalLuxury.colors.background.primary,
                          border: `1px solid ${minimalLuxury.colors.border.subtle}`,
                          color: minimalLuxury.colors.text.primary,
                        }}
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCards([...cards, { bank: "", limit: "", digits: "" }])}
                  className="text-sm tracking-wide"
                  style={{ color: minimalLuxury.colors.accent.primary }}
                >
                  + Adicionar cartão
                </button>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4">
                {fixedExpenses.map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <input
                      value={f.name}
                      onChange={(e) => {
                        const next = [...fixedExpenses]
                        next[i].name = e.target.value
                        setFixedExpenses(next)
                      }}
                      placeholder="Ex: Aluguel"
                      className="flex-1 py-4 px-5 rounded-xl text-sm tracking-wide outline-none"
                      style={{
                        background: minimalLuxury.colors.background.elevated,
                        border: `1px solid ${minimalLuxury.colors.border.subtle}`,
                        color: minimalLuxury.colors.text.primary,
                      }}
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
                      className="w-32 py-4 px-4 rounded-xl text-sm tabular-nums tracking-tight outline-none"
                      style={{
                        background: minimalLuxury.colors.background.elevated,
                        border: `1px solid ${minimalLuxury.colors.border.subtle}`,
                        color: minimalLuxury.colors.text.primary,
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFixedExpenses([...fixedExpenses, { name: "", amount: "" }])}
                  className="text-sm tracking-wide"
                  style={{ color: minimalLuxury.colors.accent.primary }}
                >
                  + Adicionar gasto fixo
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {saveError && (
          <p className="mt-6 text-sm text-center px-4" style={{ color: minimalLuxury.colors.semantic.error }}>
            {saveError}
          </p>
        )}

        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              type="button"
              disabled={saving}
              onClick={() => setStep(step - 1)}
              className="flex-1 py-5 rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 tracking-wide"
              style={{
                background: minimalLuxury.colors.background.elevated,
                border: `1px solid ${minimalLuxury.colors.border.subtle}`,
                color: minimalLuxury.colors.text.secondary,
              }}
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
          )}
          <button
            type="button"
            disabled={!canProceed() || saving}
            onClick={handlePrimaryAction}
            className="flex-1 py-5 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 tracking-wide"
            style={{
              background: minimalLuxury.colors.accent.primary,
              color: minimalLuxury.colors.background.primary,
            }}
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : step < STEPS.length ? (
              <>Continuar <ArrowRight className="w-4 h-4" /></>
            ) : (
              <>Começar <Sparkles className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
