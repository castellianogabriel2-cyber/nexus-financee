"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="fixed inset-0 gradient-radial pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-20 h-20 rounded-3xl flex items-center justify-center glow-primary"
        >
          <img src="/branding/logo.png" alt="Nexus Finance" className="w-20 h-20 object-contain" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Nexus Finance</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-sm text-muted-foreground">Carregando...</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-48 h-1 bg-border/30 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-gradient-to-r from-primary to-primary/60"
          />
        </motion.div>
      </div>
    </div>
  )
}
