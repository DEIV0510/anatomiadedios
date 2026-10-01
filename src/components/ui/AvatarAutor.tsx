import { media } from '@/lib/media'
import { Picture } from './Picture'

/** Rostro del autor (de la foto del libro) en un círculo con borde neón. Decorativo: el texto de
 *  al lado ya dice «con el autor». */
export function AvatarAutor({ className = 'size-10', sizes = '40px' }: { className?: string; sizes?: string }) {
  return (
    <span
      aria-hidden
      className={`relative block shrink-0 overflow-hidden rounded-full border border-neon/70 bg-abyss shadow-[0_0_16px_-4px_rgb(57_255_136/0.7)] ${className}`}
    >
      <Picture img={media.avatar} alt="" sizes={sizes} className="block size-full" imgClassName="size-full object-cover" />
    </span>
  )
}
