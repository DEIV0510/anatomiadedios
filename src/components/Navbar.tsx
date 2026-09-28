'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { libro } from '@/data/libro'
import { enlaces } from '@/lib/navegacion'
import { anclas } from '@/lib/site'
import { Marca } from './ui/Marca'
import { Trace } from './ui/BotonComprar'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activo, setActivo] = useState<string | null>(null)
  const [abierto, setAbierto] = useState(false)
  const menu = useRef<HTMLDialogElement>(null)

  // Se reduce al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Sección activa (la que cruza el centro de la pantalla)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActivo(en.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    enlaces.forEach((l) => {
      const s = document.getElementById(l.id)
      if (s) io.observe(s)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const d = menu.current
    if (!d) return
    const onClose = () => setAbierto(false)
    d.addEventListener('close', onClose)
    return () => d.removeEventListener('close', onClose)
  }, [])

  const abrir = () => {
    menu.current?.showModal()
    setAbierto(true)
  }
  const cerrar = () => menu.current?.close()

  const irA = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    cerrar()
    window.setTimeout(() => {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
      history.replaceState(null, '', `#${id}`)
    }, 20)
  }

  return (
    <header data-scrolled={scrolled} className="group fixed inset-x-0 top-0 z-40">
      {/* Fondo: degradado sobre el video arriba; panel con desenfoque al bajar */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-void/80 to-transparent transition-opacity duration-500 group-data-[scrolled=true]:opacity-0"
      />
      <div
        aria-hidden
        className="absolute inset-0 border-b border-line bg-void/80 opacity-0 backdrop-blur-md transition-opacity duration-500 group-data-[scrolled=true]:opacity-100"
      />
      <nav
        aria-label="Principal"
        className="wrap relative flex h-[var(--nav-h)] max-w-none items-center gap-5 transition-[height] duration-500 ease-[var(--ease-out)] group-data-[scrolled=true]:h-[var(--nav-h-min)]"
      >
        <a href={`#${anclas.inicio}`} className="group/logo mr-auto flex min-h-11 items-center gap-3" aria-label={`${libro.titulo}, inicio`}>
          <Marca className="size-8 shrink-0 text-bone transition-transform duration-500 group-hover/logo:rotate-180" />
          <span className="hidden font-display text-[0.8rem] font-bold tracking-[0.2em] whitespace-nowrap text-bone min-[400px]:inline lg:max-xl:hidden">
            {libro.titulo}
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {enlaces.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                aria-current={activo === l.id ? 'location' : undefined}
                className="group/link relative flex min-h-11 items-center px-2 font-mono text-[0.68rem] tracking-[0.18em] whitespace-nowrap text-mist uppercase transition-colors hover:text-neon aria-[current=location]:text-neon xl:px-3 xl:text-[0.7rem] xl:tracking-[0.2em]"
              >
                {l.label}
                <span
                  aria-hidden
                  className="absolute inset-x-2 bottom-2 xl:inset-x-3 h-px origin-left scale-x-0 bg-neon shadow-[0_0_8px_var(--color-neon)] transition-transform duration-300 group-hover/link:scale-x-100 group-aria-[current=location]/link:scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>

        <a
          href={`#${anclas.ediciones}`}
          data-comprar=""
          className="btn-neon min-h-11 gap-2 px-4 text-[0.68rem] tracking-[0.18em] md:px-5"
        >
          <Trace />
          <span>Comprar</span>
          <ArrowRight aria-hidden className="btn-arrow size-4" strokeWidth={1.75} />
        </a>

        <button
          type="button"
          onClick={abrir}
          aria-label="Abrir menú"
          aria-haspopup="dialog"
          aria-expanded={abierto}
          className="grid size-11 place-items-center border border-line-2 text-bone transition-colors hover:border-neon hover:text-neon lg:hidden"
        >
          <Menu aria-hidden className="size-5" strokeWidth={1.5} />
        </button>
      </nav>

      {/* Menú móvil */}
      <dialog
        ref={menu}
        className="sheet"
        aria-label="Menú"
        style={{ '--sheet-from': 'translateY(-2%)' } as React.CSSProperties}
      >
        <div className="sheet__panel relative flex h-full flex-col overflow-y-auto bg-void">
          <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
          <div className="wrap relative flex h-[var(--nav-h)] shrink-0 items-center justify-between">
            <span className="hud">
              <span className="text-neon">&gt;</span> Menú_
            </span>
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar menú"
              className="grid size-11 place-items-center border border-line-2 text-bone transition-colors hover:border-neon hover:text-neon"
            >
              <X aria-hidden className="size-5" strokeWidth={1.5} />
            </button>
          </div>
          <ul className="wrap relative mt-6 flex flex-col">
            {enlaces.map((l, i) => (
              <li key={l.id} className="border-b border-line">
                <a
                  href={`#${l.id}`}
                  onClick={irA(l.id)}
                  className="flex min-h-16 items-center gap-5 py-3 font-display text-[1.7rem] font-bold tracking-wide text-bone uppercase transition-colors hover:text-neon"
                >
                  <span className="font-mono text-xs font-normal tracking-[0.2em] text-neon">{String(i + 1).padStart(2, '0')}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="wrap relative mt-auto flex flex-col gap-4 pt-10 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <a href={`#${anclas.ediciones}`} data-comprar="" onClick={cerrar} className="btn-neon btn-xl w-full">
              <Trace />
              <span>Comprar el libro</span>
              <ArrowRight aria-hidden className="btn-arrow size-5" strokeWidth={1.75} />
            </a>
            <p className="hud text-center">{libro.autor}</p>
          </div>
        </div>
      </dialog>
    </header>
  )
}
