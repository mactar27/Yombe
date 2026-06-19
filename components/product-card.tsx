"use client"

import Image from "next/image"
import { Heart, Plus, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { formatPrice, type Product } from "@/lib/data"
import { cn } from "@/lib/utils"

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [liked, setLiked] = useState(false)
  const [imageIdx, setImageIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(
    Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes[0] : null
  )

  const images = Array.isArray(product.colors) && product.colors.length > 0 
    ? product.colors 
    : [product.image || "/placeholder.svg"]
  
  const currentImage = images[imageIdx] || images[0]

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    setImageIdx(i => i === 0 ? images.length - 1 : i - 1)
  }
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    setImageIdx(i => i === images.length - 1 ? 0 : i + 1)
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted group">
        <Image
          src={currentImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {images.length > 1 && (
          <>
            <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 z-20">
              <ChevronLeft className="size-4" />
            </button>
            <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 z-20">
              <ChevronRight className="size-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 z-20">
              {images.map((_, i) => (
                <div key={i} className={cn("h-1.5 rounded-full transition-all", i === imageIdx ? "w-4 bg-primary" : "w-1.5 bg-white/60")} />
              ))}
            </div>
          </>
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
        <div className="mt-auto flex flex-col gap-3 pt-2">
          {Array.isArray(product.sizes) && product.sizes.length > 0 && product.sizes[0] !== "Unique" && (
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end justify-between gap-2">
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
              disabled={!product.inStock || !selectedSize}
              onClick={() => selectedSize && addItem(product, selectedSize, currentImage)}
              className="gap-1"
            >
              <Plus className="size-4" />
              Ajouter
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
