const CACHE_VERSION = 'v2'
const STATIC_CACHE_NAME = `nexus-static-${CACHE_VERSION}`
const DYNAMIC_CACHE_NAME = `nexus-dynamic-${CACHE_VERSION}`

// Rotas que NUNCA devem ser cacheadas
const NO_CACHE_ROUTES = [
  '/login',
  '/dashboard',
  '/auth/',
  '/api/',
  '/carteira',
  '/cartoes',
  '/gastos',
  '/metas',
  '/reserva',
  '/configuracoes',
  '/mais',
  '/calendario',
  '/parcelamentos',
  '/analytics',
  '/admin',
  '/exportar',
  '/nova-transacao',
  '/onboarding',
]

// Assets estáticos que podem ser cacheados
const STATIC_ASSETS = [
  '/manifest.json',
  '/branding/logo-light.png',
]

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker', CACHE_VERSION)

  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )

  // Ativar imediatamente o novo service worker
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker', CACHE_VERSION)

  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Reclamar todos os clientes imediatamente
      self.clients.claim()
    ])
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // NUNCA cachear localhost
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    event.respondWith(fetch(event.request))
    return
  }

  // Não interceptar requisições para rotas dinâmicas
  const isNoCacheRoute = NO_CACHE_ROUTES.some(route =>
    url.pathname.startsWith(route)
  )

  if (isNoCacheRoute) {
    // Network-first para rotas dinâmicas
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback para cache se network falhar
        return caches.match(event.request)
      })
    )
    return
  }

  // Para assets estáticos, usar cache-first
  if (STATIC_ASSETS.some(asset => url.pathname === asset || url.pathname.includes(asset))) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(event.request).then((response) => {
          // Não cache respostas com redirect
          if (response.redirected) {
            return response
          }

          // Clone da resposta para cache
          const responseToCache = response.clone()

          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        }).catch(() => {
          // Fallback para cache se network falhar
          return caches.match(event.request)
        })
      })
    )
    return
  }

  // Para navegação HTML, usar network-first SEM cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback para página offline
        return caches.match('/')
      })
    )
    return
  }

  // Para outros recursos, usar network-first SEM cache
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request)
    })
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
