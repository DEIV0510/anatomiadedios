import { tienda } from '@/data/libro'

const money = new Intl.NumberFormat(tienda.locale, {
  style: 'currency',
  currency: tienda.moneda,
  maximumFractionDigits: 0,
})

/** 89000 -> "$ 89.000" (es-CO). null -> null */
export function precio(valor: number | null | undefined): string | null {
  if (valor == null || !Number.isFinite(valor)) return null
  return money.format(valor)
}

export function clampCantidad(n: number): number {
  if (!Number.isFinite(n)) return 1
  return Math.min(tienda.cantidadMaxima, Math.max(1, Math.round(n)))
}
