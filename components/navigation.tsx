"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { AdaptiveLogo } from "@/components/adaptive-logo"
import {
  LayoutDashboard,
  Plus,
  Wallet,
  CreditCard,
  PieChart,
  Target,
  Shield,
  CalendarClock,
  BarChart3,
  Settings,
  Sparkles,
  Receipt,
  Calendar,
  Download,
  Bot,
} from "lucide-react"
import { useFinance } from "@/providers/finance-provider"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/nova-transacao", icon: Plus, label: "Nova Transacao" },
  { href: "/carteira", icon: Wallet, label: "Carteira" },
  { href: "/cartoes", icon: CreditCard, label: "Cartoes" },
  { href: "/gastos", icon: Receipt, label: "Gastos" },
  { href: "/metas", icon: Target, label: "Metas" },
  { href: "/reserva", icon: Shield, label: "Reserva" },
  { href: "/ia", icon: Bot, label: "IA" },
  { href: "/mais", icon: Sparkles, label: "Mais" },
  { href: "/configuracoes", icon: Settings, label: "Configuracoes" },
]

const mobileNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/carteira", icon: Wallet, label: "Carteira" },
  { href: "/nova-transacao", icon: Plus, label: "Novo", isMain: true },
  { href: "/ia", icon: Bot, label: "IA" },
  { href: "/configuracoes", icon: Settings, label: "Config" },
]

function getInitials(name: string | null | undefined) {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function Sidebar() {
  const pathname = usePathname()
  const { profile, periodLabel } = useFinance()
  const displayName = profile?.full_name || "Usuario"

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen fixed left-0 top-0 bg-sidebar border-r border-sidebar-border" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-20 border-b border-sidebar-border">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-10 h-10 rounded-2xl flex items-center justify-center glow-primary"
        >
          <AdaptiveLogo className="w-10 h-10 object-contain" />
        </motion.div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">Nexus Finance</h1>
          <p className="text-xs text-muted-foreground">{periodLabel}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary glow-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-sidebar-primary" : ""}`} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary"
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sidebar-accent/30">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{getInitials(profile?.full_name)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate capitalize">{profile?.plan || "Premium"}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass-strong border-t border-border/30" style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}>
      <div className="flex items-center justify-around h-20 px-2">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href
          
          if (item.isMain) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -mt-8"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center glow-primary shadow-lg"
                >
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </motion.div>
              </Link>
            )
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all min-w-[64px] min-h-[64px] ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobile-indicator"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
