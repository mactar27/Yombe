import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShopView } from "@/components/shop/shop-view"
import { getProducts, getMaxPrice } from "@/lib/queries"

export const metadata: Metadata = {
  title: "Boutique | Yombe Ctyi 313",
  description:
    "Parcourez notre boutique : vêtements, maillots de football, accessoires et équipements sportifs à Ziguinchor.",
}

export default async function BoutiquePage() {
  const [products, maxPrice] = await Promise.all([
    getProducts(),
    getMaxPrice(),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ShopView products={products} maxPrice={maxPrice} />
      </main>
      <SiteFooter />
    </div>
  )
}
