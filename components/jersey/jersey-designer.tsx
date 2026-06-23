"use client"

import { useState } from "react"
import { ImagePlus, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const models = ["Maillot col rond", "Maillot col V", "Maillot rayé", "Maillot gardien"]
const colorOptions = [
  { name: "Or", value: "#c8a25d", text: "#111111" },
  { name: "Noir", value: "#111111", text: "#ffffff" },
  { name: "Blanc", value: "#f5f5f5", text: "#111111" },
  { name: "Rouge", value: "#b91c1c", text: "#ffffff" },
  { name: "Bleu", value: "#1d4ed8", text: "#ffffff" },
  { name: "Vert", value: "#15803d", text: "#ffffff" },
]

export function JerseyDesigner() {
  const [model, setModel] = useState(models[0])
  const [color, setColor] = useState(colorOptions[0])
  const [name, setName] = useState("YOMBE")
  const [number, setNumber] = useState("10")
  const [logo, setLogo] = useState(false)
  const [details, setDetails] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/jersey-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          color: color.name,
          playerName: name,
          number,
          withLogo: logo,
          details,
        }),
      })
      if (!res.ok) throw new Error("Erreur réseau")
      setSubmitted(true)
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Personnalisation
        </span>
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">
          Personnalisez les maillots de votre équipe
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Choisissez le modèle, la couleur, ajoutez le nom, le numéro et le logo de votre club avec
          un aperçu en temps réel.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Live preview */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="flex aspect-square items-center justify-center rounded-3xl border border-border bg-muted/50 p-6">
            <JerseyPreview color={color} name={name} number={number} logo={logo} />
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Aperçu en temps réel &middot; {model}
          </p>
        </div>

        {/* Controls */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="model">Modèle</Label>
            <Select value={model} onValueChange={(val) => setModel(val || '')}>
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Couleur</Label>
            <div className="flex flex-wrap gap-2.5">
              {colorOptions.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  aria-label={c.name}
                  onClick={() => setColor(c)}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 transition-all",
                    color.name === c.name ? "border-primary scale-110" : "border-border",
                  )}
                  style={{ backgroundColor: c.value }}
                >
                  {color.name === c.name && (
                    <Check className="size-4" style={{ color: c.text }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="jersey-name">Nom du joueur</Label>
              <Input
                id="jersey-name"
                value={name}
                maxLength={12}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                placeholder="NOM"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="jersey-number">Numéro</Label>
              <Input
                id="jersey-number"
                value={number}
                maxLength={2}
                onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="10"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLogo((v) => !v)}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
              logo ? "border-primary bg-primary/10" : "border-border hover:border-primary",
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <ImagePlus className="size-5" />
            </span>
            <span className="flex flex-col">
              <span className="font-medium">Ajouter le logo du club</span>
              <span className="text-sm text-muted-foreground">
                {logo ? "Logo ajouté à l'aperçu" : "Cliquez pour ajouter un logo"}
              </span>
            </span>
            {logo && <Check className="ml-auto size-5 text-primary" />}
          </button>

          <div className="flex flex-col gap-2">
            <Label htmlFor="jersey-details">Détails de la commande</Label>
            <Textarea
              id="jersey-details"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Nombre de maillots, tailles, délais souhaités..."
            />
          </div>

          <Button type="submit" size="lg" className="gap-2" disabled={loading || submitted}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Envoi en cours...
              </>
            ) : submitted ? (
              <>
                <Check className="size-4" />
                Demande envoyée !
              </>
            ) : (
              "Demander un devis"
            )}
          </Button>

          {submitted && (
            <p className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
              <Check className="size-4" />
              Votre demande a été enregistrée. Nous vous recontacterons rapidement.
            </p>
          )}
          {error && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
          )}
        </form>
      </div>
    </div>
  )
}

function JerseyPreview({
  color,
  name,
  number,
  logo,
}: {
  color: { name: string; value: string; text: string }
  name: string
  number: string
  logo: boolean
}) {
  return (
    <svg viewBox="0 0 300 320" className="h-full w-full max-w-sm drop-shadow-lg" role="img" aria-label="Aperçu du maillot">
      <path
        d="M105 30 L70 50 L40 95 L65 120 L85 105 L85 290 L215 290 L215 105 L235 120 L260 95 L230 50 L195 30 L180 55 Q150 75 120 55 Z"
        fill={color.value}
        stroke="#00000022"
        strokeWidth="2"
      />
      <path d="M120 55 Q150 75 180 55" fill="none" stroke={color.text} strokeOpacity="0.3" strokeWidth="3" />
      {logo && (
        <circle cx="115" cy="120" r="16" fill={color.text} opacity="0.85" />
      )}
      {logo && (
        <text x="115" y="125" textAnchor="middle" fontSize="13" fontWeight="700" fill={color.value}>
          YC
        </text>
      )}
      <text
        x="150"
        y="195"
        textAnchor="middle"
        fontSize="74"
        fontWeight="800"
        fill={color.text}
        fontFamily="Geist, sans-serif"
      >
        {number || "0"}
      </text>
      <text
        x="150"
        y="240"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        letterSpacing="2"
        fill={color.text}
        fontFamily="Geist, sans-serif"
      >
        {name || "NOM"}
      </text>
    </svg>
  )
}
