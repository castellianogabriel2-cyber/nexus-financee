import { redirect } from "next/navigation"

/** Raiz redireciona via middleware; fallback server-side. */
export default function HomePage() {
  redirect("/dashboard")
}
