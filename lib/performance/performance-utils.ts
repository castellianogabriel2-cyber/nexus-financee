/**
 * Nexus OS - Performance Utilities
 * 
 * Philosophy:
 * - 120fps feel
 * - Optimized renders
 * - Smooth animations
 * - Efficient blur
 * - Optimized gradients
 * 
 * Target:
 * - 60fps minimum
 * - 120fps ideal
 */

import { useMemo, useCallback, useRef, useEffect, useState } from "react"
import React from "react"

// Memoization helper for expensive computations
export function useMemoized<T>(factory: () => T, deps: any[]): T {
  return useMemo(factory, deps)
}

// Callback memoization
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T {
  return useCallback(callback, deps)
}

// Debounce utility
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

// Throttle utility
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRunRef = useRef<number>(0)

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastRunRef.current >= delay) {
      callback(...args)
      lastRunRef.current = now
    }
  }
}

// Intersection observer for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [(node: HTMLElement | null) => void, IntersectionObserverEntry | null] {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const observe = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    if (node) {
      observerRef.current = new IntersectionObserver(([entry]) => {
        setEntry(entry)
      }, options)
      observerRef.current.observe(node)
    }
  }, [options])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [options])

  return [observe, entry]
}

// Performance monitor
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private marks: Map<string, number> = new Map()

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  mark(name: string): void {
    this.marks.set(name, performance.now())
  }

  measure(name: string, startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark)
    if (!start) return 0

    const end = endMark ? this.marks.get(endMark) : performance.now()
    if (!end) return 0

    const duration = end - start
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    return duration
  }

  logFPS(): void {
    let frames = 0
    let lastTime = performance.now()

    const countFPS = () => {
      frames++
      const currentTime = performance.now()
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime))
        console.log(`[Performance] FPS: ${fps}`)
        frames = 0
        lastTime = currentTime
      }
      requestAnimationFrame(countFPS)
    }

    requestAnimationFrame(countFPS)
  }
}

// Animation optimization
export function optimizeAnimation(callback: () => void, fps = 60): () => void {
  let lastTime = 0
  const interval = 1000 / fps

  const animate = (time: number) => {
    if (time - lastTime >= interval) {
      callback()
      lastTime = time
    }
    requestAnimationFrame(animate)
  }

  const cancel = () => {
    // Cancel animation frame if needed
  }

  requestAnimationFrame(animate)
  return cancel
}

// Blur optimization - use CSS instead of JS when possible
export function getOptimizedBlur(radius: number): string {
  // Use CSS blur for better performance
  return `blur(${radius}px)`
}

// Gradient optimization - use CSS gradients instead of canvas
export function getOptimizedGradient(colors: string[], angle: number = 0): string {
  return `linear-gradient(${angle}deg, ${colors.join(", ")})`
}

// Lazy load images
export function useLazyImage(src: string, threshold = 0.1): [string, boolean] {
  const [imageSrc, setImageSrc] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [imgRef, entry] = useIntersectionObserver({ threshold })

  useEffect(() => {
    if (entry?.isIntersecting) {
      const img = new Image()
      img.src = src
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
    }
  }, [entry, src])

  return [imageSrc, isLoaded]
}

// Virtual scroll helper for large lists
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
): { visibleItems: T[]; startIndex: number; handleScroll: (e: React.UIEvent<HTMLDivElement>) => void } {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleCount, items.length)
  const visibleItems = items.slice(startIndex, endIndex)

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return { visibleItems, startIndex, handleScroll }
}

// Reduce re-renders with stable references
export function useStableValue<T>(value: T): T {
  const ref = useRef(value)
  if (ref.current !== value) {
    ref.current = value
  }
  return ref.current
}

// Batch state updates
export function useBatchUpdates() {
  const [isBatching, setIsBatching] = useState(false)
  const updates = useRef<(() => void)[]>([])

  const batch = useCallback((update: () => void) => {
    if (isBatching) {
      updates.current.push(update)
    } else {
      update()
    }
  }, [isBatching])

  const startBatch = useCallback(() => {
    setIsBatching(true)
    updates.current = []
  }, [])

  const endBatch = useCallback(() => {
    setIsBatching(false)
    updates.current.forEach((update) => update())
    updates.current = []
  }, [])

  return { batch, startBatch, endBatch }
}

// Performance-aware component wrapper
export function withPerformanceOptimization<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return React.memo(Component, (prevProps, nextProps) => {
    // Custom comparison logic
    return JSON.stringify(prevProps) === JSON.stringify(nextProps)
  })
}
