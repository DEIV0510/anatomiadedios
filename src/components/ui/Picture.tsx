import { mayor, srcSet, type Imagen } from '@/lib/media'

type Props = {
  img: Imagen
  alt: string
  sizes: string
  className?: string
  imgClassName?: string
  priority?: boolean
  /** Fondo difuminado mientras carga (base64 del manifiesto) */
  placeholder?: boolean
}

/** <picture> AVIF + WebP con anchos reales generados por `npm run assets` */
export function Picture({ img, alt, sizes, className, imgClassName, priority = false, placeholder = false }: Props) {
  const top = mayor(img)
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(img, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(img, 'webp')} sizes={sizes} />
      <img
        src={top.webp}
        alt={alt}
        width={img.width}
        height={img.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={imgClassName}
        style={
          placeholder && img.lqip
            ? { backgroundImage: `url(${img.lqip})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
      />
    </picture>
  )
}
