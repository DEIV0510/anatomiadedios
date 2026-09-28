# ANATOMÍA DE DIOS — landing de venta

Landing inmersiva para vender el libro **ANATOMÍA DE DIOS** de **Elkin Ferney Gomez Medina**.
Estética de «interfaz secreta»: negro, verde neón como luz de acento y el dorado de la portada en detalles.

- Next.js 16 (App Router, export estático) + React 19 + Tailwind CSS 4
- GSAP + ScrollTrigger + SplitText (cargados en un solo bloque diferido), Lucide
- Sin servidor: se publica en Vercel, Netlify, Hostinger o cualquier hosting estático

## Comandos

```bash
npm install
npm run dev        # http://localhost:5431 (muestra los datos pendientes)
npm run build      # genera out/ (sitio estático listo para subir)
npm start          # sirve out/ en http://localhost:5432
npm run assets     # regenera video, imágenes, favicon y Open Graph desde assets/source
```

## De dónde sale cada cosa

Material original (carpeta `libro` del cliente) copiado en `assets/source/`:

| Archivo | Uso |
| --- | --- |
| `hero.mp4` | Video del hero: AV1 + H.264, versión 1280×720 y recorte vertical 576×720 para móvil, sin audio (4,6 MB → 0,5–1,2 MB) |
| `libro-mockup.png` | Tarjeta del producto, imagen Open Graph y la portada **aplanada** (solo se deshizo la perspectiva del mockup, sin redibujar) para el libro 3D |

Todos los textos y datos de la página están en **`src/data/libro.ts`**, marcados según su origen:
`[portada]`, `[video]` o `[brief]`. Nada se inventó: lo que no aparece en los materiales quedó en `null`.

## Datos pendientes (completar en `src/data/libro.ts`)

Mientras falten, esas piezas **no se publican** (en `npm run dev` se ven como «PENDIENTE» y hay un panel con la lista):

| Dato | Campo | Qué se activa al completarlo |
| --- | --- | --- |
| Link de pago o WhatsApp de ventas | `checkout.url` / `checkout.whatsapp` | Los botones COMPRAR llevan al pago |
| Precio | `ediciones[0].precio` | Precio en tarjeta, compra rápida, barra móvil, FAQ y datos estructurados |
| Formato (físico, digital…) | `ediciones[0].formato` | Tarjeta y FAQ |
| Otras ediciones o combos | `ediciones` | Tarjetas seleccionables |
| Testimonios reales | `testimonios` | Sección «Quienes ya cruzaron el umbral» |
| Métodos de pago y seguridad | `metodosPago`, `seguridadPago` | Sección «Métodos de pago y seguridad» |
| Envío o entrega | `envio` | FAQ |
| Texto de confianza | `confianza.compra` | Bajo los botones de compra |
| Contacto, redes, políticas | `contacto`, `redes`, `politicasUrl` | Footer y FAQ |
| Sinopsis y ficha técnica (opcional) | `libro.sinopsis`, `libro.ficha` | Sección «Más que un libro» |

El checkout acepta cualquier pasarela con link (Wompi, Mercado Pago, Hotmart, Shopify, Stripe…); el link admite
`{cantidad}` y `{edicion}`. Con WhatsApp, el pedido llega armado (edición, cantidad y total).

## Dominio

Define `NEXT_PUBLIC_SITE_URL` con el dominio real (canonical, Open Graph, sitemap y datos estructurados).
Por defecto: `https://anatomiadedios.vercel.app`.
