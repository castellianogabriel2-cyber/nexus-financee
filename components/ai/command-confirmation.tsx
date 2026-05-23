"use client"

import { motion } from "framer-motion"
import { Check, X, Edit2, AlertTriangle, CreditCard, Wallet, Target, Shield } from "lucide-react"
import { ParsedTransaction } from "@/lib/ai/transaction-parser"
import { cn } from "@/lib/utils"

interface CommandConfirmationProps {
  command: ParsedTransaction
  onConfirm: () => void
  onEdit: () => void
  onCancel: () => void
}

export function CommandConfirmation({ command, onConfirm, onEdit, onCancel }: CommandConfirmationProps) {
  const getActionIcon = () => {
    if (command.installments_total > 1) return CreditCard
    if (command.type === 'income') return Wallet
    return Wallet
  }

  const getActionLabel = () => {
    if (command.installments_total > 1) return 'Parcelamento'
    return command.type === 'income' ? 'Receita' : 'Despesa'
  }

  const ActionIcon = getActionIcon()

  // Format payment method for display
  const getPaymentMethodDisplay = () => {
    if (!command.payment_method) return 'Não informado'
    const methodMap: Record<string, string> = {
      'credit_card': 'Cartão',
      'debit_card': 'Débito',
      'pix': 'Pix',
      'cash': 'Dinheiro',
      'bank_transfer': 'Boleto',
    }
    return methodMap[command.payment_method] || command.payment_method
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/80 border border-border/50 rounded-xl p-3 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <ActionIcon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm mb-0.5">
            {getActionLabel()}
          </h3>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1.5 mb-3">
        <div className="flex justify-between items-center py-1 border-b border-border/30">
          <span className="text-xs text-muted-foreground">Valor</span>
          <span className="text-xs font-semibold text-foreground">
            R$ {command.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-border/30">
          <span className="text-xs text-muted-foreground">Descrição</span>
          <span className="text-xs font-medium text-foreground text-right max-w-[150px] truncate">
            {command.description}
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-border/30">
          <span className="text-xs text-muted-foreground">Pagamento</span>
          <span className="text-xs font-medium text-foreground">
            {getPaymentMethodDisplay()}
          </span>
        </div>

        {command.installments_total > 1 && (
          <div className="flex justify-between items-center py-1 border-b border-border/30">
            <span className="text-xs text-muted-foreground">Parcelas</span>
            <span className="text-xs font-medium text-foreground">
              {command.installments_total}x
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1.5">
        <motion.button
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-3 py-2 rounded-lg border border-border/50 text-xs font-medium text-foreground hover:bg-card/50 transition-colors flex items-center justify-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          Cancelar
        </motion.button>

        <motion.button
          onClick={onEdit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-3 py-2 rounded-lg border border-border/50 text-xs font-medium text-foreground hover:bg-card/50 transition-colors flex items-center justify-center gap-1.5"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Editar
        </motion.button>

        <motion.button
          onClick={onConfirm}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5",
            "bg-primary text-primary-foreground"
          )}
        >
          <Check className="w-3.5 h-3.5" />
          Confirmar
        </motion.button>
      </div>
    </motion.div>
  )
}
