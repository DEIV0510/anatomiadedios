import { Plus } from 'lucide-react'
import { preguntas } from '@/lib/faq'
import { anclas, IS_DEV } from '@/lib/site'
import { BotonComprar } from './ui/BotonComprar'
import { Pendiente } from './ui/Pendiente'
import { Rotulo } from './ui/Resaltado'

/** Acordeón nativo (<details>): accesible y sin JS. Solo preguntas con respuesta real. */
export function Faq() {
  const lista = preguntas().filter((p) => p.a || IS_DEV)
  return (
    <section id={anclas.faq} aria-labelledby="faq-titulo" className="relative py-24 md:py-36">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Rotulo n="08">FAQ</Rotulo>
          <h2 id="faq-titulo" className="title-section mt-6" data-split>
            Preguntas <span className="hl">frecuentes</span>
          </h2>
          <div className="mt-10 hidden lg:block" data-reveal>
            <BotonComprar>Comprar el libro</BotonComprar>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="border-t border-line" data-stagger>
            {lista.map((p, i) => (
              <details key={p.q} className="faq-item group border-b border-line" name="faq" data-reveal>
                <summary className="flex min-h-16 items-center gap-5 py-5 text-left transition-colors hover:text-neon md:gap-8 md:py-6">
                  <span className="font-mono text-xs tracking-[0.2em] text-neon">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 font-display text-lg font-semibold text-bone group-hover:text-neon md:text-2xl">{p.q}</span>
                  <span aria-hidden className="grid size-9 shrink-0 place-items-center border border-line-2 transition-colors group-open:border-neon group-open:text-neon">
                    <Plus className="faq-icon size-4" strokeWidth={1.5} />
                  </span>
                </summary>
                <div className="pb-7 pl-[calc(1.25rem+1.35rem)] md:pl-[calc(2rem+1.35rem)]">
                  {p.a ? (
                    <p className="max-w-2xl text-mist md:text-lg">
                      <span className="mr-2 font-mono text-neon">&gt;</span>
                      {p.a}
                    </p>
                  ) : (
                    <Pendiente dato={`${p.falta} (la pregunta no se publica sin respuesta)`} />
                  )}
                </div>
              </details>
            ))}
          </div>
          <div className="mt-10 lg:hidden" data-reveal>
            <BotonComprar className="w-full sm:w-auto">Comprar el libro</BotonComprar>
          </div>
        </div>
      </div>
    </section>
  )
}
