"use client"

import { useAuth } from "@/providers/auth-provider"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const PUBLIC_ROUTES = ["/login", "/auth", "/onboarding"]

/**
 * Reforço client-side das rotas privadas (middleware já protege no servidor).
 */
export function AuthRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [showFallback, setShowFallback] = useState(false)

  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r))

  useEffect(() => {
    if (loading) return
    if (!user && !isPublic) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [user, loading, isPublic, pathname, router])

  // Fallback de 5 segundos para evitar loading infinito
  useEffect(() => {
    if (!loading || isPublic) return

    const timeoutId = setTimeout(() => {
      setShowFallback(true)
    }, 5000)

    return () => clearTimeout(timeoutId)
  }, [loading, isPublic])

  const handleContinueAnyway = () => {
    setShowFallback(false)
    // Força continuar mesmo com loading
  }

  const handleGoToLogin = () => {
    router.replace("/login")
  }

  if (loading && !isPublic) {
    if (showFallback) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Carregando...</h3>
              <p className="text-sm text-muted-foreground mb-6">
                O carregamento está demorando mais que o normal.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleContinueAnyway}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                Continuar mesmo assim
              </button>
              <button
                onClick={handleGoToLogin}
                className="w-full py-3 px-4 bg-card border border-border rounded-xl font-medium hover:bg-card/80 transition-colors"
              >
                Ir para login
              </button>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
