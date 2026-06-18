import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut } from 'lucide-react'

const sideLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produits', icon: Package },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/orders', label: 'Commandes', icon: ShoppingCart },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        style={{ backgroundColor: '#111111' }}
        className="flex w-64 flex-col border-r border-[#2a2a2a] p-6 shrink-0"
      >
        {/* Logo */}
        <Link href="/" className="mb-10 flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Yombe Ctyi 313"
            width={160}
            height={60}
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {sideLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-[#1c1c1c] hover:text-[#c8a25d]"
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 transition-colors hover:text-white/80"
        >
          <LogOut className="size-4" />
          Retour au site
        </Link>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
