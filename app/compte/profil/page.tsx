import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import pool from "@/lib/db"

export const metadata: Metadata = {
  title: "Mon profil | Yombe Ctyi 313",
  description: "Gérez vos informations personnelles.",
}

export default async function ProfilPage() {
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

  // Fetch user details
  let userDetails = { name: '', email: '' }
  try {
    const [rows] = await pool.execute('SELECT name, email FROM users WHERE id = ?', [authUser.id]) as any[]
    if (rows && rows.length > 0) {
      userDetails = rows[0]
    }
  } catch (error) {
    console.error('Error fetching user details:', error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl font-bold mb-8">Mon profil</h1>
          
          <form className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" name="name" defaultValue={userDetails.name} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={userDetails.email} disabled />
              <p className="text-xs text-muted-foreground">L'email ne peut pas être modifié</p>
            </div>

            <Button type="submit" size="lg">
              Enregistrer les modifications
            </Button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
