/**
 * Capa de movimiento. Se carga en UN solo chunk diferido (import() después de la pantalla de
 * entrada y con el navegador libre), así GSAP no compite con el primer pintado del hero.
 * Todo parte de contenido ya visible: si este archivo no llega, la página se ve completa.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

let iniciado = false
const q = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel))

export function iniciar() {
  if (iniciado) return
  iniciado = true
  gsap.registerPlugin(ScrollTrigger, SplitText)

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  lluviaDeCodigo(reduce)
  bloquesActivos()
  cursor()
  if (reduce) return

  glitchOcasional()
  inclinacionLibro()

  const mm = gsap.matchMedia()
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    heroSalida()
    despertar()
    libroScroll()
    // Revelados y títulos al final: sus posiciones ya cuentan con todo lo anterior
    document.fonts.ready.then(() => {
      titulos()
      revelados()
      ScrollTrigger.refresh()
    })
  })
}

/* ------------------------------------------------------------------------------------------ */
/* Revelados: fade + subida (o escala) al entrar en pantalla, en tandas escalonadas             */
/* ------------------------------------------------------------------------------------------ */
function revelados() {
  const els = q('[data-reveal]').filter((el) => !el.closest('[data-despertar]'))
  els.forEach((el) => {
    const escala = el.dataset.reveal === 'scale'
    gsap.set(el, { autoAlpha: 0, y: escala ? 16 : 28, scale: escala ? 0.95 : 1 })
  })
  ScrollTrigger.batch(els, {
    start: 'top 90%',
    once: true,
    onEnter: (lote) =>
      gsap.to(lote, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.95,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
        clearProps: 'transform,visibility',
      }),
  })
}

/* Títulos de sección: palabras que suben tras una máscara de línea */
function titulos() {
  q('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines,words',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.words, {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.045,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          // Al terminar se deshace el corte: sin máscaras que recorten el brillo de .hl
          onComplete: () => {
            self.kill()
            self.revert()
          },
        })
      },
    })
  })
}

/* ------------------------------------------------------------------------------------------ */
/* Hero: al bajar, el video se aleja y el texto sube (sensación de cámara)                       */
/* ------------------------------------------------------------------------------------------ */
function heroSalida() {
  const hero = document.getElementById('inicio')
  const media = hero?.querySelector('.hero-media')
  const contenido = hero?.querySelector('.wrap')
  if (!hero || !media || !contenido) return
  const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
  gsap.to(media, { yPercent: 14, scale: 1.06, ease: 'none', scrollTrigger: st })
  gsap.to(contenido, { y: -70, autoAlpha: 0.15, ease: 'none', scrollTrigger: st })
}

/* ------------------------------------------------------------------------------------------ */
/* DESPERTAR: el contorno se llena de luz y el texto se enciende palabra a palabra               */
/* ------------------------------------------------------------------------------------------ */
function despertar() {
  const sec = document.querySelector<HTMLElement>('[data-despertar]')
  if (!sec) return
  const relleno = sec.querySelector('[data-despertar-fill]')
  if (relleno) {
    gsap.fromTo(
      relleno,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        ease: 'none',
        scrollTrigger: { trigger: relleno, start: 'top 85%', end: 'bottom 35%', scrub: 0.6 },
      },
    )
  }
  const frase = sec.querySelector<HTMLElement>('[data-words]')
  if (frase) {
    const split = SplitText.create(frase, { type: 'words' })
    gsap.fromTo(
      split.words,
      { opacity: 0.1 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: frase, start: 'top 80%', end: 'bottom 45%', scrub: 0.5 },
      },
    )
  }
  q('[data-reveal]', sec).forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 26,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })
}

/* ------------------------------------------------------------------------------------------ */
/* Libro 3D: gira despacio con el scroll y las anotaciones aparecen una a una                    */
/* ------------------------------------------------------------------------------------------ */
function libroScroll() {
  const sec = document.querySelector<HTMLElement>('[data-libro]')
  const cuerpo = sec?.querySelector<HTMLElement>('[data-book-body]')
  const libro = sec?.querySelector<HTMLElement>('[data-book]')
  if (!sec || !cuerpo || !libro) return
  gsap.fromTo(
    cuerpo,
    { '--ry': '-40deg', '--rx': '9deg' },
    { '--ry': '-12deg', '--rx': '0deg', ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.8 } },
  )
  gsap.fromTo(libro, { y: 50 }, { y: -50, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } })

  const notas = q('[data-note]', sec)
  const lineas = q('[data-note-line]', sec)
  // Terminan de aparecer cuando el libro llega al centro de la pantalla
  const tl = gsap.timeline({ scrollTrigger: { trigger: libro, start: 'top 80%', end: 'center 58%', scrub: 0.6 } })
  tl.from(notas, { autoAlpha: 0, stagger: 0.18, duration: 0.3 }).from(lineas, { scaleX: 0, stagger: 0.18, duration: 0.3 }, 0.05)
}

