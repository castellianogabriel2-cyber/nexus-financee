import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppShell } from '@/components/app-shell'
import { AuthProvider } from '@/providers/auth-provider'
import { AuthRouteGuard } from '@/components/auth-route-guard'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/components/notifications/toast'
import './globals.css'

export const dynamic = 'force-dynamic'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Nexus Finance - Dashboard Financeiro Premium',
  description: 'Seu controle financeiro pessoal premium',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  icons: {
    icon: [
      {
        url: '/branding/logo-light.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/branding/logo-light.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/branding/logo-light.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nexus Finance',
  },
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: '#ffffff',
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: '#09090b',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#09090b" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <AuthRouteGuard>
                <AppShell>
                  {children}
                </AppShell>
              </AuthRouteGuard>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
