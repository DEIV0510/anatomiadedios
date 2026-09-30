import { checkout, contacto, ediciones, libro, type Edicion } from '@/data/libro'
import { precio } from '@/lib/format'

export type MotivoError = 'sin-configurar' | 'sin-whatsapp'

export type Checkout = { ok: true; href: string; canal: 'url' | 'whatsapp' } | { ok: false; motivo: MotivoError }

function plantilla(url: string, edicion: Edicion, cantidad: number) {
  return url.replaceAll('{cantidad}', String(cantidad)).replaceAll('{edicion}', encodeURIComponent(edicion.id))
}

const wa = (numero: string, texto: string) => `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(texto)}`

/** Mensaje ya escrito de una edición con WhatsApp propio (la mentoría) */
export function mensajeWhatsApp(edicion: Edicion): string {
  if (!edicion.whatsapp) return ''
  const valor = precio(edicion.precio)
  return edicion.whatsapp.mensaje.replace('{precio}', valor ? ` Valor: ${valor}.` : '')
}

/** Arma el destino del botón de compra según lo configurado en src/data/libro.ts */
export function destinoCheckout(edicion: Edicion, cantidad: number): Checkout {
  // Mentoría (o cualquier edición con WhatsApp propio): siempre al chat, con su mensaje
  if (edicion.whatsapp) {
    const numero = edicion.whatsapp.numero || checkout.whatsapp || contacto.whatsapp
    if (!numero) return { ok: false, motivo: 'sin-whatsapp' }
    return { ok: true, canal: 'whatsapp', href: wa(numero, mensajeWhatsApp(edicion)) }
  }
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
    return { ok: true, canal: 'whatsapp', href: wa(checkout.whatsapp, lineas.join('\n')) }
  }
  return { ok: false, motivo: 'sin-configurar' }
}

/** ¿Hay algún camino de compra configurado para el libro? */
export const checkoutListo = Boolean(checkout.url || checkout.whatsapp || ediciones.some((e) => e.tipo === 'libro' && e.checkoutUrl))

/** ¿La edición va por WhatsApp? (para rótulos e iconos del botón) */
export const vaPorWhatsApp = (e: Edicion) => Boolean(e.whatsapp) || (!e.checkoutUrl && !checkout.url && Boolean(checkout.whatsapp))
