import { ArrowRight } from 'lucide-react'
import { anclas } from '@/lib/site'

type Props = {
  children?: React.ReactNode
  /** Edición que se preselecciona en la compra rápida */
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
export function BotonComprar({ children = 'Comprar', edicion = '', size = 'md', className = '', label }: Props) {
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

/** Luz que recorre el borde (pathLength normaliza la velocidad) */
export function Trace() {
  return (
    <svg className="btn-trace" aria-hidden focusable="false">
      <rect width="100%" height="100%" pathLength={100} />
    </svg>
  )
}
