"use client"

import { FloatingNavigation } from "@/components/os/floating-navigation"
import { nexusOS } from "@/lib/design-system/nexus-os"
import { ReactNode } from "react"

/**
 * Nexus OS Layout Wrapper
 * Applies Nexus OS design system to all pages
 * 
 * Philosophy:
 * - Consistent experience across all pages
 * - Floating navigation
 * - Premium background
 * - Cinematic feel
 */

export function NexusOSLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full max-w-screen overflow-x-hidden relative" style={{ background: nexusOS.colors.background.primary }}>
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.02) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div className="relative min-h-screen pb-24 w-full">
        {children}
      </div>

      {/* Floating Navigation */}
      <FloatingNavigation />
    </div>
  )
}
