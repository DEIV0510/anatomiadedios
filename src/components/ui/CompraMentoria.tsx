'use client'

import { MessageCircle } from 'lucide-react'
import { ediciones } from '@/data/libro'
import { vaPorWhatsApp } from '@/lib/checkout'
import { precio } from '@/lib/format'
import { pedido } from '@/lib/pedido'
import { IS_DEV } from '@/lib/site'
import { useCheckout } from '@/lib/useCheckout'
import { BotonCheckout } from './BotonCheckout'
import { Pendiente } from './Pendiente'

const mentoria = ediciones.find((e) => e.tipo === 'mentoria')

/** Compra directa desde la sección de la mentoría: abre WhatsApp con el mensaje ya escrito */
export function CompraMentoria({ className = '' }: { className?: string }) {
  const { estado, motivo, ir } = useCheckout()
  if (!mentoria) return null
  const valor = precio(mentoria.precio)

  return (
    <div className={className} data-reveal>
      {(valor || IS_DEV) && (
        <div className="mb-6">
          <p className="hud">Valor</p>
          {valor ? (
            <p className="mt-2 font-display text-4xl font-bold text-bone tabular-nums">{valor}</p>
          ) : (
            <Pendiente dato="valor de la mentoría (opcional)" className="mt-2" />
          )}
        </div>
      )}
      <BotonCheckout
        estado={estado}
        motivo={motivo}
        whatsapp={vaPorWhatsApp(mentoria)}
        onClick={() => {
          pedido.elegir(mentoria.id)
          ir(mentoria, 1)
        }}
      >
        Comprar mentoría
      </BotonCheckout>
      <p className="hud mt-4 flex items-center gap-2 text-mist">
        <MessageCircle aria-hidden className="size-4 shrink-0 text-neon" strokeWidth={1.5} /> Se abre WhatsApp con tu mensaje listo
      </p>
    </div>
  )
}
