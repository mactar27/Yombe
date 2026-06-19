"use client"

import Image from "next/image"
import { Heart, Plus, Star } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { formatPrice, type Product } from "@/lib/data"
import { cn } from "@/lib/utils"

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [liked, setLiked] = useState(false)

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={cn(
            "object-cover transition-all duration-500 group-hover:scale-105",
            product.colors?.length > 1 ? "group-hover:opacity-0" : ""
          )}
        />
        {product.colors?.length > 1 && (
          <Image
            src={product.colors[1]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="absolute inset-0 object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {product.isNew && <Badge className="bg-secondary text-secondary-foreground">Nouveau</Badge>}
          {product.isPromo && <Badge className="bg-primary text-primary-foreground">Promo</Badge>}
          {!product.inStock && (
            <Badge variant="outline" className="border-border bg-background/90">
              Rupture
            </Badge>
          )}
        </div>
        <button
          type="button"
          aria-label="Ajouter aux favoris"
          onClick={() => setLiked((v) => !v)}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:text-primary"
        >
          <Heart className={cn("size-4", liked && "fill-primary text-primary")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.category}</p>
        <h3 className="font-serif text-lg font-semibold leading-snug text-foreground">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-1 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-3.5",
                i < product.rating ? "fill-primary text-primary" : "text-border",
              )}
            />
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="font-serif text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
          </div>
          <Button
            size="sm"
            disabled={!product.inStock}
            onClick={() => addItem(product, product.sizes[0])}
            className="gap-1"
          >
            <Plus className="size-4" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  )
}
