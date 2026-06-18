import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartView } from "@/components/cart/cart-view"

export const metadata: Metadata = {
  title: "Mon panier | Yombe Ctyi 313",
  description: "Votre panier d'achat chez Yombe Ctyi 313.",
}

export default function PanierPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <CartView />
      </main>
      <SiteFooter />
    </div>
  )
}
