"use client"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/connexion')
    router.refresh()
  }

  return (
    <Button onClick={handleLogout} variant="ghost" className="mt-1 justify-start gap-3 text-destructive hover:text-destructive w-full">
      <LogOut className="size-4" />
      Déconnexion
    </Button>
  )
}
