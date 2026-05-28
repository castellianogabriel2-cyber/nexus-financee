"use client"

import { motion } from "framer-motion"
import { minimalLuxury } from "@/lib/design-system/minimal-luxury"
import { Sparkles, Crown, Shield, Zap, Check, ArrowRight } from "lucide-react"
import Link from "next/link"

/**
 * Premium Subscription Page - Luxury Experience
 * Inspired by: Apple One, Revolut Metal, Linear Pro, Arc Plus
 * 
 * Philosophy:
 * - Luxury minimalism
 * - Exclusivity
 * - Premium feel
 * - No pressure
 * - Elegant presentation
 */

export default function AssinaturaPage() {
  return (
    <div className="min-h-screen" style={{ background: minimalLuxury.colors.background.primary }}>
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)",
        }}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-32 lg:py-40">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="text-center mb-20 lg:mb-32"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] as const }}
            className="w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center"
            style={{
              background: minimalLuxury.colors.accent.primary + "15",
            }}
          >
            <Crown className="w-10 h-10" style={{ color: minimalLuxury.colors.accent.primary }} />
          </motion.div>

          <h1
            className="text-6xl lg:text-8xl xl:text-9xl font-semibold tracking-tight mb-6"
            style={{ color: minimalLuxury.colors.text.primary }}
          >
            Nexus Premium
          </h1>

          <p
            className="text-xl lg:text-2xl font-light max-w-2xl mx-auto leading-relaxed"
            style={{ color: minimalLuxury.colors.text.tertiary }}
          >
            O sistema operacional financeiro pessoal que organiza sua vida
          </p>

          {/* Cinematic gradient line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="h-[1px] mx-auto mt-12"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)",
            }}
          />
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20 lg:mb-32">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="relative"
          >
            <div
              className="relative overflow-hidden rounded-3xl p-8 lg:p-12"
              style={{
                background: minimalLuxury.glass.light.background,
                backdropFilter: minimalLuxury.glass.light.backdropFilter,
                WebkitBackdropFilter: minimalLuxury.glass.light.backdropFilter,
                border: `1px solid ${minimalLuxury.colors.border.subtle}`,
              }}
            >
              <div className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: minimalLuxury.colors.text.quaternary }}>
                Gratuito
              </div>
              <div className="text-5xl lg:text-6xl font-semibold tracking-tight mb-2" style={{ color: minimalLuxury.colors.text.primary }}>
                R$ 0
              </div>
              <div className="text-sm mb-8" style={{ color: minimalLuxury.colors.text.tertiary }}>
                Para sempre
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Transações ilimitadas",
                  "Categorização automática",
                  "Relatórios básicos",
                  "Metas financeiras",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5" style={{ color: minimalLuxury.colors.text.tertiary }} />
                    <span className="text-sm" style={{ color: minimalLuxury.colors.text.secondary }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/home">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl text-sm font-medium tracking-wide"
                  style={{
                    background: minimalLuxury.colors.border.medium,
                    color: minimalLuxury.colors.text.secondary,
                  }}
                >
                  Continuar grátis
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="relative"
          >
            {/* Premium glow */}
            <div
              className="absolute -inset-4 -z-10 rounded-3xl"
              style={{
                background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                filter: `blur(${minimalLuxury.blur["2xl"]})`,
              }}
            />

            <div
              className="relative overflow-hidden rounded-3xl p-8 lg:p-12"
              style={{
                background: minimalLuxury.glass.strong.background,
                backdropFilter: minimalLuxury.glass.strong.backdropFilter,
                WebkitBackdropFilter: minimalLuxury.glass.strong.backdropFilter,
                border: `1px solid ${minimalLuxury.colors.accent.primary}30`,
              }}
            >
              {/* Premium badge */}
              <div className="absolute top-6 right-6">
                <div
                  className="px-3 py-1 rounded-full text-xs uppercase tracking-[0.2em]"
                  style={{
                    background: minimalLuxury.colors.accent.primary + "20",
                    color: minimalLuxury.colors.accent.primary,
                  }}
                >
                  Premium
                </div>
              </div>

              <div className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: minimalLuxury.colors.accent.primary }}>
                Nexus Premium
              </div>
              <div className="text-5xl lg:text-6xl font-semibold tracking-tight mb-2" style={{ color: minimalLuxury.colors.text.primary }}>
                R$ 29
              </div>
              <div className="text-sm mb-8" style={{ color: minimalLuxury.colors.text.tertiary }}>
                por mês
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  { icon: Sparkles, text: "IA Copilot Financeiro" },
                  { icon: Zap, text: "Insights automáticos" },
                  { icon: Shield, text: "Previsões inteligentes" },
                  { icon: Crown, text: "Análise de padrões" },
                  { text: "Relatórios avançados" },
                  { text: "Exportação de dados" },
                  { text: "Suporte prioritário" },
                  { text: "Sem anúncios" },
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.icon && <feature.icon className="w-5 h-5" style={{ color: minimalLuxury.colors.accent.primary }} />}
                    {!feature.icon && <Check className="w-5 h-5" style={{ color: minimalLuxury.colors.accent.primary }} />}
                    <span className="text-sm" style={{ color: minimalLuxury.colors.text.secondary }}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl text-sm font-medium tracking-wide flex items-center justify-center gap-2"
                style={{
                  background: minimalLuxury.colors.accent.primary,
                  color: minimalLuxury.colors.background.primary,
                }}
              >
                Começar teste grátis
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <div className="text-center mt-4 text-xs" style={{ color: minimalLuxury.colors.text.quaternary }}>
                7 dias grátis, cancele quando quiser
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="text-center"
        >
          <h2
            className="text-3xl lg:text-4xl font-semibold tracking-tight mb-8"
            style={{ color: minimalLuxury.colors.text.primary }}
          >
            Por que Premium?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Sparkles,
                title: "IA Inteligente",
                description: "Copilot financeiro que entende seus padrões e sugere economia automaticamente.",
              },
              {
                icon: Zap,
                title: "Insights Automáticos",
                description: "Previsões e análises que aparecem naturalmente, sem você precisar procurar.",
              },
              {
                icon: Crown,
                title: "Experiência Premium",
                description: "Design cinematográfico, performance otimizada, suporte prioritário.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="text-left"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: minimalLuxury.colors.accent.primary + "15",
                  }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: minimalLuxury.colors.accent.primary }} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight mb-2" style={{ color: minimalLuxury.colors.text.primary }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: minimalLuxury.colors.text.tertiary }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
