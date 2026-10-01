import { contacto, ediciones, envio, libro, metodosPago, redes } from '@/data/libro'
import { precio } from '@/lib/format'

export type Pregunta = { q: string; a: string | null; falta: string }

/**
 * Preguntas frecuentes armadas SOLO con datos reales. Si falta el dato, la respuesta queda en
 * null: en producción la pregunta no se publica y en desarrollo aparece como pendiente.
 */
export function preguntas(): Pregunta[] {
  const libros = ediciones.filter((e) => e.tipo === 'libro')
  const unico = libros.length === 1 ? libros[0] : null
  const mentoria = ediciones.find((e) => e.tipo === 'mentoria')
  const conPrecio = ediciones.filter((e) => e.precio != null)
  const canales = [
    contacto.whatsapp && `WhatsApp +${contacto.whatsapp}`,
    contacto.email && `correo ${contacto.email}`,
    redes.length > 0 && `redes (${redes.map((r) => r.nombre).join(', ')})`,
  ].filter(Boolean)

  const libroIncluye = unico
    ? unico.incluye.length
      ? `El libro ${libro.titulo}, de ${libro.autorNombre}, más: ${unico.incluye.join(', ')}.`
      : `El libro ${libro.titulo}, de ${libro.autorNombre}, en la cantidad que elijas.`
    : 'Cada tarjeta de «Elige tu experiencia» detalla lo que trae.'

  return [
    {
      q: '¿Qué incluye la compra?',
      a: mentoria
        ? `${libroIncluye} Si eliges la mentoría personalizada: el acompañamiento del autor, con dos transmisiones entre el autor y el lector.`
        : libroIncluye,
      falta: 'contenido de la compra',
    },
    ...(mentoria
      ? [
          {
            q: '¿Qué es la mentoría personalizada?',
            a: `Es el acompañamiento personalizado por parte del autor, ${libro.autorNombre}: dos transmisiones entre el autor y el lector. Se pide por WhatsApp con el botón «Comprar mentoría» (en su sección o en «Elige tu experiencia»): el mensaje ya va escrito.`,
            falta: 'mentoría',
          },
        ]
      : []),
    {
      q: '¿Qué edición estoy comprando?',
      a: unico ? (unico.formato ? `La edición ${unico.formato} de ${libro.titulo}.` : null) : 'La que marques en «Elige tu experiencia»: se ilumina en verde.',
      falta: 'formato de la edición',
    },
    { q: '¿Cómo recibo mi pedido?', a: envio, falta: 'envío o entrega' },
    {
      q: '¿Cuánto cuesta?',
      a:
        conPrecio.length === 0
          ? null
          : conPrecio.length === 1 && conPrecio[0].tipo === 'libro'
            ? `${precio(conPrecio[0].precio)} por ejemplar.`
            : conPrecio.map((e) => `${e.tipo === 'libro' ? 'Libro' : 'Mentoría'}${e.formato ? ` (${e.formato})` : ''}: ${precio(e.precio)}`).join(' · '),
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
