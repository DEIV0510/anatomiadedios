import { libro } from '@/data/libro'

/** Dominio público. Configúralo en Vercel/hosting con NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://anatomiadedios.vercel.app').replace(/\/$/, '')

/** En desarrollo se muestran los marcadores de datos pendientes */
export const IS_DEV = process.env.NODE_ENV === 'development'

export const site = {
  name: libro.titulo,
  title: `${libro.titulo} — ${libro.autorNombre}`,
  description: `${libro.subtitulo}. Descubre ${libro.titulo}, el libro de ${libro.autorNombre}: cuerpo, mente, conciencia, energía y universo.`,
  locale: 'es_CO',
}

/** Anclas de la página (navbar, footer y botones) */
export const anclas = {
  inicio: 'inicio',
  descubre: 'descubre',
  libro: 'el-libro',
  contenido: 'contenido',
  testimonios: 'testimonios',
  ediciones: 'ediciones',
  pago: 'pago',
  faq: 'faq',
  despierta: 'despierta',
} as const
