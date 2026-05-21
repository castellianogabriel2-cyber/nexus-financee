"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Bell, Check, AlertTriangle, Info, TrendingUp, Target, CreditCard, Wallet, Brain, Calendar } from "lucide-react"
import type { Notification, NotificationPriority } from "@/lib/notifications/types"

interface NotificationCenterProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
  onMarkAsRead: (id: string) => void
  onAction: (notification: Notification) => void
}

export function NotificationCenter({
  notifications,
  onDismiss,
  onMarkAsRead,
  onAction,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "unread" | "urgent">("all")

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read
    if (filter === "urgent") return notif.priority === "urgent"
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const priorityIcons = {
    low: Info,
    medium: Bell,
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

  const formatTime = (date: string) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diffMs = now.getTime() - notifDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Agora"
    if (diffMins < 60) return `${diffMins}min`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return notifDate.toLocaleDateString("pt-BR")
  }

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-card/50 transition-colors"
      >
        <Bell className="w-6 h-6 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Center Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-strong border-l border-border/50 z-50 overflow-hidden"
              style={{ paddingTop: 'env(safe-area-inset-top)' }}
            >
              {/* Header */}
              <div className="p-4 border-b border-border/30">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Notificações</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl hover:bg-card/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground" />
                  </button>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === "all"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card/50 text-foreground hover:bg-card"
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFilter("unread")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === "unread"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card/50 text-foreground hover:bg-card"
                    }`}
                  >
                    Não lidas
                  </button>
                  <button
                    onClick={() => setFilter("urgent")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filter === "urgent"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card/50 text-foreground hover:bg-card"
                    }`}
                  >
                    Urgentes
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => {
                    const PriorityIcon = priorityIcons[notification.priority]
                    const CategoryIcon = categoryIcons[notification.category]

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl border ${priorityColors[notification.priority]} ${!notification.read ? "bg-card/50" : "bg-card/30"}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                            notification.priority === "urgent" ? "bg-rose-500/20" : "bg-primary/20"
                          }`}>
                            <CategoryIcon className="w-5 h-5 text-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-foreground">{notification.title}</h3>
                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{notification.body}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(notification.createdAt)}
                              </span>
                              {notification.actionLabel && (
                                <button
                                  onClick={() => {
                                    onAction(notification)
                                    onMarkAsRead(notification.id)
                                  }}
                                  className="text-xs text-primary font-medium hover:opacity-80 transition-opacity"
                                >
                                  {notification.actionLabel}
                                </button>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => onDismiss(notification.id)}
                            className="flex-shrink-0 p-1 rounded-lg hover:bg-card/50 transition-colors"
                          >
                            <X className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/30">
                <button
                  onClick={() => {
                    notifications.forEach((n) => onMarkAsRead(n.id))
                  }}
                  className="w-full py-2 rounded-xl bg-card/50 text-foreground text-sm font-medium hover:bg-card transition-colors"
                >
                  Marcar todas como lidas
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
