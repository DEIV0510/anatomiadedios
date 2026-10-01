import { Atom, Box, Eye, Rabbit, Sparkles } from 'lucide-react'
import { ejes } from '@/data/libro'
import { anclas } from '@/lib/site'
import { BotonComprar } from './ui/BotonComprar'
import { Rotulo } from './ui/Resaltado'
import { numeroSeccion } from '@/lib/navegacion'

const ICONOS = { atom: Atom, sparkles: Sparkles, eye: Eye, box: Box, rabbit: Rabbit }

/**
 * Los cinco ejes del libro como bloques grandes. Al hacer scroll se enciende en verde el
 * bloque que cruza el centro de la pantalla y los demás se oscurecen (motion/enhance).
 * Sin JS todos quedan visibles.
 */
export function Contenido() {
  return (
    <section id={anclas.contenido} aria-labelledby="contenido-titulo" className="relative py-24 md:py-36">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Rotulo n={numeroSeccion(anclas.contenido)}>Contenido</Rotulo>
            <h2 id="contenido-titulo" className="title-section mt-6" data-split>
              Lo que encontrarás <span className="hl">dentro</span>
            </h2>
          </div>
          <p className="max-w-md self-end text-lg text-mist lg:col-span-4 lg:col-start-9" data-reveal>
            Ciencia, espiritualidad, conciencia, realidad y despertar. <span className="text-bone">Un solo hilo los une.</span>
          </p>
        </div>

        <ol className="mt-14 border-t border-line md:mt-20" data-ejes>
          {ejes.map((e) => {
            const Icono = ICONOS[e.icono]
            return (
              <li key={e.n} className="eje group relative border-b border-line" data-eje>
                {/* Barrido de luz del bloque activo */}
                <span aria-hidden className="eje__glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500" />
                <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-2 py-7 md:grid-cols-[6rem_1fr_1.1fr_auto] md:gap-x-8 md:py-10">
                  <span className="eje__n font-mono text-sm tracking-[0.2em] md:text-base">{e.n}</span>
                  <h3 className="eje__t font-display text-[clamp(1.7rem,5.4vw,4.2rem)] leading-none font-bold tracking-[-0.01em]">{e.titulo}</h3>
                  <span
                    aria-hidden
                    className="eje__i corners row-span-2 grid size-12 place-items-center md:order-last md:row-span-1 md:size-16"
                  >
                    <Icono className="size-5 md:size-6" strokeWidth={1.25} />
                  </span>
                  <p className="eje__p col-start-2 md:col-start-3 md:row-start-1 md:text-lg">{e.texto}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between" data-reveal>
          <p className="font-display text-2xl font-semibold text-bone md:text-3xl">¿Quieres descubrir qué hay dentro?</p>
          <BotonComprar className="w-full sm:w-auto">Abrir el libro</BotonComprar>
        </div>
      </div>
    </section>
  )
}
