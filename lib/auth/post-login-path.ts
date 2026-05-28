import type { SupabaseClient } from "@supabase/supabase-js"

/** Rota após login bem-sucedido: onboarding ou home (Nexus OS). */
export async function getPostLoginPath(
  supabase: SupabaseClient,
  userId: string
): Promise<"/onboarding" | "/"> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", userId)
    .maybeSingle()

  if (!profile || !profile.onboarding_completed) {
    return "/onboarding"
  }

  return "/"
}
