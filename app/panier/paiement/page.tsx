import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Paiement | Yombe Ctyi 313",
  description: "Finalisez votre commande.",
}

export default async function PaiementPage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("auth_user")

  if (!authCookie) {
    redirect("/connexion")
  }

  let authUser
  try {
    authUser = JSON.parse(authCookie.value)
  } catch (e) {
    redirect("/connexion")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="font-serif text-3xl font-bold mb-8">Finaliser la commande</h1>
          
          <div className="space-y-8">
            {/* Informations de livraison */}
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-bold mb-4">Informations de livraison</h2>
              <form className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" name="name" defaultValue={authUser.name} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="78 400 79 43" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Adresse complète</Label>
                  <Textarea id="address" name="address" rows={3} placeholder="Votre adresse complète à Ziguinchor" />
                </div>
              </form>
            </section>

            {/* Mode de paiement */}
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-bold mb-4">Mode de paiement</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 rounded-lg border border-border p-4 cursor-pointer hover:border-primary transition-colors">
                  <input type="radio" name="payment" value="wave" className="size-4" defaultChecked />
                  <span className="font-medium">Wave</span>
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-border p-4 cursor-pointer hover:border-primary transition-colors">
                  <input type="radio" name="payment" value="orange" className="size-4" />
                  <span className="font-medium">Orange Money</span>
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-border p-4 cursor-pointer hover:border-primary transition-colors">
                  <input type="radio" name="payment" value="delivery" className="size-4" />
                  <span className="font-medium">Paiement à la livraison</span>
                </label>
              </div>
            </section>

            {/* Récapitulatif */}
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-bold mb-4">Récapitulatif</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>À calculer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>2 000 FCFA</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-serif text-2xl font-bold">À calculer</span>
                </div>
              </div>
            </section>

            <Button size="lg" className="w-full">
              Confirmer la commande
            </Button>

            <Button render={<Link href="/panier" />} variant="ghost" className="w-full">
              Retour au panier
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
