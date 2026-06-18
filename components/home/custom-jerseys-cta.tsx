import Link from "next/link"
import { Check, Palette, Shirt, Type, Hash, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  { icon: Shirt, label: "Choisir le modèle" },
  { icon: ImagePlus, label: "Ajouter un logo" },
  { icon: Type, label: "Ajouter un nom" },
  { icon: Hash, label: "Ajouter un numéro" },
  { icon: Palette, label: "Choisir la couleur" },
  { icon: Check, label: "Aperçu en temps réel" },
]

export function CustomJerseysCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-secondary">
        <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Personnalisation
            </span>
            <h2 className="text-balance font-serif text-3xl font-bold text-white sm:text-4xl">
              Personnalisez les maillots de votre équipe
            </h2>
            <p className="text-white/70">
              Créez des maillots uniques pour votre club ou académie. Logo, nom, numéro et couleurs :
              tout est personnalisable avec un aperçu en temps réel.
            </p>
            <Button render={<Link href="/maillots-personnalises" />} size="lg" className="w-fit gap-2">
              Demander un devis
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <feature.icon className="size-4" />
                </span>
                <span className="text-sm font-medium text-white">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
