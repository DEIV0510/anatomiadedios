'use client'

import { Minus, Plus } from 'lucide-react'
import { tienda } from '@/data/libro'

/** Selector de cantidad: botones de 44 px, valor anunciado a lectores de pantalla */
export function Cantidad({ valor, onChange, etiqueta = 'Cantidad' }: { valor: number; onChange: (n: number) => void; etiqueta?: string }) {
  const btn =
    'grid size-11 place-items-center text-bone transition-colors hover:bg-neon/10 hover:text-neon disabled:cursor-not-allowed disabled:text-dim/60 disabled:hover:bg-transparent'
  return (
    <div role="group" aria-label={etiqueta} className="inline-flex items-stretch border border-line-2 bg-void">
      <button type="button" className={btn} onClick={() => onChange(valor - 1)} disabled={valor <= 1} aria-label="Quitar un ejemplar">
        <Minus aria-hidden className="size-4" strokeWidth={1.5} />
      </button>
      <output aria-live="polite" aria-label={`${etiqueta}: ${valor}`} className="grid min-w-12 place-items-center border-x border-line-2 font-mono text-base text-bone tabular-nums">
        {valor}
      </output>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(valor + 1)}
        disabled={valor >= tienda.cantidadMaxima}
        aria-label="Agregar un ejemplar"
      >
        <Plus aria-hidden className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  )
}
