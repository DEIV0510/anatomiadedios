import { ArrowRight } from 'lucide-react'
import { anclas } from '@/lib/site'
import { AvatarAutor } from './AvatarAutor'

/** Acceso secundario a la mentoría (junto al CTA del hero): lleva a su sección */
export function AccesoMentoria({ className = '' }: { className?: string }) {
  return (
    <a
      href={`#${anclas.mentoria}`}
      className={`group inline-flex min-h-14 items-center gap-3 border border-line-2 bg-void/60 py-2 pr-4 pl-2 transition-colors duration-300 hover:border-neon hover:bg-neon/5 ${className}`}
    >
      <AvatarAutor className="size-10" />
      <span className="font-mono text-[0.66rem] leading-snug tracking-[0.18em] uppercase">
        <span className="block text-neon">Mentoría personalizada</span>
        <span className="block text-bone">Con el autor</span>
      </span>
      <ArrowRight
        aria-hidden
        className="ml-auto size-4 shrink-0 text-neon transition-transform duration-300 group-hover:translate-x-1"
        strokeWidth={1.75}
      />
    </a>
  )
}
