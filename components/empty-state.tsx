"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref = "/nova-transacao",
}: {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-3xl border border-dashed border-border/50 bg-card/20"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 glow-primary">
        <Sparkles className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && (
        <Link
          href={actionHref}
          className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium text-sm glow-primary hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  )
}
