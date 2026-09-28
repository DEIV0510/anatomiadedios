/**
 * ANATOMÍA DE DIOS — datos de la landing.
 *
 * TODO lo que la página muestra sale de este archivo. Origen de cada dato:
 *   [portada]  assets/source/libro-mockup.png  (mockup oficial del libro, carpeta «libro»)
 *   [video]    assets/source/hero.mp4           (video del hero, carpeta «libro»)
 *   [brief]    textos que el cliente escribió en el encargo
 *
 * Lo que NO aparece en esos materiales está en `null` o en listas vacías: no se inventa.
 * Mientras un dato falte, la pieza que lo usa no se publica (precio, testimonios, métodos de
 * pago, envío, redes, contacto, políticas). En `npm run dev` se ven marcadores «PENDIENTE» y un
 * panel con todo lo que falta; en producción simplemente no aparecen.
 */

// ---------------------------------------------------------------------------------------------
// Libro
// ---------------------------------------------------------------------------------------------
export const libro = {
  /** [portada] */
  titulo: 'ANATOMÍA DE DIOS',
  /** El mismo título en texto corrido (buscadores, pestaña del navegador) */
  tituloTexto: 'Anatomía de Dios',
  /** [portada] Tal como está impreso */
  autor: 'ELKIN FERNEY GOMEZ MEDINA',
  /** Para textos corridos y datos estructurados */
  autorNombre: 'Elkin Ferney Gomez Medina',
  /** [brief] Subtítulo que acompaña al título en el hero */
  subtitulo: 'La evidencia oculta que une la ciencia y la espiritualidad',
  /** [brief] Idea central del libro */
  ejes: ['ciencia', 'espiritualidad', 'conciencia', 'realidad', 'despertar'],
  /** PENDIENTE: sinopsis oficial (contraportada). No se muestra mientras sea null. */
  sinopsis: null as string | null,
  /** PENDIENTE: número de páginas, ISBN, editorial, año… (se muestran como ficha técnica) */
  ficha: [] as { etiqueta: string; valor: string }[],
}

// ---------------------------------------------------------------------------------------------
// [video] Las cinco dimensiones que salen del libro abierto en el video
// (BODY, MIND, CONSCIOUSNESS, ENERGY, UNIVERSE). Las frases son copy editable: preguntas que
// invitan a abrir el libro, no afirmaciones sobre su contenido.
// ---------------------------------------------------------------------------------------------
export type Dimension = {
  id: 'cuerpo' | 'mente' | 'conciencia' | 'energia' | 'universo'
  nombre: string
  /** Rótulo original del video */
  codigo: string
  pregunta: string
  lectura: string
}

export const dimensiones: Dimension[] = [
  {
    id: 'mente',
    nombre: 'MENTE',
    codigo: 'MIND',
    pregunta: '¿Dónde termina el cerebro y empieza la mente?',
    lectura: 'Pensamiento, memoria, percepción: el filtro con el que lees la realidad.',
  },
  {
    id: 'conciencia',
    nombre: 'CONCIENCIA',
    codigo: 'CONSCIOUSNESS',
    pregunta: '¿Quién observa cuando tú observas?',
    lectura: 'El punto donde la ciencia y la espiritualidad se hacen la misma pregunta.',
  },
  {
    id: 'cuerpo',
    nombre: 'CUERPO',
    codigo: 'BODY',
    pregunta: '¿Y si tu anatomía fuera más que biología?',
    lectura: 'Lo que ves en el espejo es solo la primera capa.',
  },
  {
    id: 'energia',
    nombre: 'ENERGÍA',
    codigo: 'ENERGY',
    pregunta: '¿Qué fuerza invisible sostiene todo lo que existe?',
    lectura: 'Lo que no se ve también mueve lo que sí se ve.',
  },
  {
    id: 'universo',
    nombre: 'UNIVERSO',
    codigo: 'UNIVERSE',
    pregunta: '¿Y si el universo también estuviera dentro de ti?',
    lectura: 'De lo más pequeño a lo más inmenso, la misma pregunta.',
  },
]

// ---------------------------------------------------------------------------------------------
// [brief] Los ejes del libro («ciencia + espiritualidad + conciencia + realidad + despertar»)
// para la sección «Lo que encontrarás dentro». Copy editable.
// ---------------------------------------------------------------------------------------------
export const ejes = [
  { n: '01', titulo: 'CIENCIA', texto: 'Preguntas que empiezan en lo que se puede medir…', icono: 'atom' },
  { n: '02', titulo: 'ESPIRITUALIDAD', texto: '…y continúan donde la medida ya no alcanza.', icono: 'sparkles' },
  { n: '03', titulo: 'CONCIENCIA', texto: 'El punto exacto donde las dos se encuentran.', icono: 'eye' },
  { n: '04', titulo: 'REALIDAD', texto: 'Crees conocerla. Solo has visto la superficie.', icono: 'box' },
  { n: '05', titulo: 'DESPERTAR', texto: 'Lo que ocurre cuando miras más allá del código.', icono: 'rabbit' },
] as const

