"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { Home, TrendingUp, Wallet, Sparkles, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

/**
 * Nexus OS - Floating Navigation
 * iOS native style floating navigation
 * 
 * Philosophy:
 * - No fixed sidebar
 * - Floating bottom navigation
 * - iOS native feel
 * - Glass morphism
 * - Tactile interactions
 * - Spring physics
 */

interface NavItem {
  label: string
  icon: any
  href: string
}

const navItems: NavItem[] = [
  { label: "Home", icon: Home, href: "/home" },
  { label: "Metas", icon: TrendingUp, href: "/metas" },
  { label: "Carteira", icon: Wallet, href: "/carteira" },
  { label: "IA", icon: Sparkles, href: "/ia" },
  { label: "Config", icon: Settings, href: "/configuracoes" },
]

export function FloatingNavigation() {
  const pathname = usePathname()

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.3,
      }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      style={{ paddingBottom: nexusOS.layout.safeArea.bottom }}
    >
      <div
        className="flex items-center gap-2 px-6 py-3 rounded-full"
        style={{
          background: nexusOS.glass.medium.background,
          backdropFilter: nexusOS.glass.medium.backdropFilter,
          WebkitBackdropFilter: nexusOS.glass.medium.backdropFilter,
          border: `1px solid ${nexusOS.colors.border.subtle}`,
          boxShadow: nexusOS.shadows.medium,
        }}
      >
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={index} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 17,
                }}
                className="relative px-4 py-2 rounded-full"
                style={{
                  background: isActive ? nexusOS.colors.accent.primary : "transparent",
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{
                    color: isActive ? nexusOS.colors.background.primary : nexusOS.colors.text.tertiary,
                  }}
                />
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
