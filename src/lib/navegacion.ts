import { testimonios } from '@/data/libro'
import { anclas, IS_DEV } from '@/lib/site'

/** Enlaces de la navbar. TESTIMONIOS solo aparece cuando la sección existe. */
export const enlaces = [
  { id: anclas.descubre, label: 'Descubre' },
  { id: anclas.libro, label: 'El libro' },
  { id: anclas.contenido, label: 'Contenido' },
  ...(testimonios.length || IS_DEV ? [{ id: anclas.testimonios, label: 'Testimonios' }] : []),
  { id: anclas.ediciones, label: 'Ediciones' },
  { id: anclas.faq, label: 'FAQ' },
]
