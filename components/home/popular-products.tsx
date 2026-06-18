import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { SectionHeading } from "@/components/section-heading"
import { getFeaturedProducts } from "@/lib/queries"

export async function PopularProducts() {
  const featured = await getFeaturedProducts(8)

  return (
    <section className="bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Tendances"
          title="Produits populaires"
          description="Une sélection de nos articles les plus appréciés par nos clients à Ziguinchor."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button render={<Link href="/boutique" />} size="lg" variant="outline" className="gap-2">
            Voir toute la boutique
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
