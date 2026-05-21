"use client"

import { motion } from "framer-motion"

export function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card/30 border border-border/50 rounded-3xl p-6 lg:p-8"
    >
      <div className="space-y-4">
        <div className="h-4 bg-muted/50 rounded w-1/3 animate-pulse" />
        <div className="h-8 bg-muted/30 rounded w-2/3 animate-pulse" />
      </div>
    </motion.div>
  )
}

export function SkeletonHeroCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card/30 border border-border/50 rounded-3xl p-6 lg:p-8"
    >
      <div className="space-y-4">
        <div className="h-4 bg-muted/50 rounded w-1/4 animate-pulse" />
        <div className="h-10 bg-muted/30 rounded w-1/2 animate-pulse" />
      </div>
    </motion.div>
  )
}

export function SkeletonChart() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card/30 border border-border/50 rounded-3xl p-6 lg:p-8 h-80"
    >
      <div className="space-y-4">
        <div className="h-4 bg-muted/50 rounded w-1/4 animate-pulse" />
        <div className="h-48 bg-muted/20 rounded animate-pulse" />
      </div>
    </motion.div>
  )
}

export function SkeletonTransactionItem() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between py-4 border-b border-border/30"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-muted/50 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-muted/50 rounded w-32 animate-pulse" />
          <div className="h-3 bg-muted/30 rounded w-24 animate-pulse" />
        </div>
      </div>
      <div className="h-5 bg-muted/50 rounded w-20 animate-pulse" />
    </motion.div>
  )
}

export function SkeletonGoalCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card/30 border border-border/50 rounded-3xl p-6"
    >
      <div className="space-y-4">
        <div className="h-4 bg-muted/50 rounded w-1/3 animate-pulse" />
        <div className="h-8 bg-muted/30 rounded w-1/2 animate-pulse" />
        <div className="h-2 bg-muted/20 rounded w-full animate-pulse" />
      </div>
    </motion.div>
  )
}

export function SkeletonCardItem() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-card/50 to-card/30 border border-border/50 rounded-3xl p-6 aspect-[1.586/1] flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="h-4 bg-muted/50 rounded w-1/4 animate-pulse" />
        <div className="h-6 bg-muted/30 rounded w-1/3 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted/30 rounded w-1/2 animate-pulse" />
        <div className="h-3 bg-muted/30 rounded w-1/3 animate-pulse" />
      </div>
    </motion.div>
  )
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonTransactionItem key={i} />
      ))}
    </div>
  )
}
