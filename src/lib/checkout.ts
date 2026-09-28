import { checkout, ediciones, libro, type Edicion } from '@/data/libro'
import { precio } from '@/lib/format'

export type Checkout =
  | { ok: true; href: string; canal: 'url' | 'whatsapp' }
  | { ok: false; motivo: 'sin-configurar' }

function plantilla(url: string, edicion: Edicion, cantidad: number) {
  return url.replaceAll('{cantidad}', String(cantidad)).replaceAll('{edicion}', encodeURIComponent(edicion.id))
}

/** Arma el destino del botón «IR AL CHECKOUT» según lo configurado en src/data/libro.ts */
export function destinoCheckout(edicion: Edicion, cantidad: number): Checkout {
  if (edicion.checkoutUrl) return { ok: true, canal: 'url', href: plantilla(edicion.checkoutUrl, edicion, cantidad) }
  if (checkout.url) return { ok: true, canal: 'url', href: plantilla(checkout.url, edicion, cantidad) }
  if (checkout.whatsapp) {
    const total = edicion.precio != null ? precio(edicion.precio * cantidad) : null
    const lineas = [
      `Hola, quiero comprar ${libro.titulo}.`,
      `Edición: ${edicion.formato ? `${edicion.nombre} (${edicion.formato})` : edicion.nombre}`,
      `Cantidad: ${cantidad}`,
      ...(total ? [`Total: ${total}`] : []),
    ]
    return {
      ok: true,
      canal: 'whatsapp',
      href: `https://wa.me/${checkout.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(lineas.join('\n'))}`,
    }
  }
  return { ok: false, motivo: 'sin-configurar' }
}

/** ¿Hay algún camino de compra configurado? */
export const checkoutListo = Boolean(checkout.url || checkout.whatsapp || ediciones.some((e) => e.checkoutUrl))
