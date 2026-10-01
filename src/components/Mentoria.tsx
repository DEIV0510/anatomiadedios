import { BookOpen, MessageCircle } from 'lucide-react'
import { ediciones, libro } from '@/data/libro'
import { media } from '@/lib/media'
import { numeroSeccion } from '@/lib/navegacion'
import { anclas } from '@/lib/site'
import { CompraMentoria } from './ui/CompraMentoria'
import { Picture } from './ui/Picture'
import { Rotulo } from './ui/Resaltado'

/**
 * La mentoría personalizada con sección propia (dentro de «Elige tu experiencia» pasaba
 * desapercibida). La foto es la del libro: el autor con ANATOMÍA DE DIOS en la mano, enmarcada
 * como una transmisión de la interfaz, con la barra autor ⟷ lector debajo para no tapar el libro
 * ni la mano. Solo datos reales: acompañamiento del autor, dos transmisiones, se pide por WhatsApp.
 * En móvil: título → foto → datos y compra. En escritorio: foto a la izquierda.
 */
export function Mentoria() {
  if (!ediciones.some((e) => e.tipo === 'mentoria')) return null

  return (
    <section id={anclas.mentoria} aria-labelledby="mentoria-titulo" className="relative isolate overflow-hidden py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-2 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-[30%] -z-10 size-[64rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(57_255_136/0.08),transparent_70%)]"
      />

      <div className="wrap grid gap-y-12 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10 xl:gap-x-16">
        {/* Título */}
        <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:self-end">
          <Rotulo n={numeroSeccion(anclas.mentoria)}>Mentoría</Rotulo>
          <h2 id="mentoria-titulo" className="title-section mt-6" data-split>
            Del libro al <span className="hl">autor</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-mist md:text-xl" data-reveal>
            El acompañamiento personalizado del autor, {libro.autorNombre}:{' '}
            <span className="text-bone">dos transmisiones entre el autor y tú.</span>
          </p>
        </div>

        {/* La transmisión: foto real + barra autor ⟷ lector */}
        <figure className="relative mx-auto w-full max-w-[30rem] lg:col-span-6 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-center xl:col-span-5" data-reveal>
          <div className="relative overflow-hidden border border-neon/40 bg-abyss shadow-[0_0_90px_-30px_rgb(57_255_136/0.6)]">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Picture
                img={media.autor}
                alt={`${libro.autorNombre} con su libro ${libro.titulo}`}
                sizes="(min-width: 1280px) 500px, (min-width: 1024px) 45vw, (min-width: 540px) 480px, 92vw"
                className="absolute inset-0"
                imgClassName="size-full object-cover"
                placeholder
              />
              {/* Integración con la interfaz: velos, verde en los bordes, barrido y esquinas */}
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,rgb(2_4_3/0.55)_0%,transparent_15%,transparent_72%,rgb(2_4_3/0.6)_100%)]"
              />
              <div aria-hidden className="absolute inset-0 shadow-[inset_0_0_110px_-24px_rgb(57_255_136/0.32)]" />
              <div aria-hidden className="scanlines absolute inset-0 opacity-35" />
              <div aria-hidden className="mentoria-barrido" />
              <div aria-hidden className="corners absolute inset-3 [--l:22px]" />
              <div aria-hidden className="absolute inset-x-5 top-5 flex items-center justify-between gap-4 md:inset-x-6 md:top-6">
                <p className="hud text-bone">
                  <span className="text-neon">&gt;</span> Canal 1:1
                </p>
                <p className="hud flex items-center gap-2 text-bone">
                  <span className="size-1.5 bg-neon shadow-[0_0_8px_var(--color-neon)]" /> Tx 01 · Tx 02
                </p>
              </div>
            </div>

            {/* Barra de la transmisión */}
            <figcaption className="relative flex items-center gap-3 border-t border-neon/30 bg-deep/90 px-5 py-4 md:gap-4 md:px-6">
              <span className="sr-only">Transmisiones entre el autor, {libro.autorNombre}, y el lector.</span>
              <span aria-hidden className="min-w-0">
                <span className="hud block text-neon">Autor</span>
                <span className="mt-1 block max-w-[11rem] font-display text-base leading-tight font-bold text-balance text-bone md:text-lg">{libro.autorNombre}</span>
              </span>
              <span aria-hidden className="mentoria-linea relative h-px min-w-8 flex-1">
                <span className="mentoria-pulso mentoria-pulso--ida">
                  <span />
                </span>
                <span className="mentoria-pulso mentoria-pulso--vuelta">
                  <span />
                </span>
              </span>
              <span aria-hidden className="flex shrink-0 flex-col items-center gap-1.5">
                <span className="grid size-12 place-items-center border border-dashed border-neon/60 bg-void/80">
                  <BookOpen className="size-5 text-bone" strokeWidth={1.25} />
                </span>
                <span className="font-mono text-[0.6rem] tracking-[0.26em] text-bone uppercase">Lector</span>
              </span>
            </figcaption>
          </div>
        </figure>

        {/* Datos y compra */}
        <div className="lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:self-start">
          <ul className="grid grid-cols-3 gap-px border border-line bg-line" data-reveal>
            <Dato valor="02">Transmisiones</Dato>
            <Dato valor="1:1">
              Autor <span aria-hidden>⟷</span>
              <span className="sr-only">y</span> lector
            </Dato>
            <Dato valor={<MessageCircle aria-hidden className="size-8" strokeWidth={1.25} />}>Por WhatsApp</Dato>
          </ul>
          <CompraMentoria className="mt-10 max-w-lg" />
        </div>
      </div>
    </section>
  )
}

function Dato({ valor, children }: { valor: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex flex-col gap-3 bg-void/90 px-3 py-5 sm:px-4 md:px-5">
      <span className="flex h-9 items-center font-display text-3xl leading-none font-bold text-neon [text-shadow:0_0_24px_rgb(57_255_136/0.35)] md:h-10 md:text-4xl">
        {valor}
      </span>
      {/* En 360 px «TRANSMISIONES» cabe en su celda con menos espaciado */}
      <span className="hud text-[0.58rem] tracking-[0.12em] text-mist sm:text-[0.62rem] sm:tracking-[0.22em]">{children}</span>
    </li>
  )
}
