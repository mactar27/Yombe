"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/data"
import { CheckCircle2, Loader2, MapPin, Phone } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clear } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")

  const discount = 0
  const shipping = items.length > 0 ? 2000 : 0
  const total = subtotal - discount + shipping

  useEffect(() => {
    if (items.length === 0 && !success) {
      router.push("/boutique")
    }
  }, [items, success, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total,
          address,
          phone
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue")
      }

      setSuccess(true)
      clear()
      
      setTimeout(() => {
        router.push("/compte")
      }, 3000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center py-24 text-center px-4">
        <CheckCircle2 className="size-20 text-primary mb-6" />
        <h1 className="font-serif text-3xl font-bold mb-2">Commande validée !</h1>
        <p className="text-muted-foreground mb-8">
          Votre commande a été enregistrée avec succès. Vous recevrez un appel pour la livraison.
        </p>
        <p className="text-sm">Redirection vers votre espace client...</p>
      </div>
    )
  }

  if (items.length === 0) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold mb-8">Finaliser la commande</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl font-bold mb-4">Informations de livraison</h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="size-4" /> Adresse complète
                </Label>
                <Input
                  id="address"
                  required
                  placeholder="Quartier, rue, détails..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="size-4" /> Numéro de téléphone de réception
                </Label>
                <Input
                  id="phone"
                  required
                  type="tel"
                  placeholder="+221 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4">
            <h2 className="font-serif text-xl font-bold">Paiement</h2>
            <div className="rounded-lg bg-muted p-4">
              <p className="font-medium text-sm">Paiement à la livraison</p>
              <p className="text-xs text-muted-foreground mt-1">Vous paierez en espèces lors de la réception de votre commande.</p>
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" size="lg" className="w-full mt-4" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                "Valider ma commande"
              )}
            </Button>
          </div>
        </form>

        <div className="rounded-2xl border border-border bg-muted/50 p-6 h-fit">
          <h2 className="font-serif text-xl font-bold mb-4">Résumé</h2>
          <ul className="flex flex-col gap-3 mb-6">
            {items.map((item) => (
              <li key={`${item.product.id}-${item.size}`} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.product.name} {item.size && `(${item.size})`}
                </span>
                <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          
          <div className="flex flex-col gap-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Livraison</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-serif text-lg font-bold mt-2">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
