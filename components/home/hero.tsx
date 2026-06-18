import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="section-dark relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary">
            <Sparkles className="size-3.5" />
            Mode &amp; Sport Premium
          </span>
          <h1 className="text-balance font-serif text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Votre référence mode et sport à{" "}
            <span className="text-gold-gradient">Ziguinchor</span>
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
            Découvrez les dernières tendances vestimentaires et tous les équipements sportifs dont
            vous avez besoin pour performer sur le terrain.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button render={<Link href="/boutique" />} size="lg" className="gap-2">
              Acheter maintenant
              <ArrowRight className="size-4" />
            </Button>
            <Button
              render={<Link href="/#categories" />}
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              Découvrir nos collections
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-8">
            <div>
              <p className="font-serif text-2xl font-bold text-primary">+500</p>
              <p className="text-sm text-white/60">Produits disponibles</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-primary">+50</p>
              <p className="text-sm text-white/60">Clubs équipés</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-primary">24h</p>
              <p className="text-sm text-white/60">Livraison rapide</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/placeholder.svg?height=640&width=480"
                alt="Vêtements tendance"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
                priority
              />
            </div>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/placeholder.svg?height=640&width=480"
                alt="Maillots de football"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
