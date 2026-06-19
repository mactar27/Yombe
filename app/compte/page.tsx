import type { Metadata } from "next"
import Link from "next/link"
import { Heart, MapPin, Package, ShoppingBag, User } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogoutButton } from "@/app/compte/logout-button"
import { formatPrice, type Product } from "@/lib/data"
import { getFeaturedProducts, getUserOrders, getUserFavorites, type Order } from "@/lib/queries"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import pool from "@/lib/db"

export const metadata: Metadata = {
  title: "Mon espace | Yombe Ctyi 313",
  description: "Gérez votre profil, vos commandes et vos favoris.",
}

const menu = [
  { icon: User, label: "Profil", href: "/compte/profil", active: true },
  { icon: Package, label: "Commandes", href: "/compte/commandes" },
  { icon: ShoppingBag, label: "Historique", href: "/compte/historique" },
  { icon: MapPin, label: "Adresse", href: "/compte/adresse" },
  { icon: Heart, label: "Favoris", href: "/compte/favoris" },
]

const statusVariant: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  paid: "bg-secondary text-secondary-foreground",
  shipped: "bg-blue-500 text-white",
  delivered: "bg-primary text-primary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
}

const statusLabels: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
}

export default async function ComptePage() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("auth_user")

  if (!authCookie) {
    redirect("/connexion")
  }

  let authUser;
  try {
    authUser = JSON.parse(authCookie.value)
  } catch (e) {
    redirect("/connexion")
  }

  // Fetch real user email
  let userDetails = { email: 'Email non trouvé' }
  try {
    const [rows] = await pool.execute('SELECT email FROM users WHERE id = ?', [authUser.id]) as any[]
    if (rows && rows.length > 0) {
      userDetails = rows[0]
    }
  } catch (error) {
    console.error('Error fetching user email:', error)
  }

  const initials = authUser.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()

  // Fetch user orders
  let orders: Order[] = []
  try {
    orders = await getUserOrders(authUser.id)
  } catch (error) {
    console.error('Error fetching user orders:', error)
  }

  // Fetch user favorites
  let favorites: Product[] = []
  try {
    favorites = await getUserFavorites(authUser.id)
  } catch (error) {
    console.error('Error fetching user favorites:', error)
    // Fallback to featured products if favorites table doesn't exist yet
    favorites = await getFeaturedProducts(3)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary font-serif text-xl font-bold text-primary">
            {initials}
          </span>
          <div>
            <h1 className="font-serif text-2xl font-bold">{authUser.name}</h1>
            <p className="text-sm text-muted-foreground">{userDetails.email}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="flex h-fit flex-col gap-1 rounded-2xl border border-border bg-card p-3">
            {menu.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors " +
                  (item.active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-foreground hover:bg-muted")
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
            <LogoutButton />
          </aside>

          <div className="flex flex-col gap-8">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-bold">Mes commandes</h2>
              <div className="mt-4 flex flex-col divide-y divide-border">
                {orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">Aucune commande pour le moment</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div>
                        <p className="font-medium">CMD-{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <span className="font-serif font-semibold">{formatPrice(Number(order.total))}</span>
                      <Badge className={statusVariant[order.status]}>{statusLabels[order.status]}</Badge>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-bold">Mes favoris</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {favorites.map((p) => (
                  <Link
                    key={p.id}
                    href="/boutique"
                    className="flex flex-col gap-2 rounded-xl border border-border p-3 transition-colors hover:border-primary"
                  >
                    <span className="font-medium leading-tight">{p.name}</span>
                    <span className="text-sm text-muted-foreground">{p.category}</span>
                    <span className="font-serif font-semibold">{formatPrice(p.price)}</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
