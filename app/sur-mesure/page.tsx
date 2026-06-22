"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, MessageCircle, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

const WHATSAPP_NUMBER = "221770000000" // Remplacer par le vrai numéro

const JERSEY_MODELS = [
  { id: "classic", label: "Classique", description: "Col rond, coupe standard", emoji: "⚽" },
  { id: "polo", label: "Polo", description: "Col polo, style premium", emoji: "🏆" },
  { id: "training", label: "Entraînement", description: "Légère, respirante", emoji: "🎽" },
  { id: "gardien", label: "Gardien", description: "Rembourrage latéral, longue durée", emoji: "🧤" },
]

const STEPS = ["Modèle", "Personnalisation", "Coordonnées"]

export default function SurMesurePage() {
  const [step, setStep] = useState(0)
  const [model, setModel] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [playerName, setPlayerName] = useState("")
  const [number, setNumber] = useState("")
  const [colors, setColors] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function nextStep() { setStep(s => Math.min(s + 1, STEPS.length - 1)) }
  function prevStep() { setStep(s => Math.max(s - 1, 0)) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      let logoUrl = ""
      if (logoFile) {
        const fd = new FormData()
        fd.append("file", logoFile)
        const up = await fetch("/api/upload", { method: "POST", body: fd })
        const upData = await up.json()
        if (upData.url) logoUrl = upData.url
      }

      // Save to jersey_orders table
      await fetch("/api/jersey-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          quantity: Number(quantity),
          playerName,
          number,
          colors,
          logoUrl,
          contactName,
          contactPhone,
          notes,
        })
      })

      setSuccess(true)

      // Build WhatsApp message
      const msg = encodeURIComponent(
        `Bonjour Yombe Ctyi 313, je souhaite commander ${quantity} maillot(s) personnalisé(s) modèle "${JERSEY_MODELS.find(m => m.id === model)?.label || model}". Nom/numéro : ${playerName} / #${number}. Couleurs : ${colors}. Contactez-moi pour discuter des détails. Merci !`
      )
      setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank")
      }, 1200)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center py-24 text-center px-4">
        <CheckCircle2 className="size-20 text-primary mb-6" />
        <h1 className="font-serif text-3xl font-bold mb-2">Demande envoyée !</h1>
        <p className="text-muted-foreground mb-6">
          Votre demande de devis a été enregistrée. Nous vous redirigeons vers WhatsApp pour finaliser les détails.
        </p>
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-5 py-3 text-green-700 text-sm font-medium">
          <MessageCircle className="size-4" />
          Ouverture de WhatsApp…
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">Maillot sur mesure</h1>
        <p className="text-muted-foreground">Créez l'équipement parfait pour votre club ou académie.</p>
      </div>

      {/* Step indicator */}
      <div className="mb-10 flex items-center justify-center gap-0">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center">
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all",
              i < step ? "bg-primary text-primary-foreground" :
              i === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
              "bg-muted text-muted-foreground"
            )}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className={cn("ml-2 text-sm font-medium hidden sm:inline", i === step ? "text-foreground" : "text-muted-foreground")}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className={cn("mx-3 h-0.5 w-8 sm:w-16", i < step ? "bg-primary" : "bg-border")} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 0: Choose model */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-2xl font-bold mb-2">Choisissez votre modèle</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {JERSEY_MODELS.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all",
                    model === m.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/40 bg-card"
                  )}
                >
                  <span className="text-4xl">{m.emoji}</span>
                  <p className="font-semibold text-sm">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.description}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="max-w-xs"
                placeholder="Ex: 15"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="button" disabled={!model} onClick={nextStep} className="gap-2">
                Suivant <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Personalization */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="font-serif text-2xl font-bold mb-2">Personnalisation</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="playerName">Nom à imprimer</Label>
                <Input id="playerName" placeholder="Ex: DIALLO" value={playerName} onChange={e => setPlayerName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="number">Numéro</Label>
                <Input id="number" placeholder="Ex: 10" value={number} onChange={e => setNumber(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="colors">Couleurs souhaitées</Label>
              <Input id="colors" placeholder="Ex: Blanc et vert, avec bandes noires" value={colors} onChange={e => setColors(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="logo">Logo / Emblème du club</Label>
              <div className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
                logoFile ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              )}>
                <Upload className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {logoFile ? logoFile.name : "Cliquez pour uploader votre logo (PNG, JPG)"}
                </p>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={e => setLogoFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
                <ChevronLeft className="size-4" /> Retour
              </Button>
              <Button type="button" onClick={nextStep} className="gap-2">
                Suivant <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Contact */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="font-serif text-2xl font-bold mb-2">Vos coordonnées</h2>
            <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
              <p className="font-medium mb-1">Récapitulatif</p>
              <p className="text-muted-foreground">Modèle : <strong>{JERSEY_MODELS.find(m => m.id === model)?.label}</strong> — Quantité : <strong>{quantity}</strong></p>
              {playerName && <p className="text-muted-foreground">Personnalisation : <strong>{playerName} #{number}</strong></p>}
              {colors && <p className="text-muted-foreground">Couleurs : <strong>{colors}</strong></p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="contactName">Votre nom</Label>
                <Input required id="contactName" placeholder="Prénom et Nom" value={contactName} onChange={e => setContactName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="contactPhone">Numéro WhatsApp</Label>
                <Input required id="contactPhone" type="tel" placeholder="+221 77 000 00 00" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Notes supplémentaires (optionnel)</Label>
              <textarea
                id="notes"
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
                placeholder="Délai souhaité, budget indicatif, autres précisions..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <MessageCircle className="size-4 shrink-0" />
              <span>Après envoi, vous serez redirigé vers WhatsApp pour finaliser votre devis.</span>
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
                <ChevronLeft className="size-4" /> Retour
              </Button>
              <Button type="submit" disabled={loading || !contactName || !contactPhone} className="gap-2">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}
                Envoyer ma demande
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
