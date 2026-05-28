/**
 * Nexus OS Design System
 * 
 * Philosophy:
 * - Cinematic minimalism
 * - Luxury fintech
 * - Invisible AI
 * - Emotional finance
 * - iOS native feeling
 * 
 * Inspired by:
 * - Apple Wallet
 * - Arc Browser
 * - Revolut Ultra
 * - Linear
 * - Tesla UI
 * - Notion Calendar
 * - VisionOS
 */

export const nexusOS = {
  // Palette
  colors: {
    // Backgrounds
    background: {
      primary: "#0a0a0a", // Graphite black
      secondary: "#111111",
      elevated: "#1a1a1a",
      card: "#151515",
    },
    
    // Accents
    accent: {
      primary: "#00d4ff", // Electric cyan (subtle)
      secondary: "#00ff9d", // Soft emerald
      tertiary: "#7c3aed", // Deep purple
    },
    
    // Text
    text: {
      primary: "#ffffff",
      secondary: "#e5e5e5",
      tertiary: "#a3a3a3",
      quaternary: "#737373",
    },
    
    // Semantic
    semantic: {
      success: "#00ff9d",
      warning: "#fbbf24",
      error: "#f87171",
      info: "#60a5fa",
    },
    
    // Borders
    border: {
      subtle: "rgba(255, 255, 255, 0.06)",
      medium: "rgba(255, 255, 255, 0.1)",
      strong: "rgba(255, 255, 255, 0.15)",
    },
  },
  
  // Glass effects
  glass: {
    light: {
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
    },
    medium: {
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(30px)",
      WebkitBackdropFilter: "blur(30px)",
    },
    strong: {
      background: "rgba(255, 255, 255, 0.08)",
      backdropFilter: "blur(40px)",
      WebkitBackdropFilter: "blur(40px)",
    },
  },
  
  // Blur
  blur: {
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
  },
  
  // Shadows
  shadows: {
    subtle: "0 4px 24px rgba(0, 0, 0, 0.4)",
    medium: "0 8px 32px rgba(0, 0, 0, 0.5)",
    strong: "0 16px 48px rgba(0, 0, 0, 0.6)",
    glow: "0 0 60px rgba(0, 212, 255, 0.15)",
  },
  
  // Typography
  typography: {
    // Font families
    fontFamily: {
      sans: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
      mono: "'SF Mono', 'JetBrains Mono', monospace",
    },
    
    // Font sizes - absurdly large for editorial feel
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
      "7xl": "4.5rem", // 72px
      "8xl": "6rem", // 96px
      "9xl": "8rem", // 128px
      "10xl": "10rem", // 160px
    },
    
    // Font weights
    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    
    // Letter spacing
    letterSpacing: {
      tight: "-0.02em",
      normal: "0",
      wide: "0.02em",
      wider: "0.04em",
      widest: "0.1em",
    },
    
    // Line heights
    lineHeight: {
      tight: "1.1",
      normal: "1.5",
      relaxed: "1.75",
    },
  },
  
  // Spacing - generous for editorial feel
  spacing: {
    xs: "0.5rem", // 8px
    sm: "1rem", // 16px
    md: "1.5rem", // 24px
    lg: "2rem", // 32px
    xl: "3rem", // 48px
    "2xl": "4rem", // 64px
    "3xl": "6rem", // 96px
    "4xl": "8rem", // 128px
    "5xl": "12rem", // 192px
  },
  
  // Border radius - iOS native feel
  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    full: "9999px",
  },
  
  // Animation
  animation: {
    // Spring physics
    spring: {
      stiffness: 300,
      damping: 30,
    },
    
    // Durations
    duration: {
      fast: "200ms",
      normal: "400ms",
      slow: "600ms",
      slower: "800ms",
      cinematic: "1200ms",
    },
    
    // Easing
    easing: {
      // iOS native spring
      spring: [0.175, 0.885, 0.32, 1.275] as const,
      // Cinematic
      cinematic: [0.25, 0.1, 0.25, 1] as const,
      // Smooth
      smooth: [0.4, 0, 0.2, 1] as const,
    },
  },
  
  // Layout
  layout: {
    // Container
    container: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    
    // Safe areas (iOS)
    safeArea: {
      top: "env(safe-area-inset-top)",
      bottom: "env(safe-area-inset-bottom)",
      left: "env(safe-area-inset-left)",
      right: "env(safe-area-inset-right)",
    },
  },
}

// Utility functions
export const getGlow = (color: string, intensity: number = 0.5) => {
  return `0 0 ${60 * intensity}px ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`
}

export const getGradient = (colors: string[], direction: string = "to right") => {
  return `linear-gradient(${direction}, ${colors.join(", ")})`
}
