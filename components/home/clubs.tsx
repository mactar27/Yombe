import Image from "next/image"
import { Package, Shirt, Volleyball, Dumbbell, Flag } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"

const services = [
  { icon: Package, label: "Packs clubs" },
  { icon: Shirt, label: "Maillots personnalisés" },
  { icon: Volleyball, label: "Filets" },
  { icon: Dumbbell, label: "Équipements d'entraînement" },
  { icon: Flag, label: "Accessoires d'arbitrage" },
]

export function Clubs() {
  return (
    <section id="clubs" className="bg-muted/50">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
        <div className="relative order-last aspect-[4/3] overflow-hidden rounded-2xl border border-border lg:order-first">
          <Image
            src="/images/equipements.png"
            alt="Équipements pour clubs et académies de football"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-6">
          <SectionHeading
            align="left"
            eyebrow="Clubs & Académies"
            title="Nous équipons les clubs et académies sportives"
            description="Nous accompagnons les clubs, écoles de football, académies et associations sportives dans la fourniture de leurs équipements."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <li
                key={service.label}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <service.icon className="size-5" />
                </span>
                <span className="font-medium text-foreground">{service.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
