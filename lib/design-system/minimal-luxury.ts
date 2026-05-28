/**
 * Nexus Finance - Minimal Luxury Design System
 * Inspired by: Linear, Arc Browser, Apple Wallet, Revolut Ultra, Notion Calendar, Stripe, Raycast, Tesla UI, Perplexity AI
 * 
 * Philosophy:
 * - Luxury minimalism
 * - Elegant depth
 * - Sophisticated blur
 * - Smooth animations
 * - Generous whitespace
 * - Perfect typography
 * - Impeccable visual hierarchy
 * - Cinematic feeling
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COLORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const minimalColors = {
  // Graphite Black Base
  background: {
    primary: "#0a0a0a",      // Deepest black
    secondary: "#111111",    // Graphite black
    tertiary: "#1a1a1a",     // Soft black
    elevated: "#222222",      // Elevated surface
  },
  
  // Text Hierarchy
  text: {
    primary: "#fafafa",      // Pure white for headlines
    secondary: "#e5e5e5",    // Soft white for body
    tertiary: "#a3a3a3",     // Muted for labels
    quaternary: "#737373",   // Subtle for hints
  },
  
  // Micro Blue Illumination
  accent: {
    primary: "#3b82f6",      // Subtle blue
    secondary: "#60a5fa",    // Light blue
    subtle: "#1e3a8a",       // Deep blue
  },
  
  // Semantic Colors (Minimal)
  semantic: {
    success: "#10b981",      // Emerald
    warning: "#f59e0b",      // Amber
    error: "#ef4444",        // Red
    info: "#3b82f6",         // Blue
  },
  
  // Borders (Ultra Subtle)
  border: {
    subtle: "#262626",       // Almost invisible
    medium: "#333333",       // Visible but soft
    strong: "#404040",       // Clear but elegant
  },
  
  // Glass Layers
  glass: {
    light: "rgba(255, 255, 255, 0.02)",
    medium: "rgba(255, 255, 255, 0.04)",
    strong: "rgba(255, 255, 255, 0.06)",
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPOGRAPHY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const minimalTypography = {
  // Font Families
  fontFamily: {
    sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
    mono: ["JetBrains Mono", "SF Mono", "Monaco", "Cascadia Code", "monospace"],
  },
  
  // Font Sizes (Generous scaling)
  fontSize: {
    xs: "0.75rem",      // 12px
    sm: "0.875rem",     // 14px
    base: "1rem",       // 16px
    lg: "1.125rem",     // 18px
    xl: "1.25rem",      // 20px
    "2xl": "1.5rem",    // 24px
    "3xl": "1.875rem",  // 30px
    "4xl": "2.25rem",   // 36px
    "5xl": "3rem",      // 48px
    "6xl": "3.75rem",   // 60px
    "7xl": "4.5rem",    // 72px
  },
  
  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Line Heights (Breathable)
  lineHeight: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.02em",
    wider: "0.05em",
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPACING (Generous Whitespace)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const minimalSpacing = {
  0: "0",
  1: "0.25rem",   // 4px
  2: "0.5rem",    // 8px
  3: "0.75rem",   // 12px
  4: "1rem",      // 16px
  5: "1.25rem",   // 20px
  6: "1.5rem",    // 24px
  8: "2rem",      // 32px
  10: "2.5rem",   // 40px
  12: "3rem",     // 48px
  16: "4rem",     // 64px
  20: "5rem",     // 80px
  24: "6rem",     // 96px
  32: "8rem",     // 128px
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BORDER RADIUS (Ultra Subtle)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const minimalRadius = {
  none: "0",
  sm: "0.25rem",   // 4px
  md: "0.5rem",    // 8px
  lg: "0.75rem",   // 12px
  xl: "1rem",      // 16px
  "2xl": "1.25rem", // 20px
  "3xl": "1.5rem", // 24px
  full: "9999px",
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHADOWS (Elegant Depth)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const minimalShadows = {
  none: "none",
  subtle: "0 1px 2px rgba(0, 0, 0, 0.3)",
  medium: "0 4px 6px rgba(0, 0, 0, 0.4)",
  large: "0 10px 15px rgba(0, 0, 0, 0.5)",
  xl: "0 20px 25px rgba(0, 0, 0, 0.6)",
  glow: "0 0 40px rgba(59, 130, 246, 0.15)",
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLUR (Sophisticated)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const minimalBlur = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  "3xl": "32px",
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANIMATIONS (Cinematic Smooth)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const minimalAnimations = {
  // Easing Functions
  easing: {
    default: [0.25, 0.1, 0.25, 1],      // Smooth
    in: [0.4, 0, 1, 1],                 // Ease in
    out: [0, 0, 0.2, 1],                // Ease out
    spring: [0.175, 0.885, 0.32, 1.275], // Bouncy spring
  },
  
  // Durations
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    slower: "700ms",
    cinematic: "1000ms",
  },
  
  // Presets
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: "500ms", ease: [0.25, 0.1, 0.25, 1] },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: "600ms", ease: [0.25, 0.1, 0.25, 1] },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: "400ms", ease: [0.175, 0.885, 0.32, 1.275] },
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLASSMORPHISM (Frosted Glass)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const minimalGlass = {
  // Frosted Glass Layers
  light: {
    background: minimalColors.glass.light,
    backdropFilter: `blur(${minimalBlur.lg})`,
    border: minimalColors.border.subtle,
  },
  
  medium: {
    background: minimalColors.glass.medium,
    backdropFilter: `blur(${minimalBlur.xl})`,
    border: minimalColors.border.medium,
  },
  
  strong: {
    background: minimalColors.glass.strong,
    backdropFilter: `blur(${minimalBlur["2xl"]})`,
    border: minimalColors.border.strong,
  },
  
  // Reflection Effect
  reflection: {
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%)",
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BREAKPOINTS (Mobile First)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const minimalBreakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY CLASSES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const minimalUtils = {
  // Glass Utilities
  glass: `
    background: ${minimalColors.glass.medium};
    backdrop-filter: blur(${minimalBlur.xl});
    -webkit-backdrop-filter: blur(${minimalBlur.xl});
    border: 1px solid ${minimalColors.border.subtle};
  `,
  
  glassStrong: `
    background: ${minimalColors.glass.strong};
    backdrop-filter: blur(${minimalBlur["2xl"]});
    -webkit-backdrop-filter: blur(${minimalBlur["2xl"]});
    border: 1px solid ${minimalColors.border.medium};
  `,
  
  // Text Gradient (Subtle)
  textGradient: `
    background: linear-gradient(135deg, ${minimalColors.text.primary} 0%, ${minimalColors.text.secondary} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `,
  
  // Accent Gradient (Ultra Subtle)
  accentGradient: `
    background: linear-gradient(135deg, ${minimalColors.accent.primary} 0%, ${minimalColors.accent.secondary} 100%);
  `,
  
  // Smooth Transition
  transition: `
    transition: all ${minimalAnimations.duration.normal} ${minimalAnimations.easing.default};
  `,
  
  // Cinematic Transition
  cinematic: `
    transition: all ${minimalAnimations.duration.cinematic} ${minimalAnimations.easing.default};
  `,
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT ALL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const minimalLuxury = {
  colors: minimalColors,
  typography: minimalTypography,
  spacing: minimalSpacing,
  radius: minimalRadius,
  shadows: minimalShadows,
  blur: minimalBlur,
  animations: minimalAnimations,
  glass: minimalGlass,
  breakpoints: minimalBreakpoints,
  utils: minimalUtils,
}
