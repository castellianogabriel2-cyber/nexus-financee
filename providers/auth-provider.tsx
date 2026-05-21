"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Session, User } from "@supabase/supabase-js"
import { FinanceProvider } from "./finance-provider"

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let mounted = true

    const syncSession = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!mounted) return
      setUser(authUser ?? null)
      setSession(currentSession)
      setLoading(false)
    }

    syncSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      <FinanceProvider user={user}>{children}</FinanceProvider>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
