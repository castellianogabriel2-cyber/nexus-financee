"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface PremiumButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean
  loadingText?: string
}

export function PremiumButton({ 
  loading, 
  loadingText, 
  disabled, 
  children, 
  className, 
  ...props 
}: PremiumButtonProps) {
  return (
    <motion.div
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Button
        disabled={disabled || loading}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "transition-smooth",
          "no-tap-highlight",
          className
        )}
        {...props}
      >
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
          </motion.div>
        )}
        <motion.span 
          initial={{ opacity: 1 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className={loading ? "invisible" : ""}
        >
          {loading ? loadingText : children}
        </motion.span>
      </Button>
    </motion.div>
  )
}
