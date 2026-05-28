"use client"

import { motion } from "framer-motion"
import { minimalLuxury } from "@/lib/design-system/minimal-luxury"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

/**
 * Premium Hero Section - Cinematic Hero
 * Inspired by: Apple product pages, Linear landing, Arc Browser
 * 
 * Philosophy:
 * - Cinematic presentation
 * - Premium aesthetics
 * - Emotional connection
 * - Clear value proposition
 * - Memorable first impression
 */

interface PremiumHeroProps {
  title: string
  subtitle: string
  description?: string
  cta?: {
    label: string
    href: string
  }
  secondaryCta?: {
    label: string
    href: string
  }
  visual?: "gradient" | "particles" | "minimal"
}

export function PremiumHero({
  title,
  subtitle,
  description,
  cta,
  secondaryCta,
  visual = "gradient",
}: PremiumHeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: minimalLuxury.colors.background.primary }}>
      {/* Ambient background */}
      {visual === "gradient" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
          }}
        />
      )}

      {/* Animated particles */}
      {visual === "particles" && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: minimalLuxury.colors.accent.primary,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center">
        {/* Cinematic badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="inline-block mb-8"
        >
          <div
            className="px-4 py-2 rounded-full text-xs uppercase tracking-[0.3em]"
            style={{
              background: minimalLuxury.colors.accent.primary + "15",
              color: minimalLuxury.colors.accent.primary,
            }}
          >
            Nexus OS
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="text-6xl lg:text-8xl xl:text-9xl font-semibold tracking-tight mb-8 leading-[0.9]"
          style={{ color: minimalLuxury.colors.text.primary }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="text-2xl lg:text-3xl font-light mb-6 leading-relaxed max-w-3xl mx-auto"
          style={{ color: minimalLuxury.colors.text.tertiary }}
        >
          {subtitle}
        </motion.p>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="text-lg leading-relaxed max-w-2xl mx-auto mb-12"
            style={{ color: minimalLuxury.colors.text.quaternary }}
          >
            {description}
          </motion.p>
        )}

        {/* Cinematic gradient line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "150px" }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="h-[1px] mx-auto mb-12"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)",
          }}
        />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {cta && (
            <Link href={cta.href}>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-2xl font-medium tracking-wide flex items-center gap-2"
                style={{
                  background: minimalLuxury.colors.accent.primary,
                  color: minimalLuxury.colors.background.primary,
                }}
              >
                {cta.label}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          )}
          {secondaryCta && (
            <Link href={secondaryCta.href}>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-2xl font-medium tracking-wide"
                style={{
                  background: minimalLuxury.colors.background.elevated,
                  border: `1px solid ${minimalLuxury.colors.border.subtle}`,
                  color: minimalLuxury.colors.text.secondary,
                }}
              >
                {secondaryCta.label}
              </motion.button>
            </Link>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
          style={{ borderColor: minimalLuxury.colors.border.medium }}
        >
          <motion.div
            className="w-1 h-2 rounded-full"
            style={{ background: minimalLuxury.colors.accent.primary }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

/**
 * Premium Feature Hero - For feature sections
 */
export function PremiumFeatureHero({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="relative py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="flex-shrink-0"
          >
            <div
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center"
              style={{
                background: minimalLuxury.colors.accent.primary + "15",
              }}
            >
              {icon}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <h2
              className="text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight mb-6"
              style={{ color: minimalLuxury.colors.text.primary }}
            >
              {title}
            </h2>
            <p
              className="text-xl lg:text-2xl font-light leading-relaxed"
              style={{ color: minimalLuxury.colors.text.tertiary }}
            >
              {description}
            </p>

            {/* Cinematic gradient line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ delay: 0.4, duration: 1, ease: [0.25, 0.1, 0.25, 1] as const }}
              className="h-[1px] mt-12"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
