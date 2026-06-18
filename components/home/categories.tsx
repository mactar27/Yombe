import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { categoryGroups } from "@/lib/data"
import { SectionHeading } from "@/components/section-heading"

export function Categories() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Nos univers"
        title="Explorez nos catégories"
        description="De la mode lifestyle au matériel de football professionnel, trouvez tout ce qu'il vous faut."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {categoryGroups.map((group) => (
          <Link
            key={group.title}
            href="/boutique"
            className="group relative overflow-hidden rounded-2xl border border-border"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={group.image || "/placeholder.svg"}
                alt={group.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-white">{group.title}</h3>
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="size-5" />
                </span>
              </div>
              <p className="max-w-md text-sm text-white/80">{group.description}</p>
              <div className="flex flex-wrap gap-2">
                {group.items.slice(0, 6).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/25 px-3 py-1 text-xs text-white/90"
                  >
                    {item}
                  </span>
                ))}
                <span className="rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs text-primary">
                  +{group.items.length - 6} autres
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
