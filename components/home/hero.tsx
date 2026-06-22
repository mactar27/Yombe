import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Shirt, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import pool from "@/lib/db"

export async function Hero() {
  let heroImage1 = "/placeholder.svg?height=640&width=480"
  let heroImage2 = "/placeholder.svg?height=640&width=480"

  try {
    const [rows] = await pool.execute("SELECT key_name, value FROM settings WHERE key_name IN ('hero_image_1', 'hero_image_2')")
    for (const row of rows as any[]) {
      if (row.key_name === 'hero_image_1' && row.value) heroImage1 = row.value
      if (row.key_name === 'hero_image_2' && row.value) heroImage2 = row.value
    }
  } catch (error) {
    console.error("Hero settings fetch error:", error)
  }

  return (
    <section className="section-dark relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-balance font-serif text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Votre référence mode et sport à{" "}
            <span className="text-gold-gradient">Ziguinchor</span>
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
            Découvrez les dernières tendances vestimentaires et tous les équipements sportifs dont
            vous avez besoin pour performer sur le terrain.
          </p>

          {/* Deux CTA bien distincts */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/boutique?category=Football"
              className="group flex items-center justify-center gap-3 rounded-2xl border-2 border-[#c8a25d] bg-[#c8a25d]/10 px-6 py-4 text-white transition-all hover:bg-[#c8a25d] hover:shadow-lg hover:shadow-[#c8a25d]/30"
            >
              <Trophy className="size-5 shrink-0 text-[#c8a25d] group-hover:text-white transition-colors" />
              <div className="text-left">
                <p className="font-bold leading-none">Univers Football</p>
                <p className="text-xs text-white/60 mt-0.5 group-hover:text-white/80">Maillots, équipements, clubs</p>
              </div>
              <ArrowRight className="ml-auto size-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/boutique?category=Lifestyle"
              className="group flex items-center justify-center gap-3 rounded-2xl border-2 border-white/20 bg-white/5 px-6 py-4 text-white transition-all hover:border-white/50 hover:bg-white/10"
            >
              <Shirt className="size-5 shrink-0 text-white/70 group-hover:text-white transition-colors" />
              <div className="text-left">
                <p className="font-bold leading-none">Univers Lifestyle</p>
                <p className="text-xs text-white/60 mt-0.5 group-hover:text-white/80">Homme, Femme, Tendances</p>
              </div>
              <ArrowRight className="ml-auto size-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          <Link
            href="/sur-mesure"
            className="text-sm text-white/50 underline-offset-4 hover:text-[#c8a25d] hover:underline transition-colors w-fit"
          >
            ✂️ Créer un maillot personnalisé →
          </Link>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={heroImage1}
                alt="Vêtements tendance"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
                priority
              />
            </div>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={heroImage2}
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
