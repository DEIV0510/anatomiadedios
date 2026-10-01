import { ArrowRight } from 'lucide-react'
import { confianza, ediciones, libro, narrativa } from '@/data/libro'
import { anclas } from '@/lib/site'
import { AvatarAutor } from './ui/AvatarAutor'
import { BotonComprar } from './ui/BotonComprar'
import { Conejo } from './ui/Marca'
import { Pendiente } from './ui/Pendiente'

/** Cierre: fondo negro, código que cae despacio, el conejo blanco y el CTA más grande */
export function CtaFinal() {
  const t = narrativa.final
  const mentoria = ediciones.find((e) => e.tipo === 'mentoria')
  return (
    <section id={anclas.despierta} aria-labelledby="despierta-titulo" className="relative isolate overflow-hidden bg-void py-28 md:py-44">
      <canvas data-rain="final" aria-hidden className="code-rain -z-10 opacity-70 [mask-image:radial-gradient(ellipse_at_center,#000_15%,transparent_78%)]" />
      <div aria-hidden className="scanlines pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(57_255_136/0.12),transparent)]"
      />

      <div className="wrap flex flex-col items-center text-center">
        <div className="relative" data-reveal>
          <Conejo className="size-14 text-bone drop-shadow-[0_0_18px_rgba(237,242,238,0.5)] md:size-16" />
        </div>
        <h2
          id="despierta-titulo"
          aria-label={t.titulo}
          className="mt-8 font-display text-[clamp(3.4rem,14vw,11rem)] leading-[0.88] font-black tracking-[-0.02em] text-bone uppercase"
          data-reveal="scale"
        >
          <span aria-hidden data-glitch data-text={t.titulo} className="glitch glitch-hover block">
            {t.titulo}
          </span>
        </h2>
        <p className="mt-8 max-w-xl text-xl text-mist md:text-2xl" data-reveal>
          {t.texto}
        </p>
        <div className="mt-12 w-full sm:w-auto" data-reveal>
          <BotonComprar size="xl" className="w-full sm:w-auto" label={`Comprar ${libro.titulo}`}>
            Comprar {libro.titulo}
          </BotonComprar>
        </div>
        <div className="mt-6" data-reveal>
          {confianza.compra ? <p className="hud text-mist">{confianza.compra}</p> : <Pendiente dato="texto de confianza" />}
        </div>

        {/* Acceso secundario a la mentoría: abre la compra rápida con ella elegida */}
        {mentoria && (
          <div className="mt-12 flex w-full flex-col items-center gap-4 border-t border-line pt-10 sm:w-auto sm:px-10" data-reveal>
            <p className="hud">
              <span className="text-neon">&gt;</span> ¿Quieres el acompañamiento del autor?
            </p>
            <a
              href={`#${anclas.mentoria}`}
              data-comprar={mentoria.id}
              className="btn-ghost group min-h-14 w-full gap-4 py-2 pr-5 pl-2 sm:w-auto"
            >
              <AvatarAutor className="size-10" />
              <span>Mentoría personalizada</span>
              <ArrowRight aria-hidden className="ml-auto size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
