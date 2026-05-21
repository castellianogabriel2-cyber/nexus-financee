"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useFinance } from "@/providers/finance-provider"
import { ModoApertoPanel } from "@/components/modo-aperto-panel"

const settingsSections = [
  {
    title: "Conta",
    items: [
      { icon: User, label: "Perfil", description: "Nome, email e foto", href: "#" },
      { icon: Mail, label: "Email", description: "gabriel@email.com", href: "#" },
      { icon: Lock, label: "Senha", description: "Alterar senha", href: "#" },
    ],
  },
  {
    title: "Preferencias",
    items: [
      { icon: Bell, label: "Notificacoes", description: "Push, email, SMS", href: "#", toggle: true },
      { icon: Palette, label: "Aparencia", description: "Tema escuro", href: "#", toggle: true, defaultOn: true },
      { icon: CreditCard, label: "Cartoes", description: "Gerenciar cartoes", href: "#" },
    ],
  },
  {
    title: "Privacidade",
    items: [
      { icon: Shield, label: "Seguranca", description: "2FA, biometria", href: "#" },
      { icon: Smartphone, label: "Dispositivos", description: "3 dispositivos conectados", href: "#" },
      { icon: Download, label: "Exportar dados", description: "Baixar seus dados", href: "#" },
    ],
  },
  {
    title: "Suporte",
    items: [
      { icon: HelpCircle, label: "Central de ajuda", description: "Perguntas frequentes", href: "#" },
      { icon: MessageSquare, label: "Fale conosco", description: "Chat ou email", href: "#" },
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
}: {
  icon: React.ElementType
  label: string
  description: string
  toggle?: boolean
  defaultOn?: boolean
  index: number
}) {
  const [enabled, setEnabled] = useState(defaultOn ?? false)

  const handleClick = () => {
    if (toggle) {
      setEnabled(!enabled)
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
            enabled ? "bg-primary" : "bg-border"
          }`}
        >
          <motion.div
            className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
            animate={{ left: enabled ? "calc(100% - 24px)" : "4px" }}
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
  const { signOut } = useAuth()
  const { profile, toggleModoAperto } = useFinance()
  const [modoApertoOpen, setModoApertoOpen] = useState(false)

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
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{getInitials(profile?.full_name)}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">{profile?.full_name || "Usuario"}</h2>
            <p className="text-sm text-muted-foreground">{profile?.email || "—"}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                Premium
              </span>
              <span className="text-xs text-muted-foreground">desde Jan 2024</span>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-card/50 border border-border/50 text-sm font-medium text-foreground hover:bg-card/70 transition-colors">
            Editar
          </button>
        </div>
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
    </div>
  )
}
