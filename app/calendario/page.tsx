"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Plus, TrendingUp, Receipt, Briefcase, CreditCard } from "lucide-react"
import { useFinance } from "@/providers/finance-provider"
import { createClient } from "@/lib/supabase/client"
import { EmptyState } from "@/components/empty-state"

const typeIcons = {
  bill: Receipt,
  income: TrendingUp,
  freelance: Briefcase,
  installment: CreditCard,
  other: Calendar,
}

const typeLabels = {
  bill: "Conta",
  income: "Entrada",
  freelance: "Freela",
  installment: "Parcela",
  other: "Outro",
}

export default function CalendarioPage() {
  const { calendarEvents, installments, refresh, user } = useFinance()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [eventType, setEventType] = useState<"bill" | "income" | "freelance" | "installment" | "other">("bill")

  const installmentEvents = installments
    .filter((i) => i.status === "active" && i.next_due_date)
    .map((i) => ({
      id: `inst-${i.id}`,
      title: i.name,
      event_type: "installment" as const,
      amount: i.monthly_amount,
      event_date: i.next_due_date!,
      is_recurring: true,
    }))

  const allEvents = [
    ...calendarEvents,
    ...installmentEvents,
  ].sort((a, b) => a.event_date.localeCompare(b.event_date))

  const addEvent = async () => {
    if (!user || !title || !date) return
    const supabase = createClient()
    await supabase.from("calendar_events").insert({
      user_id: user.id,
      title,
      event_type: eventType,
      amount: parseFloat(amount.replace(",", ".")) || 0,
      event_date: date,
    })
    setShowForm(false)
    setTitle("")
    setAmount("")
    setDate("")
    await refresh()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Calendario financeiro</h1>
          <p className="text-muted-foreground mt-1">Vencimentos, entradas e parcelas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-medium glow-primary"
        >
          <Plus className="w-4 h-4" /> Evento
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-3xl bg-card/30 border border-border/50 space-y-4"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titulo"
            className="w-full py-3 px-4 rounded-xl bg-card/50 border border-border/50 text-foreground"
          />
          <div className="flex gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 py-3 px-4 rounded-xl bg-card/50 border border-border/50 text-foreground"
            />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Valor R$"
              className="w-32 py-3 px-4 rounded-xl bg-card/50 border border-border/50 text-foreground"
            />
          </div>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value as typeof eventType)}
            className="w-full py-3 px-4 rounded-xl bg-card/50 border border-border/50 text-foreground"
          >
            <option value="bill">Conta a pagar</option>
            <option value="income">Entrada prevista</option>
            <option value="freelance">Freela</option>
            <option value="other">Outro</option>
          </select>
          <button onClick={addEvent} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium">
            Salvar
          </button>
        </motion.div>
      )}

      {allEvents.length === 0 ? (
        <EmptyState
          title="Calendario vazio"
          description="Adicione vencimentos, entradas previstas ou freelas para planejar seu mes."
          actionLabel="Adicionar evento"
          actionHref="#"
        />
      ) : (
        <div className="space-y-3">
          {allEvents.map((event, i) => {
            const Icon = typeIcons[event.event_type] || Calendar
            const d = new Date(event.event_date + "T12:00:00")
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-card/30 border border-border/50"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-primary">{d.getDate()}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">
                    {d.toLocaleDateString("pt-BR", { month: "short" })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{typeLabels[event.event_type]}</p>
                </div>
                <div className="text-right shrink-0">
                  {event.amount != null && Number(event.amount) > 0 && (
                    <p className="font-semibold text-foreground tabular-nums">
                      R$ {Number(event.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  )}
                  <Icon className="w-4 h-4 text-muted-foreground ml-auto mt-1" />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
