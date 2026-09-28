'use client'

import { Check } from 'lucide-react'
import { confianza, dimensiones, ediciones, type Edicion } from '@/data/libro'
import { precio } from '@/lib/format'
import { media } from '@/lib/media'
import { pedido, usePedido } from '@/lib/pedido'
import { anclas, IS_DEV } from '@/lib/site'
import { useCheckout } from '@/lib/useCheckout'
import { BotonCheckout } from './ui/BotonCheckout'
import { Cantidad } from './ui/Cantidad'
import { Pendiente } from './ui/Pendiente'
import { Picture } from './ui/Picture'
import { Rotulo } from './ui/Resaltado'

/**
 * Ediciones reales (src/data/libro.ts). En los materiales hay una: el libro. La tarjeta
 * elegida se ilumina en verde; cantidad y edición se comparten con la compra rápida y la
 * barra de móvil. «COMPRAR →» lleva directo al checkout.
 */
export function Ediciones() {
  const { edicionId, cantidad } = usePedido()
  const unica = ediciones.length === 1

  return (
    <section id={anclas.ediciones} aria-labelledby="ediciones-titulo" className="relative py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-2 to-transparent" />
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Rotulo n="06">Ediciones</Rotulo>
            <h2 id="ediciones-titulo" className="title-section mt-6" data-split>
              Elige tu <span className="hl">experiencia</span>
            </h2>
          </div>
          <p className="max-w-sm text-mist" data-reveal>
            Elige, ajusta la cantidad y pasa directo al pago. <span className="text-bone">Sin vueltas.</span>
          </p>
        </div>

        <div
          role={unica ? undefined : 'radiogroup'}
          aria-label={unica ? undefined : 'Ediciones disponibles'}
          className={`mt-14 grid gap-5 ${unica ? '' : 'md:grid-cols-2 xl:grid-cols-3'}`}
        >
          {ediciones.map((e, i) => (
            <Tarjeta key={e.id} e={e} i={i} unica={unica} activa={e.id === edicionId} cantidad={cantidad} />
          ))}
          {IS_DEV && unica && (
            <div className="grid place-items-center border border-dashed border-amber/40 p-8 text-center">
              <Pendiente dato="otras ediciones o combos (opcional): copia el objeto en ediciones" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Tarjeta({ e, i, unica, activa, cantidad }: { e: Edicion; i: number; unica: boolean; activa: boolean; cantidad: number }) {
  const { estado, ir } = useCheckout()
  const img = e.imagen === 'mockup' ? media.mockup : media.cover
  const unitario = precio(e.precio)
  const total = e.precio != null ? precio(e.precio * cantidad) : null
  const antes = precio(e.precioAntes)

  return (
    <article
      aria-labelledby={`ed-${e.id}`}
      className={`group relative isolate overflow-hidden border transition-[border-color,box-shadow] duration-500 ${
        activa ? 'border-neon/80 shadow-[0_0_48px_-12px_rgb(57_255_136/0.45)]' : 'border-line hover:border-line-2'
      } ${unica ? 'grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]' : 'flex flex-col'}`}
      data-reveal
      onClick={unica ? undefined : () => pedido.elegir(e.id)}
    >
      {/* Imagen real del producto */}
      <div className={`relative overflow-hidden bg-abyss ${unica ? 'aspect-square lg:aspect-auto' : 'aspect-square'}`}>
        <Picture
          img={img}
          alt={`${e.nombre}, libro de Elkin Ferney Gomez Medina`}
          sizes={unica ? '(min-width: 1024px) 44vw, 100vw' : '(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 100vw'}
          className="absolute inset-0"
          imgClassName="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.03]"
          placeholder
        />
        <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-40" />
        <div aria-hidden className="corners pointer-events-none absolute inset-4 [--l:20px]" />
      </div>

      {/* Datos y compra */}
      <div className="relative z-10 flex flex-col bg-gradient-to-b from-deep to-abyss p-6 sm:p-8 lg:p-10">
        <div className="flex items-center justify-between gap-4">
          <p className="hud">
            <span className="text-neon">&gt;</span> Edición_{String(i + 1).padStart(2, '0')}
          </p>
          {(() => {
            const marca = (
              <>
                <span aria-hidden className={`grid size-4 place-items-center border ${activa ? 'border-neon bg-neon text-void' : 'border-line-2'}`}>
                  {activa && <Check className="size-3" strokeWidth={3} />}
                </span>
                {activa ? 'Seleccionada' : 'Elegir'}
              </>
            )
            const cls = `flex min-h-11 items-center gap-2 font-mono text-[0.66rem] tracking-[0.2em] uppercase transition-colors ${activa ? 'text-neon' : 'text-dim'}`
            return unica ? (
              <p className={cls}>{marca}</p>
            ) : (
              <button
                type="button"
                role="radio"
                aria-checked={activa}
                aria-label={`Elegir ${e.nombre}${e.formato ? `, ${e.formato}` : ''}`}
                onClick={() => pedido.elegir(e.id)}
                className={`${cls} hover:text-neon`}
              >
                {marca}
              </button>
            )
          })()}
        </div>

        <h3 id={`ed-${e.id}`} className="mt-6 font-display text-[clamp(1.9rem,4vw,3rem)] leading-none font-bold text-bone">
          {e.nombre}
        </h3>
        <div className="mt-3">
          {e.formato ? <p className="hud text-mist">{e.formato}</p> : <Pendiente dato="formato (físico, digital…)" />}
        </div>
        <p className="mt-5 max-w-md text-mist">{e.descripcion}</p>

        <p className="mt-5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.66rem] tracking-[0.2em] text-dim uppercase">
          {dimensiones.map((d, k) => (
            <span key={d.id}>
              {d.nombre}
              {k < dimensiones.length - 1 && (
                <span aria-hidden className="ml-3 text-line-2">
                  ·
                </span>
              )}
            </span>
          ))}
        </p>

        {e.incluye.length > 0 && (
          <ul className="mt-6 space-y-2">
            {e.incluye.map((x) => (
              <li key={x} className="flex items-start gap-3 text-bone">
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-neon" strokeWidth={2} /> {x}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-2 sm:items-end">
          <div>
            <p className="hud">Precio</p>
            {unitario ? (
              <p className="mt-2 flex items-baseline gap-3">
                <span className="font-display text-4xl font-bold text-bone tabular-nums">{unitario}</span>
                {antes && <s className="font-mono text-sm text-dim">{antes}</s>}
              </p>
            ) : (
              <Pendiente dato="precio" className="mt-2" />
            )}
          </div>
          <div className="sm:justify-self-end">
            <p className="hud mb-2 sm:text-right">Cantidad</p>
            <Cantidad
              valor={cantidad}
              onChange={(n) => {
                pedido.elegir(e.id)
                pedido.cantidad(n)
              }}
              etiqueta={`Cantidad de ${e.nombre}`}
            />
          </div>
        </div>

        {total && cantidad > 1 && (
          <p className="mt-4 flex items-center justify-between font-mono text-sm tracking-[0.12em] text-mist uppercase">
            <span>Total ({cantidad})</span>
            <span className="text-bone tabular-nums">{total}</span>
          </p>
        )}

        <BotonCheckout
          estado={activa ? estado : 'listo'}
          onClick={() => {
            pedido.elegir(e.id)
            ir(e, cantidad)
          }}
          className="mt-6"
        >
          Comprar
        </BotonCheckout>

        <div className="mt-4">
          {confianza.compra ? <p className="hud text-mist">{confianza.compra}</p> : <Pendiente dato="texto de confianza (envío, pago…)" />}
        </div>
      </div>
    </article>
  )
}
