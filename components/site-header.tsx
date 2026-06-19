"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Heart, Menu, Search, ShoppingBag, User, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CartSheet } from "@/components/cart-sheet"
import { useCart } from "@/components/cart-provider"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/boutique" },
  { label: "Maillots personnalisés", href: "/maillots-personnalises" },
  { label: "Clubs & Académies", href: "/#clubs" },
  { label: "Contact", href: "/#contact" },
]

export function SiteHeader() {
  const { count, setOpen } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Read auth cookie from document.cookie (non-httpOnly won't work, so we use a server hint)
    // We'll use a lightweight check via fetch
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setUser(data.user) })
      .catch(() => {})
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Ouvrir le menu" />}>
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1 px-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="flex items-center gap-2" aria-label="Yombe Ctyi 313 - Accueil">
          <Image
            src="/logo.png"
            alt="Yombe Ctyi 313 Logo"
            width={240}
            height={90}
            className="h-20 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Rechercher" className="hidden sm:inline-flex">
            <Search className="size-5" />
          </Button>
          <Button render={<Link href="/compte" />} variant="ghost" size="icon" aria-label="Favoris" className="hidden sm:inline-flex">
            <Heart className="size-5" />
          </Button>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Button
                  render={<Link href="/admin" />}
                  variant="ghost"
                  size="icon"
                  aria-label="Tableau de bord admin"
                  title="Tableau de bord admin"
                  className="text-primary"
                >
                  <LayoutDashboard className="size-5" />
                </Button>
              )}
              <Button render={<Link href="/compte" />} variant="ghost" size="icon" aria-label="Mon compte" title="Mon espace client">
                <User className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Déconnexion"
                onClick={handleLogout}
                title={`Déconnexion (${user.name})`}
              >
                <LogOut className="size-5" />
              </Button>
            </>
          ) : (
            <Button render={<Link href="/connexion" />} variant="ghost" size="icon" aria-label="Mon compte">
              <User className="size-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Panier"
            className="relative"
            onClick={() => setOpen(true)}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>
      <CartSheet />
    </header>
  )
}
