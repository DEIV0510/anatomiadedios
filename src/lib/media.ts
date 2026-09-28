import raw from '@/data/media.json'

export type Variante = { w: number; avif: string; webp: string }
export type Imagen = { width: number; height: number; variants: Variante[]; lqip?: string }

/** Medios generados por `npm run assets` (scripts/build-assets.mjs) */
export const media = raw as {
  hero: {
    desktop: { av1: string; h264: string; poster: Imagen }
    mobile: { av1: string; h264: string; poster: Imagen }
  }
  cover: Imagen & { lqip: string }
  mockup: Imagen & { lqip: string; jpg: string }
}

export const srcSet = (img: Imagen, f: 'avif' | 'webp') => img.variants.map((v) => `${v[f]} ${v.w}w`).join(', ')
export const mayor = (img: Imagen) => img.variants[img.variants.length - 1]
