"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "info"

interface PremiumToastProps {
  type?: ToastType
  message: string
  onClose?: () => void
  duration?: number
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colors = {
  success: "bg-success/10 border-success/30 text-success",
  error: "bg-destructive/10 border-destructive/30 text-destructive",
  info: "bg-primary/10 border-primary/30 text-primary",
}

export function PremiumToast({ 
  type = "info", 
  message, 
  onClose, 
  duration = 3000 
}: PremiumToastProps) {
  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg",
        colors[type]
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  )
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </div>
  )
}
