import { Award, BadgeDollarSign, Truck, Palette, Headset } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"

const reasons = [
  { icon: Award, title: "Produits de qualité", text: "Des articles sélectionnés avec soin pour leur durabilité." },
  { icon: BadgeDollarSign, title: "Prix compétitifs", text: "Le meilleur rapport qualité-prix de Ziguinchor." },
  { icon: Truck, title: "Livraison rapide", text: "Recevez vos commandes en un temps record." },
  { icon: Palette, title: "Personnalisation", text: "Maillots et équipements à votre image." },
  { icon: Headset, title: "Service client réactif", text: "Une équipe à votre écoute à tout moment." },
]

export function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Nos engagements"
        title="Pourquoi nous choisir"
        description="Une expérience d'achat premium, du choix du produit jusqu'à la livraison."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((reason) => (
          <div
            key={reason.title}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <reason.icon className="size-6" />
            </span>
            <h3 className="font-serif text-xl font-semibold text-foreground">{reason.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{reason.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
