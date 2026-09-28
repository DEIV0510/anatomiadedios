import { ChevronDown } from 'lucide-react'
import { confianza, libro } from '@/data/libro'
import { media, srcSet } from '@/lib/media'
import { anclas } from '@/lib/site'
import { BotonComprar } from './ui/BotonComprar'
import { Pendiente } from './ui/Pendiente'
import { HeroVideo } from './HeroVideo'

// Pocas partículas, posiciones fijas (sin aleatorio: mismo HTML en servidor y cliente)
const PARTICULAS = [
  { l: 8, b: 18, t: 16, d: 0, x: 18, o: 0.5 },
  { l: 17, b: 6, t: 19, d: 3.2, x: -10, o: 0.35 },
  { l: 29, b: 26, t: 14, d: 6.1, x: 14, o: 0.6 },
  { l: 41, b: 10, t: 21, d: 1.4, x: -16, o: 0.4 },
  { l: 55, b: 30, t: 17, d: 8.3, x: 10, o: 0.55 },
  { l: 63, b: 8, t: 15, d: 4.6, x: -12, o: 0.45 },
  { l: 72, b: 22, t: 20, d: 2.2, x: 16, o: 0.5 },
  { l: 81, b: 12, t: 18, d: 7.4, x: -8, o: 0.4 },
  { l: 90, b: 28, t: 16, d: 5.3, x: 12, o: 0.55 },
  { l: 96, b: 4, t: 22, d: 9.6, x: -14, o: 0.35 },
]

export function Hero() {
  const d = media.hero.desktop.poster
  const m = media.hero.mobile.poster
  return (
    <section id={anclas.inicio} aria-labelledby="hero-titulo" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* ---------- Video a sangre: en móvil ocupa la parte alta y se funde en negro ---------- */}
      <div className="hero-media absolute inset-x-0 top-0 z-0 h-[72%] md:inset-0 md:h-auto">
        <picture>
          <source media="(max-width: 767px)" type="image/avif" srcSet={m.variants.map((v) => v.avif).join(', ')} />
          <source media="(max-width: 767px)" type="image/webp" srcSet={m.variants.map((v) => v.webp).join(', ')} />
          <source type="image/avif" srcSet={srcSet(d, 'avif')} sizes="100vw" />
          <source type="image/webp" srcSet={srcSet(d, 'webp')} sizes="100vw" />
          <img
            src={d.variants[d.variants.length - 1].webp}
            alt=""
            width={d.width}
            height={d.height}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <HeroVideo
          desktop={{ av1: media.hero.desktop.av1, h264: media.hero.desktop.h264 }}
          mobile={{ av1: media.hero.mobile.av1, h264: media.hero.mobile.h264 }}
        />
        {/* Velos: legibilidad del texto sin tapar el libro */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(2_4_3/0.75)_0%,transparent_22%,transparent_52%,var(--color-void)_97%)] md:bg-[linear-gradient(90deg,var(--color-void)_0%,rgb(2_4_3/0.88)_24%,rgb(2_4_3/0.45)_44%,transparent_62%),linear-gradient(0deg,var(--color-void)_0%,transparent_26%),linear-gradient(180deg,rgb(2_4_3/0.7)_0%,transparent_18%)]"
        />
        <div aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-50" />
      </div>

      {/* Código muy oscuro, solo del lado del texto */}
      <canvas
        data-rain="hero"
        aria-hidden
        className="code-rain z-0 opacity-20 [mask-image:linear-gradient(0deg,#000_0%,#000_22%,transparent_50%)] md:opacity-35 md:[mask-image:linear-gradient(90deg,#000_0%,#000_18%,transparent_46%)]"
      />

      {/* Partículas */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {PARTICULAS.map((p, i) => (
          <span
            key={i}
            className={`particle ${i % 2 ? 'max-md:hidden' : ''}`}
            style={
              {
                left: `${p.l}%`,
                bottom: `${p.b}%`,
                '--t': `${p.t}s`,
                '--d': `${p.d}s`,
                '--x': `${p.x}px`,
                '--o': p.o,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Marco HUD */}
      <div aria-hidden className="corners pointer-events-none absolute inset-3 z-0 [--l:22px] md:inset-5" />

      {/* ---------- Contenido ---------- */}
      {/* Anclado desde arriba (no con mt-auto): si al cargar la fuente cambia la altura del
          bloque, no se desplaza todo el texto (CLS) */}
      <div className="wrap relative z-10 max-w-none pt-[max(calc(var(--nav-h)+8rem),calc(100svh-22.5rem))] pb-[max(2.25rem,env(safe-area-inset-bottom))] md:pt-[max(calc(var(--nav-h)+3rem),calc(50svh-15.5rem))] md:pb-24">
        <div className="max-w-[37rem] lg:max-w-[40rem]">
          <p className="hud hero-rise flex items-center gap-3 whitespace-nowrap" style={{ '--d': '0s' } as React.CSSProperties}>
            <span aria-hidden className="size-1.5 animate-pulse bg-neon shadow-[0_0_10px_var(--color-neon)]" />
            Archivo 001 <span aria-hidden className="text-line-2">/</span> Acceso concedido
          </p>

          <h1
            id="hero-titulo"
            aria-label={libro.titulo}
            className="hero-reveal mt-5 font-display text-[clamp(2.9rem,12.6vw,4.4rem)] leading-[0.9] font-extrabold tracking-[-0.01em] text-bone uppercase md:text-[clamp(3.6rem,6.1vw,7.4rem)]"
          >
            <span aria-hidden data-glitch className="glitch block" data-text="ANATOMÍA">
              ANATOMÍA
            </span>
            <span aria-hidden data-glitch className="glitch block" data-text="DE DIOS">
              DE <span className="text-neon [text-shadow:0_0_30px_rgb(57_255_136/0.45)]">DIOS</span>
            </span>
          </h1>

          <p
            className="hero-rise mt-5 max-w-[30rem] text-[0.84rem] leading-relaxed font-medium tracking-[0.14em] text-mist uppercase md:mt-7 md:text-[0.95rem]"
            style={{ '--d': '0.15s' } as React.CSSProperties}
          >
            La evidencia oculta que une la <span className="hl">ciencia</span> y la <span className="hl">espiritualidad</span>
          </p>

          <div className="hero-rise mt-7 md:mt-10" style={{ '--d': '0.3s' } as React.CSSProperties}>
            <BotonComprar size="xl" className="w-full sm:w-auto">
              Comprar el libro
            </BotonComprar>
          </div>

          <div
            className="hero-rise mt-5 flex flex-wrap items-center gap-x-4 gap-y-2"
            style={{ '--d': '0.42s' } as React.CSSProperties}
          >
            <p className="hud">
              Por <span className="text-bone">{libro.autor}</span>
            </p>
            {confianza.compra ? <p className="hud text-mist">{confianza.compra}</p> : <Pendiente dato="texto de confianza" />}
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <a
        href={`#${anclas.descubre}`}
        className="hero-rise absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-dim transition-colors hover:text-neon md:flex"
        style={{ '--d': '0.6s' } as React.CSSProperties}
      >
        <span className="hud text-[0.62rem]">Desliza para despertar</span>
        <ChevronDown aria-hidden className="size-4 animate-bounce" strokeWidth={1.5} />
      </a>
    </section>
  )
}
