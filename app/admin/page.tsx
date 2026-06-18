import type { Metadata } from 'next'
import Link from 'next/link'
import { Package, Users, ShoppingCart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin | Yombe Ctyi 313',
  description: 'Tableau de bord administrateur',
}

const cards = [
  {
    href: '/admin/products',
    label: 'Produits',
    description: 'Ajouter, modifier, supprimer des produits',
    icon: Package,
  },
  {
    href: '/admin/clients',
    label: 'Clients',
    description: 'Consulter les informations de vos clients',
    icon: Users,
  },
  {
    href: '/admin/orders',
    label: 'Commandes',
    description: 'Suivre et gérer toutes les commandes',
    icon: ShoppingCart,
  },
]

export default function AdminPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10 border-b border-border pb-6">
        <h1
          className="font-heading text-4xl font-bold"
          style={{ color: '#111111' }}
        >
          Tableau de bord
        </h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenue dans l'espace administration de{' '}
          <span style={{ color: '#c8a25d' }} className="font-semibold">
            Yombe Ctyi 313
          </span>
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#c8a25d]"
          >
            {/* Icon */}
            <div
              className="flex size-12 items-center justify-center rounded-xl transition-colors"
              style={{ backgroundColor: '#f3ecdd' }}
            >
              <Icon
                className="size-6 transition-colors group-hover:text-[#c8a25d]"
                style={{ color: '#a07d3c' }}
              />
            </div>

            {/* Text */}
            <div>
              <h2 className="text-lg font-semibold text-foreground group-hover:text-[#c8a25d] transition-colors">
                {label}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>

            {/* Arrow */}
            <span
              className="mt-auto self-start text-sm font-medium transition-colors group-hover:text-[#c8a25d]"
              style={{ color: '#a07d3c' }}
            >
              Gérer →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
