import { ediciones, metodosPago, testimonios } from '@/data/libro'
import { anclas, IS_DEV } from '@/lib/site'

const hayMentoria = ediciones.some((e) => e.tipo === 'mentoria')
const hayTestimonios = testimonios.length > 0 || IS_DEV
const hayPagos = metodosPago.length > 0 || IS_DEV

/** Enlaces de la navbar. TESTIMONIOS solo aparece cuando la sección existe. */
export const enlaces: { id: string; label: string; destacado?: boolean }[] = [
  { id: anclas.descubre, label: 'Descubre' },
  { id: anclas.libro, label: 'El libro' },
  { id: anclas.contenido, label: 'Contenido' },
  ...(hayMentoria ? [{ id: anclas.mentoria, label: 'Mentoría', destacado: true }] : []),
  ...(hayTestimonios ? [{ id: anclas.testimonios, label: 'Testimonios' }] : []),
  { id: anclas.ediciones, label: 'Ediciones' },
  { id: anclas.faq, label: 'FAQ' },
]

/** Secciones con rótulo [ 0N ], en orden. Las que no se publican (sin datos) no cuentan: así la
 *  numeración no salta en producción. */
const numeradas: string[] = [
  anclas.descubre,
  anclas.concepto,
  anclas.libro,
  anclas.contenido,
  ...(hayMentoria ? [anclas.mentoria] : []),
  ...(hayTestimonios ? [anclas.testimonios] : []),
  anclas.ediciones,
  ...(hayPagos ? [anclas.pago] : []),
  anclas.faq,
]

export const numeroSeccion = (id: string) => String(numeradas.indexOf(id) + 1).padStart(2, '0')
