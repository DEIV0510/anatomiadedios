'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Edicion } from '@/data/libro'
import { destinoCheckout } from '@/lib/checkout'

export type EstadoCheckout = 'listo' | 'cargando' | 'error' | 'whatsapp'

/**
 * Lleva al checkout configurado. Link de pago: misma pestaña (con estado de carga mientras
 * navega). WhatsApp: pestaña nueva abierta dentro del clic (sin bloqueos de ventanas emergentes).
 * Si no hay nada configurado: estado de error con el motivo.
 */
export function useCheckout() {
  const [estado, setEstado] = useState<EstadoCheckout>('listo')

  // Al volver con «atrás» desde el checkout (bfcache) el botón no se queda cargando
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => e.persisted && setEstado('listo')
    window.addEventListener('pageshow', onShow)
    return () => window.removeEventListener('pageshow', onShow)
  }, [])

  const ir = useCallback((edicion: Edicion, cantidad: number) => {
    const destino = destinoCheckout(edicion, cantidad)
    if (!destino.ok) {
      setEstado('error')
      return
    }
    if (destino.canal === 'whatsapp') {
      const w = window.open(destino.href, '_blank')
      if (w) {
        w.opener = null
        setEstado('whatsapp')
      } else {
        setEstado('cargando')
        window.location.href = destino.href
      }
      return
    }
    setEstado('cargando')
    window.location.assign(destino.href)
  }, [])

  const reiniciar = useCallback(() => setEstado('listo'), [])
  return { estado, ir, reiniciar }
}
