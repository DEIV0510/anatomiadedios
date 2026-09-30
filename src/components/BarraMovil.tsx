'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { libro } from '@/data/libro'
import { precio } from '@/lib/format'
import { usePedido } from '@/lib/pedido'
import { anclas } from '@/lib/site'
import { Trace } from './ui/BotonComprar'
import { Pendiente } from './ui/Pendiente'

/**
 * Barra fija inferior en móvil: aparece al salir del hero y se esconde en el cierre final
 * (que ya tiene su propio CTA) y mientras la compra rápida está abierta.
 */
export function BarraMovil() {
  const { edicion, abierto } = usePedido()
  const [fueraHero, setFueraHero] = useState(false)
  const [enFinal, setEnFinal] = useState(false)

  useEffect(() => {
    const hero = document.getElementById(anclas.inicio)
    const final = document.getElementById(anclas.despierta)
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.target === hero) setFueraHero(!en.isIntersecting)
        if (en.target === final) setEnFinal(en.isIntersecting)
      })
    }, { threshold: 0.12 })
    if (hero) io.observe(hero)
    if (final) io.observe(final)
    return () => io.disconnect()
  }, [])

  const visible = fueraHero && !enFinal && !abierto
  const valor = precio(edicion?.precio)

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-[45] border-t border-line-2 bg-void/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-transform duration-500 ease-[var(--ease-out)] md:hidden ${visible ? 'translate-y-0' : 'translate-y-[110%]'}`}
      data-barra
    >
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[0.85rem] font-bold tracking-[0.08em] text-bone">
            {edicion?.tipo === 'mentoria' ? edicion.nombre : libro.titulo}
          </p>
          {valor ? (
            <p className="font-mono text-sm text-neon tabular-nums">{valor}</p>
          ) : (
            <Pendiente dato="$precio" className="mt-0.5 px-1.5 py-0 text-[0.58rem]" />
          )}
        </div>
        <a href={`#${anclas.ediciones}`} data-comprar={edicion?.id ?? ''} className="btn-neon min-h-12 shrink-0 gap-2 px-5 text-[0.72rem]">
          <Trace />
          <span>Comprar</span>
          <ArrowRight aria-hidden className="btn-arrow size-4" strokeWidth={1.75} />
        </a>
      </div>
    </div>
  )
}
