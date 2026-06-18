import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { CartProvider } from '@/components/cart-provider'
import { SplashOnboard } from '@/components/splash-onboard'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Yombe Ctyi 313 | Mode & Sport à Ziguinchor',
  description:
    'Votre référence mode et sport à Ziguinchor. Vêtements tendance, maillots de football, maillots personnalisés et équipements sportifs au Sénégal.',
  keywords: [
    'Boutique vêtements Ziguinchor',
    'Maillots football Sénégal',
    'Équipements football Ziguinchor',
    'Personnalisation maillots Sénégal',
    'Articles sportifs Sénégal',
  ],
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#111111',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`light ${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}
    >
      <body className="bg-background font-sans antialiased">
        <SplashOnboard />
        <CartProvider>{children}</CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
