'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Users, ShoppingCart, ArrowLeft } from 'lucide-react'

const sideLinks = [
  { href: '/admin/products', label: 'Produits', icon: Package },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/orders', label: 'Commandes', icon: ShoppingCart },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        style={{ backgroundColor: '#111111' }}
        className="flex w-64 flex-col border-r border-[#2a2a2a] p-6 shrink-0"
      >
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Yombe Ctyi 313"
            width={160}
            height={60}
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Dashboard button — always visible & prominent */}
        <Link
          href="/admin"
          className={`mb-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
            pathname === '/admin'
              ? 'bg-[#c8a25d] text-white'
              : 'bg-[#1c1c1c] text-[#c8a25d] hover:bg-[#c8a25d] hover:text-white'
          }`}
        >
          <LayoutDashboard className="size-4 shrink-0" />
          Dashboard
        </Link>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {sideLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-[#1c1c1c] text-[#c8a25d]'
                  : 'text-white/70 hover:bg-[#1c1c1c] hover:text-[#c8a25d]'
              }`}
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
          <ArrowLeft className="size-4" />
          Retour au site
        </Link>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
