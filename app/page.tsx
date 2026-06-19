import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/home/hero"
import { Categories } from "@/components/home/categories"
import { PopularProducts } from "@/components/home/popular-products"
import { CustomJerseysCta } from "@/components/home/custom-jerseys-cta"
import { Clubs } from "@/components/home/clubs"
import { WhyUs } from "@/components/home/why-us"
import { Testimonials } from "@/components/home/testimonials"
import { Contact } from "@/components/home/contact"

export const revalidate = 60 // Refresh every 60 seconds

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Categories />
        <PopularProducts />
        <CustomJerseysCta />
        <Clubs />
        <WhyUs />
        <Testimonials />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  )
}
