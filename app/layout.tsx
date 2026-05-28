import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/providers/auth-provider'
import { AuthRouteGuard } from '@/components/auth-route-guard'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/components/notifications/toast'
import { ServiceWorkerRegistration } from '@/components/service-worker-registration'
import { GlobalErrorBoundary } from '@/components/global-error-boundary'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nexus OS - Sistema Operacional Financeiro',
  description: 'Seu sistema operacional financeiro emocional e premium',
  generator: 'v0.app',
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
    title: 'Nexus OS',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0a0a0a',
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
        <link rel="apple-touch-icon" href="/branding/logo-light.png" />
      </head>
      <body className="font-sans antialiased min-h-screen" style={{ background: '#050505' }}>
        <GlobalErrorBoundary>
          <ServiceWorkerRegistration />
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <AuthRouteGuard>
                  {children}
                </AuthRouteGuard>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </GlobalErrorBoundary>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  registrations.forEach(function(registration) {
                    registration.unregister();
                  });
                });
                if ('caches' in window) {
                  caches.keys().then(function(cacheNames) {
                    cacheNames.forEach(function(cacheName) {
                      caches.delete(cacheName);
                    });
                  });
                }
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
