"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface AdaptiveLogoProps {
  className?: string
  width?: number
  height?: number
}

export function AdaptiveLogo({ className = "", width = 40, height = 40 }: AdaptiveLogoProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return placeholder during SSR to prevent hydration mismatch
    return (
      <div 
        className={`bg-primary/20 rounded-lg ${className}`}
        style={{ width, height }}
      />
    )
  }

  const isDark = resolvedTheme === "dark"
  const logoSrc = isDark ? "/branding/logo-light.png" : "/branding/logo-dark.png"

  return (
    <img
      src={logoSrc}
      alt="Nexus Finance Logo"
      width={width}
      height={height}
      className={className}
    />
  )
}
