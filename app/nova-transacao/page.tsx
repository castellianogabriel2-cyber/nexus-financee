"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Home,
  Receipt,
  UtensilsCrossed,
  Heart,
  GraduationCap,
  Gamepad2,
  Car,
  MoreHorizontal,
  Banknote,
  Zap,
  CreditCard,
  Check,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  Paperclip,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PAYMENT_METHODS } from "@/lib/finance/defaults"
import { useFinance } from "@/providers/finance-provider"

const iconMap: Record<string, React.ElementType> = {
  Home,
  Receipt,
  UtensilsCrossed,
  Heart,
  GraduationCap,
  Gamepad2,
  Car,
  MoreHorizontal,
  Banknote,
  Zap,
  CreditCard,
}

export default function NovaTransacaoPage() {
  const router = useRouter()
  const { categories, cardsData, addTransaction, uploadAttachment } = useFinance()
  const [transactionType, setTransactionType] = useState<"gasto" | "entrada">("gasto")
  const [amount, setAmount] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [notes, setNotes] = useState("")
  const [installments, setInstallments] = useState(1)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatCurrency = (value: string) => {
    const num = value.replace(/\D/g, "")
    return (parseInt(num || "0") / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value.replace(/\D/g, ""))
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const canProceed = () => {
    if (step === 1) return amount.length > 0 && parseInt(amount) > 0
    if (step === 2) return selectedCategory !== null
    if (step === 3) return selectedPayment !== null && (selectedPayment !== "credito" || selectedCard !== null)
    return true
  }

  const handleConfirm = async () => {
    setSaving(true)
    setError(null)
    let attachmentUrl: string | null = null
    if (attachment) {
      const up = await uploadAttachment(attachment)
      if (up.error) {
        setError(up.error)
        setSaving(false)
        return
      }
      attachmentUrl = up.url
    }

    const value = parseInt(amount) / 100
    const { error: err } = await addTransaction({
      type: transactionType === "gasto" ? "expense" : "income",
      amount: value,
      category_id: selectedCategory,
      payment_method: selectedPayment,
      card_id: selectedPayment === "credito" ? selectedCard : null,
      description: description || null,
      notes: notes || null,
      attachment_url: attachmentUrl,
      transaction_date: new Date().toISOString().split("T")[0],
      installments_total: installments,
      installment_current: 1,
      parent_installment_id: null,
    })

    setSaving(false)
    if (err) setError(err)
    else router.push("/gastos")
  }

  const transactionCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    color: c.color,
  }))

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/dashboard"
          className="w-10 h-10 rounded-xl bg-card/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-semibold text-foreground">Nova Transacao</h1>
        <div className="w-10" />
      </div>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-border/50"}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="flex items-center gap-2 p-1.5 bg-card/50 border border-border/50 rounded-2xl">
              <button
                onClick={() => setTransactionType("gasto")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  transactionType === "gasto" ? "bg-destructive/20 text-destructive" : "text-muted-foreground"
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" /> Gasto
              </button>
              <button
                onClick={() => setTransactionType("entrada")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  transactionType === "entrada" ? "bg-success/20 text-success" : "text-muted-foreground"
                }`}
              >
                <ArrowUpRight className="w-4 h-4" /> Entrada
              </button>
            </div>
            <div className="bg-card/30 border border-border/50 rounded-3xl p-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">Valor da transacao</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl text-muted-foreground">R$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatCurrency(amount)}
                  onChange={handleAmountChange}
                  className="text-5xl lg:text-6xl font-bold text-foreground bg-transparent border-none outline-none text-center w-full tabular-nums"
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[50, 100, 200, 500].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount((val * 100).toString())}
                  className="py-3 rounded-xl bg-card/50 border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  R$ {val}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Categoria</h2>
              <p className="text-muted-foreground">Selecione a categoria</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {transactionCategories.map((cat) => {
                const IconComponent = iconMap[cat.icon] || MoreHorizontal
                const isSelected = selectedCategory === cat.id
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      isSelected ? "bg-primary/10 border-primary/50" : "bg-card/50 border-border/50"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                      <IconComponent className="w-6 h-6" style={{ color: cat.color }} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{cat.name}</span>
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Forma de pagamento</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => {
                const IconComponent = iconMap[method.icon] || Banknote
                const isSelected = selectedPayment === method.id
                return (
                  <motion.button
                    key={method.id}
                    onClick={() => {
                      setSelectedPayment(method.id)
                      if (method.id !== "credito") setSelectedCard(null)
                    }}
                    className={`relative flex items-center gap-4 p-4 rounded-2xl border ${
                      isSelected ? "bg-primary/10 border-primary/50" : "bg-card/50 border-border/50"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-foreground" />
                    </div>
                    <span className="text-sm font-medium">{method.name}</span>
                  </motion.button>
                )
              })}
            </div>
            {selectedPayment === "credito" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Selecione o cartao</p>
                {cardsData.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(String(card.id))}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border ${
                      selectedCard === String(card.id) ? "bg-primary/10 border-primary/50" : "bg-card/50 border-border/50"
                    }`}
                  >
                    <div className={`w-12 h-8 rounded-lg bg-gradient-to-br ${card.color}`} />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{card.bank}</p>
                      <p className="text-xs text-muted-foreground">**** {card.lastDigits}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {transactionType === "gasto" && selectedPayment === "credito" && (
              <div>
                <label className="text-sm text-muted-foreground">Parcelas</label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={installments}
                  onChange={(e) => setInstallments(parseInt(e.target.value) || 1)}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-card/50 border border-border/50 text-foreground"
                />
              </div>
            )}
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descricao (opcional)"
              className="w-full h-24 p-4 rounded-2xl bg-card/50 border border-border/50 text-foreground resize-none focus:outline-none focus:border-primary/50"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observacoes (opcional)"
              className="w-full h-24 p-4 rounded-2xl bg-card/50 border border-border/50 text-foreground resize-none focus:outline-none focus:border-primary/50"
            />
            <label className="flex items-center gap-3 p-4 rounded-2xl bg-card/50 border border-border/50 cursor-pointer">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground flex-1">
                {attachment ? attachment.name : "Anexar comprovante"}
              </span>
              <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 mt-8">
        {step > 1 && (
          <button onClick={handleBack} className="flex-1 py-4 rounded-2xl bg-card/50 border border-border/50 font-medium">
            Voltar
          </button>
        )}
        <button
          onClick={step === 4 ? handleConfirm : handleNext}
          disabled={!canProceed() || saving}
          className={`flex-1 py-4 rounded-2xl font-medium flex items-center justify-center gap-2 ${
            canProceed() ? "bg-primary text-primary-foreground glow-primary" : "bg-muted text-muted-foreground"
          }`}
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : step === 4 ? "Confirmar" : "Continuar"}
        </button>
      </div>
    </div>
  )
}
