'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

type Fuente = { av1: string; h264: string }
type Estado = 'espera' | 'cargando' | 'reproduciendo' | 'pausado' | 'bloqueado' | 'error' | 'omitido'

const AV1 = 'video/mp4; codecs="av01.0.05M.08"'
const MOVIL = '(max-width: 767px)'

/**
 * Video del hero. El póster (<picture> del servidor) pinta al instante; el video se pide
 * después de hidratar, en la versión que toca (AV1 si el navegador la decodifica, si no H.264;
 * recorte vertical en móvil). Arranca solo también con «reducir movimiento» (es el video que
 * pidió el cliente, corto y mudo) y siempre se puede pausar (WCAG 2.2.2). Si el navegador
 * bloquea el autoplay, aparece un play grande y arranca con el primer toque en cualquier parte.
 * Con ahorro de datos o 2G se queda en el póster. Fuera de pantalla se pausa.
 */
export function HeroVideo({ desktop, mobile }: { desktop: Fuente; mobile: Fuente }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [estado, setEstado] = useState<Estado>('espera')
  const pausadoPorUsuario = useRef(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    // iOS y los WebViews miran el ATRIBUTO muted; React solo fija la propiedad
    v.defaultMuted = true
    v.muted = true
    v.setAttribute('muted', '')

    const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
    if (c?.saveData || /2g/.test(c?.effectiveType ?? '')) {
      const t = window.setTimeout(() => setEstado('omitido'), 0)
      return () => window.clearTimeout(t)
    }
    const mq = matchMedia(MOVIL)
    const av1 = v.canPlayType(AV1) !== ''

    // Autoplay bloqueado: el primer toque o tecla en la página lo arranca
    const primerGesto = (e: Event) => {
      if ((e.target as Element | null)?.closest?.('[data-video-toggle]')) return
      quitarGesto()
      if (v.paused && !pausadoPorUsuario.current) reproducir()
    }
    const quitarGesto = () => {
      document.removeEventListener('pointerdown', primerGesto)
      document.removeEventListener('keydown', primerGesto)
    }
    const reproducir = () => {
      setEstado('cargando')
      v.play().catch((err: unknown) => {
        if ((err as DOMException)?.name === 'NotAllowedError') {
          setEstado('bloqueado')
          document.addEventListener('pointerdown', primerGesto, { passive: true })
          document.addEventListener('keydown', primerGesto)
        } else setEstado('pausado')
      })
    }
    const cargar = (autoplay: boolean) => {
      const f = mq.matches ? mobile : desktop
      const src = av1 ? f.av1 : f.h264
      if (v.getAttribute('src') !== src) v.src = src
      if (autoplay) reproducir()
    }

    const onPlaying = () => setEstado('reproduciendo')
    const onPause = () => setEstado((s) => (s === 'error' || s === 'bloqueado' ? s : 'pausado'))
    const onError = () => setEstado('error')
    v.addEventListener('playing', onPlaying)
    v.addEventListener('pause', onPause)
    v.addEventListener('error', onError)

    // Arranque fuera del cuerpo del efecto (después del primer pintado)
    const arranque = window.setTimeout(() => cargar(true), 0)

    // Cambio de orientación/tamaño que cruza el punto de corte: otra versión del video
    const onMq = () => {
      if (!v.getAttribute('src')) return
      const seguir = !v.paused
      v.removeAttribute('src')
      cargar(seguir)
    }
    mq.addEventListener('change', onMq)

    // Fuera de pantalla no se decodifica nada
    const io = new IntersectionObserver(([en]) => {
      if (!v.getAttribute('src') || pausadoPorUsuario.current) return
      if (en.isIntersecting) v.play().catch(() => {})
      else v.pause()
    })
    io.observe(v)

    return () => {
      window.clearTimeout(arranque)
      quitarGesto()
      v.removeEventListener('playing', onPlaying)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('error', onError)
      mq.removeEventListener('change', onMq)
      io.disconnect()
    }
  }, [desktop, mobile])

  const alternar = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      pausadoPorUsuario.current = false
      if (!v.getAttribute('src')) {
        const f = matchMedia(MOVIL).matches ? mobile : desktop
        v.src = v.canPlayType(AV1) !== '' ? f.av1 : f.h264
      }
      setEstado('cargando')
      v.play().catch(() => setEstado('error'))
    } else {
      pausadoPorUsuario.current = true
      v.pause()
    }
  }

  const reproduciendo = estado === 'reproduciendo' || estado === 'cargando'
  return (
    <>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        data-playing={estado === 'reproduciendo'}
      />

      {/* Autoplay bloqueado por el navegador: play grande sobre el video */}
      {estado === 'bloqueado' && (
        <button
          type="button"
          data-video-toggle
          onClick={alternar}
          aria-label="Reproducir el video"
          className="absolute top-1/2 left-1/2 z-10 inline-flex min-h-14 -translate-x-1/2 -translate-y-1/2 items-center gap-3 border border-neon/80 bg-void/70 px-6 font-mono text-xs tracking-[0.24em] whitespace-nowrap text-bone uppercase shadow-[var(--glow)] backdrop-blur-sm transition-colors hover:bg-neon hover:text-void md:left-[64%]"
        >
          <Play aria-hidden className="size-5" strokeWidth={1.75} /> Reproducir video
        </button>
      )}

      {estado !== 'omitido' && estado !== 'error' && (
        <button
          type="button"
          data-video-toggle
          onClick={alternar}
          aria-label={reproduciendo ? 'Pausar el video de fondo' : 'Reproducir el video de fondo'}
          className="hero-rise group absolute right-[var(--gutter)] z-10 inline-flex min-h-11 min-w-11 items-center justify-center gap-2.5 border border-line-2 bg-void/60 font-mono text-[0.66rem] tracking-[0.2em] text-mist uppercase backdrop-blur-sm transition-colors hover:border-neon hover:text-neon max-md:top-[calc(var(--nav-h)+0.5rem)] md:bottom-6 md:px-3.5"
          style={{ '--d': '0.5s' } as React.CSSProperties}
        >
          {reproduciendo ? (
            <Pause aria-hidden className="size-3.5" strokeWidth={1.75} />
          ) : (
            <Play aria-hidden className="size-3.5" strokeWidth={1.75} />
          )}
          <span className="hidden md:inline">{estado === 'cargando' ? 'Sincronizando…' : reproduciendo ? 'Pausar' : 'Reproducir'}</span>
          <span
            aria-hidden
            className={`size-1.5 rounded-full ${estado === 'reproduciendo' ? 'animate-pulse bg-neon shadow-[0_0_8px_var(--color-neon)]' : 'bg-dim'}`}
          />
        </button>
      )}
    </>
  )
}
