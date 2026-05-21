"use client"

import { useAuth } from "@/providers/auth-provider"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const PUBLIC_ROUTES = ["/login", "/auth", "/onboarding"]

/**
 * Reforço client-side das rotas privadas (middleware já protege no servidor).
 */
export function AuthRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r))

  useEffect(() => {
    if (loading) return
    if (!user && !isPublic) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [user, loading, isPublic, pathname, router])

  if (loading && !isPublic) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
