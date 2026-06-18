"use client"

import { useRef, useState } from "react"
import { Camera, Share2, Loader2, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SectionHeading } from "@/components/section-heading"

const contactInfos = [
  { icon: Phone, label: "Téléphone", value: "+221 77 000 00 00", href: "tel:+221770000000" },
  { icon: MessageCircle, label: "WhatsApp", value: "+221 77 000 00 00", href: "https://wa.me/221770000000" },
  { icon: MapPin, label: "Adresse", value: "HPHC+M6J, R20, Ziguinchor", href: "#map" },
]

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fd.get("name") as string,
          email: fd.get("email") as string,
          phone: fd.get("phone") as string,
          message: fd.get("message") as string,
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      formRef.current?.reset()
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Parlons de votre projet"
          description="Une question, une commande spéciale ou un devis pour votre club ? Écrivez-nous."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {contactInfos.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <info.icon className="size-4" />
                  </span>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {info.label}
                  </span>
                  <span className="text-sm font-medium text-foreground">{info.value}</span>
                </a>
              ))}
            </div>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Share2 className="size-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Camera className="size-5" />
              </a>
            </div>
            <div
              id="map"
              className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border"
            >
              <iframe
                title="Localisation de Yombe Ctyi 313 à Ziguinchor"
                src="https://www.google.com/maps?q=HPHC%2BM6J,+R20,+Ziguinchor&output=embed"
                className="size-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-name">Nom</Label>
                <Input id="contact-name" name="name" required placeholder="Votre nom" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-phone">Téléphone</Label>
                <Input id="contact-phone" name="phone" type="tel" placeholder="+221 ..." />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" name="email" type="email" required placeholder="vous@exemple.com" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea id="contact-message" name="message" required rows={5} placeholder="Votre message..." />
            </div>
            <Button type="submit" size="lg" className="gap-2" disabled={loading || sent}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  {sent ? "Message envoyé !" : "Envoyer le message"}
                </>
              )}
            </Button>
            {sent && (
              <p className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
                <Mail className="size-4" />
                Merci ! Votre message a bien été enregistré. Nous vous répondrons rapidement.
              </p>
            )}
            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
