import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { getPostLoginPath } from "@/lib/auth/post-login-path"

const PUBLIC_PATHS = ["/login", "/auth"]
const AUTH_ONLY_PATHS = ["/login"]

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    const pathname = request.nextUrl.pathname
    if (!PUBLIC_PATHS.some((p) => pathname.startsWith(p)) && !isStaticAsset(pathname)) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = "/login"
      loginUrl.searchParams.set("error", "config")
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (isStaticAsset(pathname)) {
    return supabaseResponse
  }

  const isPublicRoute = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  // Raiz → dashboard (logado) ou login (deslogado)
  if (pathname === "/") {
    const redirectUrl = request.nextUrl.clone()
    if (user) {
      redirectUrl.pathname = await getPostLoginPath(supabase, user.id)
    } else {
      redirectUrl.pathname = "/login"
    }
    return NextResponse.redirect(redirectUrl)
  }

  // Não autenticado em rota privada → /login
  if (!user && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Autenticado em /login → dashboard ou onboarding
  if (user && AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = await getPostLoginPath(supabase, user.id)
    redirectUrl.search = ""
    return NextResponse.redirect(redirectUrl)
  }

  // Autenticado: forçar onboarding se incompleto
  if (user && !isPublicRoute && pathname !== "/onboarding") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle()

    if (!profile?.onboarding_completed) {
      const onboardingUrl = request.nextUrl.clone()
      onboardingUrl.pathname = "/onboarding"
      return NextResponse.redirect(onboardingUrl)
    }
  }

  // Onboarding já completo → home (Nexus OS)
  if (user && pathname === "/onboarding") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle()

    if (profile?.onboarding_completed) {
      const homeUrl = request.nextUrl.clone()
      homeUrl.pathname = "/"
      return NextResponse.redirect(homeUrl)
    }
  }

  return supabaseResponse
}

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/icon.svg" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname)
  )
}
