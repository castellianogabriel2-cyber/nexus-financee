"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert, X, Calendar, Wallet } from "lucide-react"
import { useFinance } from "@/providers/finance-provider"

export function ModoApertoPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile, modoAperto, toggleModoAperto } = useFinance()

  if (!profile?.modo_aperto && !open) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-x-4 bottom-24 lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:inset-x-auto lg:w-full lg:max-w-lg z-50 glass-strong rounded-3xl p-6 border border-warning/30"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-warning/20 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Modo Aperto</h2>
                  <p className="text-sm text-muted-foreground">Orcamento de sobrevivencia ativo</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-card/50 flex items-center justify-center text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-card/50 rounded-2xl p-4 border border-border/50">
                <Calendar className="w-4 h-4 text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {modoAperto.daysUntilPayday}
                </p>
                <p className="text-xs text-muted-foreground">dias ate o pagamento</p>
              </div>
              <div className="bg-card/50 rounded-2xl p-4 border border-border/50">
                <Wallet className="w-4 h-4 text-success mb-2" />
                <p className="text-2xl font-bold text-primary tabular-nums">
                  R$ {modoAperto.dailyAllowance.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground">por dia disponivel</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-sm font-medium text-foreground">Gastos essenciais</p>
              {modoAperto.essentials.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum gasto essencial registrado ainda.</p>
              ) : (
                modoAperto.essentials.map((e) => (
                  <div key={e.name} className="flex justify-between text-sm py-2 border-b border-border/30">
                    <span className="text-muted-foreground">{e.name}</span>
                    <span className="font-medium text-foreground">
                      R$ {e.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Sobrevivencia estimada: <span className="text-foreground font-semibold">{modoAperto.survivalDays} dias</span> no ritmo atual.
            </p>

            <button
              onClick={() => {
                toggleModoAperto(false)
                onClose()
              }}
              className="w-full py-4 rounded-2xl bg-muted text-foreground font-medium"
            >
              Desativar Modo Aperto
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function ModoApertoBanner() {
  const { profile, modoAperto } = useFinance()
  if (!profile?.modo_aperto) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 rounded-2xl bg-warning/10 border border-warning/30 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-warning shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">Modo Aperto ativo</p>
          <p className="text-xs text-muted-foreground">
            Voce pode gastar R$ {modoAperto.dailyAllowance.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}/dia
          </p>
        </div>
      </div>
    </motion.div>
  )
}
