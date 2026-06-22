import type { Metadata } from "next"
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShopView } from "@/components/shop/shop-view"
import { getProducts, getMaxPrice } from "@/lib/queries"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Boutique | Yombe Ctyi 313",
  description:
    "Parcourez notre boutique : vêtements, maillots de football, accessoires et équipements sportifs à Ziguinchor.",
}

async function ShopContent() {
  const [products, maxPrice] = await Promise.all([
    getProducts(),
    getMaxPrice(),
  ])
  return <ShopView products={products} maxPrice={maxPrice} />
}

export default function BoutiquePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-muted mb-4" />
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 mt-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="aspect-[4/5] animate-pulse bg-muted" />
                  <div className="p-3 flex flex-col gap-2">
                    <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }>
          <ShopContent />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}
