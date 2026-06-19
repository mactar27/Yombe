import { Suspense } from "react"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { AuthForm } from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Connexion | Yombe Ctyi 313",
  description: "Connectez-vous ou créez votre compte Yombe Ctyi 313.",
}

export default function ConnexionPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">Chargement...</div>}>
          <AuthForm />
        </Suspense>
      </main>
    </div>
  )
}
