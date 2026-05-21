"use client"

import { useState, useEffect, useCallback } from "react"
import type { Notification, NotificationPreferences } from "@/lib/notifications/types"

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [supported, setSupported] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)
      })
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!supported) {
      return { success: false, error: "Notificações não suportadas neste navegador" }
    }

    if (permission === "granted") {
      return { success: true }
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      
      if (result === "granted") {
        return { success: true }
      } else {
        return { success: false, error: "Permissão negada" }
      }
    } catch (error) {
      return { success: false, error: "Erro ao solicitar permissão" }
    }
  }, [supported, permission])

  const sendLocalNotification = useCallback((notification: Omit<Notification, "id" | "read" | "createdAt">) => {
    if (!supported || permission !== "granted") {
      return { success: false, error: "Permissão não concedida" }
    }

    try {
      const notif = new Notification(notification.title, {
        body: notification.body,
        icon: "/logo-light.png",
        badge: "/logo-light.png",
        tag: notification.type,
        data: notification.data,
        requireInteraction: notification.priority === "urgent",
      })

      notif.onclick = () => {
        window.focus()
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl
        }
        notif.close()
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Erro ao enviar notificação local" }
    }
  }, [supported, permission])

  const scheduleNotification = useCallback((
    notification: Omit<Notification, "id" | "read" | "createdAt" | "sentAt">,
    delayMs: number
  ) => {
    if (!supported || permission !== "granted") {
      return { success: false, error: "Permissão não concedida" }
    }

    const timeoutId = setTimeout(() => {
      sendLocalNotification(notification)
    }, delayMs)

    return { success: true, timeoutId }
  }, [supported, permission, sendLocalNotification])

  const sendPushNotification = useCallback(async (notification: Omit<Notification, "id" | "read" | "createdAt" | "sentAt">) => {
    if (!registration) {
      return { success: false, error: "Service Worker não registrado" }
    }

    try {
      // Aqui você integraria com Supabase para enviar notificações push reais
      // Por enquanto, vamos usar notificação local como fallback
      return sendLocalNotification(notification)
    } catch (error) {
      return { success: false, error: "Erro ao enviar notificação push" }
    }
  }, [registration, sendLocalNotification])

  const dismissNotification = useCallback((tag: string) => {
    if (!supported) return

    // Notificações são fechadas automaticamente quando clicadas
    // Para fechar programaticamente, precisaria manter referência
    // Por enquanto, esta função é um placeholder
  }, [supported])

  return {
    supported,
    permission,
    requestPermission,
    sendLocalNotification,
    scheduleNotification,
    sendPushNotification,
    dismissNotification,
  }
}

export function useNotificationPreferences(userId: string) {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Aqui você buscaria as preferências do Supabase
    // Por enquanto, vamos usar valores padrão
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
    setLoading(false)
  }, [userId])

  const updatePreferences = useCallback(async (newPreferences: Partial<NotificationPreferences>) => {
    if (!preferences) return

    // Aqui você salvaria as preferências no Supabase
    setPreferences({ ...preferences, ...newPreferences })
  }, [preferences])

  return {
    preferences,
    loading,
    updatePreferences,
  }
}
