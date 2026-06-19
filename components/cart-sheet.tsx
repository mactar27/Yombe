"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/data"

export function CartSheet() {
  const { items, isOpen, setOpen, updateQuantity, removeItem, subtotal, count } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Votre panier</SheetTitle>
          <SheetDescription>
            {count > 0 ? `${count} article${count > 1 ? "s" : ""} dans votre panier` : "Votre panier est vide"}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Ajoutez des articles pour commencer vos achats.</p>
            <Button render={<Link href="/boutique" />} onClick={() => setOpen(false)}>
              Découvrir la boutique
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <ul className="flex flex-col gap-4 py-4">
                {items.map((item, idx) => (
                  <li key={`${item.product.id}-${item.size}-${item.image || idx}`} className="flex gap-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-md border bg-muted">
                      <Image
                        src={item.image || item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="font-medium leading-tight">{item.product.name}</p>
                      {item.size && (
                        <p className="text-xs text-muted-foreground">Taille : {item.size}</p>
                      )}
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="mt-auto flex items-center gap-2">
                        <div className="flex items-center rounded-md border">
                          <button
                            type="button"
                            aria-label="Diminuer la quantité"
                            className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Augmenter la quantité"
                            className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label="Supprimer l'article"
                          className="ml-auto text-muted-foreground transition-colors hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <SheetFooter className="gap-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-serif text-xl font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <Separator />
              <Button render={<Link href="/panier" />} size="lg" className="w-full" onClick={() => setOpen(false)}>
                Voir le panier
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
