"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import type { Notification, NotificationPreferences } from "@/lib/notifications/types"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { analyzeAndGenerateNotifications, shouldSendNotification } from "@/lib/notifications/generator"
import type { Transaction, Category, Profile, Card, Goal } from "@/lib/supabase/types"

type NotificationContextValue = {
  notifications: Notification[]
  unreadCount: number
  preferences: NotificationPreferences | null
  loading: boolean
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt" | "sentAt">) => void
  markAsRead: (id: string) => void
  dismiss: (id: string) => void
  markAllAsRead: () => void
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void
  generateNotifications: (
    transactions: Transaction[],
    categories: Category[],
    profile: Profile | null,
    cards: Card[],
    goals: Goal[]
  ) => void
  requestPermission: () => Promise<{ success: boolean; error?: string }>
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children, userId }: { children: ReactNode; userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(true)

  const { supported, permission, requestPermission: requestPushPermission, sendLocalNotification } = usePushNotifications()

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem(`notification-preferences-${userId}`)
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    } else {
      const defaultPreferences: NotificationPreferences = {
        userId,
        enabled: true,
        categories: {
          bills: true,
          cards: true,
          goals: true,
          spending: true,
          balance: true,
          modo_aperto: true,
          insights: true,
          savings: true,
          summary: true,
        },
        frequency: {
          daily: false,
          weekly: true,
          monthly: true,
        },
        quietHours: {
          enabled: true,
          start: "22:00",
          end: "08:00",
        },
      }
      setPreferences(defaultPreferences)
      localStorage.setItem(`notification-preferences-${userId}`, JSON.stringify(defaultPreferences))
    }
    setLoading(false)
  }, [userId])

  const addNotification = useCallback((notification: Omit<Notification, "id" | "read" | "createdAt" | "sentAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      read: false,
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Send push notification if permission granted
    if (permission === "granted" && preferences && shouldSendNotification(notification, preferences)) {
      sendLocalNotification(notification)
    }
  }, [permission, preferences, sendLocalNotification])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
    if (!preferences) return

    const updated = { ...preferences, ...newPreferences }
    setPreferences(updated)
    localStorage.setItem(`notification-preferences-${userId}`, JSON.stringify(updated))
  }, [preferences, userId])

  const generateNotifications = useCallback((
    transactions: Transaction[],
    categories: Category[],
    profile: Profile | null,
    cards: Card[],
    goals: Goal[]
  ) => {
    if (!preferences || !preferences.enabled) return

    const newNotifications = analyzeAndGenerateNotifications(
      userId,
      transactions,
      categories,
      profile,
      cards,
      goals
    )

    newNotifications.forEach((notification) => {
      if (shouldSendNotification(notification, preferences)) {
        addNotification(notification)
      }
    })
  }, [userId, preferences, addNotification])

  const requestPermission = useCallback(async () => {
    const result = await requestPushPermission()
    return result
  }, [requestPushPermission])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        preferences,
        loading,
        addNotification,
        markAsRead,
        dismiss,
        markAllAsRead,
        updatePreferences,
        generateNotifications,
        requestPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
