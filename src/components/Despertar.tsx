import { ArrowDown } from 'lucide-react'
import { narrativa } from '@/data/libro'
import { anclas } from '@/lib/site'
import { BotonComprar } from './ui/BotonComprar'
import { Conejo } from './ui/Marca'
import { Resaltado, Rotulo } from './ui/Resaltado'
import { numeroSeccion } from '@/lib/navegacion'

/**
 * Transición narrativa: mucho espacio negativo y el texto que aparece al hacer scroll.
 * En escritorio la sección se fija y el texto se «enciende» palabra a palabra (GSAP);
 * sin JS o con «reducir movimiento» todo se ve normal.
 */
export function Despertar() {
  const t = narrativa.despertar
  return (
    <section id={anclas.descubre} aria-labelledby="despertar-titulo" className="relative isolate overflow-hidden bg-void" data-despertar>
      <canvas data-rain="despertar" aria-hidden className="code-rain -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,#000_10%,transparent_75%)]" />
      <div aria-hidden className="noise pointer-events-none absolute inset-0 -z-10" />

      <div className="wrap flex min-h-[100svh] flex-col justify-center py-28 md:py-36" data-despertar-pin>
        <Rotulo n={numeroSeccion(anclas.descubre)}>Transmisión entrante</Rotulo>

        {/* DESPERTAR: contorno que se llena de luz al avanzar */}
        <h2
          id="despertar-titulo"
          aria-label={t.titulo}
          className="relative mt-8 w-fit font-display text-[clamp(2.9rem,13.4vw,12.25rem)] leading-[0.85] font-black tracking-[-0.02em] uppercase"
        >
          <span aria-hidden className="block text-transparent [-webkit-text-stroke:1px_rgb(237_242_238/0.28)]">
            {t.titulo}
          </span>
          <span
            aria-hidden
            data-despertar-fill
            data-glitch
            data-text={t.titulo}
            className="glitch absolute inset-0 block text-bone [clip-path:inset(0_0_0_0)]"
          >
            {t.titulo}
          </span>
        </h2>

        <div className="mt-12 grid gap-10 md:mt-20 md:grid-cols-12">
          <div className="md:col-span-8 md:col-start-5">
            <p className="font-display text-[clamp(1.55rem,3.3vw,3rem)] leading-[1.18] font-semibold text-bone" data-words>
              {t.lineas.map((l, i) => (
                <span key={i} className="block">
                  <Resaltado texto={l} />
                </span>
              ))}
            </p>

            <p className="mt-12 font-mono text-sm tracking-[0.32em] text-mist uppercase md:mt-16 md:text-base" data-reveal>
              <span className="text-neon">&gt;</span> {t.eleccion}
            </p>

            <a
              href={`#${anclas.libro}`}
              className="group mt-6 inline-flex min-h-12 items-center gap-4 text-bone transition-colors hover:text-neon"
              data-reveal
            >
              <Conejo className="size-10 text-bone drop-shadow-[0_0_14px_rgba(237,242,238,0.45)] transition-transform duration-500 group-hover:-translate-y-1.5 md:size-12" />
              <span className="font-display text-xl font-semibold md:text-2xl">{t.conejo}</span>
              <ArrowDown aria-hidden className="size-5 text-neon transition-transform duration-300 group-hover:translate-y-1" strokeWidth={1.5} />
            </a>

            <p className="mt-14 max-w-[32rem] font-display text-[clamp(1.35rem,2.4vw,2.1rem)] leading-snug font-semibold text-bone md:mt-20" data-reveal>
              <Resaltado texto={t.pregunta} />
            </p>
            <div className="mt-8" data-reveal>
              <BotonComprar>Comprar el libro</BotonComprar>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
