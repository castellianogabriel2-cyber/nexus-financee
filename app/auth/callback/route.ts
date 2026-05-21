import { createClient } from "@/lib/supabase/server"
import { getPostLoginPath } from "@/lib/auth/post-login-path"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const nextParam = searchParams.get("next")

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth`)
  }

  const destination =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("/login")
      ? nextParam
      : await getPostLoginPath(supabase, data.user.id)

  return NextResponse.redirect(`${origin}/auth/confirmed`)
}
