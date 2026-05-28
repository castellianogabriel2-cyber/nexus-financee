"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Home, Wallet, TrendingUp, Settings, Sparkles } from "lucide-react"
import { minimalLuxury } from "@/lib/design-system/minimal-luxury"
import { useState, memo } from "react"

/**
 * Floating Navigation - Minimal Luxury
 * Inspired by: iPhone dock, Arc Browser, Linear
 * 
 * Features:
 * - Floating pill design
 * - Frosted glass effect
 * - Subtle glow on active
 * - Smooth spring animations
 * - Mobile-first responsive
 * - Safe area support
 */

interface NavItem {
  id: string
  label: string
  icon: any
  href: string
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home, href: "/home" },
  { id: "wallet", label: "Carteira", icon: Wallet, href: "/carteira" },
  { id: "insights", label: "Insights", icon: TrendingUp, href: "/analytics" },
  { id: "ai", label: "IA", icon: Sparkles, href: "/ia" },
  { id: "settings", label: "Config", icon: Settings, href: "/configuracoes" },
]

export function FloatingNav() {
  const [activeId, setActiveId] = useState("home")

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.175, 0.885, 0.32, 1.275] as const,
      }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
    >
      <div
        className="relative"
        style={{
          background: minimalLuxury.glass.strong.background,
          backdropFilter: minimalLuxury.glass.strong.backdropFilter,
          WebkitBackdropFilter: minimalLuxury.glass.strong.backdropFilter,
          border: `1px solid ${minimalLuxury.colors.border.subtle}`,
          borderRadius: "9999px",
          padding: "10px",
          boxShadow: minimalLuxury.shadows.xl,
        }}
      >
        {/* Subtle glow effect */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="flex items-center gap-1 relative">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onClick={() => setActiveId(item.id)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const NavItem = memo(function NavItem({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick: () => void }) {
  const Icon = item.icon

  return (
    <motion.button
      onClick={onClick}
      className="relative"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{
        duration: 0.15,
        ease: [0.25, 0.1, 0.25, 1] as const,
      }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "9999px",
        }}
      >
        {/* Active indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.175, 0.885, 0.32, 1.275] as const,
              }}
              className="absolute inset-0"
              style={{
                background: minimalLuxury.colors.accent.primary,
                borderRadius: "9999px",
                opacity: 0.12,
              }}
            />
          )}
        </AnimatePresence>

        {/* Icon */}
        <Icon
          className="relative z-10"
          style={{
            width: "22px",
            height: "22px",
            color: isActive ? minimalLuxury.colors.text.primary : minimalLuxury.colors.text.tertiary,
            strokeWidth: isActive ? 2.5 : 2,
          }}
        />

        {/* Active glow */}
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.6 }}
            transition={{
              duration: 0.6,
              ease: [0, 0, 0.2, 1] as const,
            }}
            className="absolute inset-0 -z-10"
            style={{
              background: minimalLuxury.colors.accent.primary,
              borderRadius: "9999px",
              opacity: 0.25,
              filter: `blur(${minimalLuxury.blur.xl})`,
            }}
          />
        )}
      </div>
    </motion.button>
  )
})
