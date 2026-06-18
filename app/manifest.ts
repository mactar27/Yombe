import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Yombe Ctyi 313 | Mode & Sport',
    short_name: 'Yombe Ctyi 313',
    description: 'Votre référence mode et sport à Ziguinchor.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#111111',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
