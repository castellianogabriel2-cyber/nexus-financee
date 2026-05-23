import { cn } from '@/lib/utils'

export function PremiumSkeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-accent/30 rounded-md',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:animate-[shimmer_1.5s_infinite]',
        'before:bg-gradient-to-r',
        'before:from-transparent before:via-white/10 before:to-transparent',
        className
      )}
      {...props}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 p-4 rounded-2xl bg-card/50 border border-border/30">
      <PremiumSkeleton className="h-4 w-3/4" />
      <PremiumSkeleton className="h-3 w-1/2" />
      <div className="flex gap-2 pt-2">
        <PremiumSkeleton className="h-8 w-20 rounded-full" />
        <PremiumSkeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-card/50 border border-border/30">
      <PremiumSkeleton className="h-4 w-1/3 mb-2" />
      <PremiumSkeleton className="h-8 w-1/2 mb-4" />
      <PremiumSkeleton className="h-3 w-1/4" />
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-card/30 border border-border/20">
          <PremiumSkeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <PremiumSkeleton className="h-4 w-3/4" />
            <PremiumSkeleton className="h-3 w-1/2" />
          </div>
          <PremiumSkeleton className="h-8 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  )
}
