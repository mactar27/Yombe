"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/data"
import { CheckCircle2, Loader2, MapPin, MessageCircle, Phone, User } from "lucide-react"

const WHATSAPP_NUMBER = "221784007943"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clear } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [guestName, setGuestName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")

  const total = subtotal

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
          phone,
          clientName: guestName,
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue")
      }

      setOrderId(data.orderId)
      setSuccess(true)
      clear()

      // Build WhatsApp message
      const itemsSummary = items
        .map(i => `• ${i.quantity}x ${i.product.name}${i.size && i.size !== "À choisir" ? ` (Taille ${i.size})` : ""}`)
        .join("\n")

      const rawMsg = `Bonjour *Yombe Ctyi 313* !\nNouvelle commande de : *${guestName}*\n\nArticles :\n${itemsSummary}\n\nLivraison : *${address}*\n\nMerci de me confirmer le tarif de livraison.`
      
      const msg = encodeURIComponent(rawMsg)

      // Redirect to WhatsApp after a short delay
      setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank")
      }, 1500)

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
        <h1 className="font-serif text-3xl font-bold mb-2">Commande #{orderId} enregistrée !</h1>
        <p className="text-muted-foreground mb-6">
          Votre commande a bien été reçue. Nous allons vous rediriger vers WhatsApp pour confirmer la livraison.
        </p>
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-5 py-3 text-green-700 text-sm font-medium">
          <MessageCircle className="size-4" />
          Ouverture de WhatsApp en cours…
        </div>
      </div>
    )
  }

  if (items.length === 0) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold mb-2">Finaliser la commande</h1>
      <p className="text-muted-foreground text-sm mb-8">Aucun compte requis — renseignez juste vos informations de livraison.</p>
      
      <div className="grid gap-8 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl font-bold mb-4">Vos informations</h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="guestName" className="flex items-center gap-2">
                  <User className="size-4" /> Nom complet
                </Label>
                <Input
                  id="guestName"
                  required
                  placeholder="Prénom et Nom"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="size-4" /> Numéro WhatsApp
                </Label>
                <Input
                  id="phone"
                  required
                  type="tel"
                  placeholder="+221 77 000 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Nous vous contacterons sur ce numéro pour la livraison.</p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="size-4" /> Adresse de livraison
                </Label>
                <Input
                  id="address"
                  required
                  placeholder="Quartier, rue, détails..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4">
            <h2 className="font-serif text-xl font-bold">Paiement</h2>
            <div className="rounded-lg bg-muted p-4">
              <p className="font-medium text-sm">Paiement à la livraison</p>
              <p className="text-xs text-muted-foreground mt-1">Vous paierez en espèces lors de la réception. Le prix de livraison vous sera communiqué via WhatsApp.</p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <MessageCircle className="size-4 shrink-0" />
              <span>Après validation, vous serez redirigé vers WhatsApp pour confirmer la livraison.</span>
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Traitement…
                </>
              ) : (
                <>
                  <MessageCircle className="mr-2 size-4" />
                  Valider et confirmer sur WhatsApp
                </>
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
                  {item.quantity}x {item.product.name} {item.size && item.size !== "À choisir" ? `(${item.size})` : `(Taille à préciser)`}
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
              <span className="text-sm italic text-muted-foreground">À confirmer sur WhatsApp</span>
            </div>
            <div className="flex justify-between font-serif text-lg font-bold mt-2">
              <span>Total articles</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
