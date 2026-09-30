'use client'

import { useEffect, useRef, useState } from 'react'
import { dimensiones, type Dimension } from '@/data/libro'
import { BotonComprar } from './ui/BotonComprar'
import { Rotulo } from './ui/Resaltado'

type Id = Dimension['id']

// Punto del cuerpo (ancla) y posición del nodo, en el viewBox 600 x 660 de la figura
const MAPA: Record<Id, { ancla: [number, number]; nodo: [number, number]; lado: 'izq' | 'der' }> = {
  universo: { ancla: [300, 64], nodo: [92, 96], lado: 'izq' },
  mente: { ancla: [300, 146], nodo: [512, 126], lado: 'der' },
  conciencia: { ancla: [300, 268], nodo: [520, 300], lado: 'der' },
  energia: { ancla: [300, 358], nodo: [84, 334], lado: 'izq' },
  cuerpo: { ancla: [272, 520], nodo: [90, 548], lado: 'izq' },
}
// Recorrido automático de arriba abajo
const ORDEN: Id[] = ['universo', 'mente', 'conciencia', 'energia', 'cuerpo']

// Mitad derecha de la silueta (se refleja para la izquierda)
const MEDIO_CUERPO =
  'M300 104C318 104 329 120 329 144C329 166 321 182 312 189L313 206C328 212 352 214 368 222C384 230 392 246 392 266C396 296 404 322 410 344C416 368 424 398 430 428C436 446 438 466 432 480C426 490 414 488 412 474L408 436C402 408 396 384 390 360C384 336 378 306 372 286C368 276 362 270 356 270C354 300 348 326 346 350C346 372 356 390 360 410C362 440 358 474 352 506C352 532 354 558 348 584C350 592 360 598 362 604L318 604L316 586C312 558 314 530 312 506C310 478 306 452 300 434'

