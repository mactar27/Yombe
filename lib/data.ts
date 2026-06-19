// Types TypeScript — conservés pour tout le projet
export type Audience = "homme" | "femme" | "enfant" | "football" | "accessoires" | "unisexe"

export type Product = {
  id: string
  name: string
  price: number
  oldPrice?: number
  description: string
  category: string
  audience: Audience[]
  sizes: string[]
  colors: string[]
  image: string
  isNew?: boolean
  isPromo?: boolean
  inStock: boolean
  rating: number
}

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("fr-FR").format(value) + " FCFA"

export type CategoryGroup = {
  title: string
  description: string
  image: string
  href: string
  items: string[]
}

export const categoryGroups: CategoryGroup[] = [
  {
    title: "Mode & Lifestyle",
    description:
      "T-shirts, chemises, pantalons, jeans, vestes, ensembles, chaussures, casquettes et accessoires tendance.",
    image: "/images/mode-lifestyle.jpeg",
    href: "/boutique?groupe=mode",
    items: [
      "T-shirts",
      "Chemises",
      "Pantalons",
      "Jeans",
      "Vestes",
      "Ensembles",
      "Chaussures",
      "Casquettes",
      "Accessoires",
    ],
  },
  {
    title: "Football & Sport",
    description:
      "Maillots de clubs, maillots personnalisés, équipements d'arbitrage, ballons et matériel d'entraînement.",
    image: "/images/football-sport.jpeg",
    href: "/boutique?groupe=football",
    items: [
      "Maillots de clubs",
      "Maillots personnalisés",
      "Maillots d'arbitres",
      "Chaussures de football",
      "Ballons",
      "Chasubles",
      "Filets",
      "Cônes d'entraînement",
      "Échelles d'agilité",
      "Coupelles",
      "Sifflets",
      "Cartons jaunes et rouges",
      "Chronomètres",
      "Équipements de gardien",
      "Petits haltères",
      "Matériel de préparation physique",
    ],
  },
]

export type Testimonial = {
  name: string
  role: string
  quote: string
  avatar: string
  rating: number
}

// NOTE: Les données statiques ont été migrées en base MySQL.
// Utilisez les fonctions dans lib/queries.ts pour accéder aux données.