/* Inclinación con el cursor (solo puntero fino) */
function inclinacionLibro() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const escenario = document.querySelector<HTMLElement>('[data-libro-stage]')
  const cuerpo = escenario?.querySelector<HTMLElement>('[data-book-body]')
  if (!escenario || !cuerpo) return
  let raf = 0
  escenario.addEventListener('pointermove', (e) => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      const r = escenario.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1
      cuerpo.style.setProperty('--ty', `${(nx * 16).toFixed(2)}deg`)
      cuerpo.style.setProperty('--tx', `${(-ny * 10).toFixed(2)}deg`)
      cuerpo.style.setProperty('--sheen', `${(50 - nx * 45).toFixed(1)}%`)
    })
  })
  escenario.addEventListener('pointerleave', () => {
    cancelAnimationFrame(raf)
    cuerpo.style.setProperty('--ty', '0deg')
    cuerpo.style.setProperty('--tx', '0deg')
    cuerpo.style.removeProperty('--sheen')
  })
}

/* ------------------------------------------------------------------------------------------ */
/* «Lo que encontrarás»: el bloque que cruza el centro se enciende, el anterior se apaga         */
/* ------------------------------------------------------------------------------------------ */
function bloquesActivos() {
  const lista = document.querySelector<HTMLElement>('[data-ejes]')
  if (!lista) return
  const items = q('[data-eje]', lista)
  const activar = (i: number) => items.forEach((it, k) => it.classList.toggle('is-active', k === i))
  lista.classList.add('ejes-live')
  activar(0)
  items.forEach((it, i) => {
    ScrollTrigger.create({
      trigger: it,
      start: 'top 58%',
      end: 'bottom 58%',
      onToggle: (self) => self.isActive && activar(i),
    })
  })
}

/* ------------------------------------------------------------------------------------------ */
/* Glitch puntual en los títulos grandes (nunca en bucle continuo)                              */
/* ------------------------------------------------------------------------------------------ */
function glitchOcasional() {
  const disparar = (el: Element) => {
    el.classList.remove('is-glitching')
    void (el as HTMLElement).offsetWidth
    el.classList.add('is-glitching')
    window.setTimeout(() => el.classList.remove('is-glitching'), 460)
  }
  const visibles = new Set<Element>()
  const io = new IntersectionObserver((entries) =>
    entries.forEach((en) => (en.isIntersecting ? visibles.add(en.target) : visibles.delete(en.target))),
  )
  q('[data-glitch]').forEach((el) => io.observe(el))
  // Primer glitch al aparecer el título del hero
  window.setTimeout(() => q('#inicio [data-glitch]').forEach(disparar), 250)
  const ciclo = () => {
    if (!document.hidden) visibles.forEach(disparar)
    window.setTimeout(ciclo, 6500 + Math.random() * 3500)
  }
  window.setTimeout(ciclo, 5000)
}