export function Concepto() {
  const [activo, setActivo] = useState<Id>('conciencia')
  // Los pulsos (animaciones infinitas) solo existen mientras la sección se ve
  const [enVista, setEnVista] = useState(false)
  const tocado = useRef(false)
  const raiz = useRef<HTMLElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(([en]) => setEnVista(en.isIntersecting))
    if (raiz.current) io.observe(raiz.current)
    return () => io.disconnect()
  }, [])

  // Recorre los nodos solo mientras la sección está a la vista y nadie ha interactuado
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let timer: number | undefined
    const io = new IntersectionObserver(([en]) => {
      window.clearInterval(timer)
      if (!en.isIntersecting || tocado.current) return
      timer = window.setInterval(() => {
        if (tocado.current) return window.clearInterval(timer)
        setActivo((a) => ORDEN[(ORDEN.indexOf(a) + 1) % ORDEN.length])
      }, 3400)
    }, { threshold: 0.35 })
    if (raiz.current) io.observe(raiz.current)
    return () => {
      io.disconnect()
      window.clearInterval(timer)
    }
  }, [])

  const elegir = (id: Id) => {
    tocado.current = true
    setActivo(id)
  }
  const d = dimensiones.find((x) => x.id === activo)!
  const indice = ORDEN.indexOf(activo) + 1

  return (
    <section ref={raiz} id="concepto" aria-labelledby="concepto-titulo" className="relative overflow-hidden py-24 md:py-36">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_60%_50%,#000_20%,transparent_70%)]" />

      <div className="wrap relative grid items-center gap-12 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10" data-orden="ok">
        {/* Cabecera */}
        <div className="lg:col-span-5 lg:row-start-1 lg:self-end">
          <Rotulo n="02">Concepto</Rotulo>
          <h2 id="concepto-titulo" className="title-section mt-6" data-split>
            ¿Qué hay <span className="hl">detrás</span> de la realidad?
          </h2>
          <div className="mt-6 space-y-1 text-lg text-mist" data-reveal>
            <p>Cuerpo, mente, conciencia, energía y universo.</p>
            <p className="text-bone">Cinco puertas hacia una misma pregunta.</p>
          </div>
        </div>

        {/* Panel de lectura */}
        <div className="lg:col-span-5 lg:row-start-2 lg:self-start">
          <div className="panel corners p-6 md:p-8" data-reveal>
            <p className="hud flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-neon">&gt; Nodo {String(indice).padStart(2, '0')}/05</span>
              <span aria-hidden className="text-line-2">·</span>
              <span className="text-bone">{d.nombre}</span>
            </p>
            <div aria-live="polite" className="min-h-[9.5rem] md:min-h-[8.5rem]">
              <p key={d.id + 'q'} className="mt-4 animate-[hero-rise_.5s_var(--ease-out)_both] font-display text-[1.45rem] leading-snug font-semibold text-bone md:text-[1.7rem]">
                {d.pregunta}
              </p>
              <p key={d.id + 'l'} className="mt-3 animate-[hero-rise_.5s_var(--ease-out)_.08s_both] text-mist">
                {d.lectura}
              </p>
            </div>
            <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-4">
              <span className="hud">Código: {d.codigo}</span>
              <span aria-hidden className="flex gap-1">
                {ORDEN.map((id) => (
                  <span key={id} className={`h-1.5 w-4 transition-colors duration-300 ${id === activo ? 'bg-neon shadow-[0_0_8px_var(--color-neon)]' : 'bg-line-2'}`} />
                ))}
              </span>
            </div>
          </div>

          <div className="mt-8" data-reveal>
            <BotonComprar className="w-full sm:w-auto">Comprar el libro</BotonComprar>
          </div>
        </div>

        {/* Figura + nodos */}
        <div className="max-lg:row-start-2 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <p className="hud mb-4 text-center lg:text-right" data-reveal>
            <span className="[@media(hover:hover)]:hidden">Toca cada nodo</span>
            <span className="hidden [@media(hover:hover)]:inline">Pasa el cursor por cada nodo</span>
          </p>
          <div className="relative mx-auto aspect-[600/660] w-full max-w-[36rem]" data-reveal="scale" data-activo={activo}>
            {/* Órbita en HTML (círculo de Vitrubio, cx 300 cy 352 r 256): gira en la GPU */}
            <span
              aria-hidden
              className={`pointer-events-none absolute rounded-full border border-dashed transition-colors duration-500 motion-safe:animate-[spin-slow_90s_linear_infinite] ${activo === 'universo' ? 'border-neon/70' : 'border-line-2'}`}
              style={{ left: `${(44 / 600) * 100}%`, top: `${(96 / 660) * 100}%`, width: `${(512 / 600) * 100}%`, height: `${(512 / 660) * 100}%` }}
            />
            <Figura activo={activo} />
            {/* Pulso del ancla activa (HTML: escala y opacidad en la GPU) */}
            <span
              aria-hidden
              className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(MAPA[activo].ancla[0] / 600) * 100}%`, top: `${(MAPA[activo].ancla[1] / 660) * 100}%` }}
            >
              {enVista && (
                <span key={activo} className="absolute inset-0 rounded-full border border-neon motion-safe:animate-[pulse-ring_1.6s_ease-out_infinite]" />
              )}
            </span>
            {ORDEN.map((id) => {
              const dim = dimensiones.find((x) => x.id === id)!
              const { nodo, lado } = MAPA[id]
              const on = id === activo
              return (
                <button
                  key={id}
                  type="button"
                  onMouseEnter={() => elegir(id)}
                  onFocus={() => elegir(id)}
                  onClick={() => elegir(id)}
                  aria-pressed={on}
                  aria-label={`${dim.nombre}: ${dim.pregunta}`}
                  className="group absolute flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-[12px] flex-col items-center justify-center gap-1.5 sm:-translate-y-1/2 sm:flex-row sm:gap-3 sm:data-[lado=der]:-translate-x-[10px] sm:data-[lado=izq]:translate-x-[calc(-100%+10px)] sm:data-[lado=izq]:flex-row-reverse"
                  data-lado={lado}
                  style={{ left: `${(nodo[0] / 600) * 100}%`, top: `${(nodo[1] / 660) * 100}%` }}
                >
                  <span
                    aria-hidden
                    className={`relative grid size-5 shrink-0 place-items-center rounded-full border transition-all duration-300 ${on ? 'border-neon bg-neon/15 shadow-[0_0_16px_var(--color-neon)]' : 'border-mist/50 bg-void group-hover:border-neon'}`}
                  >
                    <span className={`size-1.5 rounded-full transition-colors ${on ? 'bg-neon' : 'bg-mist group-hover:bg-neon'}`} />
                    {on && enVista && (
                      <span className="absolute inset-0 rounded-full border border-neon motion-safe:animate-[pulse-ring_1.8s_ease-out_infinite]" />
                    )}
                  </span>
                  <span
                    className={`bg-void/70 px-1.5 font-mono text-[0.62rem] tracking-[0.2em] whitespace-nowrap uppercase transition-colors duration-300 sm:text-[0.7rem] ${on ? 'text-neon' : 'text-mist group-hover:text-bone'}`}
                  >
                    {dim.nombre}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Figura anatómica/espiritual: proporción de Vitrubio, silueta y el haz de luz de la portada */
function Figura({ activo }: { activo: Id }) {
  const neon = 'var(--color-neon)'
  const on = (id: Id) => activo === id
  return (
    <svg viewBox="0 0 600 660" className="absolute inset-0 size-full overflow-visible" aria-hidden focusable="false">
      <defs>
        <linearGradient id="fig-cuerpo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#39ff88" stopOpacity="0.16" />
          <stop offset="0.55" stopColor="#39ff88" stopOpacity="0.06" />
          <stop offset="1" stopColor="#39ff88" stopOpacity="0.01" />
        </linearGradient>
        <linearGradient id="fig-haz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#39ff88" stopOpacity="0" />
          <stop offset="0.2" stopColor="#9dffc6" stopOpacity="0.9" />
          <stop offset="0.75" stopColor="#39ff88" stopOpacity="0.8" />
          <stop offset="1" stopColor="#39ff88" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="fig-halo">
          <stop offset="0" stopColor="#39ff88" stopOpacity="0.55" />
          <stop offset="1" stopColor="#39ff88" stopOpacity="0" />
        </radialGradient>
        <filter id="fig-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Geometría: círculo y cuadrado de Vitrubio, marcas de grados */}
      <g fill="none" stroke="#1d3a2b">
        <circle cx="300" cy="352" r="196" strokeOpacity="0.7" />
        <rect x="44" y="96" width="512" height="512" strokeOpacity="0.55" />
        <path d="M300 88v20M300 596v20M36 352h20M544 352h20" stroke="#39ff88" strokeOpacity="0.4" />
      </g>

      {/* Silueta (mitad derecha + reflejo) */}
      <g
        className="transition-[opacity] duration-500"
        fill="url(#fig-cuerpo)"
        stroke={on('cuerpo') ? neon : '#a8b5ad'}
        strokeOpacity={on('cuerpo') ? 0.95 : 0.42}
        strokeWidth="1.3"
        strokeLinejoin="round"
      >
        <path d={MEDIO_CUERPO} />
        <path d={MEDIO_CUERPO} transform="translate(600 0) scale(-1 1)" />
      </g>

      {/* Haz de luz central (como la portada) */}
      <line x1="300" y1="40" x2="300" y2="640" stroke="url(#fig-haz)" strokeWidth={on('energia') ? 3 : 1.6} className="transition-[stroke-width] duration-500" />
      <line x1="300" y1="40" x2="300" y2="640" stroke="url(#fig-haz)" strokeWidth="6" filter="url(#fig-glow)" opacity={on('energia') ? 0.9 : 0.35} />

      {/* Focos de luz: cabeza, pecho, plexo */}
      <circle cx="300" cy="146" r={on('mente') ? 46 : 30} fill="url(#fig-halo)" className="transition-[r] duration-500" opacity={on('mente') ? 1 : 0.45} />
      <circle cx="300" cy="268" r={on('conciencia') ? 60 : 34} fill="url(#fig-halo)" className="transition-[r] duration-500" opacity={on('conciencia') ? 1 : 0.55} />
      <circle cx="300" cy="358" r={on('energia') ? 50 : 26} fill="url(#fig-halo)" className="transition-[r] duration-500" opacity={on('energia') ? 1 : 0.4} />
      {/* Destello del pecho (la luz de la portada) */}
      <path d="M300 250l4 14 14 4-14 4-4 14-4-14-14-4 14-4z" fill="#eafff3" opacity="0.9" />
      {/* Estrella del universo, sobre la cabeza */}
      <path d="M300 52l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill={on('universo') ? '#39ff88' : '#eef2ee'} className="transition-[fill] duration-500" />

      {/* Conexiones nodo -> ancla */}
      {ORDEN.map((id) => {
        const { ancla, nodo } = MAPA[id]
        const activa = on(id)
        return (
          <g key={id}>
            <line
              x1={nodo[0]}
              y1={nodo[1]}
              x2={ancla[0]}
              y2={ancla[1]}
              stroke={activa ? neon : '#2a4a3a'}
              strokeWidth={activa ? 1.4 : 1}
              strokeDasharray={activa ? '400' : '3 6'}
              strokeDashoffset={0}
              className={activa ? 'animate-[draw_.7s_var(--ease-out)_both]' : ''}
              style={activa ? { filter: 'drop-shadow(0 0 4px #39ff88)' } : undefined}
            />
            <circle cx={ancla[0]} cy={ancla[1]} r={activa ? 5 : 3.2} fill={activa ? neon : '#a8b5ad'} className="transition-all duration-300" />
          </g>
        )
      })}
    </svg>
  )
}
