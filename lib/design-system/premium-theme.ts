/**
 * Nexus Finance - Premium Design System
 * Dark Premium + Cyber Elegante
 * 
 * Inspired by: Apple Wallet, Revolut, Arc Browser, Linear, Tesla, Perplexity AI
 */

// === CORE COLORS ===
export const premiumColors = {
  // Backgrounds
  background: {
    primary: '#0a0a0b',      // Preto profundo
    secondary: '#111113',    // Grafite escuro
    tertiary: '#1a1a1d',     // Grafite médio
    elevated: '#222225',     // Grafite claro
  },
  
  // Accents
  primary: {
    DEFAULT: '#3b82f6',      // Azul premium
    glow: '#3b82f640',      // Azul glow (25% opacity)
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  },
  
  success: {
    DEFAULT: '#10b981',      // Esmeralda
    glow: '#10b98140',
  },
  
  warning: {
    DEFAULT: '#f59e0b',      // Âmbar
    glow: '#f59e0b40',
  },
  
  destructive: {
    DEFAULT: '#ef4444',      // Vermelho
    glow: '#ef444440',
  },
  
  // Text
  text: {
    primary: '#ffffff',      // Branco puro
    secondary: '#a1a1aa',    // Cinza claro
    tertiary: '#71717a',     // Cinza médio
    muted: '#52525b',        // Cinza escuro
  },
  
  // Borders
  border: {
    DEFAULT: '#27272a',      // Borda sutil
    elevated: '#3f3f46',     // Borda elevada
    glow: '#3b82f620',       // Borda com glow
  },
}

// === GLASSMORPHISM ===
export const glassEffects = {
  // Frosted glass effect
  frosted: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  
  // Strong glass for cards
  strong: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  
  // Subtle glass for backgrounds
  subtle: {
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  
  // Premium glow effect
  glow: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },
}

// === TYPOGRAPHY ===
export const typography = {
  font: {
    sans: 'var(--font-inter)',
    mono: 'var(--font-jetbrains-mono)',
  },
  
  size: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },
  
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75',
  },
}

// === SPACING ===
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
}

// === BORDER RADIUS ===
export const borderRadius = {
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
}

// === SHADOWS ===
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px rgba(0, 0, 0, 0.4)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.6)',
  glow: '0 0 20px rgba(59, 130, 246, 0.3)',
  glowStrong: '0 0 40px rgba(59, 130, 246, 0.4)',
}

// === ANIMATIONS ===
export const animations = {
  // Spring animations
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  
  // Smooth transitions
  smooth: {
    type: 'tween',
    duration: 0.3,
    ease: 'easeInOut',
  },
  
  // Cinematic transitions
  cinematic: {
    type: 'tween',
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1],
  },
  
  // Stagger delays
  stagger: {
    children: 0.1,
    container: 0.2,
  },
}

// === MOTION VARIANTS ===
export const motionVariants = {
  // Fade in
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  
  // Slide up
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  
  // Slide down
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  
  // Scale
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  
  // Stagger children
  staggerChildren: {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
}

// === GRADIENTS ===
export const gradients = {
  primary: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  warning: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  destructive: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
  dark: 'linear-gradient(135deg, #0a0a0b 0%, #111113 100%)',
  subtle: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
}

// === BREAKPOINTS ===
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// === UTILITY CLASSES ===
export const utilityClasses = {
  // Glass effect
  glass: 'backdrop-blur-xl bg-white/5 border border-white/10',
  glassStrong: 'backdrop-blur-2xl bg-white/8 border border-white/15',
  
  // Glow effect
  glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
  glowStrong: 'shadow-[0_0_40px_rgba(59,130,246,0.4)]',
  
  // Text gradients
  textGradient: 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent',
  
  // Smooth transitions
  transition: 'transition-all duration-300 ease-in-out',
  transitionCinematic: 'transition-all duration-600 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
}
