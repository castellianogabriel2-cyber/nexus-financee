import type { SupabaseClient } from "@supabase/supabase-js"

/** Rota após login bem-sucedido: onboarding ou dashboard. */
export async function getPostLoginPath(
  supabase: SupabaseClient,
  userId: string
): Promise<"/onboarding" | "/dashboard"> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", userId)
    .maybeSingle()

  if (!profile || !profile.onboarding_completed) {
    return "/onboarding"
  }

  return "/dashboard"
}
