import { ArrowRight } from 'lucide-react'
import { ediciones } from '@/data/libro'
import { anclas } from '@/lib/site'

// Los CTA de «Comprar el libro» siempre abren la compra rápida con el libro elegido
const LIBRO_ID = ediciones.find((e) => e.tipo === 'libro')?.id ?? ''

type Props = {
  children?: React.ReactNode
  /** Edición que se preselecciona en la compra rápida (por defecto, el libro) */
  edicion?: string
  size?: 'md' | 'xl'
  className?: string
  /** Rótulo accesible si el texto visible es corto */
  label?: string
}

/**
 * CTA principal. Sin JS lleva a las ediciones; con JS abre la compra rápida (el panel escucha
 * los clics en [data-comprar]). Borde neón con una luz que lo recorre.
 */
export function BotonComprar({ children = 'Comprar', edicion = LIBRO_ID, size = 'md', className = '', label }: Props) {
  return (
    <a
      href={`#${anclas.ediciones}`}
      data-comprar={edicion}
      aria-label={label}
      className={`btn-neon ${size === 'xl' ? 'btn-xl' : ''} ${className}`}
    >
      <Trace />
      <span>{children}</span>
      <ArrowRight aria-hidden className="btn-arrow size-[1.15em]" strokeWidth={1.75} />
    </a>
  )
}

/** Luz que recorre el borde (degradado cónico que gira bajo una máscara de anillo, en GPU) */
export function Trace() {
  return <span className="btn-trace" aria-hidden />
}
