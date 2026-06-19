"use client"

import { useMemo, useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ProductCard } from "@/components/product-card"
import { formatPrice, type Audience, type Product } from "@/lib/data"

const audienceFilters: { value: Audience; label: string }[] = [
  { value: "homme", label: "Homme" },
  { value: "femme", label: "Femme" },
  { value: "enfant", label: "Enfant" },
  { value: "football", label: "Football" },
  { value: "accessoires", label: "Accessoires" },
]

type SortKey = "popularite" | "prix-asc" | "prix-desc" | "nouveautes"

type Props = {
  products: Product[]
  maxPrice: number
}

export function ShopView({ products, maxPrice }: Props) {
  const allSizes = useMemo(() => Array.from(new Set(products.flatMap((p) => p.sizes))), [products])
  const allColors = useMemo(() => Array.from(new Set(products.flatMap((p) => p.colors))), [products])

  const [audiences, setAudiences] = useState<Audience[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [price, setPrice] = useState<number>(maxPrice)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>("popularite")

  const toggle = <T,>(value: T, list: T[], setter: (v: T[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const filtered = useMemo(() => {
    const result = products.filter((p) => {
      if (audiences.length && !audiences.some((a) => p.audience.includes(a))) return false
      if (sizes.length && !sizes.some((s) => p.sizes.includes(s))) return false
      if (colors.length && !colors.some((c) => p.colors.includes(c))) return false
      if (p.price > price) return false
      if (inStockOnly && !p.inStock) return false
      return true
    })
    switch (sort) {
      case "prix-asc":
        return [...result].sort((a, b) => a.price - b.price)
      case "prix-desc":
        return [...result].sort((a, b) => b.price - a.price)
      case "nouveautes":
        return [...result].sort((a, b) => Number(b.isNew) - Number(a.isNew))
      default:
        return [...result].sort((a, b) => b.rating - a.rating)
    }
  }, [audiences, sizes, colors, price, inStockOnly, sort, products])

  const activeCount = audiences.length + sizes.length + colors.length + (inStockOnly ? 1 : 0)

  const reset = () => {
    setAudiences([])
    setSizes([])
    setColors([])
    setPrice(maxPrice)
    setInStockOnly(false)
  }

  const FilterPanel = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-base font-semibold">Catégorie</h3>
        <div className="flex flex-col gap-2.5">
          {audienceFilters.map((f) => (
            <label key={f.value} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <Checkbox
                checked={audiences.includes(f.value)}
                onCheckedChange={() => toggle(f.value, audiences, setAudiences)}
              />
              {f.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-base font-semibold">Prix maximum</h3>
        <Slider
          value={[price]}
          min={5000}
          max={maxPrice}
          step={1000}
          onValueChange={(v) => setPrice(v[0])}
        />
        <p className="text-sm text-muted-foreground">Jusqu&apos;à {formatPrice(price)}</p>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-base font-semibold">Taille</h3>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s, sizes, setSizes)}
              className={
                "rounded-md border px-3 py-1.5 text-sm transition-colors " +
                (sizes.includes(s)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary")
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-base font-semibold">Couleur</h3>
        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => (
            <button
              key={c}
              type="button"
              title={c.startsWith('http') || c.startsWith('/') ? 'Variante de couleur' : c}
              onClick={() => toggle(c, colors, setColors)}
              className={
                "rounded-md border overflow-hidden transition-colors flex items-center justify-center " +
                (c.startsWith('http') || c.startsWith('/') ? "size-8 p-0 " : "px-3 py-1.5 text-sm ") +
                (colors.includes(c)
                  ? "border-primary ring-2 ring-primary ring-offset-1"
                  : "border-border hover:border-primary")
              }
            >
              {(c.startsWith('http') || c.startsWith('/')) ? (
                <img src={c} alt="Couleur" className="size-full object-cover" />
              ) : (
                c
              )}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-sm cursor-pointer">
        <Checkbox checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(Boolean(v))} />
        Disponible uniquement
      </label>

      {activeCount > 0 && (
        <Button variant="outline" onClick={reset} className="gap-2">
          <X className="size-4" />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">Boutique</h1>
        <p className="text-muted-foreground">
          Découvrez notre sélection complète de mode et d&apos;équipements sportifs.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
            <FilterPanel />
          </div>
        </aside>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger render={<Button variant="outline" className="gap-2 lg:hidden" />}>
                  <SlidersHorizontal className="size-4" />
                  Filtres
                  {activeCount > 0 && <Badge className="ml-1">{activeCount}</Badge>}
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-xl">Filtres</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-8">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>
              <p className="text-sm text-muted-foreground">
                {filtered.length} produit{filtered.length > 1 ? "s" : ""}
              </p>
            </div>

            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Trier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularite">Popularité</SelectItem>
                <SelectItem value="nouveautes">Nouveautés</SelectItem>
                <SelectItem value="prix-asc">Prix croissant</SelectItem>
                <SelectItem value="prix-desc">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
              <p className="text-muted-foreground">Aucun produit ne correspond à vos filtres.</p>
              <Button variant="outline" onClick={reset}>
                Réinitialiser
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
