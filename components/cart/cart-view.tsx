"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/data"

export function CartView() {
  const { items, updateQuantity, updateSize, removeItem, subtotal } = useCart()

  const total = subtotal // Le prix de la livraison sera communiqué au client
  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-9 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-bold">Votre panier est vide</h1>
        <p className="text-muted-foreground">
          Parcourez notre boutique et ajoutez vos articles préférés.
        </p>
        <Button render={<Link href="/boutique" />} size="lg">
          Découvrir la boutique
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold sm:text-4xl">Mon panier</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li
              key={item.key}
              className="flex gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border bg-muted sm:size-28">
                <Image
                  src={item.image || item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-serif text-lg font-semibold">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.product.category}</p>
                    {Array.isArray(item.product.sizes) && item.product.sizes.length > 0 && item.product.sizes[0] !== "Unique" ? (
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Taille :</span>
                        <select
                          className="rounded border border-border bg-background px-2 py-0.5 text-xs text-foreground"
                          value={item.size === "À choisir" || !item.size ? "" : item.size}
                          onChange={(e) => updateSize(item.key, e.target.value)}
                        >
                          <option value="" disabled>À choisir</option>
                          {item.product.sizes.map((s: string) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    ) : item.size && item.size !== "Unique" && (
                      <p className="text-xs text-muted-foreground">Taille : {item.size}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label="Supprimer"
                    onClick={() => removeItem(item.key)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                  <div className="flex items-center rounded-md border">
                    <button
                      type="button"
                      aria-label="Diminuer"
                      className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Augmenter"
                      className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="font-serif text-lg font-semibold">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="flex h-fit flex-col gap-5 rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-serif text-xl font-bold">Récapitulatif</h2>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Livraison</span>
              <span className="text-sm italic">À déterminer</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="font-medium">Total</span>
            <span className="font-serif text-2xl font-bold">{formatPrice(total)}</span>
          </div>

          <Button asChild size="lg" className="w-full">
            <Link href="/panier/paiement">
              Commander
            </Link>
          </Button>
          <Button render={<Link href="/boutique" />} variant="ghost" className="w-full">
            Continuer mes achats
          </Button>
        </aside>
      </div>
    </div>
  )
}
