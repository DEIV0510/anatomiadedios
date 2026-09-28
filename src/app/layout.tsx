import type { Metadata, Viewport } from 'next'
import { Cinzel, Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ediciones, libro, tienda } from '@/data/libro'
import { media } from '@/lib/media'
import { SITE_URL, site } from '@/lib/site'

// Títulos: capitales romanas como las de la portada (tipo Trajan, «de cine»)
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', display: 'swap' })
// Texto e interfaz
const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })
// Código, HUD y botones
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${libro.tituloTexto} — el libro de ${libro.autorNombre}`,
  description: site.description,
  applicationName: libro.tituloTexto,
  authors: [{ name: libro.autorNombre }],
  keywords: [
    libro.tituloTexto,
    libro.autorNombre,
    'libro',
    'ciencia y espiritualidad',
    'conciencia',
    'despertar',
    'cuerpo mente energía universo',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: libro.tituloTexto,
    title: `${libro.tituloTexto} — ${libro.autorNombre}`,
    description: `${libro.subtitulo}.`,
    locale: site.locale,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${libro.tituloTexto} — ${libro.autorNombre}`,
    description: `${libro.subtitulo}.`,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  themeColor: '#020403',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

// Antes de pintar: la pantalla de entrada solo en la 1.ª visita de la sesión, y nunca con
// ahorro de datos, redes 2G o «reducir movimiento».
const BOOT = `(function(){try{var d=document.documentElement;d.classList.add('js');var c=navigator.connection||{};if(sessionStorage.getItem('ad-intro')||c.saveData||/2g/.test(c.effectiveType||'')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.setAttribute('data-intro','skip')}else{sessionStorage.setItem('ad-intro','1')}}catch(e){}})()`

// «<» escapado dentro del JSON-LD (se arma con fromCharCode para no depender de secuencias \u)
const LT = String.fromCharCode(92) + 'u003c'

function jsonLd() {
  const ofertas = ediciones
    .filter((e) => e.precio != null)
    .map((e) => ({
      '@type': 'Offer',
      name: e.formato ? `${e.nombre} — ${e.formato}` : e.nombre,
      price: e.precio,
      priceCurrency: tienda.moneda,
      url: `${SITE_URL}/#ediciones`,
    }))
  const book = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: libro.tituloTexto,
    author: { '@type': 'Person', name: libro.autorNombre },
    inLanguage: 'es',
    description: `${libro.subtitulo}.`,
    image: `${SITE_URL}${media.mockup.jpg}`,
    url: SITE_URL,
    ...(ofertas.length ? { offers: ofertas } : {}),
  }
  return { __html: JSON.stringify(book).replace(/</g, LT) }
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="es"
      className={`${cinzel.variable} ${geist.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd()} />
      </head>
      <body>{children}</body>
    </html>
  )
}