/* ------------------------------------------------------------------------------------------ */
/* Cursor propio: punto exacto + anillo que lo sigue; crece sobre lo que se puede pulsar        */
/* ------------------------------------------------------------------------------------------ */
function cursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const raiz = document.querySelector<HTMLElement>('.cursor')
  const punto = raiz?.querySelector<HTMLElement>('.cursor__dot')
  const anillo = raiz?.querySelector<HTMLElement>('.cursor__ring')
  if (!raiz || !punto || !anillo) return
  const html = document.documentElement
  let x = -100
  let y = -100
  let ax = x
  let ay = y
  let activo = false
  const interactivo = 'a, button, summary, label, [role="button"], [role="radio"], input, select, textarea'

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      punto.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (!activo) {
        activo = true
        ax = x
        ay = y
        html.classList.add('has-cursor')
      }
    },
    { passive: true },
  )
  document.addEventListener('pointerover', (e) => {
    const t = e.target as Element | null
    html.classList.toggle('cursor-hover', !!t?.closest?.(interactivo))
  })
  document.addEventListener('pointerdown', () => html.classList.add('cursor-down'))
  document.addEventListener('pointerup', () => html.classList.remove('cursor-down'))
  document.documentElement.addEventListener('pointerleave', () => {
    activo = false
    html.classList.remove('has-cursor')
  })
  gsap.ticker.add(() => {
    if (!activo) return
    ax += (x - ax) * 0.2
    ay += (y - ay) * 0.2
    anillo.style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0)`
  })
}

/* ------------------------------------------------------------------------------------------ */
/* Lluvia de código: muy oscura y lenta. Solo corre mientras su sección está a la vista.        */
/* Mezcla dígitos, hexadecimal, griego (Φ Ψ Ω Δ Σ π λ ∞) y katakana: ciencia + código.          */
/* ------------------------------------------------------------------------------------------ */
const GLIFOS = '0123456789ABCDEFΦΨΩΔΣΛπλμ∞アイウエオカキクケコサシスセソ'

function lluviaDeCodigo(reduce: boolean) {
  const lienzos = q<HTMLCanvasElement>('canvas[data-rain]')
  if (!lienzos.length) return
  const fuente = getComputedStyle(document.documentElement).getPropertyValue('--font-geist-mono').trim() || 'monospace'
  lienzos.forEach((c) => lluvia(c, fuente, reduce))
}

function lluvia(canvas: HTMLCanvasElement, fuente: string, reduce: boolean) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const movil = matchMedia('(max-width: 767px)').matches
  const size = movil ? 13 : 14
  const paso = movil ? 17 : 19
  const fps = movil ? 12 : 18
  let w = 0
  let h = 0
  let cols: { y: number; v: number; espera: number }[] = []
  let visible = false
  let raf = 0
  let ultimo = 0

  const glifo = () => GLIFOS[(Math.random() * GLIFOS.length) | 0]

  const medir = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = Math.max(1, Math.round(w * dpr))
    canvas.height = Math.max(1, Math.round(h * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.font = `${size}px ${fuente}`
    ctx.textBaseline = 'top'
    const n = Math.ceil(w / paso)
    cols = Array.from({ length: n }, () => ({
      y: Math.random() * (h / size),
      v: 0.12 + Math.random() * 0.22,
      espera: Math.random() < 0.45 ? Math.random() * 120 : 0,
    }))
    if (reduce) estatico()
  }

  // Un solo fotograma quieto para «reducir movimiento»
  const estatico = () => {
    ctx.clearRect(0, 0, w, h)
    for (let i = 0; i < cols.length; i++) {
      const largo = 4 + ((Math.random() * 14) | 0)
      const y0 = Math.random() * (h / size)
      for (let k = 0; k < largo; k++) {
        ctx.fillStyle = `rgba(57,255,136,${(0.5 * (1 - k / largo)).toFixed(3)})`
        ctx.fillText(glifo(), i * paso, (y0 - k) * size)
      }
    }
  }

  const frame = (t: number) => {
    raf = requestAnimationFrame(frame)
    if (t - ultimo < 1000 / fps) return
    ultimo = t
    // Estela: se borra un poco lo pintado (el lienzo sigue transparente sobre el video)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = 'rgba(0,0,0,0.11)'
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'source-over'
    for (let i = 0; i < cols.length; i++) {
      const c = cols[i]
      if (c.espera > 0) {
        c.espera--
        continue
      }
      const y = c.y * size
      ctx.fillStyle = Math.random() < 0.08 ? 'rgba(220,255,236,0.95)' : 'rgba(57,255,136,0.8)'
      ctx.fillText(glifo(), i * paso, y)
      c.y += c.v
      if (y > h + size * 4) {
        c.y = -Math.random() * 12
        c.v = 0.12 + Math.random() * 0.22
        c.espera = Math.random() * 90
      }
    }
  }

  const arrancar = () => {
    if (reduce || !visible || document.hidden || raf) return
    raf = requestAnimationFrame(frame)
  }
  const parar = () => {
    cancelAnimationFrame(raf)
    raf = 0
  }

  medir()
  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting
    if (visible) arrancar()
    else parar()
  }).observe(canvas)
  document.addEventListener('visibilitychange', () => (document.hidden ? parar() : arrancar()))
  let t: number | undefined
  new ResizeObserver(() => {
    window.clearTimeout(t)
    t = window.setTimeout(medir, 200)
  }).observe(canvas)
}
