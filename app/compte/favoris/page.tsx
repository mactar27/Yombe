import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { formatPrice, type Product } from "@/lib/data"
import { getUserFavorites } from "@/lib/queries"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Mes favoris | Yombe Ctyi 313",
  description: "Consultez vos produits favoris.",
}

export default async function FavorisPage() {
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

  // Fetch user favorites
  let favorites: Product[] = []
  try {
    favorites = await getUserFavorites(authUser.id)
  } catch (error) {
    console.error('Error fetching user favorites:', error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-6xl">
          <h1 className="font-serif text-3xl font-bold mb-8">Mes favoris</h1>
          
          {favorites.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <Heart className="mx-auto size-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Vous n'avez pas encore de favoris</p>
              <Link href="/boutique">
                <Button size="lg">
                  Découvrir la boutique
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((product) => (
                <Link
                  key={product.id}
                  href={`/boutique?product=${product.id}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary"
                >
                  <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="font-serif font-bold text-lg">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
