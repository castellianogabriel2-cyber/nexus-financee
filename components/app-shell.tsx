"use client"

import { useRef, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar, MobileNav } from "@/components/navigation"
import { ModoApertoBanner } from "@/components/modo-aperto-panel"

const BARE_ROUTES = ["/login", "/onboarding", "/auth"]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 0 })

  const isBare = BARE_ROUTES.some((r) => pathname.startsWith(r))

  useEffect(() => {
    if (isBare) return
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        })
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isBare])

  if (isBare) {
    return <>{children}</>
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background relative"
      style={{ "--mouse-x": `${mousePosition.x}%`, "--mouse-y": `${mousePosition.y}%` } as React.CSSProperties}
    >
      <div className="fixed inset-0 gradient-radial pointer-events-none" />
      <div className="fixed inset-0 gradient-spotlight pointer-events-none opacity-50" />

      <Sidebar />
      <main className="lg:ml-72 min-h-screen pb-24 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4">
          <ModoApertoBanner />
        </div>
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
