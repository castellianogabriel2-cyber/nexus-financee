import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppShell } from '@/components/app-shell'
import { AuthProvider } from '@/providers/auth-provider'
import { AuthRouteGuard } from '@/components/auth-route-guard'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const dynamic = 'force-dynamic'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Nexus Finance - Dashboard Financeiro Premium',
  description: 'Seu controle financeiro pessoal premium',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/branding/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
    apple: '/branding/logo.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nexus Finance',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            <AuthRouteGuard>
              <AppShell>
                {children}
              </AppShell>
            </AuthRouteGuard>
          </AuthProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
