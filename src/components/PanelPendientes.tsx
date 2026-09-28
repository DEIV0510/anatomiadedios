import { pendientes } from '@/lib/pendientes'
import { IS_DEV } from '@/lib/site'

/** Solo en desarrollo: lista de datos que faltan en src/data/libro.ts */
export function PanelPendientes() {
  if (!IS_DEV) return null
  const lista = pendientes()
  if (!lista.length) return null
  return (
    <details className="fixed bottom-4 left-16 z-[80] max-w-[min(24rem,calc(100vw-5rem))] border border-amber/50 bg-void/95 font-mono text-[0.68rem] text-amber backdrop-blur max-md:bottom-20">
      <summary className="cursor-pointer px-3 py-2 tracking-[0.14em] uppercase">◇ {lista.length} datos pendientes</summary>
      <ul className="max-h-[50vh] space-y-2 overflow-y-auto border-t border-amber/30 px-3 py-3">
        {lista.map((p) => (
          <li key={p.donde}>
            <span className="text-bone">{p.dato}</span>
            <br />
            <span className="text-dim">src/data/libro.ts → {p.donde}</span>
          </li>
        ))}
      </ul>
    </details>
  )
}
