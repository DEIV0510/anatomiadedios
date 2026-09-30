'use client'

import { useEffect, useRef } from 'react'
import { Check, X } from 'lucide-react'
import { confianza, ediciones, libro } from '@/data/libro'
import { vaPorWhatsApp } from '@/lib/checkout'
import { precio } from '@/lib/format'
import { media } from '@/lib/media'
import { pedido, usePedido } from '@/lib/pedido'
import { IS_DEV } from '@/lib/site'
import { useCheckout } from '@/lib/useCheckout'
import { BotonCheckout } from './ui/BotonCheckout'
import { Cantidad } from './ui/Cantidad'
import { Pendiente } from './ui/Pendiente'
import { Picture } from './ui/Picture'

/**
 * Compra rápida: cualquier botón [data-comprar] de la página abre este panel sin obligar a
 * recorrer la página. Elegir edición (si hay varias) -> cantidad -> checkout.
 * <dialog> nativo: foco atrapado, Esc para cerrar, fondo inerte.
 */
export function CompraRapida() {
  const { abierto, edicion, cantidad } = usePedido()
  const dialogo = useRef<HTMLDialogElement>(null)
  const { estado, motivo, ir, reiniciar } = useCheckout()

  // Delegación: todos los CTA «COMPRAR» abren el panel
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-comprar]')
      if (!el) return
      e.preventDefault()
      document.querySelectorAll('dialog[open]').forEach((d) => d !== dialogo.current && (d as HTMLDialogElement).close())
      pedido.abrir(el.dataset.comprar || undefined)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // Estado -> diálogo
  useEffect(() => {
    const d = dialogo.current
    if (!d) return
    if (abierto && !d.open) {
      reiniciar()
      d.showModal()
    } else if (!abierto && d.open) d.close()
  }, [abierto, reiniciar])

  useEffect(() => {
    const d = dialogo.current
    if (!d) return
    const onClose = () => pedido.cerrar()
    d.addEventListener('close', onClose)
    return () => d.removeEventListener('close', onClose)
  }, [])

  const esMentoria = edicion?.tipo === 'mentoria'
  const unitario = precio(edicion?.precio)
  const total = edicion?.precio != null ? precio(edicion.precio * (esMentoria ? 1 : cantidad)) : null
  const porWhatsApp = edicion ? vaPorWhatsApp(edicion) : false

  return (
    <dialog
      ref={dialogo}
      className="sheet sheet--compra"
      aria-labelledby="compra-titulo"
      onClick={(e) => e.target === e.currentTarget && pedido.cerrar()}
    >
      <div className="sheet__panel absolute inset-x-0 bottom-0 flex max-h-[92svh] flex-col overflow-y-auto border-t border-line-2 bg-void md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[28rem] md:border-t-0 md:border-l">
        <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-40" />

        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-void/95 px-6 py-3 backdrop-blur">
          <p className="hud">
            <span className="text-neon">&gt;</span> Compra rápida<span className="animate-blink text-neon">_</span>
          </p>
          <button
            type="button"
            onClick={() => pedido.cerrar()}
            aria-label="Cerrar compra rápida"
            className="grid size-11 place-items-center border border-line-2 text-bone transition-colors hover:border-neon hover:text-neon"
          >
            <X aria-hidden className="size-5" strokeWidth={1.5} />
          </button>
        </header>

        <div className="relative flex flex-1 flex-col gap-7 p-6">
          {/* Producto */}
          <div className="flex gap-5">
            <div className="relative w-24 shrink-0 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.9),0_0_30px_-10px_rgb(57_255_136/0.35)]">
              <Picture img={media.cover} alt="" sizes="96px" imgClassName="block h-auto w-full" />
            </div>
            <div className="min-w-0">
              <h2 id="compra-titulo" className="font-display text-2xl leading-tight font-bold text-bone">
                {esMentoria ? edicion?.nombre : libro.titulo}
              </h2>
              <p className="hud mt-2">{esMentoria ? `${libro.titulo} · ${libro.autor}` : libro.autor}</p>
              <div className="mt-3">
                {esMentoria ? (
                  <p className="text-sm text-mist">Dos transmisiones entre el autor y el lector</p>
                ) : edicion?.formato ? (
                  <p className="text-sm text-mist">{edicion.formato}</p>
                ) : (
                  <Pendiente dato="formato" />
                )}
              </div>
            </div>
          </div>

          {/* Ediciones (solo si hay varias) */}
          {ediciones.length > 1 && (
            <fieldset>
              <legend className="hud mb-3">Experiencia</legend>
              <div className="grid gap-2">
                {ediciones.map((e) => {
                  const on = e.id === edicion?.id
                  return (
                    <label
                      key={e.id}
                      className={`flex min-h-12 cursor-pointer items-center justify-between gap-4 border px-4 py-3 transition-colors ${on ? 'border-neon bg-neon/5' : 'border-line-2 hover:border-mist'}`}
                    >
                      <span className="flex items-center gap-3">
                        <input type="radio" name="edicion" className="sr-only" checked={on} onChange={() => pedido.elegir(e.id)} />
                        <span aria-hidden className={`grid size-4 place-items-center border ${on ? 'border-neon bg-neon text-void' : 'border-line-2'}`}>
                          {on && <Check className="size-3" strokeWidth={3} />}
                        </span>
                        <span className="text-bone">
                          {e.nombre}
                          {e.formato && <span className="text-mist"> · {e.formato}</span>}
                        </span>
                      </span>
                      {precio(e.precio) && <span className="font-mono text-sm text-bone tabular-nums">{precio(e.precio)}</span>}
                    </label>
                  )
                })}
              </div>
            </fieldset>
          )}

          {/* Cantidad y total (la mentoría es una sola; sin precio no se muestra el rótulo) */}
          {(!esMentoria || total || IS_DEV) && (
            <div className="flex items-end justify-between gap-4 border-y border-line py-5">
              {!esMentoria && (
                <div>
                  <p className="hud mb-2">Cantidad</p>
                  <Cantidad valor={cantidad} onChange={(n) => pedido.cantidad(n)} />
                </div>
              )}
              {/* Sin precio configurado no se muestra el rótulo vacío (en desarrollo, el aviso) */}
              {(total || IS_DEV) && (
                <div className={esMentoria ? '' : 'text-right'}>
                  <p className="hud mb-2">{!esMentoria && cantidad > 1 ? 'Total' : 'Precio'}</p>
                  {total ? (
                    <p className="font-display text-3xl font-bold text-bone tabular-nums">{total}</p>
                  ) : (
                    <Pendiente dato={esMentoria ? 'valor de la mentoría' : 'precio'} />
                  )}
                  {!esMentoria && unitario && cantidad > 1 && <p className="mt-1 font-mono text-xs text-dim">{unitario} c/u</p>}
                </div>
              )}
            </div>
          )}

          <div className="mt-auto">
            <BotonCheckout estado={estado} motivo={motivo} whatsapp={porWhatsApp} onClick={() => edicion && ir(edicion, esMentoria ? 1 : cantidad)}>
              {esMentoria ? 'Comprar por WhatsApp' : 'Ir al checkout'}
            </BotonCheckout>
            <p className="mt-4 text-center font-mono text-[0.66rem] tracking-[0.16em] text-dim uppercase">
              {esMentoria ? 'Se abre WhatsApp con tu mensaje listo' : porWhatsApp ? 'Tu pedido llega armado por WhatsApp' : 'Te llevamos directo al pago'}
            </p>
            {!esMentoria && (
              <div className="mt-3 flex justify-center">
                {confianza.compra ? <p className="hud text-center text-mist">{confianza.compra}</p> : <Pendiente dato="texto de confianza" />}
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  )
}
