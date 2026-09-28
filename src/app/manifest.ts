import type { MetadataRoute } from 'next'
import { libro } from '@/data/libro'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${libro.tituloTexto} — ${libro.autorNombre}`,
    short_name: libro.tituloTexto,
    description: `${libro.subtitulo}.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#020403',
    theme_color: '#020403',
    lang: 'es',
    icons: [
      { src: '/media/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/media/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