// ---------------------------------------------------------------------------------------------
// [brief + portada] Lo que muestra la portada, para el «análisis» del libro 3D.
// x/y = posición del punto sobre la portada (0-1). lado = hacia dónde sale el rótulo.
// ---------------------------------------------------------------------------------------------
export const portadaCapas = [
  { id: 'universo', rotulo: 'UNIVERSO', detalle: 'Estrellas y geometría', x: 0.83, y: 0.1, lado: 'derecha' },
  { id: 'energia', rotulo: 'ENERGÍA', detalle: 'El haz de luz central', x: 0.5, y: 0.33, lado: 'derecha' },
  { id: 'rostro', rotulo: 'ROSTRO HUMANO', detalle: 'Mirada interior', x: 0.37, y: 0.49, lado: 'izquierda' },
  { id: 'naturaleza', rotulo: 'NATURALEZA', detalle: 'Árbol, agua, montaña', x: 0.84, y: 0.6, lado: 'derecha' },
  { id: 'ciudad', rotulo: 'MUNDO MODERNO', detalle: 'Ciudad en fragmentos', x: 0.1, y: 0.66, lado: 'izquierda' },
  { id: 'conexion', rotulo: 'CONEXIÓN ESPIRITUAL', detalle: 'La luz del pecho', x: 0.49, y: 0.84, lado: 'izquierda' },
] as const

// ---------------------------------------------------------------------------------------------
// [brief] Textos narrativos
// ---------------------------------------------------------------------------------------------
export const narrativa = {
  despertar: {
    titulo: 'DESPERTAR',
    /** Las palabras entre [corchetes] se resaltan en verde */
    lineas: [
      'Crees que conoces la [realidad],',
      'pero solo has estado en la [superficie].',
    ],
    eleccion: 'Es hora de elegir.',
    conejo: 'Sigue al conejo blanco',
    pregunta: '¿Estás listo para vivir más allá del [código]?',
  },
  final: {
    titulo: 'DESPIERTA',
    texto: 'La realidad puede ser mucho más grande de lo que imaginas.',
  },
}

// ---------------------------------------------------------------------------------------------
// Tienda y ediciones
// ---------------------------------------------------------------------------------------------
export const tienda = {
  /** Moneda y formato del precio (Colombia por defecto; cámbialo si vendes en otra moneda) */
  moneda: 'COP',
  locale: 'es-CO',
  cantidadMaxima: 10,
}

export type Edicion = {
  id: string
  nombre: string
  descripcion: string
  /** PENDIENTE: «Tapa dura», «Tapa blanda», «Digital (PDF)»… */
  formato: string | null
  /** PENDIENTE: precio por unidad, sin puntos ni símbolo (ej. 89000) */
  precio: number | null
  /** Precio anterior tachado (opcional) */
  precioAntes: number | null
  /** Lo que trae además del libro (vacío = no se muestra) */
  incluye: string[]
  imagen: 'mockup' | 'portada'
  /** Link de pago propio de esta edición. Admite {cantidad} y {edicion}. */
  checkoutUrl: string | null
}

/**
 * [portada] En los materiales hay UN producto: el libro. Para vender más ediciones o combos
 * (digital, física, pack…) copia el objeto y cambia id, nombre, formato y precio.
 */
export const ediciones: Edicion[] = [
  {
    id: 'libro',
    nombre: 'ANATOMÍA DE DIOS',
    descripcion: 'El libro de Elkin Ferney Gomez Medina.',
    formato: null,
    precio: null,
    precioAntes: null,
    incluye: [],
    imagen: 'mockup',
    checkoutUrl: null,
  },
]

/**
 * Checkout: a dónde lleva el botón «COMPRAR →».
 *   url:       link de pago (Wompi, Mercado Pago, Hotmart, Shopify, Stripe…). Admite
 *              {cantidad} y {edicion}, p. ej. 'https://tu-tienda.com/cart/123:{cantidad}'
 *   whatsapp:  número con indicativo, solo dígitos (ej. '573001234567'): el pedido llega
 *              armado por WhatsApp.
 * Si una edición tiene `checkoutUrl`, ese link manda sobre estos.
 */
export const checkout = {
  url: null as string | null,
  whatsapp: null as string | null,
}

/** PENDIENTE: textos de confianza bajo los botones (envío, garantía, pago…) */
export const confianza = {
  compra: null as string | null,
}

/** PENDIENTE: métodos de pago aceptados. tipo = tarjeta | banco | billetera | efectivo | otro */
export const metodosPago: { nombre: string; tipo: 'tarjeta' | 'banco' | 'billetera' | 'efectivo' | 'otro' }[] = []

/** PENDIENTE: detalle de seguridad del pago tal como lo indique la pasarela (no inventar sellos) */
export const seguridadPago = null as string | null

/** PENDIENTE: cómo llega el pedido (envío, tiempos, cobertura o descarga digital) */
export const envio = null as string | null

// ---------------------------------------------------------------------------------------------
// Prueba social
// ---------------------------------------------------------------------------------------------
/** PENDIENTE: testimonios reales de lectores. La sección no se publica mientras esté vacía. */
export const testimonios: { texto: string; nombre: string | null; detalle: string | null }[] = []

// ---------------------------------------------------------------------------------------------
// Contacto, redes y políticas
// ---------------------------------------------------------------------------------------------
export const contacto = {
  email: null as string | null,
  /** Número con indicativo, solo dígitos */
  whatsapp: null as string | null,
}

/** URLs completas. Solo se muestran las que tengan valor. */
export const redes: { nombre: 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube' | 'X'; url: string }[] = []

/** URL de la página de políticas (términos, privacidad, devoluciones). */
export const politicasUrl = null as string | null
