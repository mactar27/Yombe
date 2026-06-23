import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Smartphone, ScanLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Scanner le QR Code | Yombe Ctyi 313",
  description: "Accédez rapidement à Yombe Ctyi 313 depuis votre mobile.",
}

export default function QrCodePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 bg-muted/10 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-md w-full bg-card rounded-3xl border border-border p-8 shadow-xl flex flex-col items-center text-center relative z-10 overflow-hidden">
          
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 shadow-sm">
            <ScanLine className="size-8" />
          </div>

          <h1 className="font-serif text-3xl font-bold text-foreground mb-3">
            Scanner & Acheter
          </h1>
          
          <p className="text-muted-foreground text-sm mb-8">
            Ouvrez l'appareil photo de votre téléphone et pointez-le vers ce code pour accéder instantanément à la boutique Yombe Ctyi 313.
          </p>

          <div className="relative p-5 bg-white rounded-2xl shadow-sm border border-border/50 mb-8 inline-block">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://yombe.vercel.app&color=000000&bgcolor=ffffff&margin=0"
              alt="QR Code Yombe Ctyi 313"
              className="rounded-lg w-56 h-56"
            />
          </div>

          <div className="w-full flex flex-col gap-3">
            <Button render={<Link href="/" />} className="w-full text-base py-6 rounded-xl shadow-md gap-2 font-semibold">
              <Smartphone className="size-5" />
              Continuer sur cet appareil
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
