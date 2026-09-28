'use client'

import { useSyncExternalStore } from 'react'
import { ediciones } from '@/data/libro'
import { clampCantidad } from '@/lib/format'

/**
 * Estado del pedido compartido entre las tarjetas de ediciones, la compra rápida (panel) y la
 * barra fija de móvil. Sin librerías: un store mínimo para useSyncExternalStore.
 */
type Pedido = {
  edicionId: string
  cantidad: number
  abierto: boolean
}

const inicial: Pedido = { edicionId: ediciones[0]?.id ?? '', cantidad: 1, abierto: false }
let estado: Pedido = inicial
const oyentes = new Set<() => void>()

function emitir(parche: Partial<Pedido>) {
  estado = { ...estado, ...parche }
  oyentes.forEach((fn) => fn())
}

export const pedido = {
  leer: () => estado,
  suscribir(fn: () => void) {
    oyentes.add(fn)
    return () => oyentes.delete(fn)
  },
  elegir(edicionId: string) {
    if (ediciones.some((e) => e.id === edicionId)) emitir({ edicionId })
  },
  cantidad(n: number) {
    emitir({ cantidad: clampCantidad(n) })
  },
  abrir(edicionId?: string) {
    emitir({ abierto: true, ...(edicionId && ediciones.some((e) => e.id === edicionId) ? { edicionId } : {}) })
  },
  cerrar() {
    emitir({ abierto: false })
  },
}

export function usePedido() {
  const s = useSyncExternalStore(pedido.suscribir, pedido.leer, () => inicial)
  const edicion = ediciones.find((e) => e.id === s.edicionId) ?? ediciones[0]
  return { ...s, edicion }
}
