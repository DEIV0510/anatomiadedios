import { testimonios } from '@/data/libro'
import { anclas, IS_DEV } from '@/lib/site'
import { BotonComprar } from './ui/BotonComprar'
import { Pendiente } from './ui/Pendiente'
import { Rotulo } from './ui/Resaltado'

/**
 * Prueba social con testimonios REALES (src/data/libro.ts -> testimonios). En los materiales
 * no hay ninguno, así que en producción la sección no se publica; en desarrollo se ve la
 * plantilla vacía para saber cómo quedará.
 */
export function Testimonios() {
  const vacio = testimonios.length === 0
  if (vacio && !IS_DEV) return null
  const items = vacio ? [null, null, null] : testimonios

  return (
    <section id={anclas.testimonios} aria-labelledby="testimonios-titulo" className="relative py-24 md:py-36">
      <div className="wrap">
        <Rotulo n="05">Testimonios</Rotulo>
        <h2 id="testimonios-titulo" className="title-section mt-6 max-w-4xl" data-split>
          Quienes ya cruzaron el <span className="hl">umbral</span>
        </h2>
        {vacio && <Pendiente dato="testimonios reales (la sección no se publica mientras esté vacía)" className="mt-6" />}

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-stagger>
          {items.map((t, i) => (
            <li key={i} className={`panel corners flex flex-col p-6 md:p-8 ${t ? '' : 'border-dashed opacity-60'}`} data-reveal>
              <p className="hud flex items-center justify-between gap-4">
                <span>
                  <span className="text-neon">&gt;</span> Testimonio_{String(i + 1).padStart(2, '0')}
                </span>
                <span aria-hidden className="flex items-center gap-1.5 text-[0.62rem]">
                  <span className="size-1.5 bg-neon shadow-[0_0_8px_var(--color-neon)]" /> Registro
                </span>
              </p>
              <blockquote className="mt-6 flex-1 font-display text-xl leading-snug text-bone">
                {t ? `“${t.texto}”` : '“Texto del testimonio tal como lo escribió el lector.”'}
              </blockquote>
              <footer className="mt-6 border-t border-line pt-4">
                <p className="font-mono text-xs tracking-[0.2em] text-bone uppercase">{t ? (t.nombre ?? 'Lector') : 'Nombre'}</p>
                {(t?.detalle || !t) && <p className="mt-1 text-sm text-dim">{t ? t.detalle : 'Ciudad o detalle opcional'}</p>}
              </footer>
            </li>
          ))}
        </ul>

        <div className="mt-12" data-reveal>
          <BotonComprar>Cruza tú también</BotonComprar>
        </div>
      </div>
    </section>
  )
}
