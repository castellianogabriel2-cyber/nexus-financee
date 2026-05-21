"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient, hasSupabaseConfig } from "@/lib/supabase/client"
import { getPostLoginPath } from "@/lib/auth/post-login-path"
import { Sparkles, Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = useMemo(() => {
    if (!hasSupabaseConfig()) return null
    try {
      return createClient()
    } catch {
      return null
    }
  }, [])

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")

  useEffect(() => {
    if (searchParams.get("error") === "config") {
      setError("Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local")
    } else if (searchParams.get("error") === "auth") {
      setError("Falha na autenticacao. Tente novamente.")
    }
  }, [searchParams])

  const redirectAfterAuth = async (userId: string) => {
    if (!supabase) return
    const path = await getPostLoginPath(supabase, userId)
    window.location.href = path
  }

  const signInWithGoogle = async () => {
    if (!supabase) {
      setError("Supabase nao configurado.")
      return
    }
    setLoading("google")
    setError(null)
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    })
    if (oauthError) {
      setError(oauthError.message)
      setLoading(null)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setError("Supabase nao configurado. Adicione as variaveis em .env.local")
      return
    }

    setLoading("email")
    setError(null)
    setMessage(null)

    if (mode === "reset") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/callback?next=/configuracoes`,
      })
      setLoading(null)
      if (resetError) setError(resetError.message)
      else setMessage("Enviamos um link de recuperacao para seu email.")
      return
    }

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${siteUrl}/auth/callback` },
      })
      if (signUpError) {
        setLoading(null)
        setError(signUpError.message)
        return
      }
      if (data.session?.user) {
        await redirectAfterAuth(data.session.user.id)
        return
      }
      setLoading(null)
      setMessage("Conta criada! Confirme o email ou faca login.")
      return
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (signInError) {
      setLoading(null)
      setError(signInError.message)
      return
    }
    if (data.user) {
      await redirectAfterAuth(data.user.id)
    }
  }

  if (!hasSupabaseConfig()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="glass-strong rounded-3xl p-8 max-w-md text-center border border-destructive/30">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-foreground mb-2">Supabase obrigatorio</h1>
          <p className="text-sm text-muted-foreground">
            Copie .env.local.example para .env.local e preencha URL e chave anon do seu projeto.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 gradient-radial pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="glass-strong rounded-[2rem] p-8 lg:p-10 border border-white/5 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center glow-primary mb-6"
            >
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Financa</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Login real com Supabase Auth
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={signInWithGoogle}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-zinc-900 font-medium text-sm transition-opacity disabled:opacity-60"
            >
              {loading === "google" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continuar com Google
                </>
              )}
            </motion.button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">ou email</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <AnimatePresence mode="wait">
              {mode !== "reset" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative overflow-hidden"
                >
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            {message && <p className="text-sm text-success text-center">{message}</p>}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold glow-primary disabled:opacity-60"
            >
              {loading === "email" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === "login" && "Entrar"}
                  {mode === "signup" && "Criar conta"}
                  {mode === "reset" && "Recuperar senha"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-2 text-sm">
            {mode === "login" && (
              <>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Criar uma conta
                </button>
                <button
                  type="button"
                  onClick={() => setMode("reset")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Esqueci minha senha
                </button>
              </>
            )}
            {mode !== "login" && (
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-primary hover:underline"
              >
                Voltar ao login
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
