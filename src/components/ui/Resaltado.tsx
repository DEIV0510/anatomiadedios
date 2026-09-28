import { Fragment } from 'react'

/** "Crees que conoces la [realidad]" -> la palabra entre corchetes en verde */
export function Resaltado({ texto, className = 'hl' }: { texto: string; className?: string }) {
  const partes = texto.split(/(\[[^\]]+\])/g)
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith('[') && p.endsWith(']') ? (
          <span key={i} className={className}>
            {p.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}

/** Rótulo de sección: [ 02 ] // CONCEPTO */
export function Rotulo({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="hud flex items-center gap-3" data-reveal>
      <span className="text-neon">[ {n} ]</span>
      <span aria-hidden className="h-px w-8 bg-line-2" />
      <span>{children}</span>
    </p>
  )
}
