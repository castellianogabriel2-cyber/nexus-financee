"use client"

import { useEffect, useCallback } from "react"
import { useSecurity } from "./use-security"

export function useAppVisibility() {
  const { lock, autoLock } = useSecurity()

  useEffect(() => {
    if (!autoLock) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // App foi minimizado ou usuário mudou de aba
        lock()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [lock, autoLock])

  const isAppVisible = useCallback((): boolean => {
    return !document.hidden
  }, [])

  return {
    isAppVisible,
  }
}
