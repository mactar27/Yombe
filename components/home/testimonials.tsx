import Image from "next/image"
import { Quote, Star } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { getTestimonials } from "@/lib/queries"
import { cn } from "@/lib/utils"

export async function Testimonials() {
  const testimonials = await getTestimonials()

  return (
    <section className="section-dark">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionHeading
          dark
          eyebrow="Témoignages"
          title="Ils nous font confiance"
          description="Découvrez ce que nos clients pensent de leur expérience chez Yombe Ctyi 313."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <Quote className="size-8 text-primary" />
              <blockquote className="text-pretty leading-relaxed text-white/85">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-2 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("size-4", i < t.rating ? "fill-primary text-primary" : "text-white/20")}
                  />
                ))}
              </div>
              <figcaption className="mt-2 flex items-center gap-3 border-t border-white/10 pt-4">
                <Image
                  src={t.avatar || "/placeholder.svg"}
                  alt={t.name}
                  width={48}
                  height={48}
                  className="size-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-white/60">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
