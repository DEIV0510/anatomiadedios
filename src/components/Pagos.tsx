import { Banknote, CircleDollarSign, CreditCard, Landmark, ShieldCheck, Smartphone } from 'lucide-react'
import { metodosPago, seguridadPago } from '@/data/libro'
import { anclas, IS_DEV } from '@/lib/site'
import { Pendiente } from './ui/Pendiente'
import { Rotulo } from './ui/Resaltado'
import { numeroSeccion } from '@/lib/navegacion'

const ICONO = { tarjeta: CreditCard, banco: Landmark, billetera: Smartphone, efectivo: Banknote, otro: CircleDollarSign }

/**
 * Métodos de pago SOLO si están en src/data/libro.ts (en los materiales no aparece ninguno).
 * Sin métodos configurados la sección no se publica; en desarrollo se ve la plantilla.
 */
export function Pagos() {
  const vacio = metodosPago.length === 0
  if (vacio && !IS_DEV) return null
  const lista = vacio ? (['tarjeta', 'banco', 'billetera', 'efectivo'] as const).map((tipo) => ({ nombre: 'Método', tipo })) : metodosPago

  return (
    <section id={anclas.pago} aria-labelledby="pago-titulo" className="relative pb-24 md:pb-36">
      <div className="wrap">
        <div className="panel corners relative overflow-hidden p-6 sm:p-10 lg:p-14" data-reveal>
          <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
          <div aria-hidden className="pointer-events-none absolute -top-40 right-0 size-96 rounded-full bg-[radial-gradient(closest-side,rgb(57_255_136/0.1),transparent)]" />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5">
              <Rotulo n={numeroSeccion(anclas.pago)}>Pago</Rotulo>
              <h2 id="pago-titulo" className="mt-6 font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-tight font-bold uppercase">
                Métodos de pago y <span className="hl">seguridad</span>
              </h2>
              {vacio && <Pendiente dato="métodos de pago aceptados" className="mt-5" />}
            </div>
            <ul className={`grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4 lg:col-span-7 ${vacio ? 'opacity-50' : ''}`}>
              {lista.map((m, i) => {
                const Icono = ICONO[m.tipo]
                return (
                  <li key={`${m.nombre}-${i}`} className="group flex flex-col items-start gap-4 bg-void/90 p-5 transition-colors hover:bg-deep">
                    <Icono aria-hidden className="size-6 text-mist transition-colors group-hover:text-neon" strokeWidth={1.25} />
                    <span className="font-mono text-[0.7rem] tracking-[0.18em] text-bone uppercase">{m.nombre}</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="relative mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:gap-6">
            <p className="flex items-center gap-3 font-mono text-sm tracking-[0.24em] text-neon uppercase">
              <ShieldCheck aria-hidden className="size-5" strokeWidth={1.5} /> Transacción segura
            </p>
            {seguridadPago ? <p className="text-mist">{seguridadPago}</p> : <Pendiente dato="detalle de seguridad de la pasarela (no inventar sellos)" />}
          </div>
        </div>
      </div>
    </section>
  )
}
