"use client"

import Image from "next/image"
import { Heart, Plus, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { formatPrice, type Product } from "@/lib/data"
import { cn } from "@/lib/utils"

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [liked, setLiked] = useState(false)
  const [imageIdx, setImageIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const images = Array.isArray(product.colors) && product.colors.length > 0 
    ? product.colors 
    : [product.image || "/placeholder.svg"]
  
  const currentImage = images[imageIdx] || images[0]

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (!scrollRef.current) return
    const el = scrollRef.current
    const newIdx = imageIdx === 0 ? images.length - 1 : imageIdx - 1
    el.scrollTo({ left: newIdx * el.clientWidth, behavior: 'smooth' })
  }
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (!scrollRef.current) return
    const el = scrollRef.current
    const newIdx = imageIdx === images.length - 1 ? 0 : imageIdx + 1
    el.scrollTo({ left: newIdx * el.clientWidth, behavior: 'smooth' })
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    if (idx !== imageIdx) setImageIdx(idx)
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted group">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {images.map((img, i) => (
            <div key={i} className="relative h-full w-full shrink-0 snap-center">
              <Image
                src={img}
                alt={`${product.name} - Vue ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
        
        {images.length > 1 && (
          <>
            <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 z-20">
              <ChevronLeft className="size-4" />
            </button>
            <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 z-20">
              <ChevronRight className="size-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 z-20 pointer-events-none">
              {images.map((_, i) => (
                <div key={i} className={cn("h-1.5 rounded-full transition-all", i === imageIdx ? "w-4 bg-primary" : "w-1.5 bg-white/60")} />
              ))}
            </div>
          </>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10 pointer-events-none">
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
          onClick={(e) => { e.preventDefault(); setLiked((v) => !v); }}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:text-primary z-10"
        >
          <Heart className={cn("size-4", liked && "fill-primary text-primary")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{product.category}</p>
        <h3 className="font-serif text-base font-semibold leading-tight text-foreground line-clamp-1">{product.name}</h3>
        
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-[10px] text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="font-serif text-base font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
          </div>
          <Button
            size="sm"
            disabled={!product.inStock}
            onClick={(e) => {
              e.preventDefault();
              addItem(product, Array.isArray(product.sizes) && product.sizes.length > 0 && product.sizes[0] !== "Unique" ? "À choisir" : undefined, currentImage)
            }}
            className="h-8 gap-1 px-3 text-xs"
          >
            <Plus className="size-3.5" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  )
}
