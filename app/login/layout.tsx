import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/components/notifications/toast'
import '../globals.css'

export const dynamic = 'force-dynamic'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Nexus Finance - Login',
  description: 'Login no Nexus Finance',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#09090b',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="bg-background" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#09090b" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
