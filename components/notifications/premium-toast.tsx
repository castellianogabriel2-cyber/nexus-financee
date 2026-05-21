"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertTriangle, Info, TrendingUp, Target, CreditCard, Wallet, Brain, Calendar, ChevronRight } from "lucide-react"
import type { Notification, NotificationPriority } from "@/lib/notifications/types"

interface PremiumToastProps {
  notification: Omit<Notification, "id" | "read" | "createdAt">
  onClose: () => void
  onAction?: () => void
  duration?: number
}

export function PremiumToast({ notification, onClose, onAction, duration = 5000 }: PremiumToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const priorityIcons = {
    low: Info,
    medium: Info,
    high: AlertTriangle,
    urgent: AlertTriangle,
  }

  const categoryIcons = {
    bills: Wallet,
    cards: CreditCard,
    goals: Target,
    spending: TrendingUp,
    balance: Wallet,
    modo_aperto: AlertTriangle,
    insights: Brain,
    savings: Target,
    summary: Calendar,
  }

  const priorityColors = {
    low: "border-blue-500/50 bg-blue-500/10",
    medium: "border-yellow-500/50 bg-yellow-500/10",
    high: "border-orange-500/50 bg-orange-500/10",
    urgent: "border-rose-500/50 bg-rose-500/10",
  }

  const PriorityIcon = priorityIcons[notification.priority]
  const CategoryIcon = categoryIcons[notification.category]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 400, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 400, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={`fixed right-4 top-20 z-50 w-full max-w-md p-4 rounded-2xl border glass-strong ${priorityColors[notification.priority]} shadow-2xl`}
          style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
              notification.priority === "urgent" ? "bg-rose-500/20" : "bg-primary/20"
            }`}>
              <CategoryIcon className="w-5 h-5 text-foreground" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-semibold text-foreground">{notification.title}</h3>
                <button
                  onClick={() => {
                    setIsVisible(false)
                    setTimeout(onClose, 300)
                  }}
                  className="flex-shrink-0 p-1 rounded-lg hover:bg-card/50 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{notification.body}</p>

              {/* Action Button */}
              {notification.actionLabel && onAction && (
                <button
                  onClick={() => {
                    onAction()
                    setIsVisible(false)
                    setTimeout(onClose, 300)
                  }}
                  className="flex items-center gap-1 text-xs text-primary font-medium hover:opacity-80 transition-opacity"
                >
                  {notification.actionLabel}
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {duration > 0 && (
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-primary/60"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ToastContainerProps {
  toasts: Array<Omit<Notification, "id" | "read" | "createdAt"> & { id: string }>
  onDismiss: (id: string) => void
  onAction?: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss, onAction }: ToastContainerProps) {
  return (
    <div className="fixed right-4 top-20 z-50 w-full max-w-md space-y-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => (
          <div key={toast.id} className="pointer-events-auto" style={{ zIndex: 100 - index }}>
            <PremiumToast
              notification={toast}
              onClose={() => onDismiss(toast.id)}
              onAction={onAction ? () => onAction(toast.id) : undefined}
              duration={5000}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
