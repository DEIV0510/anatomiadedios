/**
 * Marca: el haz de luz que parte el rostro de la portada, leído como Φ (la «proporción
 * divina»), con el destello en el centro. Mismo dibujo que el favicon.
 */
export function Marca({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      <circle cx="32" cy="32" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M32 5v54" stroke="var(--color-neon)" strokeWidth="3" />
      <path
        d="M32 23.5l2.4 6.1 6.1 2.4-6.1 2.4-2.4 6.1-2.4-6.1-6.1-2.4 6.1-2.4z"
        fill="var(--color-neon)"
        style={{ filter: 'drop-shadow(0 0 4px var(--color-neon))' }}
      />
    </svg>
  )
}

/** Conejo blanco (silueta) con el ojo encendido en verde */
export function Conejo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      <g fill="currentColor">
        <ellipse cx="40.2" cy="15" rx="3.5" ry="12.5" transform="rotate(-16 40.2 15)" />
        <ellipse cx="47.6" cy="15.6" rx="3.3" ry="11.8" transform="rotate(9 47.6 15.6)" />
        <circle cx="44.6" cy="31" r="9.2" />
        <path d="M37.5 34.5c6 1.5 8.5 7 7 14.5L33 52z" />
        <ellipse cx="27" cy="46.5" rx="17.5" ry="12.5" />
        <circle cx="9.6" cy="44.6" r="4.2" />
        <ellipse cx="41.5" cy="57.6" rx="6.4" ry="2.6" />
      </g>
      <circle cx="48" cy="29.4" r="1.25" fill="var(--color-neon)" />
    </svg>
  )
}
