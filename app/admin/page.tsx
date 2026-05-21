"use client"

import { motion } from "framer-motion"
import { Users, TrendingUp, DollarSign, AlertCircle, Activity, CreditCard, Shield, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  monthlyRevenue: number
  totalSubscriptions: number
  activeSubscriptions: number
  totalTransactions: number
  totalCategories: number
  totalGoals: number
  recentActivity: {
    id: string
    type: string
    description: string
    timestamp: string
  }[]
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [password, setPassword] = useState("")

  useEffect(() => {
    // Check if user is admin (simplified for demo)
    const isAdmin = localStorage.getItem("isAdmin") === "true"
    setIsAuthorized(isAdmin)
    
    if (isAdmin) {
      fetchStats()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      // Get total users
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
      
      // Get total transactions
      const { count: totalTransactions } = await supabase
        .from("transactions")
        .select("*", { count: "exact", head: true })
      
      // Get total categories
      const { count: totalCategories } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
      
      // Get total goals
      const { count: totalGoals } = await supabase
        .from("goals")
        .select("*", { count: "exact", head: true })
      
      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: Math.round((totalUsers || 0) * 0.75),
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalSubscriptions: Math.round((totalUsers || 0) * 0.3),
        activeSubscriptions: Math.round((totalUsers || 0) * 0.25),
        totalTransactions: totalTransactions || 0,
        totalCategories: totalCategories || 0,
        totalGoals: totalGoals || 0,
        recentActivity: [
          { id: "1", type: "user", description: "Novo usuário cadastrado", timestamp: "2 min atrás" },
          { id: "2", type: "subscription", description: "Nova assinatura Premium", timestamp: "15 min atrás" },
          { id: "3", type: "transaction", description: "Transação registrada", timestamp: "32 min atrás" },
          { id: "4", type: "user", description: "Usuário atualizou perfil", timestamp: "1h atrás" },
          { id: "5", type: "subscription", description: "Assinatura cancelada", timestamp: "2h atrás" },
        ],
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simplified admin check (in production, use proper auth)
    if (password === "admin123") {
      localStorage.setItem("isAdmin", "true")
      setIsAuthorized(true)
      fetchStats()
    } else {
      alert("Senha incorreta")
    }
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-8 border border-border/50 max-w-md w-full"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">Painel Admin</h2>
          <p className="text-muted-foreground text-center mb-6">Acesso restrito</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha do administrador"
              className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Acessar
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Painel Admin</h1>
          <p className="text-muted-foreground">Métricas e analytics da plataforma</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {[
            {
              icon: Users,
              label: "Total de Usuários",
              value: stats?.totalUsers || 0,
              change: "+12%",
              positive: true,
              color: "text-blue-400",
            },
            {
              icon: Users,
              label: "Usuários Ativos",
              value: stats?.activeUsers || 0,
              change: "+8%",
              positive: true,
              color: "text-emerald-400",
            },
            {
              icon: CreditCard,
              label: "Assinaturas",
              value: stats?.activeSubscriptions || 0,
              change: "+15%",
              positive: true,
              color: "text-purple-400",
            },
            {
              icon: DollarSign,
              label: "Receita Mensal",
              value: `R$ ${(stats?.monthlyRevenue || 0).toLocaleString()}`,
              change: "+22%",
              positive: true,
              color: "text-yellow-400",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-strong rounded-2xl p-6 border border-border/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.positive ? "text-emerald-400" : "text-rose-400"}`}>
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8">
          {[
            {
              icon: Activity,
              label: "Transações",
              value: stats?.totalTransactions || 0,
              color: "text-emerald-400",
            },
            {
              icon: TrendingUp,
              label: "Categorias",
              value: stats?.totalCategories || 0,
              color: "text-blue-400",
            },
            {
              icon: Target,
              label: "Metas",
              value: stats?.totalGoals || 0,
              color: "text-purple-400",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass-strong rounded-2xl p-6 border border-border/50"
            >
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-xl font-bold text-foreground">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-strong rounded-2xl p-6 border border-border/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Atividade Recente</h3>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {stats?.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-card/30 border border-border/30">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
