"use client"

import { motion, AnimatePresence } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { Sparkles, Heart, TrendingUp, CheckCircle, X } from "lucide-react"
import { useState, useEffect } from "react"

/**
 * Nexus OS - Premium Notifications
 * 
 * Philosophy:
 * - Sistema de notificações inteligentes
 * - Calma, sofisticada, premium
 * 
 * Examples:
 * - "Seu saldo está mais saudável hoje."
 * - "Você manteve consistência essa semana."
 * - "Seu comportamento financeiro evoluiu."
 */

interface Notification {
  id: string
  type: "success" | "insight" | "celebration"
  message: string
  icon: React.ReactNode
  color: string
  timestamp: Date
}

function generateSmartNotifications(
  balance: number,
  income: number,
  expenses: number,
  savingsRate: number
): Notification[] {
  const notifications: Notification[] = []
  const now = new Date()

  // Success notifications
  if (balance > 0 && savingsRate > 15) {
    notifications.push({
      id: "1",
      type: "success",
      message: "Seu saldo está mais saudável hoje.",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "#00ff9d",
      timestamp: now,
    })
  }

  if (savingsRate > 20) {
    notifications.push({
      id: "2",
      type: "success",
      message: "Você manteve consistência essa semana.",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "#00d4ff",
      timestamp: now,
    })
  }

  // Insight notifications
  if (expenses < income * 0.8) {
    notifications.push({
      id: "3",
      type: "insight",
      message: "Seus gastos estão dentro do planejado.",
      icon: <Sparkles className="w-5 h-5" />,
      color: "#00d4ff",
      timestamp: now,
    })
  }

  // Celebration notifications
  if (balance > income * 0.5) {
    notifications.push({
      id: "4",
      type: "celebration",
      message: "Seu comportamento financeiro evoluiu.",
      icon: <Heart className="w-5 h-5" />,
      color: "#f472b6",
      timestamp: now,
    })
  }

  return notifications.slice(0, 3)
}

export function PremiumNotifications({ 
  balance,
  income,
  expenses,
  savingsRate,
  className = "" 
}: { 
  balance: number
  income: number
  expenses: number
  savingsRate: number
  className?: string 
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => {
    const generatedNotifications = generateSmartNotifications(balance, income, expenses, savingsRate)
    setNotifications(generatedNotifications)
    
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [balance, income, expenses, savingsRate])

  const activeNotifications = notifications.filter(n => !dismissed.has(n.id))

  const dismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]))
  }

  if (activeNotifications.length === 0) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className={`fixed top-24 right-6 z-50 space-y-3 ${className}`}
        >
          {activeNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className="relative p-4 rounded-2xl shadow-2xl"
              style={{
                background: nexusOS.glass.light.background,
                backdropFilter: nexusOS.glass.light.backdropFilter,
                border: `1px solid ${notification.color}30`,
                maxWidth: "320px",
              }}
            >
              <button
                onClick={() => dismiss(notification.id)}
                className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
                style={{ color: nexusOS.colors.text.tertiary }}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-3 pr-6">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="p-2 rounded-xl flex-shrink-0"
                  style={{
                    background: notification.color + "15",
                    color: notification.color,
                  }}
                >
                  {notification.icon}
                </motion.div>

                <div className="flex-1">
                  <p className="text-sm font-medium leading-relaxed" style={{ color: nexusOS.colors.text.primary }}>
                    {notification.message}
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: nexusOS.colors.text.quaternary }}>
                    agora
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Notification center component
export function NotificationCenter({ 
  balance,
  income,
  expenses,
  savingsRate,
  className = "" 
}: { 
  balance: number
  income: number
  expenses: number
  savingsRate: number
  className?: string 
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const generatedNotifications = generateSmartNotifications(balance, income, expenses, savingsRate)
    setNotifications(generatedNotifications)
    
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [balance, income, expenses, savingsRate])

  if (notifications.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`p-6 rounded-3xl ${className}`}
      style={{
        background: nexusOS.glass.light.background,
        backdropFilter: nexusOS.glass.light.backdropFilter,
        border: `1px solid ${nexusOS.colors.border.subtle}`,
      }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: nexusOS.colors.text.primary }}>
        Notificações
      </h3>

      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            className="flex items-start gap-3 p-3 rounded-2xl"
            style={{
              background: notification.color + "08",
              border: `1px solid ${notification.color}20`,
            }}
          >
            <div
              className="p-2 rounded-xl flex-shrink-0"
              style={{
                background: notification.color + "15",
                color: notification.color,
              }}
            >
              {notification.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: nexusOS.colors.text.primary }}>
                {notification.message}
              </p>
              <p className="text-[10px]" style={{ color: nexusOS.colors.text.quaternary }}>
                agora
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
