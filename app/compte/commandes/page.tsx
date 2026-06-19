import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/data"
import { getUserOrders, type Order } from "@/lib/queries"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Mes commandes | Yombe Ctyi 313",
  description: "Consultez et suivez vos commandes.",
}

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

export default async function CommandesPage() {
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

  // Fetch user orders
  let orders: Order[] = []
  try {
    orders = await getUserOrders(authUser.id)
  } catch (error) {
    console.error('Error fetching user orders:', error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="font-serif text-3xl font-bold mb-8">Mes commandes</h1>
          
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground mb-4">Vous n'avez pas encore de commandes</p>
              <Link href="/boutique">
                <button className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Découvrir la boutique
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="font-semibold text-lg">CMD-{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <Badge className={statusVariant[order.status]}>{statusLabels[order.status]}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-serif text-xl font-bold">{formatPrice(Number(order.total))}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
