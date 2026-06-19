import Link from "next/link"
import Image from "next/image"
import { Camera, Share2, MapPin, Phone } from "lucide-react"

const shopLinks = [
  { label: "Boutique", href: "/boutique" },
  { label: "Maillots personnalisés", href: "/maillots-personnalises" },
  { label: "Nouveautés", href: "/boutique" },
  { label: "Promotions", href: "/boutique" },
]

const accountLinks = [
  { label: "Connexion", href: "/connexion" },
  { label: "Mon compte", href: "/compte" },
  { label: "Mon panier", href: "/panier" },
  { label: "Inscription", href: "/connexion" },
]

export function SiteFooter() {
  return (
    <footer className="section-dark">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-4">
          <Image
            src="/images/logo.jpeg"
            alt="Yombe Ctyi 313"
            width={120}
            height={150}
            className="h-auto w-24 rounded-md"
          />
          <p className="max-w-xs text-sm leading-relaxed text-white/70">
            Votre référence mode et sport à Ziguinchor. Vêtements tendance, maillots de football et
            équipements sportifs de qualité.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="flex size-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-primary hover:text-primary"
            >
              <Share2 className="size-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-primary hover:text-primary"
            >
              <Camera className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-lg font-semibold text-primary">Boutique</h3>
          <ul className="flex flex-col gap-2.5">
            {shopLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-lg font-semibold text-primary">Mon espace</h3>
          <ul className="flex flex-col gap-2.5">
            {accountLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-lg font-semibold text-primary">Contact</h3>
          <ul className="flex flex-col gap-3 text-sm text-white/70">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>HPHC+M6J, R20, Ziguinchor, Sénégal</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href="tel:+221770000000" className="transition-colors hover:text-white">
                +221 77 000 00 00
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Yombe Ctyi 313. Tous droits réservés.</p>
          <p>
            Développé par{" "}
            <a
              href="https://wockytech.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary transition-colors hover:text-white"
            >
              WockyTech
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
