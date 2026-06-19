import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Historique | Yombe Ctyi 313",
  description: "Consultez votre historique d'achats.",
}

export default async function HistoriquePage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("auth_user")

  if (!authCookie) {
    redirect("/connexion")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="font-serif text-3xl font-bold mb-8">Historique</h1>
          
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground mb-4">Fonctionnalité en cours de développement</p>
            <p className="text-sm text-muted-foreground">Vous pourrez bientôt consulter votre historique d'achats complet.</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
