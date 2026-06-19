import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import pool from "@/lib/db"

export const metadata: Metadata = {
  title: "Mes adresses | Yombe Ctyi 313",
  description: "Gérez vos adresses de livraison.",
}

export default async function AdressePage() {
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

  // Fetch client address
  let address = { address: '', phone: '' }
  try {
    const [rows] = await pool.execute('SELECT address, phone FROM clients WHERE email = (SELECT email FROM users WHERE id = ?)', [authUser.id]) as any[]
    if (rows && rows.length > 0) {
      address = rows[0]
    }
  } catch (error) {
    console.error('Error fetching client address:', error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl font-bold mb-8">Mes adresses</h1>
          
          <form className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="address">Adresse complète</Label>
              <Textarea id="address" name="address" defaultValue={address.address} rows={3} placeholder="Votre adresse complète" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={address.phone} placeholder="78 400 79 43" />
            </div>

            <Button type="submit" size="lg">
              Enregistrer l'adresse
            </Button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
