'use client'

import { AlertTriangle, ArrowRight, Loader2, MessageCircle } from 'lucide-react'
import { contacto } from '@/data/libro'
import type { EstadoCheckout } from '@/lib/useCheckout'
import { IS_DEV } from '@/lib/site'
import { Trace } from './BotonComprar'

/** Botón que va al checkout + sus estados (cargando, WhatsApp abierto, error) */
export function BotonCheckout({
  estado,
  onClick,
  children = 'Comprar',
  className = '',
}: {
  estado: EstadoCheckout
  onClick: () => void
  children?: React.ReactNode
  className?: string
}) {
  const cargando = estado === 'cargando'
  return (
    <div className={className}>
      <button type="button" onClick={onClick} disabled={cargando} aria-busy={cargando} className="btn-neon btn-xl w-full">
        <Trace />
        {cargando ? (
          <>
            <Loader2 aria-hidden className="size-5 animate-spin" strokeWidth={1.75} />
            <span>Conectando…</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            <ArrowRight aria-hidden className="btn-arrow size-5" strokeWidth={1.75} />
          </>
        )}
      </button>

      <div aria-live="polite">
        {estado === 'whatsapp' && (
          <p className="mt-3 flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-neon uppercase">
            <MessageCircle aria-hidden className="size-4" strokeWidth={1.5} /> Tu pedido se abrió en WhatsApp
          </p>
        )}
        {estado === 'error' && (
          <div role="alert" className="mt-4 border border-alert/50 bg-alert/5 p-4">
            <p className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-alert uppercase">
              <AlertTriangle aria-hidden className="size-4" strokeWidth={1.5} /> Error 503 · Canal de pago no disponible
            </p>
            <p className="mt-2 text-sm text-mist">
              La compra en línea no está disponible en este momento.
              {contacto.email ? (
                <>
                  {' '}
                  Escríbenos a{' '}
                  <a className="text-bone underline decoration-neon underline-offset-4" href={`mailto:${contacto.email}`}>
                    {contacto.email}
                  </a>
                  .
                </>
              ) : null}
            </p>
            {IS_DEV && (
              <p className="mt-2 font-mono text-[0.68rem] leading-relaxed text-amber">
                [dev] Configura checkout.url o checkout.whatsapp en src/data/libro.ts
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
