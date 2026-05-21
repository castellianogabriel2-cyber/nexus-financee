"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Download,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock,
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  Loader2,
  Check,
  AlertCircle,
  Trophy,
  Flame,
  Star,
  Target,
  TrendingUp,
  Award,
  Camera,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { useFinance } from "@/providers/finance-provider"
import { ModoApertoPanel } from "@/components/modo-aperto-panel"
import { Modal } from "@/components/modal"
import { createClient } from "@/lib/supabase/client"
import { useTheme } from "next-themes"
import { FinancialScoreCard } from "@/components/analytics/insight-cards"

const settingsSections = [
  {
    title: "Conta",
    items: [
      { icon: User, label: "Perfil", description: "Nome, email e foto", action: "profile" },
      { icon: Mail, label: "Email", description: "Alterar email", action: "email" },
      { icon: Lock, label: "Senha", description: "Alterar senha", action: "password" },
    ],
  },
  {
    title: "Preferencias",
    items: [
      { icon: Bell, label: "Notificacoes", description: "Push, email, SMS", action: "notifications", toggle: true },
      { icon: Palette, label: "Aparencia", description: "Tema escuro", action: "appearance", toggle: true, defaultOn: true },
      { icon: CreditCard, label: "Cartoes", description: "Gerenciar cartoes", action: "cards" },
    ],
  },
  {
    title: "Privacidade",
    items: [
      { icon: Shield, label: "Seguranca", description: "2FA, biometria", action: "security" },
      { icon: Smartphone, label: "Dispositivos", description: "Dispositivos conectados", action: "devices" },
      { icon: Download, label: "Exportar dados", description: "Baixar seus dados", action: "export" },
    ],
  },
  {
    title: "Suporte",
    items: [
      { icon: HelpCircle, label: "Central de ajuda", description: "Perguntas frequentes", action: "help" },
      { icon: MessageSquare, label: "Fale conosco", description: "Chat ou email", action: "contact" },
    ],
  },
]

