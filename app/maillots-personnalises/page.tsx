import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { JerseyDesigner } from "@/components/jersey/jersey-designer"

export const metadata: Metadata = {
  title: "Maillots personnalisés | Yombe Ctyi 313",
  description:
    "Personnalisez les maillots de votre équipe : modèle, couleur, nom, numéro et logo avec aperçu en temps réel. Personnalisation maillots au Sénégal.",
}

export default function MaillotsPersonnalisesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <JerseyDesigner />
      </main>
      <SiteFooter />
    </div>
  )
}
