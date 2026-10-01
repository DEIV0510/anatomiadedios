import { libro, portadaCapas } from '@/data/libro'
import { media } from '@/lib/media'
import { anclas } from '@/lib/site'
import { BotonComprar } from './ui/BotonComprar'
import { Pendiente } from './ui/Pendiente'
import { Picture } from './ui/Picture'
import { Rotulo } from './ui/Resaltado'
import { numeroSeccion } from '@/lib/navegacion'

/**
 * El libro como protagonista: libro 3D de CSS con la portada real. Reacciona al cursor
 * (inclinación), gira despacio con el scroll y muestra un «escaneo» de lo que hay en la
 * portada (datos del brief y de la propia imagen). La lógica de movimiento vive en motion/.
 */
export function MasQueUnLibro() {
  return (
    <section id={anclas.libro} aria-labelledby="libro-titulo" className="relative overflow-hidden py-24 md:py-36" data-libro>
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-[62%] -z-10 size-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(217_173_85/0.07),transparent_70%)]"
      />
      <div className="wrap grid items-center gap-14 lg:grid-cols-12 lg:gap-6" data-libro-pin>
        <div className="lg:col-span-4">
          <Rotulo n={numeroSeccion(anclas.libro)}>El libro</Rotulo>
          <h2 id="libro-titulo" className="title-section mt-6" data-split>
            Más que un <span className="hl">libro</span>
          </h2>
          <div className="mt-6 space-y-2 text-lg text-mist" data-reveal>
            <p>Mundo moderno y naturaleza.</p>
            <p>Un rostro dividido por la luz.</p>
            <p className="text-bone">Cada detalle de la portada es una pista.</p>
          </div>

          {libro.sinopsis ? (
            <p className="mt-6 max-w-md text-mist" data-reveal>
              {libro.sinopsis}
            </p>
          ) : (
            <Pendiente dato="sinopsis oficial (opcional)" className="mt-6" />
          )}

          {libro.ficha.length > 0 ? (
            <dl className="mt-8 grid grid-cols-2 gap-px border border-line bg-line" data-reveal>
              {libro.ficha.map((f) => (
                <div key={f.etiqueta} className="bg-void p-4">
                  <dt className="hud">{f.etiqueta}</dt>
                  <dd className="mt-1 text-bone">{f.valor}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <Pendiente dato="ficha técnica: páginas, formato, ISBN" className="mt-3" />
          )}

          <div className="mt-10 hidden lg:block" data-reveal>
            <BotonComprar>Comprar el libro</BotonComprar>
          </div>
        </div>

        {/* Escenario 3D */}
        <div className="relative lg:col-span-8" data-libro-stage>
          <p className="hud mb-6 text-center" data-reveal>
            <span className="text-neon">&gt;</span> Escaneo de portada
            <span className="hidden [@media(hover:hover)]:inline"> · mueve el cursor</span>
          </p>
          <div className="grid place-items-center py-6 lg:py-10">
            <div className="float">
              <div className="book3d [--w:min(62vw,15.5rem)] sm:[--w:17rem] lg:[--w:19.5rem] xl:[--w:21rem]" data-book>
                <div aria-hidden className="book3d__glow" />
                <div className="book3d__body" data-book-body>
                  <div className="book3d__face book3d__back" />
                  <div className="book3d__face book3d__spine" />
                  <div className="book3d__face book3d__pages" />
                  <div className="book3d__face book3d__top" />
                  <div className="book3d__face book3d__front">
                    <Picture
                      img={media.cover}
                      alt={`Portada del libro ${libro.titulo} de ${libro.autorNombre}`}
                      sizes="(min-width: 1280px) 336px, (min-width: 1024px) 312px, (min-width: 640px) 272px, 62vw"
                      placeholder
                    />
                    <div aria-hidden className="book3d__sheen" />
                  </div>
                  <div aria-hidden className="book3d__notes">
                    {portadaCapas.map((c, i) => (
                      <div
                        key={c.id}
                        className={`note note--${c.lado}`}
                        data-note
                        style={
                          {
                            left: `${c.x * 100}%`,
                            top: `${c.y * 100}%`,
                            '--reach': `calc(var(--w) * ${c.lado === 'izquierda' ? c.x : 1 - c.x} + 2.5rem)`,
                          } as React.CSSProperties
                        }
                      >
                        <span className="note__line" data-note-line />
                        <span className="note__dot">{String(i + 1).padStart(2, '0')}</span>
                        <span className="note__label">{c.rotulo}</span>
                        <span className="note__sub">{c.detalle}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div aria-hidden className="book3d__shadow" />
              </div>
            </div>
          </div>

          {/* Leyenda (hasta 1279 px; en pantallas anchas los rótulos van sobre el libro) */}
          <ol className="mt-10 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 xl:sr-only" data-reveal>
            {portadaCapas.map((c, i) => (
              <li key={c.id} className="flex items-baseline gap-4 bg-void px-4 py-3.5">
                <span className="font-mono text-xs text-neon">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block font-mono text-[0.72rem] tracking-[0.2em] text-bone uppercase">{c.rotulo}</span>
                  <span className="text-sm text-dim">{c.detalle}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-10 lg:hidden" data-reveal>
            <BotonComprar className="w-full sm:w-auto">Comprar el libro</BotonComprar>
          </div>
        </div>
      </div>
    </section>
  )
}
