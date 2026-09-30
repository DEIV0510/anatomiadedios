'use client'

import { AlertTriangle, ArrowRight, Loader2, MessageCircle } from 'lucide-react'
import { contacto } from '@/data/libro'
import type { MotivoError } from '@/lib/checkout'
import type { EstadoCheckout } from '@/lib/useCheckout'
import { IS_DEV } from '@/lib/site'
import { Trace } from './BotonComprar'

const ERRORES: Record<MotivoError, { titulo: string; texto: string; dev: string }> = {
  'sin-configurar': {
    titulo: 'Error 503 · Canal de pago no disponible',
    texto: 'La compra en línea no está disponible en este momento.',
    dev: 'Configura checkout.url o checkout.whatsapp en src/data/libro.ts',
  },
  'sin-whatsapp': {
    titulo: 'Error 503 · Canal de WhatsApp no disponible',
    texto: 'Las solicitudes por WhatsApp no están disponibles en este momento.',
    dev: 'Configura el número en src/data/libro.ts → ediciones → mentoria → whatsapp.numero',
  },
}

/** Botón que va al checkout + sus estados (cargando, WhatsApp abierto, error) */
export function BotonCheckout({
  estado,
  motivo = 'sin-configurar',
  onClick,
  children = 'Comprar',
  whatsapp = false,
  className = '',
}: {
  estado: EstadoCheckout
  motivo?: MotivoError
  onClick: () => void
  children?: React.ReactNode
  /** Rótulo e icono de «abre WhatsApp» */
  whatsapp?: boolean
  className?: string
}) {
  const cargando = estado === 'cargando'
  const error = ERRORES[motivo]
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
            {whatsapp && <MessageCircle aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />}
            <span>{children}</span>
            <ArrowRight aria-hidden className="btn-arrow size-5" strokeWidth={1.75} />
          </>
        )}
      </button>

      <div aria-live="polite">
        {estado === 'whatsapp' && (
          <p className="mt-3 flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-neon uppercase">
            <MessageCircle aria-hidden className="size-4" strokeWidth={1.5} /> Tu mensaje se abrió en WhatsApp
          </p>
        )}
        {estado === 'error' && (
          <div role="alert" className="mt-4 border border-alert/50 bg-alert/5 p-4">
            <p className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-alert uppercase">
              <AlertTriangle aria-hidden className="size-4 shrink-0" strokeWidth={1.5} /> {error.titulo}
            </p>
            <p className="mt-2 text-sm text-mist">
              {error.texto}
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
            {IS_DEV && <p className="mt-2 font-mono text-[0.68rem] leading-relaxed text-amber">[dev] {error.dev}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
