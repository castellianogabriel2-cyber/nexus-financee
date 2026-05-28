"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { minimalLuxury } from "@/lib/design-system/minimal-luxury"
import { Sparkles, ArrowRight, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

/**
 * Cinematic Onboarding - Apple Keynote Style
 * Inspired by: Apple product launches, VisionOS intro, Tesla UI
 * 
 * Philosophy:
 * - Minimalist screens
 * - Emotional phrases
 * - Smooth animations
 * - Cinematic transitions
 * - Memorable experience
 * - Much whitespace
 * - Editorial presentation
 */

const slides = [
  {
    id: 1,
    title: "Bem-vindo ao Nexus.",
    subtitle: "O sistema operacional financeiro emocional.",
    visual: "intro",
  },
  {
    id: 2,
    title: "Clareza.",
    subtitle: "Entenda suas finanças como nunca antes.",
    visual: "clarity",
  },
  {
    id: 3,
    title: "Controle.",
    subtitle: "Sua vida financeira, organizada.",
    visual: "control",
  },
  {
    id: 4,
    title: "Evolução.",
    subtitle: "Cresça financeiramente com inteligência.",
    visual: "evolution",
  },
  {
    id: 5,
    title: "Inteligência.",
    subtitle: "Uma IA que entende você.",
    visual: "intelligence",
  },
]

export function CinematicOnboarding() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const [loading, setLoading] = useState(false)

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1)
      setCurrentSlide(currentSlide + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide(currentSlide - 1)
    }
  }

  const completeOnboarding = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase.from("profiles").update({
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        }).eq("id", user.id)
      }

      window.location.href = "/home"
    } catch (error) {
      console.error("Error completing onboarding:", error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center" style={{ background: minimalLuxury.colors.background.primary }}>
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.02) 0%, transparent 50%)",
        }}
      />

      <div className="relative w-full max-w-4xl px-6 lg:px-12">
        {/* Slide content */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="text-center"
          >
            {/* Visual element */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.175, 0.885, 0.32, 1.275] as const }}
              className="mb-16 lg:mb-24"
            >
              <SlideVisual visual={slides[currentSlide].visual} />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
              className="text-6xl lg:text-8xl xl:text-9xl font-semibold tracking-tight mb-8 leading-[0.9]"
              style={{ color: minimalLuxury.colors.text.primary }}
            >
              {slides[currentSlide].title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
              className="text-2xl lg:text-3xl font-light leading-relaxed max-w-2xl mx-auto"
              style={{ color: minimalLuxury.colors.text.tertiary }}
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            {/* Cinematic gradient line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "120px" }}
              transition={{ delay: 0.8, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const }}
              className="h-[1px] mx-auto mt-16"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Progress indicators */}
        <div className="flex justify-center gap-3 mt-16">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              initial={{ width: 8 }}
              animate={{ width: index === currentSlide ? 32 : 8 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
              className="h-[2px] rounded-full"
              style={{
                background: index === currentSlide
                  ? minimalLuxury.colors.accent.primary
                  : minimalLuxury.colors.border.medium,
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12">
          {currentSlide > 0 ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={prevSlide}
              className="text-sm tracking-wide"
              style={{ color: minimalLuxury.colors.text.tertiary }}
            >
              Voltar
            </motion.button>
          ) : (
            <div />
          )}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextSlide}
            disabled={loading}
            className="px-8 py-4 rounded-2xl font-medium tracking-wide flex items-center gap-2 disabled:opacity-50"
            style={{
              background: minimalLuxury.colors.accent.primary,
              color: minimalLuxury.colors.background.primary,
            }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-current/20 border-t-current rounded-full"
              />
            ) : currentSlide < slides.length - 1 ? (
              <>
                Continuar
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Começar
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

function SlideVisual({ visual }: { visual: string }) {
  switch (visual) {
    case "intro":
      return (
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-32 h-32 lg:w-40 lg:h-40 mx-auto rounded-3xl flex items-center justify-center"
          style={{
            background: minimalLuxury.colors.accent.primary + "20",
            boxShadow: `0 0 60px ${minimalLuxury.colors.accent.primary}30`,
          }}
        >
          <Sparkles className="w-16 h-16 lg:w-20 lg:h-20" style={{ color: minimalLuxury.colors.accent.primary }} />
        </motion.div>
      )
    case "clarity":
      return (
        <motion.div
          animate={{
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-32 h-32 lg:w-40 lg:h-40 mx-auto rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${minimalLuxury.colors.accent.primary}20, transparent, ${minimalLuxury.colors.accent.primary}20)`,
          }}
        >
          <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto rounded-full" style={{ background: minimalLuxury.colors.background.primary }} />
        </motion.div>
      )
    case "control":
      return (
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-32 h-32 lg:w-40 lg:h-40 mx-auto rounded-3xl flex items-center justify-center"
          style={{
            background: minimalLuxury.colors.semantic.success + "20",
          }}
        >
          <Check className="w-16 h-16 lg:w-20 lg:h-20" style={{ color: minimalLuxury.colors.semantic.success }} />
        </motion.div>
      )
    case "evolution":
      return (
        <div className="flex items-end justify-center gap-4 h-32 lg:h-40">
          {[40, 60, 80, 100].map((height, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{
                delay: index * 0.1,
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1] as const,
              }}
              className="flex-1 rounded-t-2xl"
              style={{
                background: `linear-gradient(to top, ${minimalLuxury.colors.accent.primary}40, ${minimalLuxury.colors.accent.primary})`,
              }}
            />
          ))}
        </div>
      )
    case "intelligence":
      return (
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-32 h-32 lg:w-40 lg:h-40 mx-auto rounded-full"
          style={{
            background: `radial-gradient(circle, ${minimalLuxury.colors.accent.primary}30, transparent)`,
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-full h-full rounded-full"
            style={{
              border: `2px solid ${minimalLuxury.colors.accent.primary}40`,
            }}
          />
        </motion.div>
      )
    default:
      return null
  }
}
