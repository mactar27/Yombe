'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Users, ShoppingCart, ArrowLeft, Settings } from 'lucide-react'

const sideLinks = [
  { href: '/admin/products', label: 'Produits', icon: Package },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/orders', label: 'Commandes', icon: ShoppingCart },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground">
      {/* Sidebar / Topbar */}
      <aside
        style={{ backgroundColor: '#111111' }}
        className="flex w-full lg:w-64 flex-col border-b lg:border-b-0 lg:border-r border-[#2a2a2a] p-4 lg:p-6 shrink-0 sticky top-0 z-20 lg:h-screen lg:overflow-y-auto"
      >
        {/* Logo */}
        <Link href="/" className="mb-4 lg:mb-8 flex shrink-0 items-center gap-2">
          <Image
            src="/logo.png"
            alt="Yombe Ctyi 313"
            width={120}
            height={40}
            className="h-8 lg:h-12 w-auto object-contain"
          />
        </Link>

        {/* Navigation Container */}
        <div className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1">
          {/* Dashboard button */}
          <Link
            href="/admin"
            className={`shrink-0 flex items-center gap-2 lg:gap-3 rounded-xl px-3 py-2 lg:py-3 text-sm font-semibold transition-colors lg:mb-4 ${
              pathname === '/admin'
                ? 'bg-[#c8a25d] text-white'
                : 'bg-[#1c1c1c] text-[#c8a25d] hover:bg-[#c8a25d] hover:text-white'
            }`}
          >
            <LayoutDashboard className="size-4 shrink-0" />
            Dashboard
          </Link>

          {/* Nav links */}
          {sideLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`shrink-0 flex items-center gap-2 lg:gap-3 rounded-lg px-3 py-2 lg:py-2.5 text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-[#1c1c1c] text-[#c8a25d]'
                  : 'text-white/70 hover:bg-[#1c1c1c] hover:text-[#c8a25d]'
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}

          {/* Spacer for desktop */}
          <div className="hidden lg:block lg:flex-1" />

          {/* Footer */}
          <Link
            href="/"
            className="shrink-0 flex items-center gap-2 lg:gap-3 rounded-lg px-3 py-2 lg:py-2.5 text-sm font-medium text-white/50 transition-colors hover:text-white/80 lg:mt-auto"
          >
            <ArrowLeft className="size-4 shrink-0" />
            <span className="hidden lg:inline">Retour au site</span>
            <span className="lg:hidden">Retour</span>
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
