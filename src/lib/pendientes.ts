import {
  checkout,
  confianza,
  contacto,
  ediciones,
  envio,
  libro,
  metodosPago,
  politicasUrl,
  redes,
  seguridadPago,
  testimonios,
} from '@/data/libro'

/** Datos que faltan en src/data/libro.ts (se listan en el panel de desarrollo) */
export function pendientes(): { dato: string; donde: string }[] {
  const p: { dato: string; donde: string }[] = []
  if (!checkout.url && !checkout.whatsapp && !ediciones.some((e) => e.tipo === 'libro' && e.checkoutUrl))
    p.push({ dato: 'Link de pago o WhatsApp de ventas del libro', donde: 'checkout.url / checkout.whatsapp' })
  ediciones.forEach((e) => {
    if (e.whatsapp && !e.whatsapp.numero && !checkout.whatsapp && !contacto.whatsapp)
      p.push({ dato: `WhatsApp que recibe «${e.nombre}»`, donde: `ediciones[${e.id}].whatsapp.numero` })
    if (e.precio == null)
      p.push({ dato: `Precio de «${e.nombre}»${e.tipo === 'mentoria' ? ' (opcional)' : ''}`, donde: `ediciones[${e.id}].precio` })
    if (e.tipo === 'libro' && !e.formato) p.push({ dato: `Formato de «${e.nombre}» (físico, digital…)`, donde: `ediciones[${e.id}].formato` })
  })
  if (!testimonios.length) p.push({ dato: 'Testimonios reales', donde: 'testimonios' })
  if (!metodosPago.length) p.push({ dato: 'Métodos de pago', donde: 'metodosPago' })
  if (!seguridadPago) p.push({ dato: 'Detalle de seguridad de la pasarela', donde: 'seguridadPago' })
  if (!envio) p.push({ dato: 'Envío / entrega', donde: 'envio' })
  if (!confianza.compra) p.push({ dato: 'Texto de confianza bajo los botones', donde: 'confianza.compra' })
  if (!libro.sinopsis) p.push({ dato: 'Sinopsis oficial (opcional)', donde: 'libro.sinopsis' })
  if (!contacto.email && !contacto.whatsapp) p.push({ dato: 'Contacto (email o WhatsApp)', donde: 'contacto' })
  if (!redes.length) p.push({ dato: 'Redes sociales', donde: 'redes' })
  if (!politicasUrl) p.push({ dato: 'Página de políticas', donde: 'politicasUrl' })
  return p
}