function SettingItem({
  icon: Icon,
  label,
  description,
  toggle,
  defaultOn,
  index,
  action,
  onAction,
  enabled,
}: {
  icon: React.ElementType
  label: string
  description: string
  toggle?: boolean
  defaultOn?: boolean
  index: number
  action?: string
  onAction?: (action: string) => void
  enabled?: boolean
}) {
  const [localEnabled, setLocalEnabled] = useState(defaultOn ?? false)
  const isEnabled = enabled !== undefined ? enabled : localEnabled

  const handleClick = () => {
    if (toggle) {
      const newValue = !isEnabled
      setLocalEnabled(newValue)
      onAction?.(action || "")
    } else if (action) {
      onAction?.(action)
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-card/50 transition-colors text-left"
    >
      <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      {toggle ? (
        <div
          className={`relative w-12 h-7 rounded-full transition-colors ${
            isEnabled ? "bg-primary" : "bg-border"
          }`}
        >
          <motion.div
            className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
            animate={{ left: isEnabled ? "calc(100% - 24px)" : "4px" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      ) : (
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      )}
    </motion.button>
  )
}

function getInitials(name: string | null | undefined) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
}

export default function ConfiguracoesPage() {
  const router = useRouter()
  const { signOut, user } = useAuth()
  const { profile, toggleModoAperto, updateProfile, financialScore } = useFinance()
  const { theme, setTheme } = useTheme()
  const [modoApertoOpen, setModoApertoOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Modal states
  const [profileName, setProfileName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [contactEmail, setContactEmail] = useState("")
  const [contactWhatsApp, setContactWhatsApp] = useState("")

  useEffect(() => {
    if (profile) {
      setProfileName(profile.full_name || "")
      setNotificationsEnabled(profile.notifications_enabled || false)
    }
    if (user) {
      setNewEmail(user.email || "")
    }
  }, [profile, user])

  function handleAction(action: string) {
    setMessage(null)
    switch (action) {
      case "profile":
        setActiveModal("profile")
        break
      case "email":
        setActiveModal("email")
        break
      case "password":
        setActiveModal("password")
        break
      case "notifications":
        handleToggleNotifications()
        break
      case "appearance":
        setTheme(theme === "dark" ? "light" : "dark")
        break
      case "cards":
        router.push("/cartoes")
        break
      case "security":
        setActiveModal("security")
        break
      case "devices":
        setActiveModal("devices")
        break
      case "export":
        setActiveModal("export")
        break
      case "help":
        setActiveModal("help")
        break
      case "contact":
        setActiveModal("contact")
        break
    }
  }

  async function handleSaveProfile() {
    setLoading(true)
    setMessage(null)
    const { error } = await updateProfile({ full_name: profileName })
    setLoading(false)
    if (error) {
      setMessage({ type: "error", text: error })
    } else {
      setMessage({ type: "success", text: "Perfil atualizado!" })
      setTimeout(() => setActiveModal(null), 1500)
    }
  }

  async function handleUpdateEmail() {
    setLoading(true)
    setMessage(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    setLoading(false)
    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setMessage({ type: "success", text: "Email atualizado! Confirme no seu email." })
      setTimeout(() => setActiveModal(null), 2000)
    }
  }

  async function handleUpdatePassword() {
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Senhas nao conferem" })
      return
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Senha deve ter no minimo 6 caracteres" })
      return
    }
    setLoading(true)
    setMessage(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    setLoading(false)
    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setMessage({ type: "success", text: "Senha alterada!" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setActiveModal(null), 1500)
    }
  }

  async function handleToggleNotifications() {
    const newValue = !notificationsEnabled
    setNotificationsEnabled(newValue)
    const { error } = await updateProfile({ notifications_enabled: newValue })
    if (error) {
      setNotificationsEnabled(!newValue)
    }
  }

  async function handleExport(format: "json" | "csv") {
    setLoading(true)
    setMessage(null)
    const supabase = createClient()
    const { data: transactions } = await supabase.from("transactions").select("*").eq("user_id", user?.id)
    const { data: goals } = await supabase.from("goals").select("*").eq("user_id", user?.id)
    const { data: cards } = await supabase.from("cards").select("*").eq("user_id", user?.id)

    const exportData = {
      transactions: transactions || [],
      goals: goals || [],
      cards: cards || [],
      exportedAt: new Date().toISOString(),
    }

    let content: string
    let filename: string
    let mimeType: string

    if (format === "json") {
      content = JSON.stringify(exportData, null, 2)
      filename = "financa-export.json"
      mimeType = "application/json"
    } else {
      const headers = Object.keys(exportData.transactions[0] || {}).join(",")
      const rows = exportData.transactions.map((t: any) => Object.values(t).join(",")).join("\n")
      content = `${headers}\n${rows}`
      filename = "financa-export.csv"
      mimeType = "text/csv"
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    setLoading(false)
    setMessage({ type: "success", text: "Dados exportados!" })
    setTimeout(() => setActiveModal(null), 1500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-4xl font-bold text-foreground tracking-tight">
          Configuracoes
        </h1>
        <p className="text-muted-foreground mt-2">
          Personalize sua experiencia
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card/30 border border-border/50 rounded-3xl p-6 mb-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{getInitials(profile?.full_name)}</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">{profile?.full_name || "Usuario"}</h2>
            <p className="text-sm text-muted-foreground">{profile?.email || "—"}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 text-primary text-xs font-semibold border border-primary/20">
                Premium
              </span>
              <span className="text-xs text-muted-foreground">desde Jan 2024</span>
            </div>
          </div>
          <button
            onClick={() => setActiveModal("profile")}
            className="px-4 py-2 rounded-xl bg-card/50 border border-border/50 text-sm font-medium text-foreground hover:bg-card/70 transition-colors"
          >
            Editar
          </button>
        </div>

        {/* Premium Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/30">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-lg font-bold text-foreground">12</span>
            </div>
            <span className="text-xs text-muted-foreground">Streak</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-lg font-bold text-foreground">8.5</span>
            </div>
            <span className="text-xs text-muted-foreground">Nível</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-lg font-bold text-foreground">24</span>
            </div>
            <span className="text-xs text-muted-foreground">Badges</span>
          </div>
        </div>
      </motion.div>

      {/* Financial Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="mb-6"
      >
        <FinancialScoreCard score={financialScore} />
      </motion.div>

      {/* Modo Aperto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-card/30 border border-warning/30 rounded-3xl p-6 mb-6"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-warning/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Modo Aperto</h3>
              <p className="text-sm text-muted-foreground">Orcamento de sobrevivencia ate o proximo pagamento</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (profile?.modo_aperto) setModoApertoOpen(true)
              else toggleModoAperto(true)
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              profile?.modo_aperto
                ? "bg-warning/20 text-warning"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {profile?.modo_aperto ? "Ver detalhes" : "Ativar"}
          </button>
        </div>
      </motion.div>
      <ModoApertoPanel open={modoApertoOpen} onClose={() => setModoApertoOpen(false)} />

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + sectionIndex * 0.05 }}
            className="bg-card/30 border border-border/50 rounded-3xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border/30">
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
            </div>
            <div className="p-2">
              {section.items.map((item, itemIndex) => (
                <SettingItem
                  key={item.label}
                  {...item}
                  index={sectionIndex * 3 + itemIndex}
                  onAction={handleAction}
                  enabled={item.action === "notifications" ? notificationsEnabled : item.action === "appearance" ? theme === "dark" : undefined}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Logout */}
      <motion.button
        type="button"
        onClick={signOut}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full mt-6 flex items-center justify-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive font-medium hover:bg-destructive/20 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Sair da conta
      </motion.button>

      {/* Version */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-muted-foreground mt-8"
      >
        Financa v2.0.0 - Feito com carinho
      </motion.p>

      {/* Modals */}
      <Modal open={activeModal === "profile"} onClose={() => setActiveModal(null)} title="Editar Perfil">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Nome completo</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50"
              placeholder="Seu nome"
            />
          </div>
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-xl ${
              message.type === "success" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
            }`}>
              {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span className="text-sm">{message.text}</span>
            </div>
          )}
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
          </button>
        </div>
      </Modal>

      <Modal open={activeModal === "email"} onClose={() => setActiveModal(null)} title="Alterar Email">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Novo email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50"
              placeholder="novo@email.com"
            />
          </div>
          <p className="text-xs text-muted-foreground">Voce recebera um email de confirmacao.</p>
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-xl ${
              message.type === "success" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
            }`}>
              {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span className="text-sm">{message.text}</span>
            </div>
          )}
          <button
            onClick={handleUpdateEmail}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atualizar email"}
          </button>
        </div>
      </Modal>

      <Modal open={activeModal === "password"} onClose={() => setActiveModal(null)} title="Alterar Senha">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Senha atual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Nova senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50"
              placeholder="Minimo 6 caracteres"
              minLength={6}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Confirmar senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-xl ${
              message.type === "success" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
            }`}>
              {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span className="text-sm">{message.text}</span>
            </div>
          )}
          <button
            onClick={handleUpdatePassword}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Alterar senha"}
          </button>
        </div>
      </Modal>

      <Modal open={activeModal === "security"} onClose={() => setActiveModal(null)} title="Seguranca">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-card/50 border border-border/50">
            <h4 className="font-medium text-foreground mb-2">Sessao atual</h4>
            <p className="text-sm text-muted-foreground">IP: {typeof window !== "undefined" ? "Conectado" : "—"}</p>
            <p className="text-sm text-muted-foreground">Dispositivo: Este dispositivo</p>
          </div>
          <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
            <p className="text-sm text-warning">Para logout de todos os dispositivos, use o Supabase Dashboard.</p>
          </div>
        </div>
      </Modal>

      <Modal open={activeModal === "devices"} onClose={() => setActiveModal(null)} title="Dispositivos">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Este dispositivo</p>
                <p className="text-xs text-muted-foreground">Atualmente ativo</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
            <p className="text-sm text-warning">A listagem completa de dispositivos requer configuracao adicional no Supabase Dashboard.</p>
          </div>
        </div>
      </Modal>

      <Modal open={activeModal === "export"} onClose={() => setActiveModal(null)} title="Exportar Dados">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Escolha o formato para exportar seus dados:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleExport("json")}
              disabled={loading}
              className="p-4 rounded-xl bg-card/50 border border-border/50 text-foreground hover:bg-card/70 transition-colors flex flex-col items-center gap-2"
            >
              <Download className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">JSON</span>
            </button>
            <button
              onClick={() => handleExport("csv")}
              disabled={loading}
              className="p-4 rounded-xl bg-card/50 border border-border/50 text-foreground hover:bg-card/70 transition-colors flex flex-col items-center gap-2"
            >
              <Download className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">CSV</span>
            </button>
          </div>
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-xl ${
              message.type === "success" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
            }`}>
              {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span className="text-sm">{message.text}</span>
            </div>
          )}
        </div>
      </Modal>

      <Modal open={activeModal === "help"} onClose={() => setActiveModal(null)} title="Central de Ajuda">
        <div className="space-y-4">
          {[
            { q: "Como altero minha senha?", a: "Vá em Configuracoes > Senha" },
            { q: "Como adiciono um cartao?", a: "Vá em Configuracoes > Cartoes" },
            { q: "O que e Modo Aperto?", a: "Modo de orcamento de sobrevivencia" },
            { q: "Como exporto meus dados?", a: "Vá em Configuracoes > Exportar dados" },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-card/50 border border-border/50">
              <p className="font-medium text-foreground mb-1">{item.q}</p>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={activeModal === "contact"} onClose={() => setActiveModal(null)} title="Fale Conosco">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Email de contato</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50"
              placeholder="suporte@financa.com"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">WhatsApp (opcional)</label>
            <input
              type="tel"
              value={contactWhatsApp}
              onChange={(e) => setContactWhatsApp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50"
              placeholder="+55 11 99999-9999"
            />
          </div>
          <button
            onClick={() => window.location.href = contactEmail ? `mailto:${contactEmail}` : "mailto:suporte@financa.com"}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium"
          >
            Enviar email
          </button>
        </div>
      </Modal>
    </div>
  )
}
