"use client"

import { Component, ReactNode } from "react"
import { AlertTriangle, RefreshCw, LogOut } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Global Error Boundary caught:", error, errorInfo)
  }

  handleClearCache = () => {
    if (typeof window !== "undefined") {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => registration.unregister())
        })
      }
      if ("caches" in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => caches.delete(cacheName))
        })
      }
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = "/login"
    }
  }

  handleGoToLogin = () => {
    window.location.href = "/login"
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-xl font-semibold text-foreground mb-2">Algo deu errado</h1>
              <p className="text-sm text-muted-foreground mb-6">
                {this.state.error?.message || "Ocorreu um erro inesperado ao carregar o aplicativo."}
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar novamente
              </button>
              <button
                onClick={this.handleGoToLogin}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-card border border-border rounded-xl font-medium hover:bg-card/80 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Ir para login
              </button>
              <button
                onClick={this.handleClearCache}
                className="w-full py-3 px-4 bg-card border border-border rounded-xl font-medium hover:bg-card/80 transition-colors text-sm text-muted-foreground"
              >
                Limpar cache local
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
