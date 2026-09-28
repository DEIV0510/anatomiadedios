import { contacto, ediciones, envio, libro, metodosPago, redes } from '@/data/libro'
import { precio } from '@/lib/format'

export type Pregunta = { q: string; a: string | null; falta: string }

/**
 * Preguntas frecuentes armadas SOLO con datos reales. Si falta el dato, la respuesta queda en
 * null: en producción la pregunta no se publica y en desarrollo aparece como pendiente.
 */
export function preguntas(): Pregunta[] {
  const unica = ediciones.length === 1 ? ediciones[0] : null
  const conPrecio = ediciones.filter((e) => e.precio != null)
  const canales = [
    contacto.whatsapp && `WhatsApp +${contacto.whatsapp}`,
    contacto.email && `correo ${contacto.email}`,
    redes.length > 0 && `redes (${redes.map((r) => r.nombre).join(', ')})`,
  ].filter(Boolean)

  return [
    {
      q: '¿Qué incluye la compra?',
      a:
        unica && unica.incluye.length === 0
          ? `El libro ${libro.titulo}, de ${libro.autorNombre}, en la cantidad que elijas.`
          : unica
            ? `El libro ${libro.titulo}, de ${libro.autorNombre}, más: ${unica.incluye.join(', ')}.`
            : `Depende de la edición: cada tarjeta de «Elige tu experiencia» detalla lo que trae.`,
      falta: 'contenido de la compra',
    },
    {
      q: '¿Qué edición estoy comprando?',
      a: unica
        ? unica.formato
          ? `La edición ${unica.formato} de ${libro.titulo}.`
          : null
        : 'La que marques en «Elige tu experiencia». Se ilumina en verde y es la que pasa al checkout.',
      falta: 'formato de la edición',
    },
    { q: '¿Cómo recibo mi pedido?', a: envio, falta: 'envío o entrega' },
    {
      q: '¿Cuánto cuesta?',
      a:
        conPrecio.length === 0
          ? null
          : conPrecio.length === 1
            ? `${precio(conPrecio[0].precio)} por ejemplar.`
            : conPrecio.map((e) => `${e.nombre}${e.formato ? ` (${e.formato})` : ''}: ${precio(e.precio)}`).join(' · '),
      falta: 'precio',
    },
    {
      q: '¿Qué métodos de pago están disponibles?',
      a: metodosPago.length ? `${metodosPago.map((m) => m.nombre).join(', ')}.` : null,
      falta: 'métodos de pago',
    },
    {
      q: '¿Cómo puedo contactar?',
      a: canales.length ? `Por ${canales.join(', ')}.` : null,
      falta: 'contacto',
    },
  ]
}
