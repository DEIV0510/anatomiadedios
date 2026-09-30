'use client'

import { Check, MessageCircle } from 'lucide-react'
import { confianza, dimensiones, ediciones, type Edicion } from '@/data/libro'
import { vaPorWhatsApp } from '@/lib/checkout'
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
import { VisualMentoria } from './ui/VisualMentoria'

/**
 * «Elige tu experiencia»: el libro y la mentoría personalizada (src/data/libro.ts).
 * La tarjeta elegida se ilumina en verde; la elección y la cantidad se comparten con la
 * compra rápida y la barra de móvil. El libro va al checkout; la mentoría, a WhatsApp.
 */
export function Ediciones() {
  const { edicionId, cantidad } = usePedido()
  const varias = ediciones.length > 1

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
            {varias ? 'El libro o el acompañamiento de su autor.' : 'Elige, ajusta la cantidad y pasa directo al pago.'}{' '}
            <span className="text-bone">{varias ? 'Elige y pasa directo a la compra.' : 'Sin vueltas.'}</span>
          </p>
        </div>

        <div role={varias ? 'radiogroup' : undefined} aria-label={varias ? 'Experiencias disponibles' : undefined} className="mt-14 grid gap-6">
          {ediciones.map((e, i) => (
            <Tarjeta key={e.id} e={e} i={i} varias={varias} activa={e.id === edicionId} cantidad={cantidad} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Tarjeta({ e, i, varias, activa, cantidad }: { e: Edicion; i: number; varias: boolean; activa: boolean; cantidad: number }) {
  const { estado, motivo, ir } = useCheckout()
  const libroFisico = e.tipo === 'libro'
  const unitario = precio(e.precio)
  const total = e.precio != null ? precio(e.precio * cantidad) : null
  const antes = precio(e.precioAntes)
  const porWhatsApp = vaPorWhatsApp(e)

  return (
    <article
      aria-labelledby={`ed-${e.id}`}
      className={`group relative isolate grid overflow-hidden border transition-[border-color,box-shadow] duration-500 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] ${
        activa ? 'border-neon/80 shadow-[0_0_48px_-12px_rgb(57_255_136/0.45)]' : 'border-line hover:border-line-2'
      }`}
      data-reveal
      onClick={varias ? () => pedido.elegir(e.id) : undefined}
    >
      {/* Imagen real del producto (o el visual de la mentoría) */}
      <div className="relative aspect-square overflow-hidden bg-abyss lg:aspect-auto lg:min-h-[32rem]">
        {e.imagen === 'mentoria' ? (
          <VisualMentoria />
        ) : (
          <>
            <Picture
              img={e.imagen === 'mockup' ? media.mockup : media.cover}
              alt={`${e.nombre}, libro de Elkin Ferney Gomez Medina`}
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="absolute inset-0"
              imgClassName="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.03]"
              placeholder
            />
            <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-40" />
          </>
        )}
        <div aria-hidden className="corners pointer-events-none absolute inset-4 [--l:20px]" />
      </div>

      {/* Datos y compra */}
      <div className="relative z-10 flex flex-col bg-gradient-to-b from-deep to-abyss p-6 sm:p-8 lg:p-10">
        <div className="flex items-center justify-between gap-4">
          <p className="hud">
            <span className="text-neon">&gt;</span> Experiencia_{String(i + 1).padStart(2, '0')}
          </p>
          <Seleccion e={e} activa={activa} varias={varias} />
        </div>

        <h3 id={`ed-${e.id}`} className="mt-6 font-display text-[clamp(1.9rem,4vw,3rem)] leading-none font-bold text-bone">
          {e.nombre}
        </h3>
        {libroFisico && (
          <div className="mt-3">{e.formato ? <p className="hud text-mist">{e.formato}</p> : <Pendiente dato="formato (físico, digital…)" />}</div>
        )}
        <p className="mt-5 max-w-md text-mist">{e.descripcion}</p>

        {libroFisico && (
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
        )}

        {e.ficha.length > 0 && (
          <dl className="mt-6 grid grid-cols-2 gap-px border border-line bg-line">
            {e.ficha.map((f) => (
              <div key={f.etiqueta} className="bg-void/90 px-4 py-3">
                <dt className="hud text-[0.62rem]">{f.etiqueta}</dt>
                <dd className={`mt-1 ${/^\d+$/.test(f.valor) ? 'font-display text-2xl font-bold text-neon' : 'text-bone'}`}>{f.valor}</dd>
              </div>
            ))}
          </dl>
        )}

        {e.incluye.length > 0 && (
          <ul className="mt-6 space-y-2">
            {e.incluye.map((x) => (
              <li key={x} className="flex items-start gap-3 text-bone">
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-neon" strokeWidth={2} /> {x}
              </li>
            ))}
          </ul>
        )}

        {/* Precio (y cantidad solo para el libro). Sin precio no se publica el rótulo vacío. */}
        {(unitario || IS_DEV || libroFisico) && (
          <div className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-2 sm:items-end">
            {(unitario || IS_DEV) && (
              <div>
                <p className="hud">Precio</p>
                {unitario ? (
                  <p className="mt-2 flex items-baseline gap-3">
                    <span className="font-display text-4xl font-bold text-bone tabular-nums">{unitario}</span>
                    {antes && <s className="font-mono text-sm text-dim">{antes}</s>}
                  </p>
                ) : (
                  <Pendiente dato={libroFisico ? 'precio' : 'valor de la mentoría (opcional)'} className="mt-2" />
                )}
              </div>
            )}
            {libroFisico && (
              <div className={unitario || IS_DEV ? 'sm:justify-self-end' : ''}>
                <p className={`hud mb-2 ${unitario || IS_DEV ? 'sm:text-right' : ''}`}>Cantidad</p>
                <Cantidad
                  valor={cantidad}
                  onChange={(n) => {
                    pedido.elegir(e.id)
                    pedido.cantidad(n)
                  }}
                  etiqueta={`Cantidad de ${e.nombre}`}
                />
              </div>
            )}
          </div>
        )}

        {libroFisico && total && cantidad > 1 && (
          <p className="mt-4 flex items-center justify-between font-mono text-sm tracking-[0.12em] text-mist uppercase">
            <span>Total ({cantidad})</span>
            <span className="text-bone tabular-nums">{total}</span>
          </p>
        )}

        <BotonCheckout
          estado={activa ? estado : 'listo'}
          motivo={motivo}
          whatsapp={porWhatsApp}
          onClick={() => {
            pedido.elegir(e.id)
            ir(e, libroFisico ? cantidad : 1)
          }}
          className="mt-8"
        >
          {libroFisico ? 'Comprar' : 'Comprar mentoría'}
        </BotonCheckout>

        <div className="mt-4">
          {e.whatsapp ? (
            <p className="hud flex items-center gap-2 text-mist">
              <MessageCircle aria-hidden className="size-4 text-neon" strokeWidth={1.5} /> Se abre WhatsApp con tu mensaje listo
            </p>
          ) : confianza.compra ? (
            <p className="hud text-mist">{confianza.compra}</p>
          ) : (
            <Pendiente dato="texto de confianza (envío, pago…)" />
          )}
        </div>
      </div>
    </article>
  )
}

/** Marca «Seleccionada / Elegir»: botón de radio cuando hay varias experiencias */
function Seleccion({ e, activa, varias }: { e: Edicion; activa: boolean; varias: boolean }) {
  const marca = (
    <>
      <span aria-hidden className={`grid size-4 place-items-center border ${activa ? 'border-neon bg-neon text-void' : 'border-line-2'}`}>
        {activa && <Check className="size-3" strokeWidth={3} />}
      </span>
      {/* El nombre accesible incluye el texto visible (WCAG 2.5.3) */}
      <span className="sr-only">{e.nombre}: </span>
      {activa ? 'Seleccionada' : 'Elegir'}
    </>
  )
  const cls = `flex min-h-11 items-center gap-2 font-mono text-[0.66rem] tracking-[0.2em] uppercase transition-colors ${activa ? 'text-neon' : 'text-dim'}`
  if (!varias) return <p className={cls}>{marca}</p>
  return (
    <button
      type="button"
      role="radio"
      aria-checked={activa}
      onClick={(ev) => {
        ev.stopPropagation()
        pedido.elegir(e.id)
      }}
      className={`${cls} hover:text-neon`}
    >
      {marca}
    </button>
  )
}
