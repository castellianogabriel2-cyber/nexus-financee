"use client"

import { motion } from "framer-motion"

export function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
        <div className="w-4 h-4 bg-muted-foreground/50 rounded-full" />
      </div>
      <div className="flex-1 flex items-center">
        <div className="bg-card/80 border border-border/50 px-4 py-3 rounded-2xl rounded-tl-sm">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
