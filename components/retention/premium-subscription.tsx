"use client"

import { motion } from "framer-motion"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { Crown, Sparkles, Shield, Zap, Infinity, Check } from "lucide-react"
import { useState } from "react"

/**
 * Nexus OS - Real Premium Subscription Feel
 * 
 * Philosophy:
 * - Exclusiva, sofisticada, elite
 * - NÃO "plano pago comum"
 * - Premium experience
 * 
 * Inspired by:
 * - Arc Browser
 * - Linear
 * - Apple One
 */

interface PremiumTier {
  name: string
  description: string
  price: string
  period: string
  features: string[]
  icon: React.ReactNode
  color: string
  gradient: string
  isPopular?: boolean
}

const premiumTiers: PremiumTier[] = [
  {
    name: "Nexus Core",
    description: "Para começar sua jornada",
    price: "R$ 0",
    period: "para sempre",
    features: [
      "Acompanhamento básico",
      "Transações ilimitadas",
      "Metas financeiras",
      "Relatórios mensais",
    ],
    icon: <Sparkles className="w-6 h-6" />,
    color: "#00d4ff",
    gradient: "linear-gradient(135deg, #00d4ff 0%, #00ff9d 100%)",
  },
  {
    name: "Nexus Pro",
    description: "Para quem busca controle total",
    price: "R$ 29",
    period: "/mês",
    features: [
      "Tudo do Core",
      "IA Financeira Avançada",
      "Previsões Inteligentes",
      "Análise de Padrões",
      "Exportação de Dados",
      "Suporte Prioritário",
    ],
    icon: <Crown className="w-6 h-6" />,
    color: "#fbbf24",
    gradient: "linear-gradient(135deg, #fbbf24 0%, #f472b6 100%)",
    isPopular: true,
  },
  {
    name: "Nexus Elite",
    description: "Experiência financeira definitiva",
    price: "R$ 79",
    period: "/mês",
    features: [
      "Tudo do Pro",
      "Consultoria IA Personalizada",
      "Integração Bancária",
      "Alertas em Tempo Real",
      "Acesso Antecipado",
      "Concierge Financeiro",
    ],
    icon: <Infinity className="w-6 h-6" />,
    color: "#f472b6",
    gradient: "linear-gradient(135deg, #f472b6 0%, #7c3aed 100%)",
  },
]

export function PremiumSubscription({ 
  className = "",
  onSelectTier 
}: { 
  className?: string
  onSelectTier?: (tier: string) => void 
}) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const handleSelect = (tierName: string) => {
    setSelectedTier(tierName)
    onSelectTier?.(tierName)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-6"
          style={{
            background: nexusOS.colors.accent.primary + "15",
          }}
        >
          <Crown className="w-8 h-8" style={{ color: nexusOS.colors.accent.primary }} />
        </motion.div>

        <h2 className="text-3xl font-bold mb-3" style={{ color: nexusOS.colors.text.primary }}>
          Escolha sua experiência
        </h2>
        <p className="text-base" style={{ color: nexusOS.colors.text.tertiary }}>
          Transforme sua relação com o dinheiro
        </p>
      </motion.div>

      {/* Tiers */}
      <div className="space-y-4">
        {premiumTiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            onClick={() => handleSelect(tier.name)}
            className="relative cursor-pointer"
          >
            {tier.isPopular && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: tier.gradient,
                  color: nexusOS.colors.background.primary,
                }}
              >
                Popular
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={`p-6 rounded-3xl ${selectedTier === tier.name ? "ring-2" : ""}`}
              style={{
                background: nexusOS.glass.light.background,
                backdropFilter: nexusOS.glass.light.backdropFilter,
                border: selectedTier === tier.name 
                  ? `2px solid ${tier.color}` 
                  : `1px solid ${nexusOS.colors.border.subtle}`,
                boxShadow: selectedTier === tier.name 
                  ? `0 0 40px ${tier.color}30`
                  : "none",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-2xl"
                    style={{
                      background: tier.gradient,
                    }}
                  >
                    {tier.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: nexusOS.colors.text.primary }}>
                      {tier.name}
                    </h3>
                    <p className="text-sm" style={{ color: nexusOS.colors.text.tertiary }}>
                      {tier.description}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: tier.color }}>
                    {tier.price}
                  </p>
                  <p className="text-xs" style={{ color: nexusOS.colors.text.quaternary }}>
                    {tier.period}
                  </p>
                </div>
              </div>

              <ul className="space-y-2">
                {tier.features.map((feature, featureIndex) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 + featureIndex * 0.05 }}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: nexusOS.colors.text.primary }}
                  >
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: tier.color }} />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      {selectedTier && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl font-semibold text-lg"
            style={{
              background: premiumTiers.find(t => t.name === selectedTier)?.gradient,
              color: nexusOS.colors.background.primary,
            }}
          >
            Começar com {selectedTier}
          </motion.button>
          <p className="text-xs mt-3" style={{ color: nexusOS.colors.text.quaternary }}>
            Cancele a qualquer momento
          </p>
        </motion.div>
      )}
    </div>
  )
}

// Compact tier selector
export function CompactTierSelector({ 
  onSelectTier,
  className = "" 
}: { 
  onSelectTier: (tier: string) => void
  className?: string 
}) {
  const [selected, setSelected] = useState("Nexus Core")

  return (
    <div className={`flex gap-2 ${className}`}>
      {premiumTiers.map((tier) => (
        <motion.button
          key={tier.name}
          onClick={() => {
            setSelected(tier.name)
            onSelectTier(tier.name)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-medium transition-all ${
            selected === tier.name ? "ring-2" : ""
          }`}
          style={{
            background: selected === tier.name 
              ? tier.gradient 
              : nexusOS.colors.border.subtle + "30",
            color: selected === tier.name 
              ? nexusOS.colors.background.primary 
              : nexusOS.colors.text.primary,
            borderColor: selected === tier.name ? tier.color : "transparent",
          }}
        >
          {tier.name}
        </motion.button>
      ))}
    </div>
  )
}
