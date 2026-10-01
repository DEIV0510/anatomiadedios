import { contacto, ediciones, libro, politicasUrl, redes } from '@/data/libro'
import { anclas } from '@/lib/site'
import { Marca } from './ui/Marca'
import { Pendiente } from './ui/Pendiente'

/** Footer mínimo, tipo terminal. Contacto, políticas y redes solo si existen. */
export function Footer() {
  const contactoHref = contacto.whatsapp
    ? `https://wa.me/${contacto.whatsapp.replace(/\D/g, '')}`
    : contacto.email
      ? `mailto:${contacto.email}`
      : null
  const links = [
    { label: 'Inicio', href: `#${anclas.inicio}` },
    { label: 'El libro', href: `#${anclas.libro}` },
    ...(ediciones.some((e) => e.tipo === 'mentoria') ? [{ label: 'Mentoría', href: `#${anclas.mentoria}` }] : []),
    { label: 'Ediciones', href: `#${anclas.ediciones}` },
    { label: 'FAQ', href: `#${anclas.faq}` },
    ...(contactoHref ? [{ label: 'Contacto', href: contactoHref, externo: true }] : []),
    ...(politicasUrl ? [{ label: 'Políticas', href: politicasUrl, externo: true }] : []),
  ]
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-line bg-abyss pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-12">
      <div className="wrap">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <a href={`#${anclas.inicio}`} className="inline-flex items-center gap-3" aria-label={`${libro.titulo}, volver al inicio`}>
              <Marca className="size-9 text-bone" />
              <span className="font-display text-sm font-bold tracking-[0.2em] text-bone">{libro.titulo}</span>
            </a>
            <p className="hud mt-4">{libro.autor}</p>
          </div>

          <nav aria-label="Pie de página">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-1 sm:grid-cols-3">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...('externo' in l && l.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex min-h-11 items-center gap-2 font-mono text-xs tracking-[0.2em] text-mist uppercase transition-colors hover:text-neon"
                  >
                    <span aria-hidden className="text-line-2">&gt;</span> {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-col items-start gap-2">
              {!contactoHref && <Pendiente dato="contacto" />}
              {!politicasUrl && <Pendiente dato="página de políticas" />}
            </div>
          </nav>

          <div>
            {redes.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {redes.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-11 items-center border border-line-2 px-4 font-mono text-xs tracking-[0.2em] text-mist uppercase transition-colors hover:border-neon hover:text-neon"
                    >
                      {r.nombre}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <Pendiente dato="redes sociales" />
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[0.68rem] tracking-[0.18em] text-dim uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {libro.titulo}
          </p>
          <p className="caret">Fin de la transmisión</p>
        </div>
      </div>
    </footer>
  )
}
