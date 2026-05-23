"use client"

import { useEffect } from "react"

export function ServiceWorkerRegistration() {
  useEffect(() => {
    const isDevelopment = process.env.NODE_ENV !== "production"

    if (isDevelopment) {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister()
          })
        })

        if ("caches" in window) {
          caches.keys().then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
              caches.delete(cacheName)
            })
          })
        }
      }
      return
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registrado com sucesso:", registration)
        })
        .catch((error) => {
          console.log("Erro ao registrar Service Worker:", error)
        })
    }
  }, [])

  return null
}
